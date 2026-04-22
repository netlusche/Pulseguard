export default {
    props: ['state', 'i18n', 'authService'],
    template: `
        <div class="card profile-card">
            <h2 class="card-title" style="text-align: center;">{{ i18n.t('profile.title') }}</h2>
            
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div class="form-group">
                    <label>{{ i18n.t('profile.changeEmail') }}</label>
                    <input v-model="newEmail" type="email" required>
                </div>
                <div class="form-group">
                    <label>{{ i18n.t('profile.changePassword') }}</label>
                    <div class="password-wrapper">
                        <input v-model="newPassword" :type="showNewPassword ? 'text' : 'password'" placeholder="***">
                        <button type="button" class="password-toggle" @click="showNewPassword = !showNewPassword" tabindex="-1">
                            <svg v-if="showNewPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                    </div>
                </div>
                <div class="form-group" style="margin-top: 2rem; border-top: 1px solid #334155; padding-top: 1rem;">
                    <label style="color: #ef4444">{{ i18n.t('profile.currentPassword') }}</label>
                    <div class="password-wrapper">
                        <input v-model="currentPassword" :type="showCurrentPassword ? 'text' : 'password'" required>
                        <button type="button" class="password-toggle" @click="showCurrentPassword = !showCurrentPassword" tabindex="-1">
                            <svg v-if="showCurrentPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                    </div>
                </div>
                
                <button type="submit" class="btn btn-primary w-full">
                    {{ i18n.t('profile.save') }}
                </button>
            </form>
            
            <transition name="fade">
                <div v-if="error" class="alert alert-danger mt-4">
                    {{ error }}
                </div>
            </transition>
            <transition name="fade">
                <div v-if="successMsg" class="alert alert-success mt-4">
                    {{ successMsg }}
                </div>
            </transition>
        </div>
    `,
    setup(props) {
        const Vue = window.Vue;
        const newEmail = Vue.ref(props.state.currentUser ? props.state.currentUser.email : '');
        const newPassword = Vue.ref('');
        const currentPassword = Vue.ref('');
        const error = Vue.ref(null);
        const successMsg = Vue.ref(null);
        const showNewPassword = Vue.ref(false);
        const showCurrentPassword = Vue.ref(false);

        const handleSubmit = async () => {
            error.value = null;
            successMsg.value = null;
            try {
                const responseData = await props.authService.updateProfile(
                    currentPassword.value,
                    newEmail.value,
                    newPassword.value
                );
                
                if (responseData.email_change_pending) {
                    successMsg.value = props.i18n.t('profile.emailPending');
                } else {
                    successMsg.value = props.i18n.t('profile.success');
                }
                
                if (responseData.user) {
                    props.state.currentUser = responseData.user;
                }
                currentPassword.value = '';
                newPassword.value = '';
            } catch (err) {
                error.value = err.message || props.i18n.t('profile.error');
            }
        };

        return { 
            newEmail, newPassword, currentPassword, error, successMsg, 
            showNewPassword, showCurrentPassword, handleSubmit 
        };
    }
};
