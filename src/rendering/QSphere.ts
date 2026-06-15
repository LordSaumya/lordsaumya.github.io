import * as THREE from 'three';

export class QSphere {
    private static scene: THREE.Scene;
    private static camera: THREE.PerspectiveCamera;
    private static renderer: THREE.WebGLRenderer;
    private static nodes: THREE.Mesh[] = [];
    private static lines: THREE.Line[] = [];
    private static constellationLines: THREE.Line[] = [];
    private static time: number = 0;
    private static coreOrb: THREE.Mesh;
    
    public static mount(container: HTMLElement) {
        const width = container.clientWidth;
        const height = container.clientHeight || 400; // fallback if flex doesn't expand right away

        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        this.camera.position.set(0, 0, 8);

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        // Setting absolute positioning means this canvas won't force flex-containers to stay wide 
        this.renderer.domElement.className = "absolute inset-0 w-full h-full";
        this.renderer.setSize(width, height, false); // "false" prevents ThreeJS from overwriting CSS width/height inline
        this.renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(this.renderer.domElement);

        // Core Sphere Frame
        const wireSphere = new THREE.Mesh(
            new THREE.SphereGeometry(2.5, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0x1e202e, wireframe: true, transparent: true, opacity: 0.3 })
        );
        this.scene.add(wireSphere);

        // Core Center Origin Orb
        this.coreOrb = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 8, 8),
            new THREE.MeshBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.6 })
        );
        this.scene.add(this.coreOrb);

        // Mapping 3-qubit basis states by Hamming Weight (Latitudes) to Space
        // Distributing azimuthal angle (phi) evenly so states never overlap
        const coords = [
            { theta: 0, phi: 0 },                                  // |000> Wt 0
            { theta: Math.PI / 3, phi: 0 },                        // |001> Wt 1
            { theta: Math.PI / 3, phi: (2 * Math.PI) / 3 },        // |010> Wt 1
            { theta: (2 * Math.PI) / 3, phi: Math.PI / 3 },        // |011> Wt 2
            { theta: Math.PI / 3, phi: (4 * Math.PI) / 3 },        // |100> Wt 1
            { theta: (2 * Math.PI) / 3, phi: Math.PI },            // |101> Wt 2
            { theta: (2 * Math.PI) / 3, phi: (5 * Math.PI) / 3 },  // |110> Wt 2
            { theta: Math.PI, phi: 0 }                             // |111> Wt 3
        ];
        
        // Add 8 State Nodes & Linking Vectors
        const nodeGeo = new THREE.SphereGeometry(0.12, 16, 16);
        for(let i=0; i<8; i++) {
            const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const mesh = new THREE.Mesh(nodeGeo, mat);
            
            const { theta, phi } = coords[i];
            const r = 2.5;
            
            // Mapped so Y is UP (North/South poles on the Y-axis)
            mesh.position.set(
                 r * Math.sin(theta) * Math.cos(phi),
                 r * Math.cos(theta),
                 r * Math.sin(theta) * Math.sin(phi)
            );
            
            this.scene.add(mesh);
            this.nodes.push(mesh);

            // Vector Line from center to node with vertex colors for gradient fake
            const lineGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                mesh.position
            ]);
            const colors = new Float32Array([
                0, 0, 0, // origin
                1, 1, 1  // outer tip
            ]);
            lineGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            
            const lineMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0 });
            const line = new THREE.Line(lineGeo, lineMat);
            this.scene.add(line);
            this.lines.push(line);
        }

        // Create Constellation Lines (connections between every pair of nodes)
        for(let i=0; i<8; i++) {
            for(let j=i+1; j<8; j++) {
                const geo = new THREE.BufferGeometry().setFromPoints([
                    this.nodes[i].position,
                    this.nodes[j].position
                ]);
                const mat = new THREE.LineBasicMaterial({ color: 0x475569, transparent: true, opacity: 0 }); // Muted Slate
                const line = new THREE.Line(geo, mat);
                this.scene.add(line);
                this.constellationLines.push(line);
            }
        }

        window.addEventListener('resize', () => {
            if(!container) return;
            // Native fix for flexbox canvas stretching
            this.renderer.domElement.style.display = 'none';
            const w = container.clientWidth;
            const h = container.clientHeight || 400;
            this.renderer.domElement.style.display = 'block';

            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(w, h, false);
        });
    }

    public static updateParameters(probs: Float64Array, phases: Float64Array) {
        for(let i=0; i<8; i++) {
            const prob = probs[i];
            
            // Base scale is 1, max is larger based on amplitude
            const amplitude = 0.5 * Math.sqrt(prob);
            
            // Smaller minimum size (0.3 of base 0.12 = tiny point for empty states)
            // Scaling up to 2.5x base size for 100% probability
            const targetScale = 0.3 + (amplitude * 2.2); 
            
            // Add a breathing effect relative to size
            const breath = 1 + Math.sin(this.time * 3 + i) * 0.05;
            const finalScale = targetScale * breath;
            this.nodes[i].scale.set(finalScale, finalScale, finalScale);

            // Empty states are colored dim gray; active ones bloom with phase color
            const h = (phases[i] + Math.PI) / (2 * Math.PI);
            const material = this.nodes[i].material as THREE.MeshBasicMaterial;

            if (prob < 0.001) {
                material.color.setHex(0x1e202e);
            } else {
                // Increased saturation (0.65) and luminosity balanced (0.55) to avoid looking washed out
                material.color.setHSL(h, 0.65, 0.55);
            }

            // Update linking Vector Line with an opacity gradient using Vertex Colors
            const lineGeo = this.lines[i].geometry as THREE.BufferGeometry;
            const lineColors = lineGeo.attributes.color as THREE.BufferAttribute;
            lineColors.setXYZ(0, 0.1, 0.1, 0.15); // Core is dim transparent
            
            // Re-use the material color to avoid generating a new THREE.Color object
            const r = prob < 0.001 ? 0.11 : material.color.r;
            const g = prob < 0.001 ? 0.12 : material.color.g;
            const b = prob < 0.001 ? 0.18 : material.color.b;
            lineColors.setXYZ(1, r, g, b); // Tip takes on true color
            lineColors.needsUpdate = true;

            const lineMat = this.lines[i].material as THREE.LineBasicMaterial;
            lineMat.opacity = prob > 0.001 ? Math.min(prob * 1.5, 0.45) : 0;
        }

        // Update Constellation Lines opacity based on product of probabilities 
        // (lines only show up strongly between entangled/co-existing states)
        let lineIdx = 0;
        for (let i = 0; i < 8; i++) {
            for (let j = i + 1; j < 8; j++) {
                const jointProb = probs[i] * probs[j];
                const cMat = this.constellationLines[lineIdx].material as THREE.LineBasicMaterial;
                // Fade in connection if both states exist
                cMat.opacity = jointProb > 0.001 ? Math.min(jointProb * 15, 0.6) : 0;
                lineIdx++;
            }
        }
    }

    public static render() {
        if (!this.renderer) return;
        this.time += 0.016; // approximate 60fps delta
        
        // Dynamic continuous slow rotation
        this.scene.rotation.y += 0.003;
        this.scene.rotation.x += 0.0015;
        this.scene.rotation.z += Math.sin(this.time * 0.5) * 0.001; // slight wobble
        
        // Core orb pulse
        const coreScale = 1 + Math.sin(this.time * 4) * 0.2;
        this.coreOrb.scale.set(coreScale, coreScale, coreScale);

        this.renderer.render(this.scene, this.camera);
    }
}