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
let bloomPass: UnrealBloomPass;
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

  if (!container || container.clientWidth === 0 || container.clientHeight === 0) {
    console.error('❌ Invalid container for Solar System initialization');
    return () => {};
  }

  try {
    console.log('🌌 Initializing Solar System...');
    isInitialized = true;

    cleanupSolarSystem();
  
  // ============================================================================
  // SCENE
  // ============================================================================
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000814);
  
  // ============================================================================
  // CAMERA
  // ============================================================================
  camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 30, 70);
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

  bloomPass = new UnrealBloomPass(
    new THREE.Vector2(container.clientWidth, container.clientHeight),
    0.8,  // strength - reduced for subtler glow
    0.6,  // radius - tighter bloom
    0.3   // threshold - higher to reduce overall glow
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
  
  const sunLight = new THREE.PointLight(new THREE.Color(1.0, 1.0, 1.0), 10.0, 1000, 0.5);
  sunLight.position.set(0, 0, 0);
  sunLight.castShadow = false;
  scene.add(sunLight);
  
  const fillLight = new THREE.PointLight(new THREE.Color(0.2, 0.4, 1.0), 2.0, 100, 1);
  fillLight.position.set(50, 50, -100);
  scene.add(fillLight);
  
  // ============================================================================
  // STARFIELD - Enhanced with nebula background
  // ============================================================================
  createEnhancedStarfield();
  
  // ============================================================================
  // SUN - Realistic Pulsating Lava
  // ============================================================================
  const sunGroup = new THREE.Group();
  
  // Custom lava shader
  const lavaShader = {
    uniforms: {
      time: { value: 0 },
      colorHot: { value: new THREE.Color(0xFFFFFF) },
      colorMid: { value: new THREE.Color(0xFFD700) },
      colorCool: { value: new THREE.Color(0xFF4500) },
      colorDark: { value: new THREE.Color(0x8B0000) }
    },
    vertexShader: `
      uniform float time;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      // Simple noise function
      float noise(vec3 p) {
        return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
      }
      
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        
        // Displacement for lava turbulence
        vec3 pos = position;
        float displacement = noise(position * 2.0 + time * 0.1) * 0.15;
        displacement += noise(position * 4.0 - time * 0.15) * 0.08;
        pos += normal * displacement;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
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
      
      void main() {
        // Fresnel effect
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);
        
        // Animated noise for lava patterns
        float noiseValue = noise(vPosition * 3.0 + time * 0.1);
        noiseValue += noise(vPosition * 6.0 - time * 0.2) * 0.5;
        noiseValue += noise(vPosition * 12.0 + time * 0.3) * 0.25;
        noiseValue /= 1.75;
        
        // Dark spots (sunspots)
        float spots = step(0.65, noiseValue);
        
        // Color mixing based on noise
        vec3 color;
        if (noiseValue < 0.3) {
          color = mix(colorDark, colorCool, noiseValue / 0.3);
        } else if (noiseValue < 0.6) {
          color = mix(colorCool, colorMid, (noiseValue - 0.3) / 0.3);
        } else {
          color = mix(colorMid, colorHot, (noiseValue - 0.6) / 0.4);
        }
        
        // Add fresnel glow
        color = mix(color, colorHot, fresnel * 0.6);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `
  };
  
  // Core - brightest white-yellow center
  const coreGeometry = new THREE.SphereGeometry(4.5, 64, 64);
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(1.5, 1.5, 1.5),
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
  
  // Chromosphere - red transparent layer
  const chromoGeometry = new THREE.SphereGeometry(5.5, 48, 48);
  const chromoMaterial = new THREE.MeshBasicMaterial({
    color: 0xFF3300,
    transparent: true,
    opacity: 0.4,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending
  });
  const chromosphere = new THREE.Mesh(chromoGeometry, chromoMaterial);
  sunGroup.add(chromosphere);
  
  // Corona 1 - orange glow
  const corona1Geometry = new THREE.SphereGeometry(6.0, 32, 32);
  const corona1Material = new THREE.MeshBasicMaterial({
    color: 0xFF6600,
    transparent: true,
    opacity: 0.3,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending
  });
  const corona1 = new THREE.Mesh(corona1Geometry, corona1Material);
  sunGroup.add(corona1);
  
  // Corona 2 - yellow glow (reduced)
  const corona2Geometry = new THREE.SphereGeometry(6.5, 32, 32);
  const corona2Material = new THREE.MeshBasicMaterial({
    color: 0xFFAA00,
    transparent: true,
    opacity: 0.15,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending
  });
  const corona2 = new THREE.Mesh(corona2Geometry, corona2Material);
  sunGroup.add(corona2);

  // Outer corona removed for cleaner look
  const corona3 = null;
  const lensFlare = null;
  
  scene.add(sunGroup);
  
  // Store references for animation
  sunLayers = {
    core: sunCore,
    surface: sunSurface,
    chromosphere,
    corona1,
    corona2,
    corona3,
    lensFlare,
    material: surfaceMaterial
  };
  
  // ============================================================================
  // ASTEROID BELT
  // ============================================================================
  createAsteroidBelt();
  
  // ============================================================================
  // PLANETS
  // ============================================================================
  PLANETS_DATA.forEach(planetData => {
    // Create planet with better materials
    const geometry = new THREE.SphereGeometry(planetData.radius, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      color: planetData.color,
      roughness: 0.85,
      metalness: 0.15,
      emissive: new THREE.Color(planetData.color).multiplyScalar(0.05),
      emissiveIntensity: 0.1
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
    
    // Animate sun - pulsating lava effect
    if (sunLayers) {
      // Update shader time uniform
      sunLayers.material.uniforms.time.value = time;
      
      // Pulsating scale - breathing effect
      const pulseScale = 1.0 + Math.sin(time * 0.5) * 0.02 + Math.sin(time * 1.2) * 0.01;
      sunLayers.core.scale.setScalar(pulseScale);
      sunLayers.surface.scale.setScalar(pulseScale);
      
      // Multi-speed rotation for lava flow effect
      sunLayers.surface.rotation.y += 0.0008;
      sunLayers.surface.rotation.x += 0.0002;
      sunLayers.chromosphere.rotation.y -= 0.0006;
      
      // Pulsating glow on corona layers
      const glowPulse1 = 0.3 + Math.sin(time * 0.8) * 0.1;
      const glowPulse2 = 0.15 + Math.sin(time * 1.1) * 0.06;

      sunLayers.corona1.material.opacity = glowPulse1;
      sunLayers.corona2.material.opacity = glowPulse2;

      // Slight rotation variation on coronas
      sunLayers.corona1.rotation.y += 0.0003;
      sunLayers.corona2.rotation.y -= 0.0002;
    }

    // Dynamic bloom based on camera distance from sun (reduced intensity)
    const distanceToSun = camera.position.length();
    const maxDistance = 100;
    const minDistance = 10;
    const normalizedDistance = Math.max(0, Math.min(1, (distanceToSun - minDistance) / (maxDistance - minDistance)));

    // Closer to sun = slightly stronger bloom
    bloomPass.strength = 0.6 + (1 - normalizedDistance) * 0.4;
    bloomPass.radius = 0.5 + (1 - normalizedDistance) * 0.2;
    
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

  console.log('✅ Solar System initialized successfully');

  return () => {
    console.log('🔄 Cleanup');
    window.removeEventListener('resize', handleResize);
    cancelAnimationFrame(animationId);
    isInitialized = false;
  };
  } catch (error) {
    console.error('❌ Error initializing Solar System:', error);
    isInitialized = false;
    cleanupSolarSystem();
    return () => {};
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function createEnhancedStarfield() {
  // Outer starfield sphere with texture-like appearance
  const starGeo = new THREE.SphereGeometry(200, 64, 64);
  const starMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(1.2, 1.2, 1.2),
    side: THREE.BackSide,
    toneMapped: false
  });
  const outerStars = new THREE.Mesh(starGeo, starMat);
  scene.add(outerStars);

  // Nebula layer
  const nebulaGeo = new THREE.SphereGeometry(190, 64, 64);
  const nebulaMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.8, 0.9, 1.0),
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.15,
    toneMapped: false
  });
  const nebula = new THREE.Mesh(nebulaGeo, nebulaMat);
  scene.add(nebula);

  // Point stars for twinkling effect
  const starCount = 8000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    const radius = 150 + Math.random() * 100;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    // Variable star sizes for depth
    sizes[i] = Math.random() * 3.5 + 0.8;

    // Color variation
    const colorChoice = Math.random();
    if (colorChoice < 0.6) {
      // Bright white stars
      const brightness = 0.9 + Math.random() * 0.1;
      colors[i3] = brightness;
      colors[i3 + 1] = brightness;
      colors[i3 + 2] = brightness;
    } else if (colorChoice < 0.8) {
      // Blue tint stars
      colors[i3] = 0.7 + Math.random() * 0.2;
      colors[i3 + 1] = 0.8 + Math.random() * 0.2;
      colors[i3 + 2] = 1.0;
    } else {
      // Orange/yellow tint stars
      colors[i3] = 1.0;
      colors[i3 + 1] = 0.8 + Math.random() * 0.2;
      colors[i3 + 2] = 0.6 + Math.random() * 0.2;
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 2.0,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending
  });

  const pointStars = new THREE.Points(geometry, material);
  scene.add(pointStars);
}

