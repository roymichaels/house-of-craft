import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Mesh, Group, Vector2, ShaderMaterial } from "three";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";

interface OrbModelProps {
  rotationSpeed: number;
  lightColor: string;
}

const OrbModel = ({ rotationSpeed, lightColor }: OrbModelProps) => {
  const groupRef = useRef<Group>(null);
  const sunRef = useRef<Mesh>(null);
  const corona1Ref = useRef<Mesh>(null);
  const corona2Ref = useRef<Mesh>(null);
  const corona3Ref = useRef<Mesh>(null);
  const flare1Ref = useRef<Mesh>(null);
  const flare2Ref = useRef<Mesh>(null);
  const flare3Ref = useRef<Mesh>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [previousMouse, setPreviousMouse] = useState(new Vector2());
  const [rotationVelocity, setRotationVelocity] = useState({ x: 0, y: 0 });

  const { size } = useThree();
  const isMobile = useIsMobile();

  // Custom Sun Shader Material
  const sunShaderMaterial = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        intensity: { value: 1.0 },
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
        uniform float intensity;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        // Simplex noise function
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
          vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            
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
        
        void main() {
          // Create turbulent plasma surface
          vec3 noisePos = vPosition * 2.0 + vec3(time * 0.1);
          float noise1 = snoise(noisePos);
          float noise2 = snoise(noisePos * 2.0 + vec3(time * 0.15));
          float noise3 = snoise(noisePos * 4.0 - vec3(time * 0.2));
          
          float turbulence = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;
          
          // Distance from center (for radial gradient)
          float dist = length(vUv - 0.5) * 2.0;
          
          // Sun color gradient: white hot center -> yellow -> orange edges
          vec3 coreColor = vec3(1.0, 1.0, 1.0);        // White
          vec3 midColor = vec3(1.0, 0.9, 0.3);         // Yellow
          vec3 edgeColor = vec3(1.0, 0.5, 0.1);        // Orange
          
          // Mix colors based on distance and turbulence
          vec3 color = mix(coreColor, midColor, dist * 0.7 + turbulence * 0.3);
          color = mix(color, edgeColor, dist * dist);
          
          // Add surface granulation (solar cells)
          float granulation = snoise(vPosition * 10.0 + vec3(time * 0.05)) * 0.1;
          color += granulation;
          
          // Intense brightness
          float brightness = (1.5 - dist * 0.5) * intensity;
          color *= brightness;
          
          // Pulsing effect
          float pulse = 1.0 + sin(time * 2.0) * 0.1;
          color *= pulse;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      toneMapped: false,
    });
  }, []);


  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    setPreviousMouse(new Vector2(clientX, clientY));
  };

  const handlePointerMove = (e: PointerEvent | TouchEvent) => {
    if (!isDragging || !groupRef.current) return;
    
    const clientX = (e as PointerEvent).clientX ?? (e as TouchEvent).touches?.[0]?.clientX ?? 0;
    const clientY = (e as PointerEvent).clientY ?? (e as TouchEvent).touches?.[0]?.clientY ?? 0;
    
    const deltaX = clientX - previousMouse.x;
    const deltaY = clientY - previousMouse.y;

    // Update rotation velocity
    setRotationVelocity({
      x: deltaY * 0.01,
      y: deltaX * 0.01
    });

    setPreviousMouse(new Vector2(clientX, clientY));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Global event listeners for drag to work on all devices
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove);
      window.addEventListener('touchend', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Apply rotation from dragging or default rotation
      if (isDragging) {
        groupRef.current.rotation.y += rotationVelocity.y;
        groupRef.current.rotation.x += rotationVelocity.x;
      } else {
        groupRef.current.rotation.y += rotationSpeed * 0.005;
        
        // Dampen velocity
        setRotationVelocity({
          x: rotationVelocity.x * 0.95,
          y: rotationVelocity.y * 0.95
        });
      }
    }

    // Update shader time and pulsing
    if (sunRef.current) {
      const pulse = 1 + Math.sin(time * 0.8) * 0.05;
      sunRef.current.scale.setScalar(pulse);
      
      // Update shader uniforms
      const material = sunRef.current.material as ShaderMaterial;
      material.uniforms.time.value = time;
      material.uniforms.intensity.value = 1.0 + Math.sin(time * 1.5) * 0.2;
    }

    // Rotating corona layers (different speeds)
    if (corona1Ref.current) {
      corona1Ref.current.rotation.z = time * 0.1;
      const mat1 = corona1Ref.current.material as THREE.MeshBasicMaterial;
      mat1.opacity = 0.25 + Math.sin(time * 0.5) * 0.08;
    }
    if (corona2Ref.current) {
      corona2Ref.current.rotation.z = -time * 0.08;
      const mat2 = corona2Ref.current.material as THREE.MeshBasicMaterial;
      mat2.opacity = 0.2 + Math.sin(time * 0.7) * 0.06;
    }
    if (corona3Ref.current) {
      corona3Ref.current.rotation.z = time * 0.06;
      const mat3 = corona3Ref.current.material as THREE.MeshBasicMaterial;
      mat3.opacity = 0.15 + Math.sin(time * 0.9) * 0.05;
    }

    // Solar flares/prominences (spinning and pulsing)
    if (flare1Ref.current) {
      flare1Ref.current.rotation.x = time * 0.4;
      flare1Ref.current.rotation.y = time * 0.3;
      const flareMat1 = flare1Ref.current.material as THREE.MeshPhysicalMaterial;
      flareMat1.emissiveIntensity = 5 + Math.sin(time * 2) * 1;
    }
    if (flare2Ref.current) {
      flare2Ref.current.rotation.x = -time * 0.35;
      flare2Ref.current.rotation.z = time * 0.25;
      const flareMat2 = flare2Ref.current.material as THREE.MeshPhysicalMaterial;
      flareMat2.emissiveIntensity = 5 + Math.sin(time * 2.5) * 1;
    }
    if (flare3Ref.current) {
      flare3Ref.current.rotation.y = time * 0.45;
      flare3Ref.current.rotation.z = -time * 0.2;
      const flareMat3 = flare3Ref.current.material as THREE.MeshPhysicalMaterial;
      flareMat3.emissiveIntensity = 5 + Math.sin(time * 3) * 1;
    }
  });

  return (
    <group 
      ref={groupRef}
      onPointerDown={handlePointerDown}
    >
      {/* Central Sun Sphere - Custom WebGL Shader */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[1, 128, 128]} />
        <primitive object={sunShaderMaterial} attach="material" />
      </mesh>

      {/* Corona Layer 1 - Innermost glow (white-yellow) */}
      <mesh ref={corona1Ref}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color="#FFFACD"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>

      {/* Corona Layer 2 - Mid glow (yellow-orange) */}
      {!isMobile && (
        <mesh ref={corona2Ref}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshBasicMaterial
            color="#FFD700"
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* Corona Layer 3 - Outer glow (orange) */}
      {!isMobile && (
        <mesh ref={corona3Ref}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshBasicMaterial
            color="#FF8C00"
            transparent
            opacity={0.1}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* Solar Flare/Prominence 1 - Bright orange loop */}
      <mesh ref={flare1Ref} position={[0, 0, 0]}>
        <torusGeometry args={[1.3, 0.04, 16, 100]} />
        <meshPhysicalMaterial
          color="#FF6B1A"
          emissive="#FF4500"
          emissiveIntensity={5}
          metalness={0}
          roughness={0.5}
          toneMapped={false}
        />
      </mesh>

      {/* Solar Flare/Prominence 2 */}
      <mesh ref={flare2Ref} position={[0, 0, 0]} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.4, 0.035, 16, 100]} />
        <meshPhysicalMaterial
          color="#FF8C00"
          emissive="#FF6347"
          emissiveIntensity={5}
          metalness={0}
          roughness={0.5}
          toneMapped={false}
        />
      </mesh>

      {/* Solar Flare/Prominence 3 */}
      <mesh ref={flare3Ref} position={[0, 0, 0]} rotation={[0, Math.PI / 3, Math.PI / 4]}>
        <torusGeometry args={[1.35, 0.038, 16, 100]} />
        <meshPhysicalMaterial
          color="#FFA500"
          emissive="#FF7F50"
          emissiveIntensity={5}
          metalness={0}
          roughness={0.5}
          toneMapped={false}
        />
      </mesh>

      {/* Sunspot effect - darker patches (subtle detail) */}
      <mesh position={[0.5, 0.3, 0.95]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial
          color="#1A0A00"
          transparent
          opacity={0.3}
        />
      </mesh>

      <mesh position={[-0.4, -0.5, 0.9]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial
          color="#1A0A00"
          transparent
          opacity={0.25}
        />
      </mesh>

      <mesh position={[0.2, -0.7, 0.85]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial
          color="#1A0A00"
          transparent
          opacity={0.28}
        />
      </mesh>
    </group>
  );
};

export default OrbModel;
