import { QuantumState } from "./QuantumState";
import { Complex } from "./Complex";

export type GateType = 'H' | 'Rx' | 'Ry' | 'Rz' | 'CNOT';

export interface GateEvent {
    id: number;
    type: GateType;
    target: number;      // 0, 1, or 2
    control?: number;    // 0, 1, or 2 (only for CNOT)
    theta?: number;      // Rotation angle
    xPos: number;        // World coordinates
    applied: boolean;
}

export class Gates {
    // Shared temp variables for Kronecker to avoid GC
    private static tempAmplitudes: Complex[] = Array.from({length: 8}, () => new Complex(0,0));

    static applyGate(gate: GateEvent, state: QuantumState) {
        // Since full 8x8 matrix multiplication can be expensive and complex,
        // an optimized approach for 3 qubits is to apply state mutations directly
        // based on the gate logic. (Simulating Kronecker dynamically).

        const n = QuantumState.SIZE;
        const targetBit = gate.target;
        
        // Copy current to temp
        for (let i = 0; i < n; i++) {
            this.tempAmplitudes[i].copy(state.amplitudes[i]);
        }

        const h = 1 / Math.sqrt(2);

        for (let i = 0; i < n; i++) {
            // Determine if the target bit is 0 or 1 in this state index
            const isSet = (i & (1 << targetBit)) !== 0;
            const pairIndex = i ^ (1 << targetBit); // Flip the target bit

            let c0 = this.tempAmplitudes[i & ~(1 << targetBit)];
            let c1 = this.tempAmplitudes[i | (1 << targetBit)];
            
            if (!isSet) {
                // If it's CNOT, wait for the CNOT block below
                if (gate.type === 'CNOT') continue;

                let theta = gate.theta || 0;
                let cosT = Math.cos(theta / 2);
                let sinT = Math.sin(theta / 2);

                switch(gate.type) {
                    case 'H':
                        // |0> -> h|0> + h|1>
                        // |1> -> h|0> - h|1>
                        state.amplitudes[i].set( (c0.re + c1.re)*h, (c0.im + c1.im)*h );
                        state.amplitudes[pairIndex].set( (c0.re - c1.re)*h, (c0.im - c1.im)*h );
                        break;
                    case 'Rx':
                        // Rx(theta) = [cos(t/2), -i sin(t/2); -i sin(t/2), cos(t/2)]
                        state.amplitudes[i].set(
                            c0.re * cosT + c1.im * sinT, 
                            c0.im * cosT - c1.re * sinT
                        );
                        state.amplitudes[pairIndex].set(
                            c0.im * sinT + c1.re * cosT, 
                            -c0.re * sinT + c1.im * cosT
                        );
                        break;
                    case 'Ry':
                        // Ry(theta) = [cos(t/2), -sin(t/2); sin(t/2), cos(t/2)]
                        state.amplitudes[i].set(
                            c0.re * cosT - c1.re * sinT,
                            c0.im * cosT - c1.im * sinT
                        );
                        state.amplitudes[pairIndex].set(
                            c0.re * sinT + c1.re * cosT,
                            c0.im * sinT + c1.im * cosT
                        );
                        break;
                    case 'Rz':
                        // Rz(theta) = [e^{-i t/2}, 0; 0, e^{i t/2}]
                        // = [cos(t/2) - i sin(t/2), 0; 0, cos(t/2) + i sin(t/2)]
                        state.amplitudes[i].set(
                            c0.re * cosT + c0.im * sinT,
                            c0.im * cosT - c0.re * sinT
                        );
                        state.amplitudes[pairIndex].set(
                            c1.re * cosT - c1.im * sinT,
                            c1.im * cosT + c1.re * sinT
                        );
                        break;
                }
            }

            if (gate.type === 'CNOT' && gate.control !== undefined) {
                 const controlSet = (i & (1 << gate.control)) !== 0;
                 if (controlSet) {
                      state.amplitudes[i].copy(this.tempAmplitudes[pairIndex]);
                 } else {
                      state.amplitudes[i].copy(this.tempAmplitudes[i]);
                 }
            }
        }
        
        // Normalize
        let sum = 0;
        for(let i=0; i<n; i++) sum += state.amplitudes[i].magnitudeSq;
        const norm = Math.sqrt(sum);
        if(norm > 0) {
            for(let i=0; i<n; i++) {
                state.amplitudes[i].re /= norm;
                state.amplitudes[i].im /= norm;
            }
        }

        state.updateDerived();
    }
}