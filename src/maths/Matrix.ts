import { Complex } from "./Complex";

export class Matrix {
    public data: Complex[];
    public readonly size: number; // For N x N matrix

    constructor(size: number) {
        this.size = size;
        this.data = new Array(size * size);
        for(let i=0; i < size * size; i++){
            this.data[i] = new Complex(0,0);
        }
    }

    public get(row: number, col: number): Complex {
        return this.data[row * this.size + col];
    }

    public set(row: number, col: number, re: number, im: number): void {
        this.data[row * this.size + col].set(re, im);
    }
}
