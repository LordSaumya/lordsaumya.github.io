/**
 * Mutable Mathematical State Container for exactly 3 Qubits (8-dimensional Hilbert space)
 */
import { Complex } from "./Complex";

export class QuantumState {
    public static readonly SIZE = 8;
    public amplitudes: Complex[];
    public probabilities: Float64Array;
    public phases: Float64Array;

    constructor() {
        this.amplitudes = new Array(QuantumState.SIZE);
        for(let i=0; i<QuantumState.SIZE; i++){
            this.amplitudes[i] = new Complex(0,0);
        }
        this.probabilities = new Float64Array(QuantumState.SIZE);
        this.phases = new Float64Array(QuantumState.SIZE);
        this.reset();
    }

    // Initialize to |000>
    public reset(): void {
        for(let i=0; i<QuantumState.SIZE; i++){
            this.amplitudes[i].set(0, 0);
        }
        this.amplitudes[0].set(1, 0);
        this.updateDerived();
    }

    public updateDerived(): void {
        for (let i = 0; i < QuantumState.SIZE; i++) {
            this.probabilities[i] = this.amplitudes[i].magnitudeSq;
            this.phases[i] = this.amplitudes[i].phase;
        }
    }
}