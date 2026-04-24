import { exportToCSV } from '../utils/helper.js';

export default {
    props: ['state', 'i18n', 'currentView'],
    emits: ['toggle-view', 'logout', 'set-view'],
    template: `
        <header class="flex-between">
            <div @click="$emit('set-view', 'dashboard')" style="cursor: pointer; display: flex; align-items: center; gap: 0.75rem;">
                <img src="./img/logo.png" alt="PulseGuard Logo" style="height: 48px; width: auto; object-fit: contain;">
                <div>
                    <h1 style="margin-bottom: 0;">{{ i18n.t('app.title') }}</h1>
                    <p class="text-muted" style="margin-bottom: 0;">{{ i18n.t('app.subtitle') }}</p>
                </div>
            </div>
            <div class="header-actions">
                <div class="lang-switcher-container">
                    <select v-model="i18n.locale.value" @change="i18n.setLocale($event.target.value)" class="lang-select">
                        <option value="en">English</option>
                        <option value="de">Deutsch</option>
                        <option value="tr">Türkçe</option>
                        <option value="ru">Русский</option>
                        <option value="pl">Polski</option>
                        <option value="uk">Українська</option>
                        <option value="ro">Română</option>
                        <option value="ar">العربية</option>
                    </select>
                </div>
                <template v-if="state.currentUser">
                    <button v-if="state.currentUser.role === 'admin'" @click="$emit('toggle-view', 'admin')" class="btn btn-outline" style="font-size: 0.8rem">
                        {{ currentView === 'admin' ? i18n.t('admin.backToApp') : i18n.t('admin.openAdmin') }}
                    </button>
                    <button @click="$emit('toggle-view', 'profile')" class="btn btn-outline" style="font-size: 0.8rem">
                        {{ currentView === 'profile' ? i18n.t('admin.backToApp') : i18n.t('profile.title') }}
                    </button>
                    <button v-if="currentView === 'dashboard'" @click="handleExport" class="btn btn-outline" style="font-size: 0.8rem">
                        📥 {{ i18n.t('app.exportCsv') }}
                    </button>
                    <button @click="$emit('logout')" class="btn btn-ghost" style="font-size: 0.8rem; color: #ef4444">
                        {{ i18n.t('auth.logoutBtn') }}
                    </button>
                </template>
            </div>
        </header>
    `,
    setup(props) {
        const handleExport = () => {
            exportToCSV(props.state.measurements);
        };
        return { handleExport };
    }
};
