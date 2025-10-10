import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { Lensflare, LensflareElement } from "three/examples/jsm/objects/Lensflare.js";

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let composer: EffectComposer;
let animationId: number;

const planets: Array<{
  mesh: THREE.Mesh;
  speed: number;
  dist: number;
  angle: number;
}> = [];

const asteroidBelts: THREE.InstancedMesh[] = [];

// Create procedural lens flare texture
function createLensFlareTexture(size: number, color: THREE.Color) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, 1)`);
  gradient.addColorStop(0.5, `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, 0.5)`);
  gradient.addColorStop(1, `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, 0)`);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function initSolarSystem(container: HTMLElement) {
  // Scene Setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000814);
  scene.fog = new THREE.Fog(0x000814, 500, 800); // Push fog much further out
  
  console.log('✅ Solar System: Scene created');

  // Camera - Start zoomed in near the sun
  camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 15, 40);
  camera.lookAt(0, 0, 0); // Ensure camera is looking at sun
  
  console.log('✅ Camera positioned at:', camera.position);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.3;
  controls.zoomSpeed = 0.8;
  controls.panSpeed = 0.5;
  controls.minDistance = 10;
  controls.maxDistance = 300;

  // Lighting - Increase ambient light significantly
  const ambientLight = new THREE.AmbientLight(new THREE.Color(0.13, 0.13, 0.13), 1.5);
  scene.add(ambientLight);
  
  console.log('✅ Lighting added');

  const pointLight = new THREE.PointLight(new THREE.Color(1.0, 1.0, 1.0), 10.0, 1000, 0.5);
  pointLight.position.set(0, 0, 0);
  pointLight.castShadow = false;
  scene.add(pointLight);

  const fillLight = new THREE.PointLight(new THREE.Color(0.2, 0.4, 1.0), 2.0, 100, 1);
  fillLight.position.set(50, 50, -100);
  scene.add(fillLight);

  // Procedural starfield background
  const starsGeometry = new THREE.BufferGeometry();
  const starCount = 10000;
  const starPositions = new Float32Array(starCount * 3);
  
  for (let i = 0; i < starCount * 3; i += 3) {
    const radius = 100 + Math.random() * 100; // Much closer: 100-200 instead of 400-600
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starPositions[i + 2] = radius * Math.cos(phi);
  }
  
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.2, // Make stars bigger
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true
  });
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);
  
  console.log('✅ Starfield added with', starCount, 'stars');

  // Sun with emissive material - Make it MUCH brighter
  const sunMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1.5, 1.3, 1.0),
    emissive: new THREE.Color(2.0, 1.5, 0.9),
    emissiveIntensity: 3.0, // Increased from 1.8 to 3.0
    toneMapped: true, // Changed from false to true
  });
  const sun = new THREE.Mesh(new THREE.SphereGeometry(8, 64, 64), sunMaterial); // Larger: 8 instead of 5
  scene.add(sun);
  
  console.log('✅ Sun created with radius 8');

  // Procedural lens flare
  const lensflare = new Lensflare();
  const flareColor1 = new THREE.Color(1, 0.9, 0.8);
  const flareColor2 = new THREE.Color(1, 1, 0.6);
  const flareColor3 = new THREE.Color(0.8, 0.8, 1);
  
  lensflare.addElement(new LensflareElement(createLensFlareTexture(512, flareColor1), 512, 0, flareColor1));
  lensflare.addElement(new LensflareElement(createLensFlareTexture(128, flareColor2), 128, 0.2, flareColor2));
  lensflare.addElement(new LensflareElement(createLensFlareTexture(64, flareColor3), 64, 0.4, flareColor3));
  lensflare.addElement(new LensflareElement(createLensFlareTexture(32, flareColor1), 32, 0.6, flareColor1));
  sun.add(lensflare);

  // Create planets and asteroid belts
  createPlanets();
  createAsteroidBelts();

  // Post-processing
  composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(container.clientWidth, container.clientHeight),
    2.0, // strength - increased from 1.5
    0.6, // radius - increased from 0.4
    0.3 // threshold - lowered from 0.85 to 0.3 so more objects bloom
  );
  composer.addPass(bloomPass);
  
  console.log('✅ Bloom pass configured with lower threshold');

  const outputPass = new OutputPass();
  composer.addPass(outputPass);

  // Animation loop
  let frameCount = 0;
  function animate() {
    animationId = requestAnimationFrame(animate);
    
    // Debug log every 60 frames (once per second at 60fps)
    if (frameCount === 0) {
      console.log('🎬 Animation running, planets:', planets.length, 'asteroids:', asteroidBelts.length);
    }
    frameCount = (frameCount + 1) % 60;
    
    // Rotate sun
    sun.rotation.y += 0.001;

    // Animate planets orbiting
    planets.forEach(planet => {
      planet.angle += planet.speed;
      planet.mesh.position.x = Math.cos(planet.angle) * planet.dist;
      planet.mesh.position.z = Math.sin(planet.angle) * planet.dist;
      planet.mesh.rotation.y += 0.005;
    });

    // Rotate asteroid belts slowly
    asteroidBelts.forEach(belt => {
      belt.rotation.y += 0.0005;
    });

    // Update controls
    controls.update();

    // Render
    composer.render();
  }
  animate();

  // Handle resize
  const handleResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    composer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener("resize", handleResize);

  // Return cleanup function
  return () => {
    window.removeEventListener("resize", handleResize);
    cancelAnimationFrame(animationId);
  };
}

function createPlanets() {
  const planetData = [
    { name: "Mercury", size: 0.5, dist: 8, speed: 0.0041, color: 0x8c7853 },
    { name: "Venus", size: 0.9, dist: 11, speed: 0.0016, color: 0xffc649 },
    { name: "Earth", size: 1, dist: 15, speed: 0.001, color: 0x2f6a69 },
    { name: "Mars", size: 0.8, dist: 19, speed: 0.00053, color: 0xad6242 },
    { name: "Jupiter", size: 2, dist: 25, speed: 0.000084, color: 0xc88b3a },
    { name: "Saturn", size: 1.7, dist: 31, speed: 0.000034, color: 0xfad5a5 },
    { name: "Uranus", size: 1.2, dist: 37, speed: 0.000012, color: 0x4fd0e0 },
    { name: "Neptune", size: 1.2, dist: 43, speed: 0.000006, color: 0x4166f5 },
  ];

  planetData.forEach((data) => {
    const geometry = new THREE.SphereGeometry(data.size, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: data.color,
      roughness: 0.7,
      metalness: 0.2,
      emissive: data.color,
      emissiveIntensity: 0.1,
    });
    const planet = new THREE.Mesh(geometry, material);
    planet.castShadow = true;
    planet.receiveShadow = true;
    
    const angle = Math.random() * Math.PI * 2;
    planet.position.x = Math.cos(angle) * data.dist;
    planet.position.z = Math.sin(angle) * data.dist;
    
    scene.add(planet);
    planets.push({
      mesh: planet,
      speed: data.speed,
      dist: data.dist,
      angle: angle,
    });
    
    console.log(`✅ ${data.name} created at distance ${data.dist}`);

    // Add orbital path ring
    const ringGeometry = new THREE.RingGeometry(data.dist - 0.05, data.dist + 0.05, 128);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x444444,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);
  });
}

function createAsteroidBelts() {
  // Main asteroid belt (between Mars and Jupiter)
  createAsteroidBelt(22, 24, 2000, 0x666666);
  
  // Kuiper belt (beyond Neptune)
  createAsteroidBelt(50, 65, 3000, 0x888888);
}

function createAsteroidBelt(innerRadius: number, outerRadius: number, count: number, color: number) {
  const geometry = new THREE.DodecahedronGeometry(0.1, 0);
  const material = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.9,
    metalness: 0.1,
  });
  
  const asteroidBelt = new THREE.InstancedMesh(geometry, material, count);
  const dummy = new THREE.Object3D();
  
  for (let i = 0; i < count; i++) {
    const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * 0.3;
    
    dummy.position.x = radius * Math.cos(theta);
    dummy.position.y = Math.sin(phi) * 2;
    dummy.position.z = radius * Math.sin(theta);
    
    dummy.rotation.x = Math.random() * Math.PI * 2;
    dummy.rotation.y = Math.random() * Math.PI * 2;
    dummy.rotation.z = Math.random() * Math.PI * 2;
    
    const scale = 0.5 + Math.random() * 1.5;
    dummy.scale.set(scale, scale, scale);
    
    dummy.updateMatrix();
    asteroidBelt.setMatrixAt(i, dummy.matrix);
  }
  
  asteroidBelt.castShadow = true;
  asteroidBelt.receiveShadow = true;
  scene.add(asteroidBelt);
  asteroidBelts.push(asteroidBelt);
}

export function cleanupSolarSystem() {
  if (renderer) {
    renderer.dispose();
  }
  if (composer) {
    composer.dispose();
  }
}
