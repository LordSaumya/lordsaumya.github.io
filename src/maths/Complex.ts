export class Complex {
    public re: number;
    public im: number;

    constructor(re: number = 0, im: number = 0) {
        this.re = re;
        this.im = im;
    }

    // In-place operations to avoid GC
    public set(re: number, im: number): void {
        this.re = re;
        this.im = im;
    }

    public copy(c: Complex): void {
        this.re = c.re;
        this.im = c.im;
    }

    public get magnitudeSq(): number {
        return this.re * this.re + this.im * this.im;
    }

    public get phase(): number {
        return Math.atan2(this.im, this.re);
    }
}