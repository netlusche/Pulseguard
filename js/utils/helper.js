/**
 * WHO Classification logic
 */
export const getClassification = (sys, dia) => {
    if (sys < 120 && dia < 80) return 'optimal';
    if (sys < 140 || dia < 90) return 'normal';
    return 'high';
};

/**
 * Trend Analysis: returns true if last 3 measurements are critical
 */
export const hasCriticalTrend = (measurements) => {
    if (measurements.length < 3) return false;
    const sorted = [...measurements].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const avgSys = (sorted[0].sys + sorted[1].sys + sorted[2].sys) / 3;
    const avgDia = (sorted[0].dia + sorted[1].dia + sorted[2].dia) / 3;
    return avgSys >= 135 || avgDia >= 85;
};

/**
 * Date Formatting
 */
export const formatDate = (timestamp, locale = 'de') => {
    return new Date(timestamp).toLocaleDateString(locale, {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * CSV Export
 */
export const exportToCSV = (measurements) => {
    let csv = "data:text/csv;charset=utf-8,Date;Systolic;Diastolic;Pulse;Notes\n" + 
              measurements.map(m => `${m.timestamp};${m.sys};${m.dia};${m.pulse};${m.notes}`).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `PulseGuard_Export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
};
