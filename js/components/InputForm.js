import { getClassification } from '../utils/helper.js';

export default {
    props: ['state', 'i18n', 'storage'],
    template: `
        <div class="card">
            <h2 class="card-title">{{ i18n.t('form.title') }}</h2>
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div class="form-grid-2">
                    <div class="form-group">
                        <label>{{ i18n.t('form.sys') }}</label>
                        <input v-model.number="form.sys" type="number" required min="50" max="250">
                    </div>
                    <div class="form-group">
                        <label>{{ i18n.t('form.dia') }}</label>
                        <input v-model.number="form.dia" type="number" required min="30" max="150">
                    </div>
                </div>
                <div class="form-group">
                    <label>{{ i18n.t('form.pulse') }}</label>
                    <input v-model.number="form.pulse" type="number" required min="30" max="200">
                </div>
                <div class="form-group">
                    <label>{{ i18n.t('form.notes') }}</label>
                    <textarea v-model="form.notes" :placeholder="i18n.t('form.notesPlaceholder')" rows="2"></textarea>
                </div>
                <div class="form-group">
                    <label>{{ i18n.t('form.timestamp') }}</label>
                    <input v-model="form.timestamp" type="datetime-local" required>
                </div>
                <button type="submit" class="btn btn-primary w-full">
                    {{ i18n.t('form.save') }}
                </button>
            </form>

            <transition name="fade">
                <div v-if="state.lastFeedback" :class="['alert', 'mt-4', state.lastFeedback.type === 'high' ? 'alert-danger' : (state.lastFeedback.type === 'normal' ? 'alert-warning' : 'alert-success')]">
                    {{ i18n.t('form.feedback.' + state.lastFeedback.type) }}
                </div>
            </transition>
        </div>
    `,
    setup(props) {
        const Vue = window.Vue;
        const getLocalISOString = () => {
            const now = new Date();
            const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
            return localNow.toISOString().slice(0, 16);
        };

        const form = Vue.ref({
            sys: '',
            dia: '',
            pulse: '',
            notes: '',
            timestamp: getLocalISOString()
        });

        const handleSubmit = async () => {
            const classification = getClassification(form.value.sys, form.value.dia);
            
            await props.storage.addMeasurement({
                ...form.value,
                userId: props.state.currentUser.id
            });

            // Refresh state
            props.state.measurements = await props.storage.getMeasurements();
            props.state.lastFeedback = { type: classification };

            // Reset form
            form.value = {
                sys: '',
                dia: '',
                pulse: '',
                notes: '',
                timestamp: getLocalISOString()
            };

            setTimeout(() => {
                props.state.lastFeedback = null;
            }, 10000);
            
            // Trigger chart update event if needed, but Chart.js watcher is better
        };

        return { form, handleSubmit };
    }
};
