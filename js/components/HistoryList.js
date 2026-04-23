import { formatDate } from '../utils/helper.js';

export default {
    props: ['state', 'i18n', 'storage'],
    template: `
        <div class="card">
            <h2 class="card-title">{{ i18n.t('dashboard.historyTitle') }}</h2>
            <ul class="history-list">
                <li v-for="entry in sortedEntries" :key="entry.id" class="history-item" style="flex-wrap: wrap; gap: 0.5rem">
                    <div style="display: flex; align-items: center; gap: 1rem; flex: 1; flex-wrap: wrap; min-width: 250px">
                        <div class="text-muted" style="font-size: 0.85rem; min-width: 100px">
                            {{ formatDate(entry.timestamp, i18n.locale.value) }}
                        </div>
                        <div class="value-badge" style="display: flex; align-items: center; gap: 0.5rem">
                            <span>{{ entry.sys }}/{{ entry.dia }}</span>
                            <span class="unit" style="margin-right: 0.5rem">{{ i18n.t('common.unit') }}</span>
                            <span class="pulse-tag">{{ entry.pulse }} {{ i18n.t('common.bpm') }}</span>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 1rem">
                        <!-- Short Notes Preview / Tooltip -->
                        <div v-if="entry.notes" class="tooltip" tabindex="0" style="max-width: 200px">
                            <span class="text-muted" style="font-size: 0.8rem; font-style: italic; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; max-width: 150px">
                                "{{ entry.notes }}"
                            </span>
                            <div class="tooltip-text">
                                <strong>{{ i18n.t('form.notes') }}:</strong><br>
                                <em>"{{ entry.notes }}"</em>
                            </div>
                        </div>
                        
                        <button @click="handleDelete(entry.id)" class="btn btn-ghost" style="padding: 0.25rem; color: #ef4444">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                    </div>
                </li>
            </ul>
            <div v-if="state.measurements.length === 0" class="text-muted" style="text-align: center; padding: 2rem">
                {{ i18n.t('dashboard.noData') }}
            </div>
            <div style="text-align: right; margin-top: 1rem;">
                <a href="#" @click.prevent="$emit('expand')" class="btn btn-ghost" style="padding: 0.5rem; font-size: 0.875rem;">
                    {{ i18n.t('dashboard.expandView') }} &rarr;
                </a>
            </div>
        </div>
    `,
    setup(props) {
        const Vue = window.Vue;
        const sortedEntries = Vue.computed(() => {
            return [...props.state.measurements]
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, 10);
        });

        const handleDelete = async (id) => {
            if (confirm(props.i18n.t('dashboard.deleteConfirm'))) {
                await props.storage.deleteMeasurement(id);
                props.state.measurements = await props.storage.getMeasurements();
            }
        };

        return { sortedEntries, handleDelete, formatDate };
    }
};
