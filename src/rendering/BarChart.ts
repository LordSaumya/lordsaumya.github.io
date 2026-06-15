export class BarChart {
    private static bars: HTMLElement[] = [];
    private static labels: HTMLElement[] = [];
    private static currentWidths: number[] = new Array(8).fill(0);

    public static mount(container: HTMLElement) {
        container.innerHTML = '';
        
        for (let i = 0; i < 8; i++) {
            const row = document.createElement('div');
            row.className = 'w-full mb-3 flex items-center gap-4';

            const label = document.createElement('div');
            const bin = i.toString(2).padStart(3, '0');
            label.className = 'w-16 font-mono text-sm text-gray-400 text-right';
            label.innerText = `|${bin}〉`;

            const track = document.createElement('div');
            track.className = 'flex-1 h-3 bg-slate-700/60 rounded-full overflow-hidden';

            const fill = document.createElement('div');
            fill.className = 'h-full rounded-full origin-left transition-colors duration-300';
            fill.style.width = '0%';
            
            track.appendChild(fill);
            row.appendChild(label);
            row.appendChild(track);
            container.appendChild(row);

            this.labels.push(label);
            this.bars.push(fill);
        }
    }

    public static update(probabilities: Float64Array) {
        if (this.bars.length === 0) return;

        let maxProb = 0;
        for (let i = 0; i < 8; i++) {
            if (probabilities[i] > maxProb) maxProb = probabilities[i];
        }

        for (let i = 0; i < 8; i++) {
            const targetWidth = probabilities[i] * 100;
            // Lerp
            this.currentWidths[i] += (targetWidth - this.currentWidths[i]) * 0.1;
            
            this.bars[i].style.width = `${this.currentWidths[i]}%`;
            
            // Accent color logic
            const targetClass = (probabilities[i] === maxProb && maxProb > 0.01)
                ? 'h-full bg-q-accent shadow-[0_0_8px_rgba(0,229,255,0.6)] rounded-full origin-left transition-colors duration-300'
                : 'h-full bg-white rounded-full origin-left transition-colors duration-300 opacity-90';

            // Only update DOM if the class actually changed to prevent layout thrashing
            if (this.bars[i].className !== targetClass) {
                this.bars[i].className = targetClass;
            }
        }
    }
}