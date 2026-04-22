export default {
    props: ['state', 'i18n', 'authService'],
    template: `
        <div class="card" style="margin-top: 2rem;">
            <h2 class="card-title">{{ i18n.t('admin.globalSettings') }}</h2>
            <div class="space-y-4" style="margin-bottom: 2rem;">
                <div style="display: flex; align-items: center; justify-content: flex-start; gap: 2rem; padding: 1.25rem 1rem; background: hsl(var(--muted)); border-radius: 8px;">
                    <div style="flex-grow: 1; max-width: 450px;">
                        <strong style="display: block; font-size: 1rem; margin-bottom: 0.25rem;">{{ i18n.t('admin.strictPasswordTitle') }}</strong>
                        <p style="font-size: 0.85rem; color: hsl(var(--muted-foreground)); margin: 0;">{{ i18n.t('admin.strictPasswordDesc') }}</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" v-model="settings.strict_password_policy" @change="saveSettings" true-value="1" false-value="0">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div style="display: flex; align-items: center; justify-content: flex-start; gap: 2rem; padding: 1.25rem 1rem; background: hsl(var(--muted)); border-radius: 8px;">
                    <div style="flex-grow: 1; max-width: 450px;">
                        <strong style="display: block; font-size: 1rem; margin-bottom: 0.25rem;">{{ i18n.t('admin.twoFactorTitle') }}</strong>
                        <p style="font-size: 0.85rem; color: hsl(var(--muted-foreground)); margin: 0;">{{ i18n.t('admin.twoFactorDesc') }}</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" v-model="settings.two_factor_enabled" @change="saveSettings" true-value="1" false-value="0">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
            <transition name="fade">
                <div v-if="settingsMsg" class="alert alert-success mt-4" style="margin-bottom: 2rem;">
                    {{ settingsMsg }}
                </div>
            </transition>

            <h2 class="card-title">{{ i18n.t('admin.title') }}</h2>
            
            <div class="table-responsive">
                <table style="width: 100%; text-align: left; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="padding: 1rem; border-bottom: 1px solid #334155;">{{ i18n.t('admin.id') }}</th>
                            <th style="padding: 1rem; border-bottom: 1px solid #334155;">{{ i18n.t('admin.email') }}</th>
                            <th style="padding: 1rem; border-bottom: 1px solid #334155;">{{ i18n.t('admin.role') }}</th>
                            <th style="padding: 1rem; border-bottom: 1px solid #334155;">{{ i18n.t('admin.registered') }}</th>
                            <th style="padding: 1rem; border-bottom: 1px solid #334155;">{{ i18n.t('admin.actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in users" :key="user.id">
                            <td style="padding: 1rem; border-bottom: 1px solid #1e293b;">{{ user.id }}</td>
                            <td style="padding: 1rem; border-bottom: 1px solid #1e293b;">{{ user.email }}</td>
                            <td style="padding: 1rem; border-bottom: 1px solid #1e293b;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <label class="toggle-switch">
                                        <input type="checkbox" 
                                               :checked="user.role === 'admin'" 
                                               @change="toggleRole(user)" 
                                               :disabled="user.id === state.currentUser.id && adminCount <= 1">
                                        <span class="toggle-slider"></span>
                                    </label>
                                    <span style="font-size: 0.85rem; color: hsl(var(--muted-foreground));">
                                        {{ user.role === 'admin' ? 'Admin' : 'User' }}
                                    </span>
                                </div>
                            </td>
                            <td style="padding: 1rem; border-bottom: 1px solid #1e293b;">{{ new Date(user.created_at).toLocaleDateString() }}</td>
                            <td style="padding: 1rem; border-bottom: 1px solid #1e293b;">
                                <div style="display: flex; gap: 0.5rem;">
                                    <button 
                                        v-if="user.id !== state.currentUser.id"
                                        @click="deleteUser(user.id)" 
                                        class="btn btn-ghost" style="color: #ef4444; padding: 0.25rem;">
                                        {{ i18n.t('admin.delete') }}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div v-if="error" class="alert alert-danger mt-4">
                {{ error }}
            </div>
        </div>
    `,
    setup(props) {
        const Vue = window.Vue;
        const users = Vue.ref([]);
        const error = Vue.ref(null);
        const settingsMsg = Vue.ref(null);
        const settings = Vue.ref({
            strict_password_policy: '0',
            two_factor_enabled: '0'
        });

        const loadSettings = async () => {
            try {
                settings.value = await props.authService.getSettings();
            } catch (err) {
                console.error(err);
            }
        };

        const saveSettings = async () => {
            settingsMsg.value = null;
            try {
                await props.authService.updateSettings(settings.value);
                settingsMsg.value = props.i18n.t('admin.settingsSaved');
                setTimeout(() => settingsMsg.value = null, 3000);
            } catch (err) {
                error.value = err.message;
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await fetch(`${props.authService.baseUrl}/index.php?action=users`, {
                    headers: {
                        'Authorization': `Bearer ${props.authService.getToken()}`
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch users');
                users.value = await response.json();
            } catch (err) {
                error.value = err.message;
            }
        };

        const deleteUser = async (id) => {
            if (!confirm(props.i18n.t('admin.confirmDelete'))) return;
            try {
                const response = await fetch(`${props.authService.baseUrl}/index.php?action=users&id=${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${props.authService.getToken()}`
                    }
                });
                if (!response.ok) throw new Error('Failed to delete user');
                await fetchUsers();
            } catch (err) {
                error.value = err.message;
            }
        };

        const adminCount = Vue.computed(() => users.value.filter(u => u.role === 'admin').length);

        const toggleRole = async (user) => {
            const newRole = user.role === 'admin' ? 'user' : 'admin';
            
            if (user.id === props.state.currentUser.id && newRole === 'user' && adminCount.value <= 1) {
                error.value = "Cannot demote the only remaining admin.";
                return;
            }
            
            try {
                const response = await fetch(`${props.authService.baseUrl}/index.php?action=users&id=${user.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${props.authService.getToken()}`
                    },
                    body: JSON.stringify({ role: newRole })
                });
                
                if (!response.ok) {
                    const err = await response.json().catch(() => ({}));
                    throw new Error(err.error || 'Failed to update role');
                }
                
                await fetchUsers();
                
                if (user.id === props.state.currentUser.id && newRole === 'user') {
                    const storedUser = JSON.parse(localStorage.getItem('pulseguard_user') || '{}');
                    storedUser.role = 'user';
                    localStorage.setItem('pulseguard_user', JSON.stringify(storedUser));
                    window.location.reload();
                }
            } catch (err) {
                error.value = err.message;
                await fetchUsers();
            }
        };

        Vue.onMounted(() => {
            fetchUsers();
            loadSettings();
        });

        return { users, error, settings, settingsMsg, deleteUser, toggleRole, saveSettings, adminCount };
    }
};
