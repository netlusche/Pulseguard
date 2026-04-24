export default {
    props: ['state', 'i18n'],
    template: `
        <div class="card">
            <div class="flex-between mb-2">
                <h2 class="card-title" style="margin-bottom: 0;">{{ i18n.t('dashboard.extendedChartTitle') }}</h2>
                <button @click="$emit('back')" class="btn btn-outline" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;">
                    &larr; {{ i18n.t('dashboard.backToDashboard') }}
                </button>
            </div>
            
            <div class="form-grid-2" style="margin-bottom: 1.5rem; background: hsl(var(--muted)); padding: 1rem; border-radius: var(--radius);">
                <div class="form-group">
                    <label class="form-label">{{ i18n.t('dashboard.from') }}</label>
                    <input type="date" class="form-input" v-model="fromDate" @change="updateChart">
                </div>
                <div class="form-group">
                    <label class="form-label">{{ i18n.t('dashboard.to') }}</label>
                    <input type="date" class="form-input" v-model="toDate" @change="updateChart">
                </div>
            </div>

            <div style="position: relative; height: 400px; width: 100%;">
                <canvas id="extendedBpChart"></canvas>
            </div>
            <div v-if="filteredData.length === 0" class="text-muted" style="text-align: center; padding: 2rem">
                {{ i18n.t('dashboard.noData') }}
            </div>
        </div>
    `,
    setup(props) {
        const Vue = window.Vue;
        let chartInstance = null;
        
        // Default to last 30 days
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        const fromDate = Vue.ref(thirtyDaysAgo.toISOString().split('T')[0]);
        const toDate = Vue.ref(today.toISOString().split('T')[0]);
        const filteredData = Vue.ref([]);

        const getChartData = () => {
            const start = new Date(fromDate.value);
            start.setHours(0, 0, 0, 0);
            const end = new Date(toDate.value);
            end.setHours(23, 59, 59, 999);
            
            const data = props.state.measurements
                .filter(m => {
                    const d = new Date(m.timestamp);
                    return d >= start && d <= end;
                })
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                
            filteredData.value = data;
            return data;
        };

        const updateChart = () => {
            const ctx = document.getElementById('extendedBpChart');
            if (!ctx) return;
            
            const dataPoints = getChartData();
            const labels = dataPoints.map(m => new Date(m.timestamp).toLocaleDateString(props.i18n.locale.value === 'de' ? 'de-DE' : 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }));
            
            if (chartInstance) {
                chartInstance.data.labels = labels;
                chartInstance.data.datasets[0].data = dataPoints.map(m => m.sys);
                chartInstance.data.datasets[1].data = dataPoints.map(m => m.dia);
                chartInstance.update();
            } else {
                chartInstance = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels,
                        datasets: [
                            { 
                                label: props.i18n.t('form.sys'), 
                                data: dataPoints.map(m => m.sys), 
                                borderColor: '#3b82f6', 
                                backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                                tension: 0.3, 
                                fill: true 
                            },
                            { 
                                label: props.i18n.t('form.dia'), 
                                data: dataPoints.map(m => m.dia), 
                                borderColor: '#10b981', 
                                backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                                tension: 0.3, 
                                fill: true 
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: { y: { beginAtZero: false } },
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: { usePointStyle: true, boxWidth: 6 }
                            }
                        }
                    }
                });
            }
        };

        Vue.onMounted(() => {
            setTimeout(() => {
                updateChart();
            }, 50);
        });

        Vue.watch(() => props.state.measurements, () => {
            updateChart();
        }, { deep: true });

        Vue.watch(() => props.i18n.locale.value, () => {
            if (chartInstance) {
                chartInstance.destroy();
                chartInstance = null;
            }
            updateChart();
        });

        return { fromDate, toDate, updateChart, filteredData };
    }
};
