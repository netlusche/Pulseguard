import { formatDate } from '../utils/helper.js';

export default {
    props: ['state', 'i18n', 'storage'],
    template: `
        <div class="card">
            <div class="flex-between mb-2">
                <h2 class="card-title" style="margin-bottom: 0;">{{ i18n.t('dashboard.historyTitle') }}</h2>
                <button @click="$emit('back')" class="btn btn-outline" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;">
                    &larr; {{ i18n.t('dashboard.backToDashboard') }}
                </button>
            </div>
            
            <div class="form-grid-2" style="margin-bottom: 1.5rem; background: hsl(var(--muted)); padding: 1rem; border-radius: var(--radius);">
                <div>
                    <label>{{ i18n.t('dashboard.from') }}</label>
                    <input type="date" v-model="fromDate">
                </div>
                <div>
                    <label>{{ i18n.t('dashboard.to') }}</label>
                    <input type="date" v-model="toDate">
                </div>
            </div>

            <ul class="history-list">
                <li v-for="entry in filteredEntries" :key="entry.id" class="history-item">
                    <div class="history-content">
                        <div class="text-muted" style="font-size: 0.85rem; min-width: 140px;">
                            {{ formatDate(entry.timestamp, i18n.locale.value) }}
                        </div>
                        <div class="value-badge" style="display: flex; align-items: center; gap: 0.5rem; min-width: 150px;">
                            <span>{{ entry.sys }}/{{ entry.dia }}</span>
                            <span class="unit" style="margin-right: 0.5rem">{{ i18n.t('common.unit') }}</span>
                            <span class="pulse-tag">{{ entry.pulse }} {{ i18n.t('common.bpm') }}</span>
                        </div>
                        <div v-if="entry.notes" class="notes-preview" tabindex="0" style="width: 100%;">
                            <span class="text-muted" style="font-size: 0.85rem; font-style: italic; display: block; width: 100%;">
                                "{{ entry.notes }}"
                            </span>
                        </div>
                    </div>
                    
                    <button @click="handleDelete(entry.id)" class="btn btn-ghost" style="padding: 0.5rem; color: #ef4444; flex-shrink: 0;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </li>
            </ul>
            <div v-if="filteredEntries.length === 0" class="text-muted" style="text-align: center; padding: 2rem">
                {{ i18n.t('dashboard.noData') }}
            </div>
        </div>
    `,
    setup(props) {
        const Vue = window.Vue;
        
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        const fromDate = Vue.ref(thirtyDaysAgo.toISOString().split('T')[0]);
        const toDate = Vue.ref(today.toISOString().split('T')[0]);

        const filteredEntries = Vue.computed(() => {
            const start = new Date(fromDate.value);
            start.setHours(0, 0, 0, 0);
            const end = new Date(toDate.value);
            end.setHours(23, 59, 59, 999);
            
            return [...props.state.measurements]
                .filter(m => {
                    const d = new Date(m.timestamp);
                    return d >= start && d <= end;
                })
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        });

        const handleDelete = async (id) => {
            if (confirm(props.i18n.t('dashboard.deleteConfirm'))) {
                await props.storage.deleteMeasurement(id);
                props.state.measurements = await props.storage.getMeasurements();
            }
        };

        return { fromDate, toDate, filteredEntries, handleDelete, formatDate };
    }
};
