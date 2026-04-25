export default {
    props: ['state', 'i18n', 'authService'],
    template: `
        <div class="card auth-card">
            <h2 class="card-title" style="text-align: center;">{{ i18n.t('auth.forgotPasswordTitle') || 'Forgot Password' }}</h2>
            <p style="text-align: center; margin-bottom: 2rem; color: #94a3b8; font-size: 0.95rem;">
                {{ i18n.t('auth.forgotPasswordDesc') || 'Enter your email to receive a reset link.' }}
            </p>
            
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div class="form-group">
                    <label>{{ i18n.t('auth.email') }}</label>
                    <input v-model="email" type="email" required placeholder="name@example.com">
                </div>
                
                <button type="submit" class="btn btn-primary w-full" :disabled="loading">
                    {{ loading ? '...' : (i18n.t('auth.sendResetLinkBtn') || 'Send Reset Link') }}
                </button>
            </form>
            
            <div class="auth-switch">
                <button @click="$emit('switch', 'login')" class="btn-link">
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
    setup(props) {
        const Vue = window.Vue;
        const email = Vue.ref('');
        const error = Vue.ref(null);
        const successMsg = Vue.ref(null);
        const loading = Vue.ref(false);

        const handleSubmit = async () => {
            error.value = null;
            successMsg.value = null;
            loading.value = true;
            try {
                await props.authService.forgotPassword(email.value);
                successMsg.value = props.i18n.t('auth.resetLinkSent') || 'If the email exists, a link was sent.';
                email.value = '';
            } catch (err) {
                error.value = err.message;
            } finally {
                loading.value = false;
            }
        };

        return { email, error, successMsg, loading, handleSubmit };
    }
};
