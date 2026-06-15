import { GateEvent, GateType } from "../maths/Gates";

export class CircuitStream {
    private static ctx: CanvasRenderingContext2D;
    private static width: number = 0;
    private static height: number = 150;
    
    private static gates: GateEvent[] = [];
    private static speed: number = 0.2; // pixels per ms
    private static activeLineX: number = 0;
    private static pulseIntensity: number = 0;

    public static hasTriggered: boolean = false;
    public static triggeredGate: GateEvent | null = null;
    
    private static timeSinceLastGate: number = 0;
    private static gateInterval: number = 750;
    private static gateIdCounter: number = 0;

    public static mount(canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d')!;
        this.resize(canvas);
        window.addEventListener('resize', () => this.resize(canvas));
    }

    private static resize(canvas: HTMLCanvasElement) {
        const parent = canvas.parentElement;
        if (!parent) return;
        
        // Hide canvas temporarily to allow parent flex container to shrink undisturbed
        canvas.style.display = 'none';
        const rect = parent.getBoundingClientRect();
        canvas.style.display = 'block';

        this.width = canvas.width = rect.width;
        this.height = canvas.height = rect.height;
        
        // Align active line directly with the center of the Q-sphere
        const qsphere = document.getElementById('qsphere-container');
        if (qsphere) {
             const sphereRect = qsphere.getBoundingClientRect();
             this.activeLineX = (sphereRect.left + sphereRect.width / 2) - rect.left;
        } else {
             this.activeLineX = this.width * 0.2;
        }
    }

    public static updateAndDraw(deltaTime: number) {
        if (!this.ctx) return;

        this.hasTriggered = false;
        this.triggeredGate = null;

        // Spawn gates
        this.timeSinceLastGate += deltaTime;
        if (this.timeSinceLastGate > this.gateInterval) {
            this.timeSinceLastGate = 0;
            this.spawnGate();
        }

        // Setup draw
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw Wires
        this.ctx.strokeStyle = '#1e1e38';
        this.ctx.lineWidth = 2;
        const wireSpacing = this.height / 4;
        
        for(let i=1; i<=3; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * wireSpacing);
            this.ctx.lineTo(this.width, i * wireSpacing);
            this.ctx.stroke();
            
            // Labels
            this.ctx.fillStyle = '#666';
            this.ctx.font = '14px monospace';
            this.ctx.fillText(`|q${i-1}>`, 10, i * wireSpacing - 10);
        }

        // Draw Active Line
        this.pulseIntensity = Math.max(0, this.pulseIntensity - deltaTime * 0.003); // Fades over ~333ms
        
        this.ctx.strokeStyle = '#00e5ff'; // Vivid bright teal accent
        this.ctx.lineWidth = 1 + this.pulseIntensity * 0.5; // Very subtle thickening
        this.ctx.shadowColor = '#00e5ff';
        this.ctx.shadowBlur = this.pulseIntensity * 6; // Subtle bloom
        
        this.ctx.setLineDash([]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.activeLineX, 0);
        this.ctx.lineTo(this.activeLineX, this.height);
        this.ctx.stroke();
        
        this.ctx.shadowBlur = 0; // Reset shadow for gates
        this.ctx.lineWidth = 1; // Reset line width for gates

        // Remove glowing rect fill to keep things muted

        // Update and draw gates
        const size = 30;
        for (let i = this.gates.length - 1; i >= 0; i--) {
            const g = this.gates[i];
            g.xPos -= this.speed * deltaTime;

            const yPos = (g.target + 1) * wireSpacing;

            // Trigger logoc
            if (!g.applied && g.xPos <= this.activeLineX + size/2) {
                g.applied = true;
                this.hasTriggered = true;
                this.triggeredGate = g;
                this.pulseIntensity = 1.0; // Trigger the subtle pulse
            }

            // Draw vertical wire for CNOT
            if (g.type === 'CNOT' && g.control !== undefined) {
                const controlY = (g.control + 1) * wireSpacing;
                this.ctx.beginPath();
                this.ctx.moveTo(g.xPos, yPos);
                this.ctx.lineTo(g.xPos, controlY);
                this.ctx.strokeStyle = g.applied ? '#3f3f46' : '#64748b'; // Slate colors
                this.ctx.stroke();

                // Draw control dot
                this.ctx.beginPath();
                this.ctx.arc(g.xPos, controlY, 4, 0, Math.PI * 2);
                this.ctx.fillStyle = g.applied ? '#3f3f46' : '#64748b';
                this.ctx.fill();
                this.ctx.stroke();
            }

            // Draw Box
            let boxWidth = size + 10;
            let displayString: string = g.type;
            
            if (g.type === 'Rx' || g.type === 'Ry' || g.type === 'Rz') {
                boxWidth = size + 45; // significantly wider to space out text
                let thetaStr = '';
                if (g.theta) {
                    if (Math.abs(g.theta - Math.PI) < 0.01) thetaStr = '(π)';
                    else if (Math.abs(g.theta - Math.PI/2) < 0.01) thetaStr = '(π/2)';
                    else if (Math.abs(g.theta - Math.PI/3) < 0.01) thetaStr = '(π/3)';
                }
                
                // Emulate LaTeX subscripting using unicode mapping where practical
                const subChar = g.type[1];
                const subUnicode = subChar;
                
                displayString = `R${subUnicode}${thetaStr}`;
            } else if (g.type === 'CNOT') {
                boxWidth = size; // wider padding for CNOT text
                displayString = 'X';
            }

            this.ctx.fillStyle = '#050510';
            this.ctx.strokeStyle = g.applied ? '#3f3f46' : '#64748b'; // Tailwind slate-500
            this.ctx.fillRect(g.xPos - boxWidth/2, yPos - size/2, boxWidth, size);
            this.ctx.strokeRect(g.xPos - boxWidth/2, yPos - size/2, boxWidth, size);

            this.ctx.fillStyle = g.applied ? '#555' : '#e2e8f0'; // Faded white
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.font = '16px "Courier New", "Times New Roman", sans-serif';
            this.ctx.fillText(displayString, g.xPos, yPos);

            // Clean up
            if (g.xPos < -50) {
                this.gates.splice(i, 1);
            }
        }
    }

    private static spawnGate() {
        const types: GateType[] = ['H', 'Rx', 'Ry', 'Rz', 'CNOT'];
        const type = types[Math.floor(Math.random() * types.length)];
        const target = Math.floor(Math.random() * 3);
        
        let theta = 0;
        if (type === 'Rx' || type === 'Ry' || type === 'Rz') {
            const angles = [Math.PI, Math.PI/2, Math.PI/3];
            theta = angles[Math.floor(Math.random() * angles.length)];
        }
        
        this.gates.push({
            id: this.gateIdCounter++,
            type,
            target,
            control: type === 'CNOT' ? (target + 1) % 3 : undefined,
            theta,
            xPos: this.width + 50,
            applied: false
        });
    }
}