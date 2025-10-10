import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SunProps {
  radius: number;
  glowIntensity?: number;
}

const Sun = ({ radius, glowIntensity = 3.5 }: SunProps) => {
  const sunRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const flareGroupRef = useRef<THREE.Group>(null);

  // Photorealistic sun surface shader
  const sunMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        radius: { value: radius },
        glowIntensity: { value: glowIntensity },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float radius;
        uniform float glowIntensity;

        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;

        // Improved noise functions for realistic surface detail
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);

          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));

          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          float frequency = 1.0;

          for(int i = 0; i < 6; i++) {
            value += amplitude * noise(p * frequency);
            frequency *= 2.0;
            amplitude *= 0.5;
          }

          return value;
        }

        // Granulation pattern (convection cells)
        float granulation(vec2 uv, float scale) {
          vec2 p = uv * scale + time * 0.02;
          return fbm(p) * 0.5 + 0.5;
        }

        // Sunspot regions (darker, cooler areas)
        float sunspots(vec2 uv) {
          vec2 p1 = uv * 3.0 + vec2(time * 0.01, 0.0);
          vec2 p2 = uv * 2.5 + vec2(0.0, time * 0.008);

          float spot1 = smoothstep(0.6, 0.8, noise(p1));
          float spot2 = smoothstep(0.55, 0.75, noise(p2));

          return spot1 * spot2;
        }

        // Active regions (bright, hot areas)
        float activeRegions(vec2 uv) {
          vec2 p = uv * 4.0 + time * 0.03;
          float pattern = fbm(p);
          return smoothstep(0.6, 0.9, pattern);
        }

        // Limb darkening effect
        float limbDarkening(vec3 normal) {
          float rim = 1.0 - abs(dot(normal, vec3(0.0, 0.0, 1.0)));
          return pow(rim, 0.5);
        }

        void main() {
          // Calculate surface coordinates
          vec2 uv = vUv * 2.0 - 1.0;

          // Base granulation
          float gran = granulation(vUv, 20.0);

          // Add sunspots
          float spots = sunspots(vUv);

          // Add active regions
          float active = activeRegions(vUv);

          // Limb darkening
          float limb = limbDarkening(vNormal);

          // Color palette - photorealistic sun colors
          vec3 coreColor = vec3(1.0, 0.95, 0.85);      // White-hot core
          vec3 hotColor = vec3(1.0, 0.85, 0.3);        // Bright yellow
          vec3 warmColor = vec3(1.0, 0.6, 0.2);        // Orange
          vec3 coolColor = vec3(0.9, 0.4, 0.15);       // Deep orange-red
          vec3 spotColor = vec3(0.4, 0.15, 0.05);      // Dark sunspot

          // Build color based on surface features
          vec3 baseColor = mix(warmColor, hotColor, gran * 0.7);

          // Apply active regions (bright spots)
          baseColor = mix(baseColor, coreColor, active * 0.8);

          // Apply sunspots (dark regions)
          baseColor = mix(baseColor, spotColor, spots * 0.6);

          // Apply limb darkening for realism
          baseColor = mix(coolColor, baseColor, limb * 0.7 + 0.3);

          // Add brightness variation
          float brightness = 1.0 + gran * 0.3 + active * 0.5;
          baseColor *= brightness;

          // High emissive intensity for dramatic look
          vec3 finalColor = baseColor * glowIntensity * 1.5;

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      side: THREE.FrontSide,
      toneMapped: false,
    });
  }, [radius, glowIntensity]);

  // Dramatic corona shader
  const coronaMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        glowIntensity: { value: glowIntensity },
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
        uniform float glowIntensity;

        varying vec3 vNormal;
        varying vec3 vPosition;

        float noise(vec3 p) {
          return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
        }

        void main() {
          // View direction for fresnel effect
          vec3 viewDirection = normalize(vPosition - cameraPosition);
          float fresnel = pow(1.0 + dot(viewDirection, vNormal), 3.0);

          // Wispy corona tendrils
          float tendrils = noise(vPosition * 5.0 + time * 0.1);
          tendrils += noise(vPosition * 10.0 + time * 0.15) * 0.5;

          // Corona color - intense orange-red glow
          vec3 coronaColor = vec3(1.0, 0.5, 0.2);

          // Combine effects
          float alpha = fresnel * (0.4 + tendrils * 0.3) * glowIntensity * 0.3;

          gl_FragColor = vec4(coronaColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [glowIntensity]);

  // Atmospheric chromosphere layer
  const atmosphereMaterial = useMemo(() => {
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
          // View direction for rim effect
          vec3 viewDirection = normalize(cameraPosition);
          float rim = 1.0 - abs(dot(viewDirection, vNormal));
          rim = pow(rim, 2.0);

          // Red-orange chromosphere color
          vec3 chromosphereColor = vec3(1.0, 0.3, 0.1);

          float alpha = rim * 0.5;

          gl_FragColor = vec4(chromosphereColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  // Animation loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Update shader time uniforms
    if (sunMaterial.uniforms) {
      sunMaterial.uniforms.time.value = time;
    }
    if (coronaMaterial.uniforms) {
      coronaMaterial.uniforms.time.value = time;
    }
    if (atmosphereMaterial.uniforms) {
      atmosphereMaterial.uniforms.time.value = time;
    }

    // Slow rotation for surface movement
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.0005;
    }

    // Dramatic pulsing corona
    if (coronaRef.current) {
      const pulseFactor = 1 + Math.sin(time * 0.3) * 0.15 + Math.sin(time * 0.7) * 0.08;
      coronaRef.current.scale.setScalar(pulseFactor);
    }

    // Subtle atmosphere breathing
    if (atmosphereRef.current) {
      const breathe = 1 + Math.sin(time * 0.4) * 0.05;
      atmosphereRef.current.scale.setScalar(breathe);
    }

    // Rotate solar flares
    if (flareGroupRef.current) {
      flareGroupRef.current.rotation.y = time * 0.1;
    }
  });

  return (
    <group>
      {/* Main sun body with photorealistic shader */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[radius, 128, 128]} />
        <primitive object={sunMaterial} attach="material" />
      </mesh>

      {/* Chromosphere atmosphere layer */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[radius * 1.08, 64, 64]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>

      {/* Dramatic corona */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[radius * 1.5, 64, 64]} />
        <primitive object={coronaMaterial} attach="material" />
      </mesh>

      {/* Solar flares group */}
      <group ref={flareGroupRef}>
        {/* Multiple flare particles for cinematic effect */}
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const distance = radius * (1.3 + Math.random() * 0.4);
          const x = Math.cos(angle) * distance;
          const y = (Math.random() - 0.5) * radius * 0.5;
          const z = Math.sin(angle) * distance;

          return (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[radius * 0.15, 16, 16]} />
              <meshBasicMaterial
                color={new THREE.Color(1.0, 0.6 + Math.random() * 0.3, 0.2)}
                transparent
                opacity={0.3 + Math.random() * 0.3}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          );
        })}
      </group>

      {/* Enhanced point light for dramatic scene lighting */}
      <pointLight
        position={[0, 0, 0]}
        intensity={glowIntensity * 2.5}
        distance={300}
        decay={1.5}
        color="#FFA040"
      />

      {/* Additional warm fill light */}
      <pointLight
        position={[0, 0, 0]}
        intensity={glowIntensity * 1.5}
        distance={200}
        decay={2}
        color="#FFD080"
      />
    </group>
  );
};

export default Sun;
