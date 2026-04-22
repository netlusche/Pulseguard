export default {
    props: ['state', 'i18n'],
    template: `
        <div class="card">
            <h2 class="card-title">{{ i18n.t('dashboard.chartTitle') }}</h2>
            <div style="position: relative; height: 300px; width: 100%;">
                <canvas id="bpChart"></canvas>
            </div>
        </div>
    `,
    setup(props) {
        let chartInstance = null;
        const Vue = window.Vue;

        const getChartData = () => {
            const fourteenDaysAgo = new Date();
            fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
            
            return props.state.measurements
                .filter(m => new Date(m.timestamp) >= fourteenDaysAgo)
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        };

        const updateChart = () => {
            const ctx = document.getElementById('bpChart');
            if (!ctx) return;
            
            const dataPoints = getChartData();
            const labels = dataPoints.map(m => new Date(m.timestamp).toLocaleDateString(props.i18n.locale.value === 'de' ? 'de-DE' : 'en-US', { day: '2-digit', month: '2-digit' }));
            
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
            updateChart();
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

        return {};
    }
};
