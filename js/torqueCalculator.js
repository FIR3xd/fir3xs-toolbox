import { getTorqueAtRPM } from './engineCurves.js';

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("evForm");
    const output = document.getElementById("output");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }
        form.classList.remove("was-validated");

        const engineType = form.engineType.value;
        if (!engineType) {
            output.textContent = "Please select a valid electric motor type.";
            return;
        }

        const maxTorque = parseFloat(form.maxTorque.value);
        const maxPowerHp = parseFloat(form.maxPower.value);
        const precision = parseInt(form.precision.value, 10);
        const maxRpm = parseInt(form.maxRpm.value, 10);
        const exportTxt = form.exportTxt.checked;

        let lines = ['["rpm", "torque"]'];

        for (let rpm = 0; rpm <= maxRpm; rpm += precision) {
            let torque = getTorqueAtRPM(engineType, rpm, maxTorque, maxPowerHp, maxRpm);
            if (torque > maxTorque) torque = maxTorque;
            if (torque < 0) torque = 0;
            lines.push(`[${rpm}, ${torque.toFixed(4)}]`);
        }

        if (maxRpm % precision !== 0) {
            let torque = getTorqueAtRPM(engineType, maxRpm, maxTorque, maxPowerHp, maxRpm);
            if (torque > maxTorque) torque = maxTorque;
            if (torque < 0) torque = 0;
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
    });
});
