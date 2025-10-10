import * as THREE from 'three';

// ============================================================================
// SIMPLIFIED SOLAR SYSTEM - Clean rebuild with minimal complexity
// ============================================================================

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let animationId: number;
let isInitialized = false;

interface CelestialBody {
  mesh: THREE.Mesh;
  orbitRadius: number;
  orbitSpeed: number;
  angle: number;
  rotationSpeed: number;
}

const planets: CelestialBody[] = [];

// Simplified planet data - just the essentials
const PLANET_DATA = [
  { name: "Mercury", size: 0.6, distance: 12, speed: 0.04, rotation: 0.02, color: 0x8C7853 },
  { name: "Venus", size: 1.2, distance: 18, speed: 0.016, rotation: 0.004, color: 0xFFC649 },
  { name: "Earth", size: 1.3, distance: 25, speed: 0.01, rotation: 0.01, color: 0x4169E1 },
  { name: "Mars", size: 0.9, distance: 32, speed: 0.0053, rotation: 0.01, color: 0xCD5C5C },
  { name: "Jupiter", size: 3.5, distance: 52, speed: 0.00084, rotation: 0.04, color: 0xDAA520 },
  { name: "Saturn", size: 3.0, distance: 70, speed: 0.00034, rotation: 0.038, color: 0xF4A460 },
  { name: "Uranus", size: 2.0, distance: 85, speed: 0.00012, rotation: 0.03, color: 0x4FD0E0 },
  { name: "Neptune", size: 1.9, distance: 100, speed: 0.00006, rotation: 0.032, color: 0x4169E1 },
];

export function initSolarSystem(container: HTMLElement) {
  // Prevent double initialization
  if (isInitialized) {
    console.warn('⚠️ Solar System already initialized, skipping...');
    return () => {};
  }
  
  console.log('🌌 Initializing Simplified Solar System...');
  isInitialized = true;
  
  // Clean up any existing instance
  cleanupSolarSystem();
  
  // ============================================================================
  // SCENE SETUP
  // ============================================================================
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000814); // Deep space blue
  console.log('🎬 Scene created with background:', scene.background);
  
  // ============================================================================
  // CAMERA SETUP
  // ============================================================================
  camera = new THREE.PerspectiveCamera(
    50, // FOV
    container.clientWidth / container.clientHeight,
    0.1,
    500
  );
  camera.position.set(0, 40, 80);
  camera.lookAt(0, 0, 0);
  console.log('📷 Camera positioned at:', camera.position);
  
  // ============================================================================
  // RENDERER SETUP
  // ============================================================================
  renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: false // Solid background - no transparency
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  console.log('🎨 Renderer created and appended to DOM');
  
  // ============================================================================
  // LIGHTING
  // ============================================================================
  const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
  scene.add(ambientLight);
  
  const sunLight = new THREE.PointLight(0xFFFFFF, 2, 300);
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight);
  console.log('💡 Lighting added');
  
  // ============================================================================
  // STARFIELD BACKGROUND
  // ============================================================================
  createStarfield();
  
  // ============================================================================
  // SUN
  // ============================================================================
  const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
  const sunMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xFDB813
  });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  scene.add(sun);
  console.log('☀️ Sun created');
  
  // ============================================================================
  // PLANETS
  // ============================================================================
  PLANET_DATA.forEach(data => {
    // Create planet mesh
    const geometry = new THREE.SphereGeometry(data.size, 24, 24);
    const material = new THREE.MeshStandardMaterial({
      color: data.color,
      roughness: 0.7,
      metalness: 0.3
    });
    const planet = new THREE.Mesh(geometry, material);
    
    // Set initial position
    const initialAngle = Math.random() * Math.PI * 2;
    planet.position.x = Math.cos(initialAngle) * data.distance;
    planet.position.z = Math.sin(initialAngle) * data.distance;
    scene.add(planet);
    
    // Store planet data
    planets.push({
      mesh: planet,
      orbitRadius: data.distance,
      orbitSpeed: data.speed,
      angle: initialAngle,
      rotationSpeed: data.rotation
    });
    
    // Create orbit path
    createOrbitPath(data.distance);
    
    console.log(`🪐 Created ${data.name} at distance ${data.distance}`);
  });
  
  // ============================================================================
  // ANIMATION LOOP
  // ============================================================================
  let frameCount = 0;
  let lastLog = Date.now();
  
  function animate() {
    animationId = requestAnimationFrame(animate);
    
    // Log FPS every 2 seconds
    frameCount++;
    if (Date.now() - lastLog > 2000) {
      console.log(`🎬 FPS: ${Math.round(frameCount / 2)} | Planets: ${planets.length}`);
      frameCount = 0;
      lastLog = Date.now();
    }
    
    // Rotate sun
    sun.rotation.y += 0.001;
    
    // Update planets
    planets.forEach(planet => {
      // Orbit
      planet.angle += planet.orbitSpeed;
      planet.mesh.position.x = Math.cos(planet.angle) * planet.orbitRadius;
      planet.mesh.position.z = Math.sin(planet.angle) * planet.orbitRadius;
      
      // Rotation
      planet.mesh.rotation.y += planet.rotationSpeed;
    });
    
    // Render
    renderer.render(scene, camera);
  }
  
  animate();
  
  // ============================================================================
  // WINDOW RESIZE HANDLER
  // ============================================================================
  const handleResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  
  window.addEventListener('resize', handleResize);
  
  // ============================================================================
  // CLEANUP FUNCTION
  // ============================================================================
  return () => {
    console.log('🔄 Cleanup called');
    window.removeEventListener('resize', handleResize);
    cancelAnimationFrame(animationId);
    isInitialized = false;
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function createStarfield() {
  const starCount = 2000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(starCount * 3);
  
  for (let i = 0; i < starCount * 3; i += 3) {
    // Random spherical distribution
    const radius = 200 + Math.random() * 100;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i + 2] = radius * Math.cos(phi);
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const material = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 0.5,
    transparent: true,
    opacity: 0.8
  });
  
  const stars = new THREE.Points(geometry, material);
  scene.add(stars);
  console.log('⭐ Starfield created with', starCount, 'stars');
}

function createOrbitPath(radius: number) {
  const geometry = new THREE.RingGeometry(radius - 0.1, radius + 0.1, 128);
  const material = new THREE.MeshBasicMaterial({
    color: 0x444444,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.2
  });
  const ring = new THREE.Mesh(geometry, material);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);
}

export function cleanupSolarSystem() {
  if (!scene) return;
  
  console.log('🧹 Cleaning up Solar System...');
  
  // Stop animation
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  // Clear planets array
  planets.length = 0;
  
  // Dispose scene objects
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.geometry?.dispose();
      if (object.material instanceof THREE.Material) {
        object.material.dispose();
      }
    }
  });
  
  // Clear scene
  while(scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
  
  // Dispose renderer
  if (renderer) {
    renderer.dispose();
  }
  
  isInitialized = false;
  console.log('✅ Cleanup complete');
}
