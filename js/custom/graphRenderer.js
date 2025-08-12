export function renderTorqueGraph(canvasId, rpmValues, torqueValues, maxRpm, maxTorque) {
    if (!window.Chart) {
        console.error("Chart.js library not loaded!");
        return;
    }

    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) {
        console.error(`Canvas with id '${canvasId}' not found!`);
        return;
    }

    if (window.torqueChart && typeof window.torqueChart.destroy === 'function') {
        window.torqueChart.destroy();
    }

    // Clamp torque values
    for (let i = 0; i < torqueValues.length; i++) {
        if (!isFinite(torqueValues[i]) || torqueValues[i] < 0) torqueValues[i] = 0;
        else if (torqueValues[i] > maxTorque) torqueValues[i] = maxTorque;
    }

    // Calculate HP array from torque and rpm arrays
    const hpValues = rpmValues.map((rpm, i) => {
        const torque = torqueValues[i];
        return torque && rpm ? (torque * rpm) / 7127 : 0;
    });

    const yMaxTorque = maxTorque * 1.1;
    const yMaxHp = Math.max(...hpValues) * 1.1;

    window.torqueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: rpmValues,
            datasets: [
                {
                    label: 'Torque (Nm)',
                    data: torqueValues,
                    borderColor: 'cyan',
                    backgroundColor: 'rgba(0,255,255,0.1)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 0,
                    borderWidth: 2,
                    yAxisID: 'yTorque',
                },
                {
                    label: 'Power (HP)',
                    data: hpValues,
                    borderColor: 'magenta',
                    backgroundColor: 'rgba(255,0,255,0.1)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 0,
                    borderWidth: 2,
                    yAxisID: 'yPower',
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    min: 0,
                    max: maxRpm,
                    ticks: { color: '#eee' },
                    title: { display: true, text: 'RPM', color: '#eee' },
                },
                yTorque: {
                    type: 'linear',
                    position: 'left',
                    beginAtZero: true,
                    min: 0,
                    max: yMaxTorque,
                    ticks: { color: 'cyan' },
                    title: { display: true, text: 'Torque (Nm)', color: 'cyan' },
                },
                yPower: {
                    type: 'linear',
                    position: 'right',
                    beginAtZero: true,
                    min: 0,
                    max: yMaxHp,
                    ticks: { color: 'magenta' },
                    title: { display: true, text: 'Power (HP)', color: 'magenta' },
                    grid: { drawOnChartArea: false }, // avoid grid overlap
                }
            },
            plugins: {
                legend: { labels: { color: '#eee' } }
            }
        }
    });
}
