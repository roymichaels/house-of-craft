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
  // Minimal fog for maximum planet visibility
  scene.fog = new THREE.FogExp2(0x1a1a2a, 0.0005);
  
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
  renderer.toneMappingExposure = 1.3;  // Increased exposure for brighter planets
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);
  
  // ============================================================================
  // POST-PROCESSING
  // ============================================================================
  composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  // REDUCED BLOOM - minimal sun glow, emphasize planets
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(container.clientWidth, container.clientHeight),
    0.3,  // strength - reduced for less sun glow
    0.3,   // radius - very tight containment
    0.85   // threshold - only the very brightest sun areas glow
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
  // LIGHTING - Enhanced for 3D volumetric sun and planet visibility
  // ============================================================================
  // STRONG ambient for highly visible planets
  const ambientLight = new THREE.AmbientLight(0x6a6a8a, 1.2);
  scene.add(ambientLight);

  // Reduced sun light - less dominance
  const sunLight = new THREE.PointLight(0xFF8833, 5.0, 800, 2);
  sunLight.position.set(0, 0, 0);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 500;
  scene.add(sunLight);

  // Strong rim light for planet visibility and depth
  const rimLight = new THREE.DirectionalLight(0x9aaacc, 2.0);
  rimLight.position.set(-100, 50, -100);
  scene.add(rimLight);

  // Powerful fill lights for illuminating planets
  const fillLight = new THREE.PointLight(0x8a8aaa, 4.0, 500, 2);
  fillLight.position.set(80, 40, -80);
  scene.add(fillLight);

  // Additional strong fill lights from multiple angles
  const fillLight2 = new THREE.PointLight(0x7a7a9a, 3.6, 450, 2);
  fillLight2.position.set(-80, 40, 80);
  scene.add(fillLight2);

  const topLight = new THREE.PointLight(0x8a9aaa, 2.4, 400, 2);
  topLight.position.set(0, 100, 0);
  scene.add(topLight);

  // Additional directional lights for planet illumination
  const sideLight1 = new THREE.DirectionalLight(0x7a8aaa, 1.5);
  sideLight1.position.set(100, 0, 0);
  scene.add(sideLight1);

  const sideLight2 = new THREE.DirectionalLight(0x7a8aaa, 1.5);
  sideLight2.position.set(-100, 0, 0);
  scene.add(sideLight2);
  
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
  
  // REALISTIC PHOTOGRAPHIC SUN SHADER - Like a volcanic fiery sphere
  const solarShader = {
    uniforms: {
      time: { value: 0 },
      // REALISTIC VOLCANIC SUN COLORS - deep oranges and reds with bright cores
      colorCore: { value: new THREE.Color(0xFFFFEE) },        // Bright white-yellow hotspots
      colorHot: { value: new THREE.Color(0xFFCC55) },         // Bright yellow-orange
      colorMid: { value: new THREE.Color(0xFF8833) },         // Orange
      colorCool: { value: new THREE.Color(0xFF5522) },        // Red-orange
      colorDark: { value: new THREE.Color(0xDD3311) },        // Dark red
      colorEdge: { value: new THREE.Color(0xCC2200) }         // Deep red edges
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
        // View direction for realistic 3D lighting
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float viewDot = max(dot(vNormal, viewDir), 0.0);

        // STRONG LIMB DARKENING - creates realistic sphere with dark edges
        float limbDarkening = pow(viewDot, 1.5);

        // Fine surface texture - volcanic/boiling appearance
        float texture1 = turbulence(vPosition * 4.0 + time * 0.05);
        float texture2 = turbulence(vPosition * 8.0 - time * 0.08);
        float texture3 = snoise(vPosition * 12.0 + time * 0.1) * 0.5 + 0.5;

        // Combine textures for complex surface
        float surfaceNoise = (texture1 * 0.5 + texture2 * 0.3 + texture3 * 0.2);

        // Create hot spots and cool regions
        float hotSpots = smoothstep(0.6, 0.9, surfaceNoise);
        float coolRegions = smoothstep(0.3, 0.6, surfaceNoise);

        // Build color from dark to bright based on surface features
        vec3 baseColor = colorDark;
        baseColor = mix(baseColor, colorCool, coolRegions);
        baseColor = mix(baseColor, colorMid, smoothstep(0.4, 0.7, surfaceNoise));
        baseColor = mix(baseColor, colorHot, hotSpots);
        baseColor = mix(baseColor, colorCore, pow(hotSpots, 2.0) * 0.6);

        // Apply STRONG limb darkening - edges become very dark
        baseColor = mix(colorEdge * 0.3, baseColor, limbDarkening);

        // Subtle edge glow
        float edgeGlow = pow(1.0 - viewDot, 4.0);
        baseColor += colorMid * edgeGlow * 0.15;

        // Overall intensity - keep it volcanic/realistic
        baseColor *= 2.5;

        gl_FragColor = vec4(baseColor, 1.0);
      }
    `
  };
  
  // REALISTIC VOLCANIC SUN CONSTRUCTION

  // Inner core - reduced brightness
  const innerCoreGeometry = new THREE.SphereGeometry(2.1, 128, 128);
  const innerCoreMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(1.5, 0.8, 0.2),  // Reduced orange core brightness
    toneMapped: false
  });
  const innerCore = new THREE.Mesh(innerCoreGeometry, innerCoreMaterial);
  sunGroup.add(innerCore);

  // Main photosphere - realistic textured surface with reduced size
  const surfaceGeometry = new THREE.SphereGeometry(3.5, 256, 256);
  const surfaceMaterial = new THREE.ShaderMaterial({
    uniforms: solarShader.uniforms,
    vertexShader: solarShader.vertexShader,
    fragmentShader: solarShader.fragmentShader
  });
  const sunSurface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
  sunGroup.add(sunSurface);

  // Minimal atmospheric glow layer
  const atmosphereGeometry = new THREE.SphereGeometry(4.5, 96, 96);
  const atmosphereMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      glowColor: { value: new THREE.Color(0xFF5522) }
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
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.5);

        float intensity = fresnel * 0.1;

        gl_FragColor = vec4(glowColor * 0.4, intensity * 0.15);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false
  });
  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  sunGroup.add(atmosphere);

  scene.add(sunGroup);

  // Store references for animation
  sunLayers = {
    innerCore: innerCore,
    surface: sunSurface,
    material: surfaceMaterial,
    atmosphere: atmosphere,
    atmosphereMaterial: atmosphereMaterial
  };
  
  // ============================================================================
  // ASTEROID BELT
  // ============================================================================
  createAsteroidBelt();

  // ============================================================================
  // PLANET MATERIAL CREATOR - Realistic Procedural Textures
  // ============================================================================
  function createPlanetMaterial(planetData: any) {
    const baseColor = new THREE.Color(planetData.color);

    // Create procedural shader based on planet type
    if (planetData.name === 'Mercury') {
      // Rocky, cratered surface
      return new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          baseColor: { value: new THREE.Color(0x8C7853) },
          craterColor: { value: new THREE.Color(0x5a4a3a) }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 baseColor;
          uniform vec3 craterColor;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;

          float hash(vec3 p) {
            return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
          }

          float noise(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
                  mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
              mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                  mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
          }

          void main() {
            // Cratered rocky surface
            float craters = noise(vPosition * 15.0) * noise(vPosition * 8.0);
            float surface = noise(vPosition * 25.0) * 0.3;

            vec3 color = mix(baseColor, craterColor, craters * 0.7);
            color += surface * 0.2;

            // Lighting
            vec3 lightDir = normalize(vec3(1.0, 0.5, 1.0));
            float diff = max(dot(vNormal, lightDir), 0.0);
            color *= (0.6 + diff * 0.8);

            gl_FragColor = vec4(color, 1.0);
          }
        `,
        toneMapped: false
      });
    } else if (planetData.name === 'Venus') {
      // Thick cloudy atmosphere
      return new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          cloudColor1: { value: new THREE.Color(0xFFC649) },
          cloudColor2: { value: new THREE.Color(0xE8B030) }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 cloudColor1;
          uniform vec3 cloudColor2;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;

          float hash(vec3 p) {
            return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
          }

          float noise(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
                  mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
              mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                  mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
          }

          void main() {
            // Swirling cloud patterns
            vec3 pos = vPosition + vec3(time * 0.02, time * 0.01, 0.0);
            float clouds1 = noise(pos * 6.0);
            float clouds2 = noise(pos * 12.0);
            float pattern = (clouds1 + clouds2 * 0.5) / 1.5;

            vec3 color = mix(cloudColor2, cloudColor1, pattern);

            // Atmospheric glow
            vec3 lightDir = normalize(vec3(1.0, 0.3, 1.0));
            float diff = max(dot(vNormal, lightDir), 0.0);
            color *= (0.7 + diff * 0.6);

            gl_FragColor = vec4(color, 1.0);
          }
        `,
        toneMapped: false
      });
    } else if (planetData.name === 'Earth') {
      // Oceans, continents, clouds
      return new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          oceanColor: { value: new THREE.Color(0x1a4d7a) },
          landColor: { value: new THREE.Color(0x2a6a3a) },
          cloudColor: { value: new THREE.Color(0xffffff) }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 oceanColor;
          uniform vec3 landColor;
          uniform vec3 cloudColor;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;

          float hash(vec3 p) {
            return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
          }

          float noise(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
                  mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
              mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                  mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
          }

          void main() {
            // Continents vs oceans
            float land = noise(vPosition * 4.0);
            float detail = noise(vPosition * 12.0) * 0.3;
            float landMask = step(0.45, land + detail);

            vec3 surface = mix(oceanColor, landColor, landMask);

            // Moving clouds
            vec3 cloudPos = vPosition + vec3(time * 0.03, 0.0, 0.0);
            float clouds = noise(cloudPos * 8.0) * noise(cloudPos * 16.0);
            float cloudMask = smoothstep(0.5, 0.7, clouds);

            vec3 color = mix(surface, cloudColor, cloudMask * 0.7);

            // Lighting
            vec3 lightDir = normalize(vec3(1.0, 0.3, 1.0));
            float diff = max(dot(vNormal, lightDir), 0.0);

            // Ocean specular
            vec3 viewDir = normalize(cameraPosition - vPosition);
            vec3 reflectDir = reflect(-lightDir, vNormal);
            float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0) * (1.0 - landMask);

            color *= (0.5 + diff * 0.8);
            color += vec3(1.0, 1.0, 1.0) * spec * 0.5;

            gl_FragColor = vec4(color, 1.0);
          }
        `,
        toneMapped: false
      });
    } else if (planetData.name === 'Mars') {
      // Rusty red rocky surface
      return new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          baseColor: { value: new THREE.Color(0xC1440E) },
          darkColor: { value: new THREE.Color(0x8a2f0a) },
          lightColor: { value: new THREE.Color(0xE55a20) }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 baseColor;
          uniform vec3 darkColor;
          uniform vec3 lightColor;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;

          float hash(vec3 p) {
            return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
          }

          float noise(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
                  mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
              mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                  mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
          }

          void main() {
            // Rocky rust-colored surface
            float surface1 = noise(vPosition * 8.0);
            float surface2 = noise(vPosition * 16.0);
            float pattern = surface1 * 0.7 + surface2 * 0.3;

            vec3 color = mix(darkColor, baseColor, pattern);
            color = mix(color, lightColor, pow(pattern, 2.0) * 0.3);

            // Polar ice caps
            float pole = abs(vPosition.y);
            if (pole > 0.9) {
              color = mix(color, vec3(1.0, 0.95, 0.9), (pole - 0.9) * 5.0);
            }

            // Lighting
            vec3 lightDir = normalize(vec3(1.0, 0.3, 1.0));
            float diff = max(dot(vNormal, lightDir), 0.0);
            color *= (0.6 + diff * 0.7);

            gl_FragColor = vec4(color, 1.0);
          }
        `,
        toneMapped: false
      });
    } else if (planetData.name === 'Jupiter') {
      // Gas giant with bands
      return new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          bandColor1: { value: new THREE.Color(0xE8C060) },
          bandColor2: { value: new THREE.Color(0xC88B3A) },
          bandColor3: { value: new THREE.Color(0xA06828) },
          redSpot: { value: new THREE.Color(0xD84A38) }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 bandColor1;
          uniform vec3 bandColor2;
          uniform vec3 bandColor3;
          uniform vec3 redSpot;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;

          float hash(vec3 p) {
            return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
          }

          float noise(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
                  mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
              mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                  mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
          }

          void main() {
            // Horizontal bands with turbulence
            vec3 pos = vPosition + vec3(time * 0.01, 0.0, 0.0);
            float bands = sin(vPosition.y * 18.0 + noise(pos * 6.0) * 2.0) * 0.5 + 0.5;
            float turbulence = noise(pos * 10.0) * 0.3;

            vec3 color = mix(bandColor2, bandColor1, bands);
            color = mix(color, bandColor3, turbulence);

            // Great Red Spot
            vec2 spotCenter = vec2(0.3, -0.2);
            float dist = length(vPosition.xz - spotCenter);
            if (dist < 0.25) {
              float spotMix = smoothstep(0.25, 0.15, dist);
              color = mix(color, redSpot, spotMix * 0.8);
            }

            // Lighting
            vec3 lightDir = normalize(vec3(1.0, 0.2, 1.0));
            float diff = max(dot(vNormal, lightDir), 0.0);
            color *= (0.7 + diff * 0.6);

            gl_FragColor = vec4(color, 1.0);
          }
        `,
        toneMapped: false
      });
    } else if (planetData.name === 'Saturn') {
      // Similar to Jupiter but lighter
      return new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          bandColor1: { value: new THREE.Color(0xFFE4B5) },
          bandColor2: { value: new THREE.Color(0xFAD5A5) },
          bandColor3: { value: new THREE.Color(0xE8C090) }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 bandColor1;
          uniform vec3 bandColor2;
          uniform vec3 bandColor3;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;

          float hash(vec3 p) {
            return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
          }

          float noise(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
                  mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
              mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                  mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
          }

          void main() {
            vec3 pos = vPosition + vec3(time * 0.008, 0.0, 0.0);
            float bands = sin(vPosition.y * 22.0 + noise(pos * 5.0) * 1.5) * 0.5 + 0.5;
            float detail = noise(pos * 12.0) * 0.2;

            vec3 color = mix(bandColor2, bandColor1, bands);
            color = mix(color, bandColor3, detail);

            // Lighting
            vec3 lightDir = normalize(vec3(1.0, 0.2, 1.0));
            float diff = max(dot(vNormal, lightDir), 0.0);
            color *= (0.75 + diff * 0.5);

            gl_FragColor = vec4(color, 1.0);
          }
        `,
        toneMapped: false
      });
    } else if (planetData.name === 'Uranus') {
      // Cyan/blue-green ice giant
      return new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          baseColor: { value: new THREE.Color(0x4FD0E7) },
          darkColor: { value: new THREE.Color(0x2a95b0) }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 baseColor;
          uniform vec3 darkColor;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;

          float hash(vec3 p) {
            return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
          }

          float noise(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
                  mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
              mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                  mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
          }

          void main() {
            // Smooth cyan atmosphere with subtle variations
            vec3 pos = vPosition + vec3(0.0, time * 0.005, 0.0);
            float pattern = noise(pos * 4.0) * 0.3 + noise(pos * 8.0) * 0.2;

            vec3 color = mix(darkColor, baseColor, 0.7 + pattern);

            // Lighting
            vec3 lightDir = normalize(vec3(1.0, 0.3, 1.0));
            float diff = max(dot(vNormal, lightDir), 0.0);
            color *= (0.7 + diff * 0.5);

            gl_FragColor = vec4(color, 1.0);
          }
        `,
        toneMapped: false
      });
    } else if (planetData.name === 'Neptune') {
      // Deep blue ice giant
      return new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          baseColor: { value: new THREE.Color(0x4169E1) },
          darkColor: { value: new THREE.Color(0x2545a0) },
          stormColor: { value: new THREE.Color(0x5a8aff) }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 baseColor;
          uniform vec3 darkColor;
          uniform vec3 stormColor;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;

          float hash(vec3 p) {
            return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
          }

          float noise(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
                  mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
              mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                  mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
          }

          void main() {
            // Deep blue with storm systems
            vec3 pos = vPosition + vec3(time * 0.012, time * 0.005, 0.0);
            float bands = sin(vPosition.y * 14.0 + noise(pos * 5.0)) * 0.5 + 0.5;
            float storms = noise(pos * 8.0);

            vec3 color = mix(darkColor, baseColor, bands * 0.6 + 0.4);
            color = mix(color, stormColor, pow(storms, 3.0) * 0.5);

            // Lighting
            vec3 lightDir = normalize(vec3(1.0, 0.3, 1.0));
            float diff = max(dot(vNormal, lightDir), 0.0);
            color *= (0.7 + diff * 0.5);

            gl_FragColor = vec4(color, 1.0);
          }
        `,
        toneMapped: false
      });
    } else {
      // Dwarf planets and others - simple rocky texture
      return new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          baseColor: { value: baseColor },
          darkColor: { value: new THREE.Color(baseColor.r * 0.5, baseColor.g * 0.5, baseColor.b * 0.5) }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 baseColor;
          uniform vec3 darkColor;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;

          float hash(vec3 p) {
            return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
          }

          float noise(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
                  mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
              mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                  mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
          }

          void main() {
            float pattern = noise(vPosition * 12.0);
            vec3 color = mix(darkColor, baseColor, pattern);

            // Lighting
            vec3 lightDir = normalize(vec3(1.0, 0.3, 1.0));
            float diff = max(dot(vNormal, lightDir), 0.0);
            color *= (0.6 + diff * 0.7);

            gl_FragColor = vec4(color, 1.0);
          }
        `,
        toneMapped: false
      });
    }
  }

  // ============================================================================
  // PLANETS
  // ============================================================================
  PLANETS_DATA.forEach(planetData => {
    // Create planet with enhanced PBR materials
    const geometry = new THREE.SphereGeometry(planetData.radius, 64, 64);

    // Create realistic procedural planet material with shader
    const planetMaterial = createPlanetMaterial(planetData);
    const planet = new THREE.Mesh(geometry, planetMaterial);
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
        color: 0xFFE4B5,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        roughness: 0.5,
        emissive: new THREE.Color(0xFFE4B5),
        emissiveIntensity: 0.5,
        toneMapped: false
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
        roughness: 0.6,
        metalness: 0.1,
        emissive: new THREE.Color(planetData.moon.color),
        emissiveIntensity: 0.4,
        envMapIntensity: 0.8,
        toneMapped: false
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
    
    // Animate sun - realistic volcanic sphere
    if (sunLayers) {
      // Update shader time uniforms
      sunLayers.material.uniforms.time.value = time;
      sunLayers.atmosphereMaterial.uniforms.time.value = time;

      // Subtle pulsing for realistic breathing
      const pulseScale = 1.0 + Math.sin(time * 0.2) * 0.015;

      sunLayers.innerCore.scale.setScalar(pulseScale * 1.01);
      sunLayers.surface.scale.setScalar(pulseScale);
      sunLayers.atmosphere.scale.setScalar(pulseScale * 1.01);

      // Realistic solar rotation
      sunLayers.innerCore.rotation.y += 0.0005;
      sunLayers.surface.rotation.y += 0.0004;
      sunLayers.surface.rotation.x += 0.00008;

      // Atmospheric rotation
      sunLayers.atmosphere.rotation.y -= 0.0003;
      sunLayers.atmosphere.rotation.z += 0.0001;
    }
    
    // Update planets - slow, contemplative orbital motion
    celestialBodies.forEach(body => {
      // Update shader time uniform for animated textures
      if (body.mesh.material && (body.mesh.material as any).uniforms?.time) {
        (body.mesh.material as any).uniforms.time.value = time;
      }

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
      opacity: { value: 0.05 }
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
