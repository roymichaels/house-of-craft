import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let composer: EffectComposer;
let animationId: number;
let isInitialized = false;
let sunLayers: any = null;

interface CelestialBody {
  mesh: THREE.Mesh;
  orbitRadius: number;
  orbitSpeed: number;
  angle: number;
  rotationSpeed: number;
  moons?: Moon[];
}

interface Moon {
  mesh: THREE.Mesh;
  orbitRadius: number;
  orbitSpeed: number;
  angle: number;
}

const celestialBodies: CelestialBody[] = [];

// Planet data - exact values from main-6.js with realistic colors
const PLANETS_DATA = [
  { name: "Mercury", radius: 0.5, distance: 8, speed: 0.0041, rotation: 0.02, color: 0x8C8C8C, angle: 2.1 }, // Gray
  { name: "Venus", radius: 0.9, distance: 11, speed: 0.0016, rotation: 0.004, color: 0xE8D5B7, angle: 4.8 }, // Pale yellow
  { 
    name: "Earth", 
    radius: 1.0, 
    distance: 15, 
    speed: 0.001, 
    rotation: 0.01, 
    color: 0x2F6A9F, 
    angle: 3.45,
    moon: { radius: 0.27, distance: 2.5, speed: 0.037, color: 0xC0C0C0 } // Silvery gray
  },
  { name: "Mars", radius: 0.8, distance: 19, speed: 0.00053, rotation: 0.01, color: 0xC1440E, angle: 0.9 }, // Rust red
  { name: "Jupiter", radius: 2.0, distance: 25, speed: 0.000084, rotation: 0.04, color: 0xC88B3A, angle: 2.7 }, // Orange-brown
  { name: "Saturn", radius: 1.7, distance: 31, speed: 0.000034, rotation: 0.038, color: 0xFAD5A5, angle: 5.8, hasRings: true }, // Pale gold
  { name: "Uranus", radius: 1.2, distance: 37, speed: 0.000012, rotation: 0.03, color: 0x4FD0E7, angle: 1.2 }, // Cyan
  { name: "Neptune", radius: 1.1, distance: 42, speed: 0.0000061, rotation: 0.032, color: 0x4166F5, angle: 6.1 }, // Deep blue
  // Dwarf planets
  { name: "Ceres", radius: 0.3, distance: 22, speed: 0.00022, rotation: 0.01, color: 0x7B7D7D, angle: 0 }, // Dark gray
  { name: "Pluto", radius: 0.4, distance: 48, speed: 0.000004, rotation: 0.01, color: 0xC9A98A, angle: 5.3 }, // Tan/beige
  { name: "Eris", radius: 0.35, distance: 52, speed: 0.0000018, rotation: 0.01, color: 0xD3D3D3, angle: 2.7 }, // Light gray
  { name: "Makemake", radius: 0.25, distance: 50, speed: 0.0000032, rotation: 0.01, color: 0x8B5A3C, angle: 1.9 }, // Reddish-brown
  { name: "Haumea", radius: 0.28, distance: 51, speed: 0.0000035, rotation: 0.01, color: 0xE5E5E5, angle: 4.2 }, // Off-white
  { name: "Sedna", radius: 0.2, distance: 65, speed: 0.00000009, rotation: 0.01, color: 0x8B2500, angle: 0.1 }, // Dark reddish
];

