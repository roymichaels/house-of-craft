import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AsteroidBeltProps {
  innerRadius: number;
  outerRadius: number;
  count: number;
}

const AsteroidBelt = ({ innerRadius, outerRadius, count }: AsteroidBeltProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Generate random asteroid positions
  const asteroids = useMemo(() => {
    const temp = [];
    const matrix = new THREE.Matrix4();
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 2; // Small vertical variation
      
      const scale = 0.05 + Math.random() * 0.15; // Random sizes
      const rotX = Math.random() * Math.PI;
      const rotY = Math.random() * Math.PI;
      const rotZ = Math.random() * Math.PI;
      
      matrix.makeRotationFromEuler(new THREE.Euler(rotX, rotY, rotZ));
      matrix.scale(new THREE.Vector3(scale, scale, scale));
      matrix.setPosition(x, y, z);
      
      temp.push({
        matrix: matrix.clone(),
        rotationSpeed: (Math.random() - 0.5) * 0.01,
      });
    }
    
    return temp;
  }, [count, innerRadius, outerRadius]);

  // Apply initial matrices
  useMemo(() => {
    if (meshRef.current) {
      asteroids.forEach((asteroid, i) => {
        meshRef.current!.setMatrixAt(i, asteroid.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [asteroids]);

  // Animate rotation
  useFrame(() => {
    if (meshRef.current) {
      asteroids.forEach((asteroid, i) => {
        const matrix = new THREE.Matrix4();
        meshRef.current!.getMatrixAt(i, matrix);
        
        const position = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();
        matrix.decompose(position, quaternion, scale);
        
        const euler = new THREE.Euler().setFromQuaternion(quaternion);
        euler.y += asteroid.rotationSpeed;
        quaternion.setFromEuler(euler);
        
        matrix.compose(position, quaternion, scale);
        meshRef.current!.setMatrixAt(i, matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#6B5D54" roughness={1} metalness={0.1} />
    </instancedMesh>
  );
};

export default AsteroidBelt;
