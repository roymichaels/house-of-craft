import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const MouseLight = () => {
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (spotLightRef.current) {
      // Smooth follow
      spotLightRef.current.position.x += (mousePos.current.x * 3 - spotLightRef.current.position.x) * 0.05;
      spotLightRef.current.position.y += (mousePos.current.y * 3 - spotLightRef.current.position.y) * 0.05;
      
      // Point toward orb center
      spotLightRef.current.target.position.set(0, 0, 0);
      spotLightRef.current.target.updateMatrixWorld();
    }
  });

  return (
    <spotLight
      ref={spotLightRef}
      position={[0, 0, 5]}
      intensity={0.8}
      angle={0.3}
      penumbra={0.5}
      color="#D4AF37"
      distance={12}
    />
  );
};

export default MouseLight;