function createAsteroidBelt() {
  // Main asteroid belt with varied types
  for (let i = 0; i < 300; i++) {
    const size = 0.015 + Math.random() * 0.08;
    const distance = 19.5 + Math.random() * 6; // Between Mars and Jupiter
    const angle = Math.random() * Math.PI * 2;

    // Different asteroid types
    const asteroidType = Math.random();
    let color: THREE.Color;
    if (asteroidType < 0.5) {
      color = new THREE.Color(0.4, 0.26, 0.13); // C-type (carbonaceous)
    } else if (asteroidType < 0.8) {
      color = new THREE.Color(0.6, 0.6, 0.6); // S-type (silicate)
    } else {
      color = new THREE.Color(0.5, 0.4, 0.3); // M-type (metallic)
    }

    const geometry = new THREE.SphereGeometry(size, 6, 6);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color.clone().multiplyScalar(0.08),
      emissiveIntensity: 0.12,
      roughness: 1.0,
      metalness: asteroidType > 0.8 ? 0.3 : 0.1
    });
    const asteroid = new THREE.Mesh(geometry, material);

    asteroid.position.x = Math.cos(angle) * distance;
    asteroid.position.z = Math.sin(angle) * distance;
    asteroid.position.y = (Math.random() - 0.5) * 1.0;

    asteroid.rotation.x = Math.random() * Math.PI;
    asteroid.rotation.y = Math.random() * Math.PI;
    asteroid.rotation.z = Math.random() * Math.PI;

    scene.add(asteroid);
  }
}

