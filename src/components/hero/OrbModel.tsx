import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Mesh, Group, Vector2 } from "three";
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

    // Pulsing sun surface (solar breathing)
    if (sunRef.current) {
      const pulse = 1 + Math.sin(time * 0.8) * 0.05;
      sunRef.current.scale.setScalar(pulse);
      
      // Turbulent emissive pulsing
      const material = sunRef.current.material as THREE.MeshPhysicalMaterial;
      material.emissiveIntensity = 6 + Math.sin(time * 1.5) * 1;
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
      {/* Central Sun Sphere - White hot core with yellow/orange gradients */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          color="#FFEB3B"
          emissive="#FDB813"
          emissiveIntensity={6}
          metalness={0}
          roughness={0.9}
          toneMapped={false}
        />
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
