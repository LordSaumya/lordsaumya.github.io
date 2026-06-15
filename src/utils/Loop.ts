import { CircuitStream } from "../rendering/CircuitStream";
import { QSphere } from "../rendering/QSphere";
import { BarChart } from "../rendering/BarChart";
import { QuantumState } from "../maths/QuantumState";
import { Gates } from "../maths/Gates";

export class Loop {
    private static lastTime: number = 0;
    private static state: QuantumState;
    private static animationId: number = 0;

    public static start() {
        this.state = new QuantumState();
        this.lastTime = performance.now();
        this.animate(this.lastTime);
    }

    public static stop() {
        cancelAnimationFrame(this.animationId);
    }

    private static animate = (currentTime: number) => {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // 1. Update circuit positioning
        CircuitStream.updateAndDraw(deltaTime);

        // 2. Intersections
        if (CircuitStream.hasTriggered && CircuitStream.triggeredGate) {
            Gates.applyGate(CircuitStream.triggeredGate, this.state);
        }

        // 3. Three.js Binding
        QSphere.updateParameters(this.state.probabilities, this.state.phases);
        QSphere.render();

        // 4. Bar Chart Binding (Lerping)
        BarChart.update(this.state.probabilities);

        // Hook next frame
        this.animationId = requestAnimationFrame(this.animate);
    }
}