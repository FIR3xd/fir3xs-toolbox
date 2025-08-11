document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("evForm");
    const output = document.getElementById("output");

    // Motor torque curve functions with power limit awareness for raw output
    const motorCurves = {
        raw: (rpm, maxTorque, maxPowerHp, maxRpm) => {
            if (rpm === 0) return maxTorque;

            const maxPowerKw = maxPowerHp * 0.7457;
            const powerAtTorque = (maxTorque * rpm) / 9549.297; // kW at current torque & rpm

            if (powerAtTorque <= maxPowerKw) {
                return maxTorque;
            } else {
                return (maxPowerKw * 9549.297) / rpm;
            }
        },

        fastRamp: (rpm, maxTorque, maxPowerHp, maxRpm) => {
            const rampUpEnd = maxRpm * 0.2;
            const flatEnd = maxRpm * 0.7;
            if (rpm === 0) return 0;
            if (rpm < rampUpEnd) {
                return (rpm / rampUpEnd) * (maxTorque * 0.9);
            }
            if (rpm <= flatEnd) {
                return maxTorque * 0.9;
            }
            return maxTorque * (0.9 - ((rpm - flatEnd) / (maxRpm - flatEnd)) * 0.4);
        },

        slowRampStrongFalloff: (rpm, maxTorque, maxPowerHp, maxRpm) => {
            const rampUpEnd = maxRpm * 0.4;
            const flatEnd = maxRpm * 0.6;
            if (rpm === 0) return 0;
            if (rpm < rampUpEnd) {
                return (rpm / rampUpEnd) * (maxTorque * 0.7);
            }
            if (rpm <= flatEnd) {
                return maxTorque * 0.7;
            }
            return maxTorque * (0.7 - ((rpm - flatEnd) / (maxRpm - flatEnd)) * 0.5);
        },

        flatTop: (rpm, maxTorque, maxPowerHp, maxRpm) => {
            const flatEnd = maxRpm * 0.8;
            if (rpm === 0) return maxTorque;
            if (rpm <= flatEnd) {
                return maxTorque;
            }
            return maxTorque * (1 - ((rpm - flatEnd) / (maxRpm - flatEnd)));
        },

        teslaModelS: (rpm, maxTorque, maxPowerHp, maxRpm) => {
            const flatEnd = 6000;
            if (rpm === 0) return maxTorque;
            if (rpm <= flatEnd) {
                return maxTorque;
            }
            if (rpm > flatEnd && rpm <= maxRpm) {
                return maxTorque * (1 - (rpm - flatEnd) / (maxRpm - flatEnd));
            }
            return 0;
        },

        nissanLeaf: (rpm, maxTorque, maxPowerHp, maxRpm) => {
            const rampUpEnd = 1500;
            const fallOffStart = 3000;
            if (rpm === 0) return 0;
            if (rpm < rampUpEnd) {
                return (rpm / rampUpEnd) * (maxTorque * 0.85);
            }
            if (rpm >= rampUpEnd && rpm <= fallOffStart) {
                return maxTorque * 0.85;
            }
            if (rpm > fallOffStart && rpm <= maxRpm) {
                return maxTorque * 0.85 * (1 - (rpm - fallOffStart) / (maxRpm - fallOffStart));
            }
            return 0;
        },
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }
        form.classList.remove("was-validated");

        const engineType = form.engineType.value;
        if (!engineType || !motorCurves[engineType]) {
            output.textContent = "Please select a valid electric motor type.";
            return;
        }

        const maxTorque = parseFloat(form.maxTorque.value);
        const maxPowerHp = parseFloat(form.maxPower.value);
        const precision = parseInt(form.precision.value, 10);
        const maxRpm = parseInt(form.maxRpm.value, 10);
        const exportTxt = form.exportTxt.checked;

        const torqueFunc = motorCurves[engineType];

        let lines = ['["rpm", "torque"]'];

        for (let rpm = 0; rpm <= maxRpm; rpm += precision) {
            let torque = torqueFunc(rpm, maxTorque, maxPowerHp, maxRpm);
            if (torque > maxTorque) torque = maxTorque;
            if (torque < 0) torque = 0;
            lines.push(`[${rpm}, ${torque.toFixed(4)}]`);
        }

        // Add last point if needed
        if (maxRpm % precision !== 0) {
            let torque = torqueFunc(maxRpm, maxTorque, maxPowerHp, maxRpm);
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
