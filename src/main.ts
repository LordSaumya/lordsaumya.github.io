import './style.css';
import { Loop } from './utils/Loop';
import { CircuitStream } from './rendering/CircuitStream';
import { QSphere } from './rendering/QSphere';
import { BarChart } from './rendering/BarChart';
import { ProfileCard } from './ui/ProfileCard';

// Setup UI
ProfileCard.mount(document.getElementById('profile-card')!);
QSphere.mount(document.getElementById('qsphere-container')!);
BarChart.mount(document.getElementById('barchart-container')!);
CircuitStream.mount(document.getElementById('circuit-canvas')! as HTMLCanvasElement);

// Start Animation Loop
Loop.start();