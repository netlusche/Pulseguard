/**
 * WHO Classification logic
 */
export const getClassification = (sys, dia) => {
    if (sys < 120 && dia < 80) return 'optimal';
    if (sys < 140 && dia < 90) return 'normal';
    return 'high';
};

/**
 * Trend Analysis: returns true if last 3 measurements are critical
 */
export const getTrendStatus = (measurements) => {
    if (measurements.length < 3) return null;
    const sorted = [...measurements].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const avgSys = (sorted[0].sys + sorted[1].sys + sorted[2].sys) / 3;
    const avgDia = (sorted[0].dia + sorted[1].dia + sorted[2].dia) / 3;
    
    // Calculate if there's a significant rising trend between the 3rd most recent and the most recent
    const isRisingSys = sorted[0].sys > sorted[2].sys + 5;
    const isRisingDia = sorted[0].dia > sorted[2].dia + 5;
    
    const isDroppingSys = sorted[0].sys < sorted[2].sys - 5;
    const isDroppingDia = sorted[0].dia < sorted[2].dia - 5;
    
    if (isRisingSys || isRisingDia) {
        if (avgSys >= 140 || avgDia >= 90) return 'danger';
        if (avgSys >= 130 || avgDia >= 85) return 'warning';
    } else if (isDroppingSys || isDroppingDia) {
        if (avgSys < 130 && avgDia < 85) return 'success';
    }
    
    return null;
};

/**
 * Time-based Multi-tier Status (7-Day Average)
 */
export const getDashboardStatus = (measurements) => {
    if (!measurements || measurements.length === 0) return null;

    const sortedAll = [...measurements].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const latest = sortedAll[0];

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    
    let recentMeasurements = measurements.filter(m => new Date(m.timestamp) >= sevenDaysAgo);
    
    // Fallback if < 3 measurements in the last 7 days
    if (recentMeasurements.length < 3) {
        recentMeasurements = sortedAll.slice(0, 3);
    }
    
    if (recentMeasurements.length === 0) return null;

    const avgSys = recentMeasurements.reduce((sum, m) => sum + m.sys, 0) / recentMeasurements.length;
    const avgDia = recentMeasurements.reduce((sum, m) => sum + m.dia, 0) / recentMeasurements.length;

    // 1. Acute Spike Check (Newest Measurement)
    if (latest.sys >= 160 || latest.dia >= 100) {
        return {
            type: 'danger',
            icon: '🚨',
            titleKey: 'dashboard.status.acuteSpikeTitle',
            descKey: 'dashboard.status.acuteSpikeDesc'
        };
    }

    // 2. Outlier Check (Latest is high, but 7-day average is NOT high)
    if ((latest.sys >= 140 || latest.dia >= 90) && (avgSys < 140 && avgDia < 90)) {
        return {
            type: 'warning',
            icon: '⚠️',
            titleKey: 'dashboard.status.outlierTitle',
            descKey: 'dashboard.status.outlierDesc'
        };
    }

    // 3. Trend overrides static states
    const trend = getTrendStatus(measurements);
    if (trend === 'danger') {
        return {
            type: 'danger',
            icon: '📈',
            titleKey: 'dashboard.status.trendTitle',
            descKey: 'dashboard.status.trendDesc'
        };
    } else if (trend === 'warning') {
        return {
            type: 'warning',
            icon: '📈',
            titleKey: 'dashboard.status.mildTrendTitle',
            descKey: 'dashboard.status.mildTrendDesc'
        };
    } else if (trend === 'success') {
        return {
            type: 'success',
            icon: '📉',
            titleKey: 'dashboard.status.goodTrendTitle',
            descKey: 'dashboard.status.goodTrendDesc'
        };
    }

    // 4. Static 7-Day Average States
    if (avgSys >= 140 || avgDia >= 90) {
        return {
            type: 'danger',
            icon: '🔴',
            titleKey: 'dashboard.status.redTitle',
            descKey: 'dashboard.status.redDesc'
        };
    } else if (avgSys >= 130 || avgDia >= 85) {
        return {
            type: 'warning',
            icon: '🟡',
            titleKey: 'dashboard.status.yellowTitle',
            descKey: 'dashboard.status.yellowDesc'
        };
    } else {
        return {
            type: 'success',
            icon: '🟢',
            titleKey: 'dashboard.status.greenTitle',
            descKey: 'dashboard.status.greenDesc'
        };
    }
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
