import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const MagicGarden : React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x87CEEB, 30, 100);
        sceneRef.current = scene;
        
        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 10, 25);
        camera.lookAt(0, 0, 0);

        // Renderer setup with enhanced settings
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.4;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        rendererRef.current = renderer;
        mountRef.current.appendChild(renderer.domElement);

        // Enhanced Sky with dynamic gradient
        const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
        const skyMaterial = new THREE.ShaderMaterial({
            uniforms: {
                topColor: { value: new THREE.Color(0x87CEEB) },
                bottomColor: { value: new THREE.Color(0xFFE4E1) },
                offset: { value: 33 },
                exponent: { value: 0.6 },
                time: { value: 0.0 }
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 topColor;
                uniform vec3 bottomColor;
                uniform float offset;
                uniform float exponent;
                uniform float time;
                varying vec3 vWorldPosition;
                void main() {
                float h = normalize(vWorldPosition + offset).y;
                vec3 color = mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0));
                // Add subtle color shifting
                color += vec3(sin(time * 0.5) * 0.1, cos(time * 0.3) * 0.05, sin(time * 0.7) * 0.08);
                gl_FragColor = vec4(color, 1.0);
                }
            `,
            side: THREE.BackSide
        });
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        scene.add(sky);

        // Enhanced Lighting System
        const ambientLight = new THREE.AmbientLight(0xFFE4E1, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xFFF8DC, 2.0);
        directionalLight.position.set(20, 30, 15);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 100;
        directionalLight.shadow.camera.left = -25;
        directionalLight.shadow.camera.right = 25;
        directionalLight.shadow.camera.top = 25;
        directionalLight.shadow.camera.bottom = -25;
        directionalLight.shadow.mapSize.width = 4096;
        directionalLight.shadow.mapSize.height = 4096;
        scene.add(directionalLight);

        // Multiple colored fill lights for magical atmosphere
        const fillLight1 = new THREE.DirectionalLight(0xFFB6C1, 0.4);
        fillLight1.position.set(-15, 15, -10);
        scene.add(fillLight1);

        const fillLight2 = new THREE.DirectionalLight(0xE6E6FA, 0.3);
        fillLight2.position.set(10, 8, -15);
        scene.add(fillLight2);

        const fillLight3 = new THREE.DirectionalLight(0x98FB98, 0.2);
        fillLight3.position.set(0, 5, 20);
        scene.add(fillLight3);

        // Magical ground with shimmering effect
        const groundGeometry = new THREE.PlaneGeometry(220, 220, 150, 150);
        const groundMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                grassColor: { value: new THREE.Color(0x2d5016) },
                shimmerColor: { value: new THREE.Color(0x98FB98) }
            },
            vertexShader: `
                uniform float time;
                varying vec3 vPosition;
                varying vec3 vNormal;
                void main() {
                vPosition = position;
                vNormal = normal;
                vec3 pos = position;
                pos.z += sin(pos.x * 0.3 + time) * 0.1 + cos(pos.y * 0.2 + time) * 0.05;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 grassColor;
                uniform vec3 shimmerColor;
                varying vec3 vPosition;
                varying vec3 vNormal;
                void main() {
                vec3 color = grassColor;
                float shimmer = sin(vPosition.x * 0.5 + time) * cos(vPosition.y * 0.3 + time) * 0.3 + 0.7;
                color = mix(color, shimmerColor, shimmer * 0.2);
                gl_FragColor = vec4(color, 1.0);
                }
            `
        });
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        // Enhanced grass with wind animation
        const grassTypes = [
            { color: 0x228B22, height: 0.4 },
            { color: 0x32CD32, height: 0.5 },
            { color: 0x90EE90, height: 0.3 },
            { color: 0x9ACD32, height: 0.45 },
            { color: 0x98FB98, height: 0.35 }
        ];

        const grassBlades: THREE.Mesh[] = [];
        for (let i = 0; i < 400; i++) {
            const grassType = grassTypes[Math.floor(Math.random() * grassTypes.length)];
            const grassGeometry = new THREE.ConeGeometry(0.015 + Math.random() * 0.02, grassType.height, 4);
            const grassMaterial = new THREE.MeshLambertMaterial({ 
                color: grassType.color,
                transparent: true,
                opacity: 0.9
            });
            const grass = new THREE.Mesh(grassGeometry, grassMaterial);
            grass.position.set(
                (Math.random() - 0.5) * 50,
                    grassType.height / 2,
                (Math.random() - 0.5) * 50
            );
            grass.rotation.y = Math.random() * Math.PI;
            grass.castShadow = true;
            grass.userData = { originalRotation: grass.rotation.z };
            grassBlades.push(grass);
            scene.add(grass);
        }

        // Magical rainbow flowers with glowing petals
        const flowerTypes = [
            { colors: [0xFF69B4, 0xFF1493, 0xFFC0CB, 0xFFB6C1], size: 0.18, petals: 8 },
            { colors: [0xFF4500, 0xFF6347, 0xFFA500, 0xFFD700], size: 0.15, petals: 6 },
            { colors: [0xFFD700, 0xFFFF00, 0xFFFACD, 0xF0E68C], size: 0.20, petals: 5 },
            { colors: [0x9370DB, 0x8A2BE2, 0xDDA0DD, 0xE6E6FA], size: 0.17, petals: 7 },
            { colors: [0x00FF7F, 0x90EE90, 0x98FB98, 0xF0FFF0], size: 0.16, petals: 6 },
            { colors: [0x87CEEB, 0x4169E1, 0x6495ED, 0xB0E0E6], size: 0.19, petals: 8 }
        ];
        
        const flowers: THREE.Group[] = [];
        interface MagicParticleData {
            mesh: THREE.Mesh;
            baseY: number;
            speed: number;
            radius: number;
            angle: number;
        }
        const magicParticles: MagicParticleData[] = [];
        
        for (let i = 0; i < 40; i++) {
            const flowerType = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
            const flowerGroup = new THREE.Group();
        
            // Multi-segment stem with natural curve
            for (let s = 0; s < 4; s++) {
                const stemGeometry = new THREE.CylinderGeometry(0.02 - s * 0.003, 0.025 - s * 0.003, 0.25);
                const stemMaterial = new THREE.MeshLambertMaterial({ 
                    color: s === 0 ? 0x0f5d0f : s === 1 ? 0x228B22 : 0x32CD32
                });
                const stem = new THREE.Mesh(stemGeometry, stemMaterial);
                stem.position.y = 0.125 + (s * 0.25);
                stem.rotation.x = Math.sin(s * 0.5) * 0.1;
                stem.castShadow = true;
                flowerGroup.add(stem);
            }

            // Detailed leaves with veins
            for (let l = 0; l < 3; l++) {
                const leafGeometry = new THREE.SphereGeometry(0.1, 12, 12);
                const leafMaterial = new THREE.MeshPhongMaterial({ 
                    color: 0x228B22,
                    shininess: 20
                });
                const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
                    leaf.position.set(
                    Math.sin(l * 2.1) * 0.15,
                    0.3 + (l * 0.15),
                    Math.cos(l * 2.1) * 0.15
                );
                leaf.scale.set(0.6, 0.25, 1.8);
                leaf.rotation.z = Math.sin(l * 2.1) * Math.PI / 3;
                leaf.castShadow = true;
                flowerGroup.add(leaf);
            }

            // Glowing multi-layered petals
            for (let layer = 0; layer < 3; layer++) {
                const petalsInLayer = flowerType.petals - layer;
                for (let j = 0; j < petalsInLayer; j++) {
                    const petalGeometry = new THREE.SphereGeometry(flowerType.size * (1 - layer * 0.2), 16, 16);
                    const petalColor = flowerType.colors[Math.floor(Math.random() * flowerType.colors.length)];
                    const petalMaterial = new THREE.MeshPhongMaterial({ 
                        color: petalColor,
                        shininess: 50,
                        transparent: true,
                        opacity: 0.9,
                        emissive: new THREE.Color(petalColor).multiplyScalar(0.1)
                    });
                    const petal = new THREE.Mesh(petalGeometry, petalMaterial);
                    const angle = (j / petalsInLayer) * Math.PI * 2 + (layer * Math.PI / petalsInLayer);
                    const radius = (0.3 - layer * 0.08);
                    petal.position.set(
                        Math.cos(angle) * radius,
                        1.0 + (layer * 0.03),
                        Math.sin(angle) * radius
                    );
                    petal.scale.set(0.7, 0.4, 1.3);
                    petal.rotation.z = angle;
                    petal.castShadow = true;
                    petal.receiveShadow = true;
                    flowerGroup.add(petal);
                }
            }

            // Sparkling center
            const centerGeometry = new THREE.SphereGeometry(0.08, 16, 16);
            const centerMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xFFD700,
                emissive: 0x444400,
                shininess: 100
            });
            const center = new THREE.Mesh(centerGeometry, centerMaterial);
            center.position.y = 1.08;
            center.castShadow = true;
            flowerGroup.add(center);

            // Enhanced magic particles
            for (let p = 0; p < 5; p++) {
                const particleGeometry = new THREE.SphereGeometry(0.015, 12, 12);
                const particleMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0xFFFF00,
                    transparent: true,
                    opacity: 0.9
                });
                const particle = new THREE.Mesh(particleGeometry, particleMaterial);
                particle.position.set(
                    (Math.random() - 0.5) * 1.2,
                    1.3 + Math.random() * 0.8,
                    (Math.random() - 0.5) * 1.2
                );
                magicParticles.push({
                    mesh: particle,
                    baseY: particle.position.y,
                    speed: 0.4 + Math.random() * 0.6,
                    radius: 0.4 + Math.random() * 0.3,
                    angle: Math.random() * Math.PI * 2
                });
                flowerGroup.add(particle);
            }

            flowerGroup.position.set(
                (Math.random() - 0.5) * 40,
                0,
                (Math.random() - 0.5) * 40
            );
            flowerGroup.castShadow = true;
            flowers.push(flowerGroup);
            scene.add(flowerGroup);
        }

        // Majestic crystal trees
        for (let i = 0; i < 12; i++) {
            const treeGroup = new THREE.Group();
            
            // Detailed trunk with texture
            const trunkSegments = 5;
            for (let s = 0; s < trunkSegments; s++) {
                const trunkGeometry = new THREE.CylinderGeometry(
                    0.3 - (s * 0.04), 
                    0.35 - (s * 0.04), 
                    0.9
                );
                const trunkMaterial = new THREE.MeshPhongMaterial({ 
                    color: s % 2 === 0 ? 0x8B4513 : 0x654321,
                    shininess: 10
                });
                const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
                trunk.position.y = 0.45 + (s * 0.9);
                trunk.castShadow = true;
                treeGroup.add(trunk);
            }

            // Crystalline foliage with sparkles
            for (let layer = 0; layer < 4; layer++) {
                const leavesGeometry = new THREE.SphereGeometry(
                    1.8 - (layer * 0.3), 
                    20, 
                    20
                );
                const leavesColors = [0x228B22, 0x32CD32, 0x90EE90, 0x98FB98];
                const leavesMaterial = new THREE.MeshPhongMaterial({ 
                    color: leavesColors[layer],
                    transparent: true,
                    opacity: 0.85,
                    shininess: 30,
                    emissive: new THREE.Color(leavesColors[layer]).multiplyScalar(0.05)
                });
                const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
                leaves.position.y = 4.0 + (layer * 0.6);
                leaves.castShadow = true;
                leaves.receiveShadow = true;
                treeGroup.add(leaves);
            }

            // Glowing fruits
            for (let f = 0; f < 8; f++) {
                const fruitGeometry = new THREE.SphereGeometry(0.08, 12, 12);
                const fruitColors = [0xFF0000, 0xFFA500, 0xFFD700, 0xFF69B4, 0x9370DB];
                const fruitColor = fruitColors[Math.floor(Math.random() * fruitColors.length)];
                const fruitMaterial = new THREE.MeshPhongMaterial({ 
                    color: fruitColor,
                    shininess: 60,
                    emissive: new THREE.Color(fruitColor).multiplyScalar(0.1)
                });
                const fruit = new THREE.Mesh(fruitGeometry, fruitMaterial);
                fruit.position.set(
                    (Math.random() - 0.5) * 2.5,
                    4.0 + Math.random() * 2.0,
                    (Math.random() - 0.5) * 2.5
                );
                fruit.castShadow = true;
                treeGroup.add(fruit);
            }

            treeGroup.position.set(
                (Math.random() - 0.5) * 45,
                0,
                (Math.random() - 0.5) * 45
            );
            scene.add(treeGroup);
        }

        // Enchanted butterflies with iridescent wings
        interface ButterflyUserData {
            originalY: number;
            speed: number;
            radius: number;
            angle: number;
        }
        type Butterfly = THREE.Group & { userData: ButterflyUserData };
        const butterflies: Butterfly[] = [];
        for (let i = 0; i < 15; i++) {
            const butterflyGroup = new THREE.Group();
            
            // Detailed body with segments
            const bodyGeometry = new THREE.CylinderGeometry(0.02, 0.025, 0.5);
            const bodyMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x2c1810,
                shininess: 30
            });
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            body.castShadow = true;
            butterflyGroup.add(body);

            // Delicate antennae
            for (let a = 0; a < 2; a++) {
                const antennaGeometry = new THREE.CylinderGeometry(0.003, 0.003, 0.15);
                const antenna = new THREE.Mesh(antennaGeometry, bodyMaterial);
                antenna.position.set(a === 0 ? -0.03 : 0.03, 0.3, 0);
                antenna.rotation.z = (a === 0 ? -1 : 1) * Math.PI / 5;
                butterflyGroup.add(antenna);
            }

            // Iridescent wings with patterns
            const wingColors = [
                [0xFF1493, 0xFF69B4, 0xFFC0CB], [0x9370DB, 0xDDA0DD, 0xE6E6FA], 
                [0x00FF7F, 0x90EE90, 0x98FB98], [0xFFD700, 0xFFFF00, 0xFFFACD],
                [0xFF4500, 0xFFA500, 0xFFE4B5], [0x4169E1, 0x87CEEB, 0xB0E0E6]
            ];
            const wingPalette = wingColors[Math.floor(Math.random() * wingColors.length)];
            
            for (let j = 0; j < 4; j++) {
                const wingGeometry = new THREE.SphereGeometry(0.15, 16, 16);
                const wingMaterial = new THREE.MeshPhongMaterial({ 
                    color: wingPalette[j < 2 ? 0 : 1],
                    transparent: true,
                    opacity: 0.8,
                    shininess: 50,
                    emissive: new THREE.Color(wingPalette[j < 2 ? 0 : 1]).multiplyScalar(0.1)
                });
                const wing = new THREE.Mesh(wingGeometry, wingMaterial);
                wing.scale.set(0.4, 1.5, 0.08);
                
                if (j < 2) {
                    wing.position.set(j === 0 ? -0.12 : 0.12, 0.1, 0);
                } else {
                    wing.position.set(j === 2 ? -0.1 : 0.1, -0.1, 0);
                    wing.scale.set(0.3, 1.1, 0.08);
                }
                wing.castShadow = true;
                butterflyGroup.add(wing);
            }

            butterflyGroup.position.set(
                (Math.random() - 0.5) * 30,
                2.5 + Math.random() * 4,
                (Math.random() - 0.5) * 30
            );
            butterflyGroup.userData = {
                originalY: butterflyGroup.position.y,
                speed: 0.4 + Math.random() * 0.6,
                radius: 4 + Math.random() * 3,
                angle: Math.random() * Math.PI * 2
            };
            butterflies.push(butterflyGroup as Butterfly);
            scene.add(butterflyGroup);
        }

        // Magical creatures - Rainbow rabbits
        for (let i = 0; i < 6; i++) {
            const rabbitGroup = new THREE.Group();
            
            // Shimmering body
            const bodyGeometry = new THREE.SphereGeometry(0.4, 20, 20);
            const rabbitColors = [0xFFFFFF, 0xF5F5DC, 0xFFB6C1, 0xDDA0DD, 0x98FB98, 0x87CEEB];
            const rabbitColor = rabbitColors[Math.floor(Math.random() * rabbitColors.length)];
            const bodyMaterial = new THREE.MeshPhongMaterial({ 
                color: rabbitColor,
                shininess: 20,
                emissive: new THREE.Color(rabbitColor).multiplyScalar(0.05)
            });
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            body.position.y = 0.4;
            body.castShadow = true;
            rabbitGroup.add(body);

            // Fluffy head
            const headGeometry = new THREE.SphereGeometry(0.28, 18, 18);
            const head = new THREE.Mesh(headGeometry, bodyMaterial);
            head.position.y = 0.75;
            head.castShadow = true;
            rabbitGroup.add(head);

            // Adorable ears
            for (let j = 0; j < 2; j++) {
                const earGeometry = new THREE.SphereGeometry(0.08, 14, 14);
                const ear = new THREE.Mesh(earGeometry, bodyMaterial);
                ear.position.set(j === 0 ? -0.15 : 0.15, 1.0, -0.08);
                ear.scale.set(0.7, 3.0, 0.5);
                ear.rotation.z = (j === 0 ? -1 : 1) * Math.PI / 10;
                ear.castShadow = true;
                rabbitGroup.add(ear);
            }

            // Sparkling eyes
            for (let j = 0; j < 2; j++) {
                const eyeGeometry = new THREE.SphereGeometry(0.04, 10, 10);
                const eyeMaterial = new THREE.MeshPhongMaterial({ 
                    color: 0x000000,
                    shininess: 100
                });
                const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
                eye.position.set(j === 0 ? -0.1 : 0.1, 0.8, 0.25);
                rabbitGroup.add(eye);
            }

            // Pink nose
            const noseGeometry = new THREE.SphereGeometry(0.02, 8, 8);
            const noseMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xFF69B4,
                shininess: 50
            });
            const nose = new THREE.Mesh(noseGeometry, noseMaterial);
            nose.position.set(0, 0.75, 0.27);
            rabbitGroup.add(nose);

            // Fluffy tail
            const tailGeometry = new THREE.SphereGeometry(0.12, 14, 14);
            const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
            tail.position.set(0, 0.45, -0.35);
            tail.castShadow = true;
            rabbitGroup.add(tail);

            rabbitGroup.position.set(
                (Math.random() - 0.5) * 35,
                0,
                (Math.random() - 0.5) * 35
            );
            scene.add(rabbitGroup);
        }


        const fireflies: THREE.Mesh[] = [];
        for (let i = 0; i < 25; i++) {
        const fireflyGeometry = new THREE.SphereGeometry(0.04, 10, 10);
        const fireflyMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFFFF00,
            transparent: true,
            opacity: 0.9
        });
        const firefly = new THREE.Mesh(fireflyGeometry, fireflyMaterial);
        firefly.position.set(
            (Math.random() - 0.5) * 40,
            1.5 + Math.random() * 4,
            (Math.random() - 0.5) * 40
        );
        firefly.userData = {
            originalY: firefly.position.y,
            speed: 0.3 + Math.random() * 0.5,
            radius: 1.5 + Math.random() * 2.5,
            angle: Math.random() * Math.PI * 2
        };
        fireflies.push(firefly);
        scene.add(firefly);
        }

        const clouds: THREE.Group[] = [];
        for (let i = 0; i < 16; i++) {
            const cloudGroup = new THREE.Group();
            
            const cloudParts = 10 + Math.floor(Math.random() * 6);
            for (let j = 0; j < cloudParts; j++) {
                const cloudGeometry = new THREE.SphereGeometry(
                    0.7 + Math.random() * 1.0, 
                    20, 
                    20
                );
                const cloudMaterial = new THREE.MeshLambertMaterial({ 
                    color: 0xFFFFFF,
                    transparent: true,
                    opacity: 0.8 + Math.random() * 0.2
                });
                const cloudPart = new THREE.Mesh(cloudGeometry, cloudMaterial);
                cloudPart.position.set(
                    (Math.random() - 0.5) * 5,
                    Math.random() * 1.5,
                    (Math.random() - 0.5) * 5
                );
                cloudPart.receiveShadow = true;
                cloudGroup.add(cloudPart);
            }

            cloudGroup.position.set(
                (Math.random() - 0.5) * 100,
                15 + Math.random() * 10,
                (Math.random() - 0.5) * 100
            );
            cloudGroup.userData = {
                speed: 0.08 + Math.random() * 0.15,
                colorShift: Math.random() * Math.PI * 2
            };
            clouds.push(cloudGroup);
            scene.add(cloudGroup);
        }

        // Magical rainbow streams
        const rainbowStreams: THREE.Mesh[] = [];
        for (let i = 0; i < 8; i++) {
            const streamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 15);
            const streamMaterial = new THREE.MeshBasicMaterial({ 
                color: new THREE.Color().setHSL(i / 8, 0.8, 0.6),
                transparent: true,
                opacity: 0.4
            });
            const stream = new THREE.Mesh(streamGeometry, streamMaterial);
            stream.position.set(
                (Math.random() - 0.5) * 50,
                7.5,
                (Math.random() - 0.5) * 50
            );
            stream.rotation.z = Math.PI / 2;
            stream.rotation.y = Math.random() * Math.PI;
            rainbowStreams.push(stream);
            scene.add(stream);
        }

        // Mouse and touch controls
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        interface MouseMoveEvent extends MouseEvent {
            clientX: number;
            clientY: number;
        }

        const handleMouseMove = (event: MouseMoveEvent) => {
            targetX = (event.clientX / window.innerWidth) * 2 - 1;
            targetY = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Enhanced animation loop with magical effects
        const animate = () => {
            animationRef.current = requestAnimationFrame(animate);
            const time = Date.now() * 0.001;

            // Update sky shader
            (sky.material as THREE.ShaderMaterial).uniforms.time.value = time;

            // Update ground shimmer
            (ground.material as THREE.ShaderMaterial).uniforms.time.value = time;

            // Smooth mouse interpolation
            mouseX += (targetX - mouseX) * 0.04;
            mouseY += (targetY - mouseY) * 0.04;

            // Animate grass with wind effect
            grassBlades.forEach((grass, index) => {
                const offset = index * 0.1;
                grass.rotation.z = grass.userData.originalRotation + Math.sin(time * 2 + offset) * 0.3;
                grass.scale.y = 1 + Math.sin(time * 1.5 + offset) * 0.1;
            });

            // Enhanced flower animations with multiple effects
            flowers.forEach((flower, index) => {
                const offset = index * 0.3;
                flower.rotation.z = Math.sin(time * 0.6 + offset) * 0.15;
                flower.position.y = Math.sin(time * 0.4 + offset) * 0.03;
                flower.scale.set(
                1 + Math.sin(time * 0.8 + offset) * 0.05,
                1 + Math.cos(time * 0.7 + offset) * 0.03,
                1 + Math.sin(time * 0.9 + offset) * 0.05
                );
            });

            // Magical particles with complex orbiting patterns
            magicParticles.forEach((particle, index) => {
                const offset = index * 0.2;
                particle.angle += particle.speed * 0.02;
                particle.mesh.position.y = particle.baseY + Math.sin(time * particle.speed + offset) * 0.4;
                particle.mesh.position.x += Math.cos(particle.angle + offset) * 0.015;
                particle.mesh.position.z += Math.sin(particle.angle + offset) * 0.015;
                
                // Rainbow color cycling
                const hue = (time * 0.5 + index * 0.1) % 1;
                (particle.mesh.material as THREE.MeshBasicMaterial).color.setHSL(hue, 0.8, 0.6);
                
                // Pulsing glow effect
                (particle.mesh.material as THREE.MeshBasicMaterial).opacity = 0.6 + Math.sin(time * 3 + offset) * 0.4;
            });

            // Enhanced butterfly flight with realistic patterns
            butterflies.forEach((butterfly, index) => {
                const offset = index * 0.5;
                const userData = butterfly.userData;
                
                userData.angle += userData.speed * 0.015;
                butterfly.position.y = userData.originalY + Math.sin(time * userData.speed + offset) * 0.8;
                butterfly.position.x += Math.cos(userData.angle + offset) * 0.04;
                butterfly.position.z += Math.sin(userData.angle + offset) * 0.04;
                
                // Wing flapping with variable speed
                butterfly.rotation.z = Math.sin(time * 8 + offset) * 0.4;
                butterfly.rotation.y += userData.speed * 0.008;
                
                // Body bobbing
                butterfly.children[0].rotation.x = Math.sin(time * 4 + offset) * 0.2;
            });

            // Firefly dance with trailing effect
            fireflies.forEach((firefly, index) => {
                const offset = index * 0.3;
                const userData = firefly.userData;
                
                userData.angle += userData.speed * 0.012;
                firefly.position.y = userData.originalY + Math.sin(time * userData.speed + offset) * 0.6;
                firefly.position.x += Math.cos(userData.angle + offset) * 0.025;
                firefly.position.z += Math.sin(userData.angle + offset) * 0.025;
                
                // Color shifting and twinkling
                const hue = (time * 0.3 + index * 0.15) % 1;
                (firefly.material as THREE.MeshBasicMaterial).color.setHSL(hue, 1.0, 0.7);
                (firefly.material as THREE.MeshBasicMaterial).opacity = 0.7 + Math.sin(time * 4 + offset) * 0.3;
            });

            // Dreamy cloud movement with color shifts
            clouds.forEach((cloud, index) => {
                const userData = cloud.userData;
                cloud.position.x += userData.speed * 0.08;
                cloud.position.z += Math.sin(time * 0.08 + index) * 0.03;
                cloud.rotation.y += 0.001;
                
                // Subtle color shifting
                cloud.children.forEach((part, partIndex) => {
                    const material = (part as THREE.Mesh).material as THREE.MeshLambertMaterial;
                    const colorShift = Math.sin(time * 0.2 + userData.colorShift + partIndex) * 0.1;
                    material.color.setRGB(1, 1 - colorShift * 0.2, 1 - colorShift * 0.1);
                });
                
                // Reset clouds that move too far
                if (cloud.position.x > 60) {
                    cloud.position.x = -60;
                }
            });

            // Rainbow streams animation
            rainbowStreams.forEach((stream, index) => {
                stream.rotation.y += 0.005;
                stream.position.y = 7.5 + Math.sin(time * 0.5 + index) * 2;
                
                // Color cycling
                const hue = (time * 0.2 + index * 0.125) % 1;
                (stream.material as THREE.MeshBasicMaterial).color.setHSL(hue, 0.8, 0.6);
            });

            // Dynamic camera with enhanced following and gentle floating
            const cameraOffset = {
                x: mouseX * 8 + Math.sin(time * 0.1) * 2,
                y: mouseY * 4 + 10 + Math.cos(time * 0.08) * 1,
                z: 25 + Math.sin(time * 0.05) * 3
            };
            
            camera.position.x += (cameraOffset.x - camera.position.x) * 0.025;
            camera.position.y += (cameraOffset.y - camera.position.y) * 0.025;
            camera.position.z += (cameraOffset.z - camera.position.z) * 0.025;
            
            // Look at target with slight movement
            const lookTarget = new THREE.Vector3(
                mouseX * 2,
                2 + mouseY,
                mouseY * 2
            );
            camera.lookAt(lookTarget);

            // Lighting animation
            directionalLight.intensity = 1.8 + Math.sin(time * 0.1) * 0.3;
            fillLight1.intensity = 0.3 + Math.sin(time * 0.15) * 0.1;
            fillLight2.intensity = 0.25 + Math.cos(time * 0.12) * 0.1;

            renderer.render(scene, camera);
        };

        animate();

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return (
        <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-purple-900 via-blue-900 to-teal-900">
            <div ref={mountRef} className="w-full h-full" />
            
            {/* Enhanced magical UI overlay */}
            <div className="absolute top-6 left-6 bg-gradient-to-br from-white/20 to-purple-200/30 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/30 max-w-sm mt-20">
                <h2 className="text-xl font-bold bg-[#3A8EBA] bg-clip-text text-transparent mb-4 text-center">
                    ✨ Enchanted Wonderland ✨
                </h2>
                <p className="text-sm text-gray-700 mb-4 text-center leading-relaxed"> Move your mouse to explore the magical realm!</p>
            </div>
            
            {/* Floating magical elements overlay */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 animate-bounce text-3xl opacity-60">✨</div>
                <div className="absolute top-1/3 right-1/4 animate-pulse text-4xl opacity-50">🌟</div>
                <div className="absolute bottom-1/3 left-1/3 animate-bounce delay-1000 text-3xl opacity-70">💫</div>
                <div className="absolute top-1/2 right-1/3 animate-pulse delay-500 text-2xl opacity-60">⭐</div>
                <div className="absolute top-3/4 left-1/2 animate-bounce delay-700 text-3xl opacity-50">🌙</div>
                <div className="absolute bottom-1/4 right-1/2 animate-pulse delay-1200 text-2xl opacity-60">💖</div>
            </div>

            {/* Enhanced bottom info panel */}
            <div className="absolute bottom-6 right-6 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-yellow-500/20 backdrop-blur-lg p-6 rounded-2xl border border-white/30 shadow-2xl">
                <div className="text-white text-center">
                    <div className="font-bold text-lg mb-2 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                        🎭 Magical Wonderland Experience
                    </div>
                    <div className="text-sm opacity-90 mb-2">
                        Enhanced with rainbow magic ✨ Dynamic lighting 🌈 Smooth animations
                    </div>
                    <div className="text-xs opacity-75">
                        Featuring: Glowing flowers • Rainbow butterflies • Dancing fireflies • Crystal trees
                    </div>
                </div>
            </div>

            {/* Magic particle overlay effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/6 left-1/6 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-60"></div>
                <div className="absolute top-2/3 right-1/5 w-1 h-1 bg-pink-400 rounded-full animate-pulse opacity-80"></div>
                <div className="absolute bottom-1/4 left-2/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping delay-500 opacity-50"></div>
                <div className="absolute top-1/2 left-1/5 w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-1000 opacity-70"></div>
            </div>
        </div>
    );
};

export default MagicGarden;