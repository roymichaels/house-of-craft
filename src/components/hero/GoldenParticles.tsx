import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GoldenParticlesProps {
  count?: number;
  radius?: number;
}

const GoldenParticles = ({ count = 300, radius = 3 }: GoldenParticlesProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, velocities, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    
    // Space color palette
    const spaceColors = [
      new THREE.Color("#D4AF37"), // Golden
      new THREE.Color("#60A5FA"), // Cosmic Blue
      new THREE.Color("#9333EA"), // Nebula Purple
      new THREE.Color("#EC4899"), // Nebula Pink
      new THREE.Color("#14B8A6"), // Teal
    ];
    
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
      
      // Random color from palette
      const color = spaceColors[Math.floor(Math.random() * spaceColors.length)];
      col[i] = color.r;
      col[i + 1] = color.g;
      col[i + 2] = color.b;
    }
    
    return { positions: pos, velocities: vel, colors: col };
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
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default GoldenParticles;
