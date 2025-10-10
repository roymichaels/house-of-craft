import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const AmbientDust = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Generate random marble dust particle positions
  const particleCount = 150;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 20; // x
      pos[i + 1] = (Math.random() - 0.5) * 20; // y
      pos[i + 2] = (Math.random() - 0.5) * 20; // z
    }
    return pos;
  }, []);

  // Animate marble dust particles - slow upward drift like temple incense
  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        // Slow upward drift with slight horizontal drift
        positions[i + 1] += 0.002; // y - upward
        positions[i] += Math.sin(state.clock.elapsedTime + i) * 0.001; // x - subtle drift
        
        // Reset particles that drift too high
        if (positions[i + 1] > 10) {
          positions[i + 1] = -10;
          positions[i] = (Math.random() - 0.5) * 20;
        }
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#E8E8E8"
        transparent
        opacity={0.25}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default AmbientDust;
