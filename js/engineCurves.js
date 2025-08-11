export const motorCurves = {
    raw: (rpm, maxTorque, maxPowerHp, maxRpm) => {
        if (rpm === 0) return maxTorque;
        const maxPowerKw = maxPowerHp * 0.7457;
        const powerAtTorque = (maxTorque * rpm) / 9549.297;
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

// Export a helper function to get the torque curve by type
export function getTorqueAtRPM(type, rpm, maxTorque, maxPowerHp, maxRpm) {
    const fn = motorCurves[type];
    if (!fn) throw new Error(`Motor curve "${type}" not found`);
    return fn(rpm, maxTorque, maxPowerHp, maxRpm);
}
