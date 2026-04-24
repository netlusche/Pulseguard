import { createState } from './state.js';
import { initI18n } from './i18n/index.js';
import { StorageService } from './services/storage.js';
import { AuthService } from './services/auth.js';
import { getDashboardStatus } from './utils/helper.js';

// Components
import Header from './components/Header.js';
import InputForm from './components/InputForm.js';
import ChartView from './components/ChartView.js';
import HistoryList from './components/HistoryList.js?v=4';
import ExtendedChartView from './components/ExtendedChartView.js';
import ExtendedHistoryView from './components/ExtendedHistoryView.js?v=4';
import LoginView from './components/LoginView.js';
import VerifyView from './components/VerifyView.js';
import AdminDashboard from './components/AdminDashboard.js';
import ProfileView from './components/ProfileView.js';

const { createApp, onMounted, computed, ref, watch } = window.Vue;

const App = {
    components: {
        'app-header': Header,
        'input-form': InputForm,
        'chart-view': ChartView,
        'history-list': HistoryList,
        'extended-chart-view': ExtendedChartView,
        'extended-history-view': ExtendedHistoryView,
        'login-view': LoginView,
        'verify-view': VerifyView,
        'admin-dashboard': AdminDashboard,
        'profile-view': ProfileView
    },
    setup() {
        const state = createState(window.Vue);
        const i18n = initI18n(window.Vue);
        const storage = new StorageService();
        const authService = new AuthService();
        
        const currentView = ref('dashboard');
        const verifyAction = ref(null);
        const verifyToken = ref(null);

        // Check URL for verification tokens
        const params = new URLSearchParams(window.location.search);
        const action = params.get('action');
        const token = params.get('token');
        if ((action === 'verify' || action === 'verify_change') && token) {
            verifyAction.value = action;
            verifyToken.value = token;
        }

        const dashboardStatus = computed(() => getDashboardStatus(state.measurements));

        const loadData = async () => {
            if (!state.currentUser) return;
            state.loading = true;
            try {
                state.measurements = await storage.getMeasurements();
            } catch (err) {
                state.error = err.message;
            } finally {
                state.loading = false;
            }
        };

        const handleLogout = () => {
            authService.logout();
            state.currentUser = null;
            state.measurements = [];
            currentView.value = 'dashboard';
        };

        const toggleView = (viewName) => {
            currentView.value = currentView.value === viewName ? 'dashboard' : viewName;
        };

        onMounted(() => {
            if (state.currentUser) {
                loadData();
            }
        });

        watch(() => state.currentUser, (newVal) => {
            if (newVal) {
                loadData();
            }
        });

        return { 
            state, i18n, storage, authService, dashboardStatus, 
            handleLogout, toggleView, currentView, verifyAction, verifyToken 
        };
    },
    template: `
        <div class="app-container">
            <app-header :state="state" :i18n="i18n" :currentView="currentView" @logout="handleLogout" @toggle-view="toggleView" />
            
            <verify-view v-if="verifyToken" 
                :state="state" 
                :i18n="i18n" 
                :authService="authService"
                :verifyAction="verifyAction"
                :verifyToken="verifyToken"
                @continue="verifyToken = null" />
            
            <login-view v-else-if="!state.currentUser" :state="state" :i18n="i18n" :authService="authService" />
            
            <template v-else>
                <admin-dashboard v-if="currentView === 'admin' && state.currentUser.role === 'admin'" :state="state" :i18n="i18n" :authService="authService" />
                
                <profile-view v-else-if="currentView === 'profile'" :state="state" :i18n="i18n" :authService="authService" />
                
                <template v-else>
                    <transition name="fade">
                        <div v-if="dashboardStatus" class="alert mt-4" :class="'alert-' + dashboardStatus.type">
                            <span style="font-size: 1.5rem; margin-top: 0.125rem;">{{ dashboardStatus.icon }}</span>
                            <div>
                                <p style="font-weight: 700">{{ i18n.t(dashboardStatus.titleKey) }}</p>
                                <p style="font-size: 0.875rem">{{ i18n.t(dashboardStatus.descKey) }}</p>
                            </div>
                        </div>
                    </transition>

                    <div class="dashboard-grid mt-4" :class="{'dashboard-grid-full': currentView !== 'dashboard'}">
                        <aside v-if="currentView === 'dashboard'">
                            <input-form :state="state" :i18n="i18n" :storage="storage" />
                        </aside>
                        <main class="space-y-8" style="display: flex; flex-direction: column; gap: 2rem">
                            <extended-chart-view v-if="currentView === 'extended-charts'" :state="state" :i18n="i18n" @back="currentView = 'dashboard'" />
                            <extended-history-view v-else-if="currentView === 'extended-history'" :state="state" :i18n="i18n" :storage="storage" @back="currentView = 'dashboard'" />
                            <template v-else>
                                <chart-view :state="state" :i18n="i18n" @expand="currentView = 'extended-charts'" />
                                <history-list :state="state" :i18n="i18n" :storage="storage" @expand="currentView = 'extended-history'" />
                            </template>
                        </main>
                    </div>
                </template>
            </template>
        </div>
    `
};

createApp(App).mount('#app');
