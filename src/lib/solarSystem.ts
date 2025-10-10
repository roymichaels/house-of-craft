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
  renderer.toneMappingExposure = 0.85;  // Darker exposure to emphasize lava ball darkness
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);
  
  // ============================================================================
  // POST-PROCESSING
  // ============================================================================
  composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  // Very minimal bloom - subtle glow only
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(container.clientWidth, container.clientHeight),
    0.25,  // strength - very low for minimal glow
    0.3,   // radius - tight, minimal spread
    0.9    // threshold - very high, only brightest parts glow
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
  // LIGHTING - Brighter space to see planets
  // ============================================================================
  // Increased ambient for visible planets
  const ambientLight = new THREE.AmbientLight(0x4a4a5a, 0.35);  // Much brighter ambient
  scene.add(ambientLight);

  // Main sun light - warm molten lava color with reduced intensity
  const sunLight = new THREE.PointLight(0xDD5500, 18.0, 800, 2);  // Dark warm orange, lower intensity
  sunLight.position.set(0, 0, 0);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 500;
  scene.add(sunLight);

  // Stronger rim light for planet visibility
  const rimLight = new THREE.DirectionalLight(0x6a7a9a, 0.4);  // Brighter rim light
  rimLight.position.set(-100, 50, -100);
  scene.add(rimLight);

  // Stronger fill light for illuminating planets
  const fillLight = new THREE.PointLight(0x5a5a7a, 1.5, 400, 2);  // Much brighter fill
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
  
  // Apocalyptic lava ball shader - Dark molten surface with fiery cracks
  const solarShader = {
    uniforms: {
      time: { value: 0 },
      // Apocalyptic lava ball color palette - dark with fiery cracks
      colorCore: { value: new THREE.Color(0xFF8800) },      // Hot orange-red core
      colorPhotosphere: { value: new THREE.Color(0xDD4400) }, // Dark burnt orange
      colorGranule: { value: new THREE.Color(0xCC3300) },   // Dark red-orange cells
      colorCool: { value: new THREE.Color(0x661100) },      // Very dark brown-red
      colorDark: { value: new THREE.Color(0x220000) },      // Almost black, deep charcoal
      colorChromosphere: { value: new THREE.Color(0x991100) } // Dark crimson atmosphere
    },
    vertexShader: `
      uniform float time;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;

      // Perlin-style noise for realistic turbulence
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      // Multi-octave turbulence for realistic convection
      float turbulence(vec3 p) {
        float sum = 0.0;
        float freq = 1.0;
        float amp = 1.0;
        for(int i = 0; i < 4; i++) {
          sum += abs(snoise(p * freq)) * amp;
          freq *= 2.0;
          amp *= 0.5;
        }
        return sum;
      }

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;

        // Realistic solar convection - granulation pattern displacement
        vec3 pos = position;
        float granulation = turbulence(position * 2.5 + time * 0.03);
        float convection = snoise(position * 1.2 + time * 0.02) * 0.5 + 0.5;
        float displacement = (granulation * 0.4 + convection * 0.3) * 0.6;
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

      // Perlin noise for realistic patterns
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      float turbulence(vec3 p) {
        float sum = 0.0;
        float freq = 1.0;
        float amp = 1.0;
        for(int i = 0; i < 4; i++) {
          sum += abs(snoise(p * freq)) * amp;
          freq *= 2.0;
          amp *= 0.5;
        }
        return sum;
      }

      void main() {
        // View direction for limb darkening
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float viewDot = dot(vNormal, viewDir);

        // REALISTIC LIMB DARKENING - sun is darker at edges
        float limbDarkening = smoothstep(0.0, 1.0, viewDot);
        limbDarkening = pow(limbDarkening, 0.6);

        // Solar granulation - convection cells (realistic 1000-2000km scale)
        float granulation = turbulence(vPosition * 3.0 + time * 0.02) * 0.5 + 0.5;
        granulation = smoothstep(0.3, 0.7, granulation);

        // Large-scale convection patterns (supergranulation)
        float superGranulation = snoise(vPosition * 0.8 + time * 0.01) * 0.5 + 0.5;

        // Sunspots - cooler, darker regions
        float sunspots = turbulence(vPosition * 1.5 + time * 0.005);
        float darkSpots = smoothstep(0.75, 0.85, sunspots);

        // Solar flares and active regions
        float activity = snoise(vPosition * 2.0 + time * 0.03) * 0.5 + 0.5;
        float brightRegions = smoothstep(0.7, 0.9, activity);

        // Combine surface features
        float surfaceDetail = granulation * 0.6 + superGranulation * 0.4;

        // Build realistic solar surface color
        vec3 baseColor = mix(colorGranule, colorPhotosphere, surfaceDetail);

        // Add sunspots (dark, cool regions)
        baseColor = mix(baseColor, colorDark, darkSpots * 0.8);

        // Add bright active regions
        baseColor = mix(baseColor, colorCore, brightRegions * 0.4);

        // Apply limb darkening for 3D realism
        baseColor = mix(baseColor * 0.5, baseColor, limbDarkening);

        // Chromospheric edge glow (visible at limb)
        float edgeGlow = pow(1.0 - viewDot, 3.0);
        baseColor = mix(baseColor, colorChromosphere, edgeGlow * 0.4);

        // Subtle variations in brightness (realistic photosphere)
        float brightness = 0.95 + turbulence(vPosition * 4.0 + time * 0.02) * 0.05;
        baseColor *= brightness;

        gl_FragColor = vec4(baseColor, 1.0);
      }
    `
  };
  
  // Inner core - molten lava core with reduced intensity
  const coreGeometry = new THREE.SphereGeometry(3.5, 64, 64);
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(2.0, 0.8, 0.2),  // Darker molten orange
    toneMapped: false
  });
  const sunCore = new THREE.Mesh(coreGeometry, coreMaterial);
  sunGroup.add(sunCore);

  // Photosphere layer - realistic solar surface
  const surfaceGeometry = new THREE.SphereGeometry(5.0, 256, 256);
  const surfaceMaterial = new THREE.ShaderMaterial({
    uniforms: solarShader.uniforms,
    vertexShader: solarShader.vertexShader,
    fragmentShader: solarShader.fragmentShader
  });
  const sunSurface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
  sunGroup.add(sunSurface);

  // Corona - dark crimson atmosphere with reduced glow
  const coronaGeometry = new THREE.SphereGeometry(6.5, 64, 64);
  const coronaMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      coronaColor: { value: new THREE.Color(0x883300) },        // Dark burnt orange
      chromosphereColor: { value: new THREE.Color(0x661100) }   // Dark red-brown
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
      uniform vec3 coronaColor;
      uniform vec3 chromosphereColor;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.5);

        // Subtle atmospheric activity
        float activity = sin(time * 0.2 + vPosition.x * 2.0) * 0.1 + 0.9;

        // Layer atmospheric colors - chromosphere closer, corona farther
        vec3 atmosphereColor = mix(chromosphereColor, coronaColor, fresnel * 0.6);

        float intensity = fresnel * 0.2 * activity;  // Reduced glow

        gl_FragColor = vec4(atmosphereColor * intensity, intensity * 0.2);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false
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

      // Subtle pulsing - realistic solar breathing
      const pulseScale = 1.0 + Math.sin(time * 0.15) * 0.015 + Math.sin(time * 0.3) * 0.008;
      sunLayers.core.scale.setScalar(pulseScale * 1.02);
      sunLayers.surface.scale.setScalar(pulseScale);
      sunLayers.corona.scale.setScalar(pulseScale * 1.01);

      // Realistic solar rotation (27 days = very slow)
      sunLayers.surface.rotation.y += 0.0003;
      sunLayers.surface.rotation.x += 0.00005;

      // Atmospheric differential rotation
      sunLayers.corona.rotation.y -= 0.00015;
      sunLayers.corona.rotation.z += 0.00008;
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

    // Custom shader material for smooth circular stars
    const material = new THREE.ShaderMaterial({
      uniforms: {
        opacity: { value: layer.opacity * 0.7 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;

        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * 100.0 / -mvPosition.z;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float opacity;
        varying vec3 vColor;

        void main() {
          // Create smooth circular star
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);

          // Smooth edge falloff for anti-aliasing
          float alpha = 1.0 - smoothstep(0.4, 0.5, dist);

          // Add subtle glow
          float glow = exp(-dist * 4.0) * 0.3;

          gl_FragColor = vec4(vColor * (1.0 + glow), alpha * opacity);
        }
      `,
      transparent: true,
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

  // Custom shader material for smooth circular dust particles
  const material = new THREE.ShaderMaterial({
    uniforms: {
      opacity: { value: 0.12 }
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;

      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * 80.0 / -mvPosition.z;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float opacity;
      varying vec3 vColor;

      void main() {
        // Create smooth circular dust particle
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);

        // Very soft edge for dust
        float alpha = 1.0 - smoothstep(0.35, 0.5, dist);

        gl_FragColor = vec4(vColor, alpha * opacity);
      }
    `,
    transparent: true,
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
