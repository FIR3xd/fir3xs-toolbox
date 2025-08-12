export const motorCurves = {
    //Virtual-------------------------------------------------------------------------

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

    //EVs-------------------------------------------------------------------------

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

    vwID4: (rpm, maxTorque, maxPowerHp, maxRpm) => {
        const rampUpEnd = 1600;
        const fallOffStart = 6000;
        if (rpm === 0) return 0;
        if (rpm < rampUpEnd) {
            return (rpm / rampUpEnd) * (maxTorque * 0.88);
        }
        if (rpm >= rampUpEnd && rpm <= fallOffStart) {
            return maxTorque * 0.88;
        }
        if (rpm > fallOffStart && rpm <= maxRpm) {
            return maxTorque * 0.88 * (1 - (rpm - fallOffStart) / (maxRpm - fallOffStart));
        }
        return 0;
    },

    porscheTaycan: (rpm, maxTorque, maxPowerHp, maxRpm) => {
        const rampUpEnd = 900;
        const plateauEnd = 10000;
        if (rpm === 0) return 0;
        if (rpm < rampUpEnd) {
            return (rpm / rampUpEnd) * maxTorque;
        }
        if (rpm >= rampUpEnd && rpm <= plateauEnd) {
            return maxTorque;
        }
        if (rpm > plateauEnd && rpm <= maxRpm) {
            return maxTorque * (1 - (rpm - plateauEnd) / (maxRpm - plateauEnd));
        }
        return 0;
    },

    enyaqRS: (rpm, maxTorque, maxPowerHp, maxRpm) => {
        const rampUpEnd = 1200;
        const fallOffStart = 5000;
        if (rpm === 0) return 0;
        if (rpm < rampUpEnd) {
            return (rpm / rampUpEnd) * (maxTorque * 0.95);
        }
        if (rpm >= rampUpEnd && rpm <= fallOffStart) {
            return maxTorque * 0.95;
        }
        if (rpm > fallOffStart && rpm <= maxRpm) {
            return maxTorque * 0.95 * (1 - (rpm - fallOffStart) / (maxRpm - fallOffStart));
        }
        return 0;
    },

    gmEV1: (rpm, maxTorque, maxPowerHp, maxRpm) => {
        const rampUpEnd = 1000;
        const plateauEnd = 6000;
        if (rpm === 0) return 0;
        if (rpm < rampUpEnd) {
            // Gentle ramp, torque hits 80% max quickly
            return (rpm / rampUpEnd) * (maxTorque * 0.8);
        }
        if (rpm >= rampUpEnd && rpm <= plateauEnd) {
            return maxTorque * 0.8;
        }
        if (rpm > plateauEnd && rpm <= maxRpm) {
            return maxTorque * 0.8 * (1 - (rpm - plateauEnd) / (maxRpm - plateauEnd));
        }
        return 0;
    },

    //Shitpost-------------------------------------------------------------------------

    eSkateboardSlither: (rpm, maxTorque, maxPowerHp, maxRpm) => {
        if (rpm === 0) return 0;
        if (rpm < maxRpm * 0.3) {
            return maxTorque * 0.7;
        }
        if (rpm >= maxRpm * 0.3 && rpm <= maxRpm) {
            return maxTorque * 0.7 * (1 - (rpm - maxRpm * 0.3) / (maxRpm * 0.7));
        }
        return 0;
    },

    dumpsterDive: (rpm, maxTorque, maxPowerHp, maxRpm) => {
        const rampUpEnd = 500;
        const fallOffStart = 1500;
        if (rpm === 0) return 0;
        if (rpm < rampUpEnd) {
            return (rpm / rampUpEnd) * (maxTorque * 0.5);
        }
        if (rpm >= rampUpEnd && rpm <= fallOffStart) {
            return maxTorque * 0.5;
        }
        if (rpm > fallOffStart && rpm <= maxRpm) {
            return maxTorque * 0.5 * (1 - (rpm - fallOffStart) / (maxRpm - fallOffStart));
        }
        return 0;
    },

    lawnmower: (rpm, maxTorque, maxPowerHp, maxRpm) => {
        const rampUpEnd = 500;
        const fallOffStart = 2000;
        if (rpm === 0) return 0;
        if (rpm < rampUpEnd) {
            return (rpm / rampUpEnd) * (maxTorque * 0.4);
        }
        if (rpm >= rampUpEnd && rpm <= fallOffStart) {
            return maxTorque * 0.4;
        }
        if (rpm > fallOffStart && rpm <= maxRpm) {
            return maxTorque * 0.4 * (1 - (rpm - fallOffStart) / (maxRpm - fallOffStart));
        }
        return 0;
    },

    nyanMotor: (rpm, maxTorque, maxPowerHp, maxRpm) => {
        if (rpm === 0) return 0;
        const baseTorque = maxTorque * 0.8;
        const freq = 20; // oscillation frequency
        const oscillation = Math.sin((rpm / maxRpm) * Math.PI * freq) * 0.3; // -0.3 to +0.3
        const torque = baseTorque * (1 + oscillation);
        // Clamp torque to positive values and maxTorque * 1.1 max
        return Math.min(Math.max(torque, 0), maxTorque * 1.1);
    },

    brokenToaster: (rpm, maxTorque, maxPowerHp, maxRpm) => {
        // Ridiculously bad torque curve, random drops, like a toaster on the fritz
        if (rpm === 0) return 0;
        if (rpm < maxRpm * 0.2) {
            return maxTorque * 0.15;
        }
        if (rpm < maxRpm * 0.4) {
            return maxTorque * 0.05; // sudden power loss, lol
        }
        if (rpm < maxRpm * 0.6) {
            return maxTorque * 0.3;
        }
        if (rpm < maxRpm * 0.8) {
            return maxTorque * 0.1; // more power dips
        }
        if (rpm <= maxRpm) {
            return maxTorque * 0.25;
        }
        return 0;
    },

    jesusTookTheMotor: (rpm, maxTorque, maxPowerHp, maxRpm) => {
        if (rpm === 0) return 0;
        // Smooth ascending curve like an angelic choir crescendo
        const progress = rpm / maxRpm;
        // Using a nice easing function (easeInQuad) for that smooth heavenly lift
        const torque = maxTorque * (progress * progress);
        return torque;
    },

};

// Export a helper function to get the torque curve by type
export function getTorqueAtRPM(type, rpm, maxTorque, maxPowerHp, maxRpm) {
    const fn = motorCurves[type];
    if (!fn) throw new Error(`Motor curve "${type}" not found`);
    return fn(rpm, maxTorque, maxPowerHp, maxRpm);
}