export function initSolarSystem(container: HTMLElement) {
  if (isInitialized) {
    console.warn('⚠️ Solar System already initialized');
    return () => {};
  }
  
  console.log('🌌 Initializing Solar System (main.js recreation)...');
  isInitialized = true;
  
  cleanupSolarSystem();
  
  // ============================================================================
  // SCENE
  // ============================================================================
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  // Enhanced fog for atmospheric depth - exponential falloff
  scene.fog = new THREE.FogExp2(0x0a0510, 0.0025);
  
  // ============================================================================
  // CAMERA
  // ============================================================================
  camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 20, 65);
  camera.lookAt(0, 0, 0);
  
  // ============================================================================
  // RENDERER
  // ============================================================================
  renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: false
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);
  
  // ============================================================================
  // POST-PROCESSING
  // ============================================================================
  composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  // Minimal bloom - only for sun, prevents star square artifacts
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(container.clientWidth, container.clientHeight),
    0.5,  // strength - minimal to prevent artifacts
    0.4,  // radius - very tight, circular bloom
    0.85  // threshold - high, only sun blooms
  );
  composer.addPass(bloomPass);

  const outputPass = new OutputPass();
  composer.addPass(outputPass);
  
  // ============================================================================
  // ORBIT CONTROLS
  // ============================================================================
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.3;
  controls.zoomSpeed = 0.8;
  controls.panSpeed = 0.5;
  controls.minDistance = 8;
  controls.maxDistance = 200;
  
  // ============================================================================
  // LIGHTING - Physically Based
  // ============================================================================
  // Reduced ambient for deeper space darkness
  const ambientLight = new THREE.AmbientLight(0x0a0a15, 0.08);
  scene.add(ambientLight);

  // Main sun light - realistic color temperature and intensity
  const sunLight = new THREE.PointLight(0xfff4e0, 25.0, 800, 2);
  sunLight.position.set(0, 0, 0);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 500;
  scene.add(sunLight);

  // Subtle rim light for depth separation
  const rimLight = new THREE.DirectionalLight(0x2a4a7a, 0.15);
  rimLight.position.set(-100, 50, -100);
  scene.add(rimLight);

  // Secondary fill light for subtle illumination of dark sides
  const fillLight = new THREE.PointLight(0x1a1a30, 0.5, 300, 2);
  fillLight.position.set(80, 40, -80);
  scene.add(fillLight);
  
  // ============================================================================
  // STARFIELD
  // ============================================================================
  createStarfield();

  // ============================================================================
  // VOLUMETRIC SPACE DUST
  // ============================================================================
  createSpaceDust();
  
  // ============================================================================
  // SUN - Realistic Pulsating Lava
  // ============================================================================
  const sunGroup = new THREE.Group();
  
  // Custom lava shader - Enhanced for dramatic effect
  const lavaShader = {
    uniforms: {
      time: { value: 0 },
      colorWhiteHot: { value: new THREE.Color(0xFFFFFF) },
      colorHot: { value: new THREE.Color(0xFFAA33) },
      colorMid: { value: new THREE.Color(0xFF4400) },
      colorCool: { value: new THREE.Color(0xBB1100) },
      colorDark: { value: new THREE.Color(0x220000) }
    },
    vertexShader: `
      uniform float time;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;

      // Smooth noise function
      float noise(vec3 p) {
        return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
      }

      // Smooth Fractal Brownian Motion - fewer octaves for cinematic quality
      float fbm(vec3 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for(int i = 0; i < 3; i++) {
          value += amplitude * noise(p);
          p *= 1.8;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;

        // Smooth cinematic displacement - slow, dramatic movement
        vec3 pos = position;
        float disp1 = fbm(position * 1.5 + time * 0.08);
        float disp2 = fbm(position * 2.2 - time * 0.12);
        float disp3 = fbm(position * 1.0 + time * 0.05);
        float displacement = (disp1 * 0.4 + disp2 * 0.35 + disp3 * 0.25) * 1.2;
        pos += normal * displacement;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 colorWhiteHot;
      uniform vec3 colorHot;
      uniform vec3 colorMid;
      uniform vec3 colorCool;
      uniform vec3 colorDark;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;

      float noise(vec3 p) {
        return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
      }

      // Smooth Fractal Brownian Motion - cinematic quality
      float fbm(vec3 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for(int i = 0; i < 3; i++) {
          value += amplitude * noise(p);
          p *= 1.8;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        // Dramatic fresnel effect for cinematic edge glow
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.0);

        // Slow, dramatic flowing lava patterns - cinematic speeds
        vec3 flowDir1 = vPosition + vec3(time * 0.05, time * 0.03, 0.0);
        vec3 flowDir2 = vPosition - vec3(0.0, time * 0.07, time * 0.04);
        vec3 flowDir3 = vPosition + vec3(time * 0.02, -time * 0.025, time * 0.03);
        vec3 flowDir4 = vPosition + vec3(time * 0.06, time * 0.015, -time * 0.02);

        float lava1 = fbm(flowDir1 * 1.5);
        float lava2 = fbm(flowDir2 * 2.0);
        float lava3 = fbm(flowDir3 * 1.2);
        float lava4 = noise(vPosition * 4.0 + time * 0.15);
        float lava5 = fbm(flowDir4 * 1.8);

        // Combine patterns for dramatic apocalyptic effect
        float noiseValue = lava1 * 0.35 + lava2 * 0.25 + lava3 * 0.2 + lava4 * 0.12 + lava5 * 0.08;

        // Slow, dramatic swirling veins and flame channels
        float veins = abs(sin(lava1 * 8.0 + time * 0.3));
        float veins2 = abs(cos(lava2 * 6.5 - time * 0.25));
        float veins3 = abs(sin(lava3 * 9.0 + time * 0.2));
        noiseValue = mix(noiseValue, (veins + veins2 + veins3) * 0.4, 0.35);

        // Smooth contrast for cinematic quality
        noiseValue = pow(noiseValue, 0.6);
        noiseValue = smoothstep(0.08, 0.92, noiseValue);

        // Deep dramatic dark spots (cooler lava crust) - slow formation
        float spots = fbm(vPosition * 2.5 + time * 0.01);
        float darkSpots = smoothstep(0.65, 0.82, spots);
        noiseValue = mix(noiseValue * 0.2, noiseValue, darkSpots);

        // Cinematic apocalyptic color mapping with dramatic heat variation
        vec3 color;
        if (noiseValue < 0.15) {
          color = colorDark;
        } else if (noiseValue < 0.28) {
          color = mix(colorDark, colorCool, (noiseValue - 0.15) / 0.13);
        } else if (noiseValue < 0.48) {
          color = mix(colorCool, colorMid, (noiseValue - 0.28) / 0.2);
        } else if (noiseValue < 0.68) {
          color = mix(colorMid, colorHot, (noiseValue - 0.48) / 0.2);
        } else if (noiseValue < 0.85) {
          color = mix(colorHot, colorWhiteHot, (noiseValue - 0.68) / 0.17);
        } else {
          color = colorWhiteHot * 1.15;
        }

        // Blazing white-hot veins of flowing lava - smooth transitions
        float brightVeins = smoothstep(0.78, 0.90, noiseValue);
        color = mix(color, colorWhiteHot * 1.8, brightVeins * 0.7);

        // Dramatic fresnel glow for fiery atmosphere
        color = mix(color, colorHot * 1.4, fresnel * 0.65);

        // Subtle surface texture detail - cinematic grain
        float detail = noise(vPosition * 12.0 + time * 0.05) * 0.08;
        color += detail * vec3(1.0, 0.7, 0.5);

        gl_FragColor = vec4(color, 1.0);
      }
    `
  };
  
  // Core - BLAZING WHITE-HOT center
  const coreGeometry = new THREE.SphereGeometry(2.8, 64, 64);
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(6.0, 4.2, 3.0),
    toneMapped: false
  });
  const sunCore = new THREE.Mesh(coreGeometry, coreMaterial);
  sunGroup.add(sunCore);

  // Surface layer - lava with shader
  const surfaceGeometry = new THREE.SphereGeometry(5.0, 128, 128);
  const surfaceMaterial = new THREE.ShaderMaterial({
    uniforms: lavaShader.uniforms,
    vertexShader: lavaShader.vertexShader,
    fragmentShader: lavaShader.fragmentShader
  });
  const sunSurface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
  sunGroup.add(sunSurface);

  // Corona glow - outer atmosphere
  const coronaGeometry = new THREE.SphereGeometry(6.8, 64, 64);
  const coronaMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      glowColor: { value: new THREE.Color(0xff6622) }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 glowColor;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);

        float pulse = sin(time * 0.3) * 0.12 + 0.88;
        float intensity = fresnel * 0.5 * pulse;

        vec3 color = glowColor * intensity;
        gl_FragColor = vec4(color, intensity * 0.4);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  });
  const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
  sunGroup.add(corona);

  scene.add(sunGroup);

  // Store references for animation
  sunLayers = {
    core: sunCore,
    surface: sunSurface,
    material: surfaceMaterial,
    corona: corona,
    coronaMaterial: coronaMaterial
  };
  
  // ============================================================================
  // ASTEROID BELT
  // ============================================================================
  createAsteroidBelt();
  
  // ============================================================================
  // PLANETS
  // ============================================================================
  PLANETS_DATA.forEach(planetData => {
    // Create planet with enhanced PBR materials
    const geometry = new THREE.SphereGeometry(planetData.radius, 64, 64);

    // Planet-specific material properties for realism
    let roughness = 0.9;
    let metalness = 0.0;
    let emissive = new THREE.Color(0x000000);
    let emissiveIntensity = 0.0;

    // Customize materials based on planet type
    if (planetData.name === 'Venus' || planetData.name === 'Mars') {
      roughness = 0.95; // Very rough, rocky surface
    } else if (planetData.name === 'Earth') {
      roughness = 0.6; // Oceans are smoother
      emissive = new THREE.Color(0x0a1a2a);
      emissiveIntensity = 0.05; // Subtle city lights effect
    } else if (planetData.name === 'Jupiter' || planetData.name === 'Saturn' ||
               planetData.name === 'Uranus' || planetData.name === 'Neptune') {
      roughness = 0.4; // Gas giants are smoother, more reflective
      metalness = 0.1;
    }

    const material = new THREE.MeshStandardMaterial({
      color: planetData.color,
      roughness: roughness,
      metalness: metalness,
      emissive: emissive,
      emissiveIntensity: emissiveIntensity,
      envMapIntensity: 0.8
    });
    const planet = new THREE.Mesh(geometry, material);
    planet.castShadow = true;
    planet.receiveShadow = true;
    
    // Set initial position
    planet.position.x = Math.cos(planetData.angle) * planetData.distance;
    planet.position.z = Math.sin(planetData.angle) * planetData.distance;
    scene.add(planet);
    
    const bodyData: CelestialBody = {
      mesh: planet,
      orbitRadius: planetData.distance,
      orbitSpeed: planetData.speed,
      angle: planetData.angle,
      rotationSpeed: planetData.rotation
    };
    
    // Add rings for Saturn
    if (planetData.hasRings) {
      const ringGeometry = new THREE.RingGeometry(
        planetData.radius * 1.5,
        planetData.radius * 2.5,
        64
      );
      const ringMaterial = new THREE.MeshStandardMaterial({
        color: 0xC4A35A,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
        roughness: 0.8
      });
      const rings = new THREE.Mesh(ringGeometry, ringMaterial);
      rings.rotation.x = Math.PI / 2;
      planet.add(rings);
    }
    
    // Add moon for Earth
    if (planetData.moon) {
      const moonGeometry = new THREE.SphereGeometry(planetData.moon.radius, 32, 32);
      const moonMaterial = new THREE.MeshStandardMaterial({
        color: planetData.moon.color,
        roughness: 0.95,
        metalness: 0.0,
        envMapIntensity: 0.3
      });
      const moon = new THREE.Mesh(moonGeometry, moonMaterial);
      moon.castShadow = true;
      moon.receiveShadow = true;
      scene.add(moon);
      
      bodyData.moons = [{
        mesh: moon,
        orbitRadius: planetData.moon.distance,
        orbitSpeed: planetData.moon.speed,
        angle: 0
      }];
    }
    
    celestialBodies.push(bodyData);
    
    // Create orbit path
    createOrbitPath(planetData.distance);
  });
  
  // ============================================================================
  // ANIMATION LOOP
  // ============================================================================
  function animate() {
    animationId = requestAnimationFrame(animate);
    
    const time = performance.now() * 0.001; // Time in seconds
    
    // Animate sun
    if (sunLayers) {
      // Update shader time uniform
      sunLayers.material.uniforms.time.value = time;
      sunLayers.coronaMaterial.uniforms.time.value = time;

      // Slow, dramatic pulsating scale - cinematic breathing effect
      const pulseScale = 1.0 + Math.sin(time * 0.3) * 0.04 + Math.sin(time * 0.6) * 0.02 + Math.sin(time * 0.9) * 0.01;
      sunLayers.core.scale.setScalar(pulseScale * 1.03);
      sunLayers.surface.scale.setScalar(pulseScale);
      sunLayers.corona.scale.setScalar(pulseScale * 1.02);

      // Very slow rotation for cinematic lava flow
      sunLayers.surface.rotation.y += 0.0005;
      sunLayers.surface.rotation.x += 0.0001;

      // Slow counter-rotation for corona atmosphere
      sunLayers.corona.rotation.y -= 0.0002;
    }
    
    // Update planets - slow, contemplative orbital motion
    celestialBodies.forEach(body => {
      // Orbit - reduced speed for dramatic, slow-motion effect
      body.angle += body.orbitSpeed * 0.0001;
      body.mesh.position.x = Math.cos(body.angle) * body.orbitRadius;
      body.mesh.position.z = Math.sin(body.angle) * body.orbitRadius;

      // Rotation
      body.mesh.rotation.y += body.rotationSpeed;

      // Update moons
      if (body.moons) {
        body.moons.forEach(moon => {
          moon.angle += moon.orbitSpeed * 0.002;
          moon.mesh.position.x = body.mesh.position.x + Math.cos(moon.angle) * moon.orbitRadius;
          moon.mesh.position.z = body.mesh.position.z + Math.sin(moon.angle) * moon.orbitRadius;
        });
      }
    });
    
    controls.update();
    composer.render();
  }
  
  animate();
  
  // ============================================================================
  // RESIZE HANDLER
  // ============================================================================
  const handleResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    composer.setSize(container.clientWidth, container.clientHeight);
  };
  
  window.addEventListener('resize', handleResize);
  
  return () => {
    console.log('🔄 Cleanup');
    window.removeEventListener('resize', handleResize);
    cancelAnimationFrame(animationId);
    isInitialized = false;
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function createStarfield() {
  // Create multiple layers of stars for parallax depth effect
  const layers = [
    { count: 3000, minRadius: 180, maxRadius: 250, sizeRange: [0.5, 1.8], opacity: 1.0 },
    { count: 2000, minRadius: 250, maxRadius: 350, sizeRange: [0.3, 1.2], opacity: 0.85 },
    { count: 1500, minRadius: 350, maxRadius: 500, sizeRange: [0.2, 0.8], opacity: 0.7 }
  ];

  layers.forEach(layer => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(layer.count * 3);
    const colors = new Float32Array(layer.count * 3);
    const sizes = new Float32Array(layer.count);

    for (let i = 0; i < layer.count; i++) {
      const i3 = i * 3;
      const radius = layer.minRadius + Math.random() * (layer.maxRadius - layer.minRadius);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Variable star sizes for depth
      sizes[i] = layer.sizeRange[0] + Math.random() * (layer.sizeRange[1] - layer.sizeRange[0]);

      // Realistic stellar colors
      const colorChoice = Math.random();
      if (colorChoice < 0.6) {
        // White stars (main sequence)
        const brightness = 0.85 + Math.random() * 0.15;
        colors[i3] = brightness;
        colors[i3 + 1] = brightness;
        colors[i3 + 2] = brightness;
      } else if (colorChoice < 0.75) {
        // Blue-white stars (hot stars)
        colors[i3] = 0.7 + Math.random() * 0.2;
        colors[i3 + 1] = 0.8 + Math.random() * 0.15;
        colors[i3 + 2] = 0.95 + Math.random() * 0.05;
      } else if (colorChoice < 0.88) {
        // Yellow-orange stars (sun-like)
        colors[i3] = 0.95 + Math.random() * 0.05;
        colors[i3 + 1] = 0.8 + Math.random() * 0.15;
        colors[i3 + 2] = 0.5 + Math.random() * 0.2;
      } else {
        // Red stars (cool giants)
        colors[i3] = 0.9 + Math.random() * 0.1;
        colors[i3 + 1] = 0.4 + Math.random() * 0.2;
        colors[i3 + 2] = 0.3 + Math.random() * 0.15;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.8,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: layer.opacity * 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
  });

  // Add nebula background
  createNebulaBackground();
}

function createNebulaBackground() {
  // Create distant nebula clouds for depth
  const nebulaCount = 8;
  for (let i = 0; i < nebulaCount; i++) {
    const geometry = new THREE.SphereGeometry(20 + Math.random() * 30, 16, 16);

    const nebulaColors = [
      0x1a0a2e, // Deep purple
      0x0f2027, // Dark blue-green
      0x2c1a4d, // Purple-blue
      0x1a1a3e  // Deep indigo
    ];

    const material = new THREE.MeshBasicMaterial({
      color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
      transparent: true,
      opacity: 0.03 + Math.random() * 0.05,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });

    const nebula = new THREE.Mesh(geometry, material);

    // Random position far from center
    const distance = 250 + Math.random() * 200;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;

    nebula.position.x = distance * Math.sin(phi) * Math.cos(theta);
    nebula.position.y = distance * Math.sin(phi) * Math.sin(theta);
    nebula.position.z = distance * Math.cos(phi);

    scene.add(nebula);
  }
}

function createSpaceDust() {
  // Create volumetric dust particles that catch light
  const dustCount = 2000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(dustCount * 3);
  const colors = new Float32Array(dustCount * 3);
  const sizes = new Float32Array(dustCount);

  for (let i = 0; i < dustCount; i++) {
    const i3 = i * 3;

    // Distribute dust in a sphere around solar system
    const radius = 40 + Math.random() * 120;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    // Very small particles
    sizes[i] = 0.1 + Math.random() * 0.3;

    // Dust colors - warm near sun, cool farther out
    const distanceFromCenter = Math.sqrt(
      positions[i3] * positions[i3] +
      positions[i3 + 1] * positions[i3 + 1] +
      positions[i3 + 2] * positions[i3 + 2]
    );

    if (distanceFromCenter < 60) {
      // Warm dust near sun
      colors[i3] = 0.8 + Math.random() * 0.2;
      colors[i3 + 1] = 0.5 + Math.random() * 0.3;
      colors[i3 + 2] = 0.3 + Math.random() * 0.2;
    } else {
      // Cool dust farther out
      colors[i3] = 0.4 + Math.random() * 0.2;
      colors[i3 + 1] = 0.5 + Math.random() * 0.2;
      colors[i3 + 2] = 0.6 + Math.random() * 0.3;
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 0.6,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const dust = new THREE.Points(geometry, material);
  scene.add(dust);
}

function createAsteroidBelt() {
  for (let i = 0; i < 150; i++) {
    const size = 0.02 + Math.random() * 0.06;
    const distance = 20 + Math.random() * 4; // Between 20-24
    const angle = Math.random() * Math.PI * 2;

    // Irregular shapes for asteroids
    const geometry = new THREE.DodecahedronGeometry(size, 0);

    // Vary asteroid colors - rocky to metallic
    const asteroidType = Math.random();
    let color, roughness, metalness;

    if (asteroidType < 0.7) {
      // Rocky asteroids (most common)
      color = 0x555555 + Math.floor(Math.random() * 0x222222);
      roughness = 0.95;
      metalness = 0.05;
    } else if (asteroidType < 0.9) {
      // Carbonaceous asteroids (darker)
      color = 0x2a2a2a + Math.floor(Math.random() * 0x111111);
      roughness = 1.0;
      metalness = 0.0;
    } else {
      // Metallic asteroids (rare, reflective)
      color = 0x888888;
      roughness = 0.3;
      metalness = 0.7;
    }

    const material = new THREE.MeshStandardMaterial({
      color: color,
      roughness: roughness,
      metalness: metalness
    });
    const asteroid = new THREE.Mesh(geometry, material);
    asteroid.castShadow = true;
    asteroid.receiveShadow = true;

    // Random rotation for variety
    asteroid.rotation.x = Math.random() * Math.PI * 2;
    asteroid.rotation.y = Math.random() * Math.PI * 2;
    asteroid.rotation.z = Math.random() * Math.PI * 2;

    asteroid.position.x = Math.cos(angle) * distance;
    asteroid.position.z = Math.sin(angle) * distance;
    asteroid.position.y = (Math.random() - 0.5) * 0.5;

    scene.add(asteroid);
  }
}

function createOrbitPath(radius: number) {
  // Color-coded orbit rings based on distance
  let orbitColor: number;
  if (radius < 20) {
    orbitColor = 0x4A90E2; // Inner planets - Blue
  } else if (radius >= 20 && radius < 24) {
    orbitColor = 0x996633; // Asteroid region - Brown
  } else if (radius >= 24 && radius < 45) {
    orbitColor = 0x8B7EBF; // Outer planets - Purple
  } else {
    orbitColor = 0xCCA000; // Dwarf planets - Gold
  }
  
  const curve = new THREE.EllipseCurve(
    0, 0,           // center x, y
    radius, radius, // xRadius, yRadius
    0, 2 * Math.PI, // start angle, end angle
    false,          // clockwise
    0               // rotation
  );
  
  const points = curve.getPoints(128);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: orbitColor,
    transparent: true,
    opacity: 0.2
  });
  
  const orbit = new THREE.Line(geometry, material);
  orbit.rotation.x = Math.PI / 2;
  scene.add(orbit);
}

export function cleanupSolarSystem() {
  if (!scene) return;
  
  console.log('🧹 Cleanup');
  
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  celestialBodies.length = 0;
  
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.geometry?.dispose();
      if (object.material instanceof THREE.Material) {
        object.material.dispose();
      }
    }
  });
  
  while(scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
  
  if (composer) {
    composer.dispose();
  }
  
  if (renderer) {
    renderer.dispose();
  }
  
  if (controls) {
    controls.dispose();
  }
  
  isInitialized = false;
}
