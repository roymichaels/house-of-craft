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

export function initSolarSystem(container: HTMLElement) {
  // Scene Setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000814);
  scene.fog = new THREE.Fog(0x000814, 180, 250);

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 20, 80);

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

  // Lighting
  const ambientLight = new THREE.AmbientLight(new THREE.Color(0.13, 0.13, 0.13), 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(new THREE.Color(1.0, 1.0, 1.0), 10.0, 1000, 0.5);
  pointLight.position.set(0, 0, 0);
  pointLight.castShadow = false;
  scene.add(pointLight);

  const fillLight = new THREE.PointLight(new THREE.Color(0.2, 0.4, 1.0), 2.0, 100, 1);
  fillLight.position.set(50, 50, -100);
  scene.add(fillLight);

  // Starfield background
  const loader = new THREE.TextureLoader();
  const starGeo = new THREE.SphereGeometry(200, 64, 64);
  const starMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(1.2, 1.2, 1.2),
    side: THREE.BackSide,
    toneMapped: false,
  });
  const starfield = new THREE.Mesh(starGeo, starMat);
  scene.add(starfield);

  // Sun with emissive material
  const sunMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1.2, 1.1, 0.9),
    emissive: new THREE.Color(1.5, 1.2, 0.8),
    emissiveIntensity: 1.8,
    toneMapped: false,
  });
  const sun = new THREE.Mesh(new THREE.SphereGeometry(5, 64, 64), sunMaterial);
  scene.add(sun);

  // Lens flare
  const textureFlare0 = loader.load("/textures/lensflare0.png");
  const textureFlare2 = loader.load("/textures/lensflare2.png");
  const lensflare = new Lensflare();
  lensflare.addElement(new LensflareElement(textureFlare0, 512, 0, new THREE.Color(1, 0.9, 0.8)));
  lensflare.addElement(new LensflareElement(textureFlare2, 128, 0.2, new THREE.Color(1, 1, 0.6)));
  lensflare.addElement(new LensflareElement(textureFlare2, 64, 0.4, new THREE.Color(0.8, 0.8, 1)));
  lensflare.addElement(new LensflareElement(textureFlare2, 32, 0.6, new THREE.Color(1, 0.8, 0.6)));
  sun.add(lensflare);

  // Create planets
  createPlanets();

  // Post-processing
  composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(container.clientWidth, container.clientHeight),
    1.5, // strength
    0.4, // radius
    0.85 // threshold
  );
  composer.addPass(bloomPass);

  const outputPass = new OutputPass();
  composer.addPass(outputPass);

  // Animation loop
  function animate() {
    animationId = requestAnimationFrame(animate);
    
    // Rotate sun
    sun.rotation.y += 0.001;

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

const planets: Array<{
  mesh: THREE.Mesh;
  speed: number;
  dist: number;
  angle: number;
}> = [];

function createPlanets() {
  const loader = new THREE.TextureLoader();
  
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
      metalness: 0.1,
    });
    const planet = new THREE.Mesh(geometry, material);
    
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
  });
}

export function cleanupSolarSystem() {
  if (renderer) {
    renderer.dispose();
  }
  if (composer) {
    composer.dispose();
  }
}
