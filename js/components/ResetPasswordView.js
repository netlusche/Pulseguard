export default {
    props: ['state', 'i18n', 'authService', 'resetToken'],
    template: `
        <div class="card auth-card">
            <h2 class="card-title" style="text-align: center;">{{ i18n.t('auth.resetPasswordTitle') || 'Set New Password' }}</h2>
            
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div class="form-group">
                    <label>{{ i18n.t('auth.password') }}</label>
                    <div class="password-wrapper">
                        <input v-model="password" :type="showPassword ? 'text' : 'password'" required placeholder="***">
                        <button type="button" class="password-toggle" @click="showPassword = !showPassword" tabindex="-1">
                            <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                    </div>
                </div>
                <div class="form-group">
                    <label>{{ i18n.t('auth.passwordConfirm') || 'Confirm Password' }}</label>
                    <div class="password-wrapper">
                        <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" required placeholder="***">
                        <button type="button" class="password-toggle" @click="showConfirmPassword = !showConfirmPassword" tabindex="-1">
                            <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                    </div>
                </div>
                
                <button type="submit" class="btn btn-primary w-full" :disabled="loading">
                    {{ loading ? '...' : (i18n.t('auth.resetPasswordBtn') || 'Reset Password') }}
                </button>
            </form>
            
            <div class="auth-switch">
                <button @click="$emit('continue')" class="btn-link">
                    {{ i18n.t('auth.backToLoginBtn') }}
                </button>
            </div>
            
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
    setup(props, { emit }) {
        const Vue = window.Vue;
        const password = Vue.ref('');
        const confirmPassword = Vue.ref('');
        const error = Vue.ref(null);
        const successMsg = Vue.ref(null);
        const loading = Vue.ref(false);
        const showPassword = Vue.ref(false);
        const showConfirmPassword = Vue.ref(false);

        const handleSubmit = async () => {
            error.value = null;
            successMsg.value = null;
            
            if (password.value !== confirmPassword.value) {
                error.value = props.i18n.t('auth.passwordMismatch') || 'Passwords do not match';
                return;
            }
            
            loading.value = true;
            try {
                await props.authService.resetPassword(props.resetToken, password.value);
                successMsg.value = props.i18n.t('auth.resetSuccess') || 'Password reset successfully.';
                setTimeout(() => {
                    emit('continue');
                }, 2000);
            } catch (err) {
                error.value = err.message || props.i18n.t('auth.resetError') || 'Invalid or expired token.';
            } finally {
                loading.value = false;
            }
        };

        return { 
            password, confirmPassword, error, successMsg, loading, 
            showPassword, showConfirmPassword, handleSubmit 
        };
    }
};
