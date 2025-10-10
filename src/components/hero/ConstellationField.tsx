import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ConstellationField = () => {
  const starsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { starPositions, linePositions } = useMemo(() => {
    const starCount = 200;
    const stars = new Float32Array(starCount * 3);
    const connections: number[] = [];

    // Generate star positions in far background
    for (let i = 0; i < starCount * 3; i += 3) {
      stars[i] = (Math.random() - 0.5) * 50;
      stars[i + 1] = (Math.random() - 0.5) * 50;
      stars[i + 2] = -20 - Math.random() * 20; // Behind orb
    }

    // Create constellation connections
    for (let i = 0; i < starCount - 1; i++) {
      if (Math.random() < 0.05) { // 5% connection chance
        const idx1 = i * 3;
        const idx2 = (i + 1) * 3;
        
        connections.push(
          stars[idx1], stars[idx1 + 1], stars[idx1 + 2],
          stars[idx2], stars[idx2 + 1], stars[idx2 + 2]
        );
      }
    }

    return { 
      starPositions: stars, 
      linePositions: new Float32Array(connections) 
    };
  }, []);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.00005;
      starsRef.current.rotation.x += 0.00002;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y += 0.00005;
      linesRef.current.rotation.x += 0.00002;
    }
  });

  return (
    <group>
      {/* Stars */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starPositions.length / 3}
            array={starPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#E8E8E8"
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Constellation lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#C4A661"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
};

export default ConstellationField;
