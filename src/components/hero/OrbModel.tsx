import { useRef, useState, useEffect, useMemo, useCallback } from "react";
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
  const moonRef = useRef<Mesh>(null);
  const corona1Ref = useRef<Mesh>(null);
  const corona2Ref = useRef<Mesh>(null);
  const corona3Ref = useRef<Mesh>(null);
  const flare1Ref = useRef<Mesh>(null);
  const flare2Ref = useRef<Mesh>(null);
  const flare3Ref = useRef<Mesh>(null);
  const chromosphereRef = useRef<Mesh>(null);

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
          // Distance from center (for radial gradient)
          float dist = length(vUv - 0.5) * 2.0;
          
          // Corona texture
          vec3 noisePos = vPosition * 4.0 + vec3(time * 0.1);
          float noise1 = snoise(noisePos);
          float noise2 = snoise(noisePos * 2.0 + vec3(time * 0.15));
          float turbulence = noise1 * 0.5 + noise2 * 0.5;
          
          // ECLIPSE EFFECT: Inverse limb - bright at edges, dark in center
          float limbBrighten = pow(dist, 2.5);
          
          // Eclipse color gradient - dark core, bright corona edges
          vec3 coreColor = vec3(0.05, 0.05, 0.05);  // Almost black core
          vec3 midColor = vec3(1.5, 1.4, 1.0);      // Bright white-gold corona
          vec3 edgeColor = vec3(2.0, 1.8, 1.2);     // Intense golden-white rays
          
          vec3 color = mix(coreColor, midColor, pow(dist, 1.5));
          color = mix(color, edgeColor, pow(dist, 3.0));
          
          // Add corona texture
          float granulation = snoise(vPosition * 10.0 + vec3(time * 0.05)) * 0.2;
          color += granulation;
          
          // Subtle pulsing
          float pulse = 1.0 + sin(time * 2.0) * 0.05;
          
          // Eclipse brightness - bright edges, dark center
          float brightness = (0.2 + dist * 3.0) * intensity * limbBrighten;
          
          gl_FragColor = vec4(color * brightness * pulse, 1.0);
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

  const handlePointerMove = useCallback((e: PointerEvent | TouchEvent) => {
    if (!isDragging || !groupRef.current) return;
    
    e.preventDefault();
    
    const clientX = (e as PointerEvent).clientX ?? (e as TouchEvent).touches?.[0]?.clientX ?? 0;
    const clientY = (e as PointerEvent).clientY ?? (e as TouchEvent).touches?.[0]?.clientY ?? 0;
    
    const deltaX = clientX - previousMouse.x;
    const deltaY = clientY - previousMouse.y;

    // Update rotation velocity - increased for better touch response
    setRotationVelocity({
      x: deltaY * 0.015,
      y: deltaX * 0.015
    });

    setPreviousMouse(new Vector2(clientX, clientY));
  }, [isDragging, previousMouse]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Global event listeners for drag to work on all devices
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove, { passive: false });
      window.addEventListener('touchend', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Apply rotation from dragging or default rotation
      if (isDragging) {
        groupRef.current.rotation.y += rotationVelocity.y;
        groupRef.current.rotation.x += rotationVelocity.x;
      } else {
        groupRef.current.rotation.y += rotationSpeed * 0.005;
        
        // Dampen velocity with smoother decay
        setRotationVelocity({
          x: rotationVelocity.x * 0.92,
          y: rotationVelocity.y * 0.92
        });
      }
    }
    
    // Keep moon positioned between camera and sun for consistent eclipse
    if (moonRef.current && groupRef.current) {
      const moonOffset = new THREE.Vector3(0.15, -0.1, 0.3);
      moonOffset.applyQuaternion(groupRef.current.quaternion.clone().invert());
      moonRef.current.position.copy(moonOffset);
    }

    // Update shader time and pulsing
    if (sunRef.current) {
      const pulse = 1 + Math.sin(time * 0.8) * 0.05;
      sunRef.current.scale.setScalar(pulse);
      
      // Update shader uniforms with more dynamic intensity
      const material = sunRef.current.material as ShaderMaterial;
      material.uniforms.time.value = time;
      material.uniforms.intensity.value = 1.2 + Math.sin(time * 1.5) * 0.2;
    }

    // Rotating corona layers - ECLIPSE MODE (highly visible)
    if (corona1Ref.current) {
      corona1Ref.current.rotation.z = time * 0.05;
      const mat1 = corona1Ref.current.material as THREE.MeshBasicMaterial;
      mat1.opacity = 0.4 + Math.sin(time * 0.5) * 0.05;
    }
    if (corona2Ref.current) {
      corona2Ref.current.rotation.z = -time * 0.04;
      const mat2 = corona2Ref.current.material as THREE.MeshBasicMaterial;
      mat2.opacity = 0.3 + Math.sin(time * 0.7) * 0.05;
    }
    if (corona3Ref.current) {
      corona3Ref.current.rotation.z = time * 0.03;
      const mat3 = corona3Ref.current.material as THREE.MeshBasicMaterial;
      mat3.opacity = 0.25 + Math.sin(time * 0.9) * 0.05;
    }

    // Corona streamers (slower, more ethereal)
    if (flare1Ref.current) {
      flare1Ref.current.rotation.x = time * 0.15;
      flare1Ref.current.rotation.y = time * 0.1;
      const flareMat1 = flare1Ref.current.material as THREE.MeshPhysicalMaterial;
      flareMat1.emissiveIntensity = 10 + Math.sin(time * 2) * 2;
    }
    if (flare2Ref.current) {
      flare2Ref.current.rotation.x = -time * 0.12;
      flare2Ref.current.rotation.z = time * 0.08;
      const flareMat2 = flare2Ref.current.material as THREE.MeshPhysicalMaterial;
      flareMat2.emissiveIntensity = 10 + Math.sin(time * 2.5) * 2;
    }
    if (flare3Ref.current) {
      flare3Ref.current.rotation.y = time * 0.14;
      flare3Ref.current.rotation.z = -time * 0.06;
      const flareMat3 = flare3Ref.current.material as THREE.MeshPhysicalMaterial;
      flareMat3.emissiveIntensity = 10 + Math.sin(time * 3) * 2;
    }
    
    // Chromosphere pulse
    if (chromosphereRef.current) {
      chromosphereRef.current.rotation.z = time * 0.2;
      const chromoMat = chromosphereRef.current.material as THREE.MeshBasicMaterial;
      chromoMat.opacity = 0.7 + Math.sin(time * 3) * 0.1;
    }
  });

  return (
    <group 
      ref={groupRef}
      onPointerDown={handlePointerDown}
    >
      {/* Central Sun Sphere with ECLIPSE shader */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[1, 128, 128]} />
        <primitive object={sunShaderMaterial} attach="material" />
      </mesh>

      {/* Occluding Moon - The dark silhouette creating the eclipse */}
      <mesh ref={moonRef}>
        <sphereGeometry args={[0.95, 64, 64]} />
        <meshBasicMaterial
          color="#000000"
          toneMapped={false}
        />
      </mesh>

      {/* Corona Layer 1 - Bright inner corona (ECLIPSE MODE) */}
      <mesh ref={corona1Ref}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshBasicMaterial
          color="#FFFDF7"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>

      {/* Corona Layer 2 - Mid corona glow (ECLIPSE MODE) */}
      {!isMobile && (
        <mesh ref={corona2Ref}>
          <sphereGeometry args={[4, 64, 64]} />
          <meshBasicMaterial
            color="#FFFDF7"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* Corona Layer 3 - Outer corona wispy glow (ECLIPSE MODE) */}
      {!isMobile && (
        <mesh ref={corona3Ref}>
          <sphereGeometry args={[5, 64, 64]} />
          <meshBasicMaterial
            color="#FFFACD"
            transparent
            opacity={0.25}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* Corona Streamer 1 - Realistic Metallic Gold Ring */}
      <mesh ref={flare1Ref} position={[0, 0, 0]}>
        <torusGeometry args={[2.5, 0.08, 32, 100]} />
        <meshPhysicalMaterial
          color="#FFD700"
          emissive="#8B6508"
          emissiveIntensity={2}
          metalness={1.0}
          roughness={0.15}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          reflectivity={1.0}
          envMapIntensity={1.5}
          transparent
          opacity={0.9}
          toneMapped={false}
        />
      </mesh>

      {/* Corona Streamer 2 - Realistic Metallic Gold Ring */}
      <mesh ref={flare2Ref} position={[0, 0, 0]} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[3, 0.1, 32, 100]} />
        <meshPhysicalMaterial
          color="#FFD700"
          emissive="#8B6508"
          emissiveIntensity={2}
          metalness={1.0}
          roughness={0.15}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          reflectivity={1.0}
          envMapIntensity={1.5}
          transparent
          opacity={0.85}
          toneMapped={false}
        />
      </mesh>

      {/* Corona Streamer 3 - Realistic Metallic Gold Ring */}
      <mesh ref={flare3Ref} position={[0, 0, 0]} rotation={[0, Math.PI / 3, Math.PI / 4]}>
        <torusGeometry args={[2.8, 0.09, 32, 100]} />
        <meshPhysicalMaterial
          color="#FFD700"
          emissive="#8B6508"
          emissiveIntensity={2}
          metalness={1.0}
          roughness={0.15}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          reflectivity={1.0}
          envMapIntensity={1.5}
          transparent
          opacity={0.88}
          toneMapped={false}
        />
      </mesh>

      {/* Chromosphere - Pink/red ring visible at sun's edge */}
      <mesh ref={chromosphereRef} position={[0, 0, 0]}>
        <torusGeometry args={[1.05, 0.03, 32, 64]} />
        <meshBasicMaterial
          color="#FF1744"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* Bailey's Beads - Bright spots around moon edge */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 0.95;
        const x = 0.15 + Math.cos(angle) * radius;
        const y = -0.1 + Math.sin(angle) * radius;
        return (
          <mesh key={i} position={[x, y, 0.3]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial
              color="#FFFFFF"
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default OrbModel;
