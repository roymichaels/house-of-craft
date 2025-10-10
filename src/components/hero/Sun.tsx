import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SunProps {
  radius: number;
  glowIntensity?: number;
}

const Sun = ({ radius, glowIntensity = 5.0 }: SunProps) => {
  const sunRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const outerGlowRef = useRef<THREE.Mesh>(null);
  const flareGroupRef = useRef<THREE.Group>(null);

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

          // APOCALYPTIC COLOR PALETTE
          vec3 darkRed = vec3(0.5, 0.05, 0.0);       // Deep burning red
          vec3 red = vec3(1.0, 0.1, 0.0);            // Intense red
          vec3 orange = vec3(1.0, 0.4, 0.0);         // Burning orange
          vec3 brightOrange = vec3(1.0, 0.65, 0.1);  // Hot orange
          vec3 yellow = vec3(1.0, 0.9, 0.2);         // Scorching yellow
          vec3 white = vec3(1.0, 1.0, 0.95);         // White-hot

          // Build extreme fire color
          vec3 color = darkRed;
          color = mix(color, red, smoothstep(0.2, 0.4, turbulence));
          color = mix(color, orange, smoothstep(0.4, 0.6, turbulence));
          color = mix(color, brightOrange, smoothstep(0.5, 0.7, fire));
          color = mix(color, yellow, smoothstep(0.7, 0.85, fire));
          color = mix(color, white, smoothstep(0.85, 1.0, hotspots));

          // Extreme brightness variations
          float brightness = 1.0 + turbulence * 2.0 + hotspots * 3.0;
          color *= brightness;

          // MASSIVE emissive power for apocalyptic glow
          color *= 8.0;

          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.FrontSide,
      toneMapped: false,
    });
  }, []);

  // EXPLOSIVE inner core
  const innerCoreMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
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

        void main() {
          vec2 center = vUv - 0.5;
          float dist = length(center);

          // Pulsing white-hot core
          float pulse = 1.0 + sin(time * 2.0) * 0.3 + sin(time * 3.5) * 0.2;
          float core = smoothstep(0.5, 0.0, dist) * pulse;

          vec3 whiteHot = vec3(1.0, 1.0, 0.95);
          vec3 yellowHot = vec3(1.0, 0.95, 0.4);

          vec3 color = mix(yellowHot, whiteHot, core);
          color *= 15.0 * pulse;

          gl_FragColor = vec4(color, core);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  // MASSIVE corona with violent tendrils
  const coronaMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
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
          vec3 viewDirection = normalize(vPosition - cameraPosition);
          float fresnel = pow(1.0 + dot(viewDirection, vNormal), 2.0);

          // VIOLENT plasma tendrils
          float tendrils = noise(vPosition * 3.0 + time * 0.8);
          tendrils += noise(vPosition * 6.0 - time * 1.2) * 0.5;
          tendrils += noise(vPosition * 12.0 + time * 1.5) * 0.25;

          // Extreme corona colors
          vec3 red = vec3(1.0, 0.2, 0.0);
          vec3 orange = vec3(1.0, 0.5, 0.1);
          vec3 yellow = vec3(1.0, 0.8, 0.2);

          vec3 color = mix(red, orange, tendrils);
          color = mix(color, yellow, pow(tendrils, 2.0));

          float alpha = fresnel * (0.6 + tendrils * 0.4) * 1.5;

          gl_FragColor = vec4(color * 3.0, alpha);
        }
      `,
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  // MASSIVE outer glow
  const outerGlowMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vNormal;

        void main() {
          vec3 viewDirection = normalize(cameraPosition);
          float rim = pow(1.0 - abs(dot(viewDirection, vNormal)), 3.0);

          float pulse = 1.0 + sin(time * 0.8) * 0.2;

          vec3 glowColor = vec3(1.0, 0.6, 0.2);

          gl_FragColor = vec4(glowColor * 2.0, rim * 0.8 * pulse);
        }
      `,
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Update all shader times
    if (sunMaterial.uniforms) sunMaterial.uniforms.time.value = time;
    if (innerCoreMaterial.uniforms) innerCoreMaterial.uniforms.time.value = time;
    if (coronaMaterial.uniforms) coronaMaterial.uniforms.time.value = time;
    if (outerGlowMaterial.uniforms) outerGlowMaterial.uniforms.time.value = time;

    // Chaotic rotation
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.002;
      sunRef.current.rotation.x += 0.0003;
    }

    // Violent pulsing core
    if (innerCoreRef.current) {
      const pulse = 1 + Math.sin(time * 2) * 0.2 + Math.sin(time * 3.5) * 0.15;
      innerCoreRef.current.scale.setScalar(pulse);
    }

    // EXTREME corona pulsing
    if (coronaRef.current) {
      const pulseFactor = 1 + Math.sin(time * 0.5) * 0.3 + Math.sin(time * 1.2) * 0.2;
      coronaRef.current.scale.setScalar(pulseFactor);
    }

    // Massive outer glow breathing
    if (outerGlowRef.current) {
      const breathe = 1 + Math.sin(time * 0.3) * 0.25;
      outerGlowRef.current.scale.setScalar(breathe);
    }

    // Rotate flares chaotically
    if (flareGroupRef.current) {
      flareGroupRef.current.rotation.y = time * 0.3;
      flareGroupRef.current.rotation.z = Math.sin(time * 0.2) * 0.5;
    }
  });

  return (
    <group>
      {/* APOCALYPTIC main sun body */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[radius, 128, 128]} />
        <primitive object={sunMaterial} attach="material" />
      </mesh>

      {/* White-hot inner core */}
      <mesh ref={innerCoreRef}>
        <sphereGeometry args={[radius * 0.7, 64, 64]} />
        <primitive object={innerCoreMaterial} attach="material" />
      </mesh>

      {/* MASSIVE violent corona */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[radius * 2.0, 64, 64]} />
        <primitive object={coronaMaterial} attach="material" />
      </mesh>

      {/* HUGE outer glow */}
      <mesh ref={outerGlowRef}>
        <sphereGeometry args={[radius * 2.8, 32, 32]} />
        <primitive object={outerGlowMaterial} attach="material" />
      </mesh>

      {/* EXPLOSIVE solar flares */}
      <group ref={flareGroupRef}>
        {[...Array(24)].map((_, i) => {
          const angle = (i / 24) * Math.PI * 2;
          const distance = radius * (1.5 + Math.random() * 0.8);
          const x = Math.cos(angle) * distance;
          const y = (Math.random() - 0.5) * radius * 0.8;
          const z = Math.sin(angle) * distance;
          const size = radius * (0.2 + Math.random() * 0.3);

          return (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[size, 16, 16]} />
              <meshBasicMaterial
                color={new THREE.Color(
                  1.0,
                  0.4 + Math.random() * 0.5,
                  Math.random() * 0.2
                )}
                transparent
                opacity={0.5 + Math.random() * 0.4}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          );
        })}
      </group>

      {/* EXTREME lighting for apocalyptic atmosphere */}
      <pointLight
        position={[0, 0, 0]}
        intensity={glowIntensity * 8.0}
        distance={500}
        decay={1.2}
        color="#FF6600"
      />

      <pointLight
        position={[0, 0, 0]}
        intensity={glowIntensity * 5.0}
        distance={400}
        decay={1.5}
        color="#FFAA33"
      />

      <pointLight
        position={[0, 0, 0]}
        intensity={glowIntensity * 3.0}
        distance={300}
        decay={1.8}
        color="#FFCC55"
      />
    </group>
  );
};

export default Sun;
