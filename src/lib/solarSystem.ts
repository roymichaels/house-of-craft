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
  scene.background = new THREE.Color(0x0A0404);
  scene.fog = new THREE.Fog(0x1A0A06, 180, 250);
  
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
  
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(container.clientWidth, container.clientHeight),
    2.5,  // strength - maximum intensity for sunrise glow
    1.8,  // radius - extra wide bloom for sunburst effect
    0.03  // threshold - very low to bloom entire sun area
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
  // LIGHTING
  // ============================================================================
  const ambientLight = new THREE.AmbientLight(new THREE.Color(0.13, 0.13, 0.13), 0.5);
  scene.add(ambientLight);
  
  const sunLight = new THREE.PointLight(new THREE.Color(1.0, 0.4, 0.15), 18.0, 1000, 0.35);
  sunLight.position.set(0, 0, 0);
  sunLight.castShadow = false;
  scene.add(sunLight);
  
  const fillLight = new THREE.PointLight(new THREE.Color(0.8, 0.2, 0.1), 3.0, 100, 1);
  fillLight.position.set(50, 50, -100);
  scene.add(fillLight);
  
  // ============================================================================
  // STARFIELD
  // ============================================================================
  createStarfield();
  
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

      // Improved noise function
      float noise(vec3 p) {
        return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
      }

      // Fractal Brownian Motion for more organic patterns
      float fbm(vec3 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for(int i = 0; i < 4; i++) {
          value += amplitude * noise(p);
          p *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;

        // EXTREME displacement for violent apocalyptic turbulence
        vec3 pos = position;
        float disp1 = fbm(position * 3.0 + time * 0.25);
        float disp2 = fbm(position * 5.0 - time * 0.35);
        float disp3 = fbm(position * 1.8 + time * 0.15);
        float disp4 = fbm(position * 7.0 + time * 0.4);
        float displacement = (disp1 * 0.35 + disp2 * 0.3 + disp3 * 0.2 + disp4 * 0.15) * 1.8;
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

      // Fractal Brownian Motion for complex patterns - MORE OCTAVES
      float fbm(vec3 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for(int i = 0; i < 6; i++) {
          value += amplitude * noise(p);
          p *= 2.3;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        // INTENSE fresnel effect for apocalyptic edge glow
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.0);

        // CHAOTIC flowing lava patterns with EXTREME frequencies
        vec3 flowDir1 = vPosition + vec3(time * 0.18, time * 0.12, 0.0);
        vec3 flowDir2 = vPosition - vec3(0.0, time * 0.22, time * 0.15);
        vec3 flowDir3 = vPosition + vec3(time * 0.08, -time * 0.09, time * 0.11);
        vec3 flowDir4 = vPosition + vec3(time * 0.25, time * 0.05, -time * 0.08);

        float lava1 = fbm(flowDir1 * 2.8);
        float lava2 = fbm(flowDir2 * 4.2);
        float lava3 = fbm(flowDir3 * 2.0);
        float lava4 = noise(vPosition * 10.0 + time * 0.6);
        float lava5 = fbm(flowDir4 * 3.5);

        // Combine patterns for EXTREME turbulent apocalyptic effect
        float noiseValue = lava1 * 0.35 + lava2 * 0.25 + lava3 * 0.2 + lava4 * 0.12 + lava5 * 0.08;

        // Add EXTREME dramatic swirling veins and flame streaks
        float veins = abs(sin(lava1 * 18.0 + time * 1.0));
        float veins2 = abs(cos(lava2 * 15.0 - time * 0.8));
        float veins3 = abs(sin(lava3 * 20.0 + time * 0.6));
        noiseValue = mix(noiseValue, (veins + veins2 + veins3) * 0.4, 0.4);

        // MAXIMUM contrast for apocalyptic effect
        noiseValue = pow(noiseValue, 0.5);
        noiseValue = smoothstep(0.02, 0.98, noiseValue);

        // Create DEEP dramatic dark spots (cooler lava crust)
        float spots = fbm(vPosition * 5.0 + time * 0.04);
        float darkSpots = smoothstep(0.7, 0.8, spots);
        noiseValue = mix(noiseValue * 0.15, noiseValue, darkSpots);

        // APOCALYPTIC color mapping with EXTREME heat variation
        vec3 color;
        if (noiseValue < 0.12) {
          color = colorDark;
        } else if (noiseValue < 0.25) {
          color = mix(colorDark, colorCool, (noiseValue - 0.12) / 0.13);
        } else if (noiseValue < 0.45) {
          color = mix(colorCool, colorMid, (noiseValue - 0.25) / 0.2);
        } else if (noiseValue < 0.65) {
          color = mix(colorMid, colorHot, (noiseValue - 0.45) / 0.2);
        } else if (noiseValue < 0.82) {
          color = mix(colorHot, colorWhiteHot, (noiseValue - 0.65) / 0.17);
        } else {
          color = colorWhiteHot * 1.2;
        }

        // Add BLAZING white-hot veins of flowing lava
        float brightVeins = smoothstep(0.75, 0.92, noiseValue);
        color = mix(color, colorWhiteHot * 2.0, brightVeins * 0.8);

        // EXTREME dramatic fresnel glow for fiery atmosphere
        color = mix(color, colorHot * 1.5, fresnel * 0.75);

        // Add intense surface texture detail
        float detail = noise(vPosition * 25.0 + time * 0.15) * 0.12;
        color += detail * vec3(1.2, 0.8, 0.6);

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

  // Inner Corona - INTENSE red-orange flame glow
  const innerCoronaGeometry = new THREE.SphereGeometry(7.5, 64, 64);
  const innerCoronaMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(3.5, 1.4, 0.35),
    transparent: true,
    opacity: 0.65,
    side: THREE.BackSide,
    toneMapped: false
  });
  const innerCorona = new THREE.Mesh(innerCoronaGeometry, innerCoronaMaterial);
  sunGroup.add(innerCorona);

  // Outer Corona - DRAMATIC fiery atmospheric glow
  const outerCoronaGeometry = new THREE.SphereGeometry(10.5, 64, 64);
  const outerCoronaMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(2.8, 0.9, 0.25),
    transparent: true,
    opacity: 0.48,
    side: THREE.BackSide,
    toneMapped: false
  });
  const outerCorona = new THREE.Mesh(outerCoronaGeometry, outerCoronaMaterial);
  sunGroup.add(outerCorona);

  // Far Corona - DEEP crimson apocalyptic halo
  const farCoronaGeometry = new THREE.SphereGeometry(14.0, 64, 64);
  const farCoronaMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(2.0, 0.5, 0.18),
    transparent: true,
    opacity: 0.32,
    side: THREE.BackSide,
    toneMapped: false
  });
  const farCorona = new THREE.Mesh(farCoronaGeometry, farCoronaMaterial);
  sunGroup.add(farCorona);

  // Ultra Far Corona - Extended sunrise atmospheric glow
  const ultraFarCoronaGeometry = new THREE.SphereGeometry(18.0, 64, 64);
  const ultraFarCoronaMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(1.5, 0.35, 0.12),
    transparent: true,
    opacity: 0.22,
    side: THREE.BackSide,
    toneMapped: false
  });
  const ultraFarCorona = new THREE.Mesh(ultraFarCoronaGeometry, ultraFarCoronaMaterial);
  sunGroup.add(ultraFarCorona);

  scene.add(sunGroup);

  // Store references for animation
  sunLayers = {
    core: sunCore,
    surface: sunSurface,
    material: surfaceMaterial,
    innerCorona: innerCorona,
    outerCorona: outerCorona,
    farCorona: farCorona,
    ultraFarCorona: ultraFarCorona
  };
  
  // ============================================================================
  // ASTEROID BELT
  // ============================================================================
  createAsteroidBelt();
  
  // ============================================================================
  // PLANETS
  // ============================================================================
  PLANETS_DATA.forEach(planetData => {
    // Create planet
    const geometry = new THREE.SphereGeometry(planetData.radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: planetData.color,
      roughness: 0.7,
      metalness: 0.3
    });
    const planet = new THREE.Mesh(geometry, material);
    
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
      const moonGeometry = new THREE.SphereGeometry(planetData.moon.radius, 16, 16);
      const moonMaterial = new THREE.MeshStandardMaterial({
        color: planetData.moon.color,
        roughness: 0.9,
        metalness: 0.1
      });
      const moon = new THREE.Mesh(moonGeometry, moonMaterial);
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
    
    // Animate sun - APOCALYPTIC pulsating lava effect with EXTREME coronas
    if (sunLayers) {
      // Update shader time uniform
      sunLayers.material.uniforms.time.value = time;

      // VIOLENT pulsating scale - threatening breathing effect
      const pulseScale = 1.0 + Math.sin(time * 0.7) * 0.05 + Math.sin(time * 1.5) * 0.025 + Math.sin(time * 2.3) * 0.015;
      sunLayers.core.scale.setScalar(pulseScale * 1.03);
      sunLayers.surface.scale.setScalar(pulseScale);

      // Animate coronas with INTENSE pulse rates for chaotic effect
      const coronaPulse1 = 1.0 + Math.sin(time * 0.8) * 0.12 + Math.sin(time * 1.6) * 0.05;
      const coronaPulse2 = 1.0 + Math.sin(time * 0.6 + 1.0) * 0.15 + Math.sin(time * 1.3) * 0.06;
      const coronaPulse3 = 1.0 + Math.sin(time * 0.4 + 2.0) * 0.18 + Math.sin(time * 1.0) * 0.07;
      const coronaPulse4 = 1.0 + Math.sin(time * 0.3 + 3.0) * 0.22 + Math.sin(time * 0.8) * 0.08;

      sunLayers.innerCorona.scale.setScalar(coronaPulse1);
      sunLayers.outerCorona.scale.setScalar(coronaPulse2);
      sunLayers.farCorona.scale.setScalar(coronaPulse3);
      sunLayers.ultraFarCorona.scale.setScalar(coronaPulse4);

      // Vary corona opacity for INTENSE flickering effect
      if (sunLayers.innerCorona.material) {
        sunLayers.innerCorona.material.opacity = 0.65 + Math.sin(time * 1.2) * 0.22 + Math.sin(time * 2.5) * 0.09;
      }
      if (sunLayers.outerCorona.material) {
        sunLayers.outerCorona.material.opacity = 0.48 + Math.sin(time * 0.9 + 1.5) * 0.18 + Math.sin(time * 2.0) * 0.07;
      }
      if (sunLayers.farCorona.material) {
        sunLayers.farCorona.material.opacity = 0.32 + Math.sin(time * 0.7 + 3.0) * 0.14 + Math.sin(time * 1.8) * 0.06;
      }
      if (sunLayers.ultraFarCorona.material) {
        sunLayers.ultraFarCorona.material.opacity = 0.22 + Math.sin(time * 0.5 + 4.0) * 0.12 + Math.sin(time * 1.5) * 0.05;
      }

      // MUCH faster rotation for violent lava flow
      sunLayers.surface.rotation.y += 0.002;
      sunLayers.surface.rotation.x += 0.0005;
    }
    
    // Update planets
    celestialBodies.forEach(body => {
      // Orbit
      body.angle += body.orbitSpeed * 0.001;
      body.mesh.position.x = Math.cos(body.angle) * body.orbitRadius;
      body.mesh.position.z = Math.sin(body.angle) * body.orbitRadius;
      
      // Rotation
      body.mesh.rotation.y += body.rotationSpeed;
      
      // Update moons
      if (body.moons) {
        body.moons.forEach(moon => {
          moon.angle += moon.orbitSpeed * 0.01;
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
  const starCount = 5000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);
  
  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    const radius = 200 + Math.random() * 200;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);
    
    // Variable star sizes for depth
    sizes[i] = Math.random() * 2.5 + 0.5;
    
    // Color variation - mostly white, some blue/orange tints
    const colorChoice = Math.random();
    if (colorChoice < 0.7) {
      // White stars with brightness variation
      const brightness = 0.7 + Math.random() * 0.3;
      colors[i3] = brightness;
      colors[i3 + 1] = brightness;
      colors[i3 + 2] = brightness;
    } else if (colorChoice < 0.85) {
      // Blue tint stars
      colors[i3] = 0.6 + Math.random() * 0.2;
      colors[i3 + 1] = 0.7 + Math.random() * 0.2;
      colors[i3 + 2] = 0.9 + Math.random() * 0.1;
    } else {
      // Orange tint stars
      colors[i3] = 0.9 + Math.random() * 0.1;
      colors[i3 + 1] = 0.7 + Math.random() * 0.2;
      colors[i3 + 2] = 0.5 + Math.random() * 0.2;
    }
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  const material = new THREE.PointsMaterial({
    size: 1.5,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.9
  });
  
  const stars = new THREE.Points(geometry, material);
  scene.add(stars);
}

function createAsteroidBelt() {
  for (let i = 0; i < 150; i++) {
    const size = 0.02 + Math.random() * 0.06;
    const distance = 20 + Math.random() * 4; // Between 20-24
    const angle = Math.random() * Math.PI * 2;
    
    const geometry = new THREE.SphereGeometry(size, 6, 6);
    const material = new THREE.MeshStandardMaterial({
      color: 0x666666,
      roughness: 1.0,
      metalness: 0.1
    });
    const asteroid = new THREE.Mesh(geometry, material);
    
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