function createOrbitPath(radius: number) {
  // Color-coded orbit rings based on distance with glow
  let orbitColor: THREE.Color;
  let glowIntensity: number;
  let baseOpacity: number;

  if (radius < 20) {
    orbitColor = new THREE.Color(0.3, 0.5, 0.7); // Inner planets - Blue
    glowIntensity = 0.03;
    baseOpacity = 0.15;
  } else if (radius >= 20 && radius < 24) {
    orbitColor = new THREE.Color(0.6, 0.3, 0.15); // Asteroid region - Brown
    glowIntensity = 0.06;
    baseOpacity = 0.12;
  } else if (radius >= 24 && radius < 45) {
    orbitColor = new THREE.Color(0.5, 0.4, 0.7); // Outer planets - Purple
    glowIntensity = 0.05;
    baseOpacity = 0.18;
  } else {
    orbitColor = new THREE.Color(0.8, 0.6, 0.0); // Dwarf planets - Gold
    glowIntensity = 0.08;
    baseOpacity = 0.22;
  }

  // Use ring geometry for better visibility
  const ringGeo = new THREE.RingGeometry(
    radius - 0.08,
    radius + 0.08,
    256
  );

  const ringMat = new THREE.MeshBasicMaterial({
    color: orbitColor,
    emissive: orbitColor,
    emissiveIntensity: glowIntensity,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: baseOpacity,
    toneMapped: false
  });

  const orbit = new THREE.Mesh(ringGeo, ringMat);
  orbit.rotation.x = Math.PI / 2;
  orbit.position.y = -0.01;
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
