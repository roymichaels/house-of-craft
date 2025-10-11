import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SunProps {
  radius: number;
  glowIntensity?: number;
}

const Sun = ({ radius }: SunProps) => {
  const sunRef = useRef<THREE.Mesh>(null);

  // APOCALYPTIC FIREBALL surface shader
  const sunMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;

        // Add surface displacement for turbulent effect
        uniform float time;

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
          vNormal = normalize(normalMatrix * normal);
          vUv = uv;

          // Violent surface displacement
          vec3 pos = position;
          float displacement = noise(pos * 3.0 + time * 0.5) * 0.15;
          displacement += noise(pos * 6.0 + time * 0.8) * 0.08;
          pos += normal * displacement;

          vPosition = pos;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1,0)), f.x),
                     mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
        }

        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for(int i = 0; i < 8; i++) {
            value += amplitude * noise(p);
            p *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }

        void main() {
          // VIOLENT TURBULENT SURFACE
          vec2 uv = vUv * 8.0 + time * 0.3;

          // Multiple layers of chaotic motion
          float turbulence = fbm(uv + time * 0.4);
          turbulence += fbm(uv * 2.0 - time * 0.6) * 0.5;
          turbulence += fbm(uv * 4.0 + time * 0.8) * 0.25;

          // Extreme fire patterns
          float fire1 = fbm(vUv * 10.0 + vec2(0.0, time * 1.5));
          float fire2 = fbm(vUv * 15.0 + vec2(time * 2.0, 0.0));
          float fire = (fire1 + fire2) * 0.5;

          // Violent bright spots
          float hotspots = pow(fire, 3.0) * 2.0;

          // REALISTIC SUN COLOR PALETTE (more red)
          vec3 deepRed = vec3(0.8, 0.1, 0.05);       // Deep red core
          vec3 red = vec3(1.0, 0.2, 0.1);            // Red
          vec3 redOrange = vec3(1.0, 0.35, 0.15);    // Red-orange
          vec3 orange = vec3(1.0, 0.5, 0.2);         // Orange
          vec3 brightOrange = vec3(1.0, 0.65, 0.3);  // Bright orange
          vec3 yellow = vec3(1.0, 0.85, 0.4);        // Warm yellow
          vec3 white = vec3(1.0, 0.95, 0.8);         // Warm white

          // Build realistic sun color with more red
          vec3 color = deepRed;
          color = mix(color, red, smoothstep(0.15, 0.35, turbulence));
          color = mix(color, redOrange, smoothstep(0.35, 0.5, turbulence));
          color = mix(color, orange, smoothstep(0.5, 0.65, fire));
          color = mix(color, brightOrange, smoothstep(0.65, 0.8, fire));
          color = mix(color, yellow, smoothstep(0.8, 0.9, fire));
          color = mix(color, white, smoothstep(0.9, 1.0, hotspots));

          // Enhanced brightness for more presence
          float brightness = 1.2 + turbulence * 1.8 + hotspots * 2.5;
          color *= brightness;

          // Increased base brightness for more glow
          color *= 0.08;

          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.FrontSide,
      toneMapped: false,
    });
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Update shader time
    if (sunMaterial.uniforms) sunMaterial.uniforms.time.value = time;

    // Chaotic rotation
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.002;
      sunRef.current.rotation.x += 0.0003;
    }
  });

  return (
    <group>
      {/* APOCALYPTIC main sun body */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[radius, 128, 128]} />
        <primitive object={sunMaterial} attach="material" />
      </mesh>

      {/* Enhanced warm glow light */}
      <pointLight
        position={[0, 0, 0]}
        color="#ff6b35"
        intensity={2.0}
        distance={30}
        decay={2}
      />

      {/* Outer atmospheric glow */}
      <pointLight
        position={[0, 0, 0]}
        color="#ff4520"
        intensity={1.0}
        distance={40}
        decay={2.5}
      />
    </group>
  );
};

export default Sun;
