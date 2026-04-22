export const createState = (Vue) => {
    const savedUser = localStorage.getItem('pulseguard_user');
    return Vue.reactive({
        measurements: [],
        lastFeedback: null,
        currentUser: savedUser ? JSON.parse(savedUser) : null,
        loading: false,
        error: null
    });
};
