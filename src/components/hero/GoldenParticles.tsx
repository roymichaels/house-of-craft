import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GoldenParticlesProps {
  count?: number;
  radius?: number;
}

const GoldenParticles = ({ count = 300, radius = 3 }: GoldenParticlesProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    
    for (let i = 0; i < count * 3; i += 3) {
      // Spherical distribution around orb
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = radius + (Math.random() - 0.5) * 2;
      
      pos[i] = r * Math.sin(phi) * Math.cos(theta);
      pos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i + 2] = r * Math.cos(phi);
      
      // Random drift velocities
      vel[i] = (Math.random() - 0.5) * 0.01;
      vel[i + 1] = (Math.random() - 0.5) * 0.01;
      vel[i + 2] = (Math.random() - 0.5) * 0.01;
    }
    
    return { positions: pos, velocities: vel };
  }, [count, radius]);

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        // Gentle orbital drift
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];
        
        // Keep particles in bounds
        const dist = Math.sqrt(
          positions[i] ** 2 + 
          positions[i + 1] ** 2 + 
          positions[i + 2] ** 2
        );
        
        if (dist > radius + 2 || dist < radius - 2) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos((Math.random() * 2) - 1);
          const r = radius + (Math.random() - 0.5) * 2;
          
          positions[i] = r * Math.sin(phi) * Math.cos(theta);
          positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
          positions[i + 2] = r * Math.cos(phi);
        }
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.rotation.y += 0.0002;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#D4AF37"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default GoldenParticles;
