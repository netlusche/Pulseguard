export default {
    props: ['state', 'i18n', 'authService', 'verifyAction', 'verifyToken'],
    template: `
        <div class="card auth-card" style="text-align: center;">
            <h2 class="card-title">{{ i18n.t('auth.verifyTitle') }}</h2>
            
            <div v-if="status === 'loading'" style="padding: 2rem;">
                <div style="font-size: 2rem; margin-bottom: 1rem;">⏳</div>
                <p>{{ i18n.t('auth.verifying') }}</p>
            </div>
            
            <div v-else-if="status === 'success'" style="padding: 2rem;">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 1rem;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <h3 style="margin-bottom: 1rem; font-size: 1.25rem; font-weight: 600;">{{ i18n.t('auth.verifySuccess') }}</h3>
                <p style="margin-bottom: 2rem;">{{ message }}</p>
                <button @click="$emit('continue')" class="btn btn-primary w-full">
                    {{ i18n.t('auth.verifyContinueBtn') }}
                </button>
            </div>
            
            <div v-else style="padding: 2rem;">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 1rem;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <h3 style="margin-bottom: 1rem; font-size: 1.25rem; font-weight: 600;">{{ i18n.t('auth.verifyFailed') }}</h3>
                <p style="margin-bottom: 2rem; color: #ef4444;">{{ message }}</p>
                <button @click="$emit('continue')" class="btn btn-primary w-full">
                    {{ i18n.t('auth.verifyGoLoginBtn') }}
                </button>
            </div>
        </div>
    `,
    setup(props) {
        const Vue = window.Vue;
        const status = Vue.ref('loading');
        const message = Vue.ref('');

        Vue.onMounted(async () => {
            try {
                const res = await props.authService.verifyToken(props.verifyAction, props.verifyToken);
                status.value = 'success';
                message.value = res.message || props.i18n.t('auth.verifySuccessMsg');
                
                // Clear the URL parameters without reloading
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (err) {
                status.value = 'error';
                message.value = err.message || props.i18n.t('auth.verifyErrorMsg');
            }
        });

        return { status, message };
    }
};
