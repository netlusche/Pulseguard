export default {
    props: ['state', 'i18n', 'authService'],
    template: `
        <div class="card auth-card">
            <h2 class="card-title" style="text-align: center;">
                <template v-if="requires2FA">{{ i18n.t('auth.twoFactorTitle') }}</template>
                <template v-else>{{ isLogin ? i18n.t('auth.loginTitle') : i18n.t('auth.registerTitle') }}</template>
            </h2>
            
            <form v-if="!requires2FA" @submit.prevent="handleSubmit" class="space-y-4">
                <div class="form-group">
                    <label>{{ i18n.t('auth.email') }}</label>
                    <input v-model="email" type="email" required>
                </div>
                <div class="form-group">
                    <label>{{ i18n.t('auth.password') }}</label>
                    <div class="password-wrapper">
                        <input v-model="password" :type="showPassword ? 'text' : 'password'" required>
                        <button type="button" class="password-toggle" @click="showPassword = !showPassword" tabindex="-1">
                            <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                    </div>
                </div>
                <div v-if="!isLogin" class="form-group">
                    <label>{{ i18n.t('auth.passwordConfirm') }}</label>
                    <div class="password-wrapper">
                        <input v-model="passwordConfirm" :type="showPasswordConfirm ? 'text' : 'password'" required>
                        <button type="button" class="password-toggle" @click="showPasswordConfirm = !showPasswordConfirm" tabindex="-1">
                            <svg v-if="showPasswordConfirm" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                    </div>
                </div>
                
                <button type="submit" class="btn btn-primary w-full">
                    {{ isLogin ? i18n.t('auth.loginBtn') : i18n.t('auth.registerBtn') }}
                </button>
            </form>
            
            <form v-else @submit.prevent="handle2FASubmit" class="space-y-4">
                <div class="form-group">
                    <label>{{ i18n.t('auth.twoFactorLabel') }}</label>
                    <input v-model="twoFactorCode" type="text" maxlength="6" required>
                </div>
                <button type="submit" class="btn btn-primary w-full">
                    {{ i18n.t('auth.verifyCodeBtn') }}
                </button>
                <button type="button" @click="requires2FA = false" class="btn btn-ghost w-full mt-4">
                    {{ i18n.t('auth.backToLoginBtn') }}
                </button>
            </form>
            
            <div v-if="!requires2FA" style="text-align: center; margin-top: 1rem;">
                <button @click="isLogin = !isLogin" class="btn btn-ghost">
                    {{ isLogin ? i18n.t('auth.switchToRegister') : i18n.t('auth.switchToLogin') }}
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
        const email = Vue.ref('');
        const password = Vue.ref('');
        const passwordConfirm = Vue.ref('');
        const isLogin = Vue.ref(true);
        const error = Vue.ref(null);
        const successMsg = Vue.ref(null);
        const requires2FA = Vue.ref(false);
        const twoFactorCode = Vue.ref('');
        const showPassword = Vue.ref(false);
        const showPasswordConfirm = Vue.ref(false);

        const handleSubmit = async () => {
            error.value = null;
            successMsg.value = null;

            if (!isLogin.value && password.value !== passwordConfirm.value) {
                error.value = props.i18n.t('auth.passwordMismatch');
                return;
            }

            try {
                if (isLogin.value) {
                    const result = await props.authService.login(email.value, password.value);
                    if (result.require_2fa) {
                        requires2FA.value = true;
                        successMsg.value = props.i18n.t('auth.codeSent');
                        return;
                    }
                    props.state.currentUser = result;
                    emit('login-success');
                } else {
                    await props.authService.register(email.value, password.value);
                    isLogin.value = true;
                    successMsg.value = props.i18n.t('auth.registerSuccessMail');
                }
            } catch (err) {
                error.value = err.message || props.i18n.t('auth.error');
            }
        };

        const handle2FASubmit = async () => {
            error.value = null;
            try {
                const user = await props.authService.verify2FA(email.value, twoFactorCode.value);
                props.state.currentUser = user;
                emit('login-success');
            } catch (err) {
                error.value = err.message || 'Verification failed';
            }
        };

        return { 
            email, password, passwordConfirm, isLogin, error, successMsg, 
            requires2FA, twoFactorCode, showPassword, showPasswordConfirm,
            handleSubmit, handle2FASubmit 
        };
    }
};
