import { getTorqueAtRPM } from './engineCurves.js';
import { renderTorqueGraph } from './graphRenderer.js';

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("evForm");
    const output = document.getElementById("output");

    // Elements for toggle + sliders
    const customToggle = document.getElementById("customCurveToggle");
    const presetSection = document.getElementById("presetSelectorSection");
    const customSlidersSection = document.getElementById("customSlidersSection");

    // Slider elements
    const rampUpSlider = document.getElementById("rampUpSlider");
    const plateauSlider = document.getElementById("plateauSlider");
    const falloffStartSlider = document.getElementById("falloffStartSlider");
    const falloffSteepnessSlider = document.getElementById("falloffSteepnessSlider");

    // Slider value display spans
    const rampUpValue = document.getElementById("rampUpValue");
    const plateauValue = document.getElementById("plateauValue");
    const falloffStartValue = document.getElementById("falloffStartValue");
    const falloffSteepnessValue = document.getElementById("falloffSteepnessValue");

    // Precision slider and value display
    const precisionSlider = document.getElementById("precisionSlider");
    const precisionValue = document.getElementById("precisionValue");

    // Update slider labels on input
    const updateSliderLabels = () => {
        rampUpValue.textContent = rampUpSlider.value + "%";
        plateauValue.textContent = plateauSlider.value + "%";
        falloffStartValue.textContent = falloffStartSlider.value + "%";
        falloffSteepnessValue.textContent = falloffSteepnessSlider.value;
    };

    // Initial label update
    updateSliderLabels();

    // Attach slider input listeners for live label update
    [rampUpSlider, plateauSlider, falloffStartSlider, falloffSteepnessSlider].forEach(slider => {
        slider.addEventListener("input", updateSliderLabels);
    });

    // Precision slider live text update
    precisionValue.textContent = precisionSlider.value;
    precisionSlider.addEventListener("input", () => {
        precisionValue.textContent = precisionSlider.value;
    });

    // Toggle handler: show/hide sections
    customToggle.addEventListener("change", () => {
        if (customToggle.checked) {
            customSlidersSection.style.display = "block";
            presetSection.style.display = "none";
            form.engineType.removeAttribute("required");
        } else {
            customSlidersSection.style.display = "none";
            presetSection.style.display = "block";
            form.engineType.setAttribute("required", "true");
        }
    });

    // Custom torque curve function based on sliders
    function customTorqueCurve(rpm, maxTorque, maxPowerHp, maxRpm) {
        const rampUpEnd = (rampUpSlider.value / 100) * maxRpm;
        const plateauEnd = ((rampUpSlider.value / 100) + (plateauSlider.value / 100)) * maxRpm;
        const fallOffStart = (falloffStartSlider.value / 100) * maxRpm;
        const fallOffSteepness = falloffSteepnessSlider.value;

        if (rpm === 0) return 0;

        if (rpm < rampUpEnd) {
            return (rpm / rampUpEnd) * maxTorque;
        }
        if (rpm >= rampUpEnd && rpm <= plateauEnd) {
            return maxTorque;
        }
        if (rpm > plateauEnd && rpm <= fallOffStart) {
            return maxTorque;
        }
        if (rpm > fallOffStart && rpm <= maxRpm) {
            const normalizedRPM = (rpm - fallOffStart) / (maxRpm - fallOffStart);
            return maxTorque * Math.pow(1 - normalizedRPM, fallOffSteepness);
        }
        return 0;
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }
        form.classList.remove("was-validated");

        const useCustomCurve = customToggle.checked;

        const engineType = form.engineType.value;
        const maxTorque = parseFloat(form.maxTorque.value);
        const maxPowerHp = parseFloat(form.maxPower.value);
        const precision = parseInt(precisionSlider.value, 10);
        const maxRpm = parseInt(form.maxRpm.value, 10);
        const exportTxt = form.exportTxt.checked;

        let lines = ['["rpm", "torque"]'];
        const rpmValues = [];
        const torqueValues = [];

        for (let rpm = 0; rpm <= maxRpm; rpm += precision) {
            let torque;
            if (useCustomCurve) {
                torque = customTorqueCurve(rpm, maxTorque, maxPowerHp, maxRpm);
            } else {
                torque = getTorqueAtRPM(engineType, rpm, maxTorque, maxPowerHp, maxRpm);
            }

            if (torque > maxTorque) torque = maxTorque;
            if (torque < 0) torque = 0;

            rpmValues.push(rpm);
            torqueValues.push(torque);
            lines.push(`[${rpm}, ${torque.toFixed(4)}]`);
        }

        if (maxRpm % precision !== 0) {
            let torque;
            if (useCustomCurve) {
                torque = customTorqueCurve(maxRpm, maxTorque, maxPowerHp, maxRpm);
            } else {
                torque = getTorqueAtRPM(engineType, maxRpm, maxTorque, maxPowerHp, maxRpm);
            }

            if (torque > maxTorque) torque = maxTorque;
            if (torque < 0) torque = 0;

            rpmValues.push(maxRpm);
            torqueValues.push(torque);
            lines.push(`[${maxRpm}, ${torque.toFixed(4)}]`);
        }

        const torqueTable = lines.join("\n");
        output.textContent = torqueTable;

        if (exportTxt) {
            const blob = new Blob([torqueTable], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "torque_output.txt";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        try {
            renderTorqueGraph('torqueChart', rpmValues, torqueValues, maxRpm, maxTorque);
        } catch (error) {
            console.error("Failed to render torque graph:", error);
        }
    });
});