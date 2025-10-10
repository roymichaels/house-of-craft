import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "three";

interface CameraControllerProps {
  fov: number;
  position: { x: number; y: number; z: number };
}

const CameraController = ({ fov, position }: CameraControllerProps) => {
  const { camera, size } = useThree();
  const mousePosition = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse position to -1 to 1
      mousePosition.current.x = (event.clientX / size.width) * 2 - 1;
      mousePosition.current.y = -(event.clientY / size.height) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [size]);

  useEffect(() => {
    if (camera instanceof PerspectiveCamera) {
      camera.fov = fov;
      camera.position.set(position.x, position.y, position.z);
      camera.updateProjectionMatrix();
    }
  }, [camera, fov, position]);

  useFrame(() => {
    // Parallax effect - subtle camera rotation based on mouse
    const parallaxStrength = 0.05;
    targetRotation.current.y = mousePosition.current.x * parallaxStrength;
    targetRotation.current.x = mousePosition.current.y * parallaxStrength;

    // Smooth lerp interpolation
    camera.rotation.y += (targetRotation.current.y - camera.rotation.y) * 0.05;
    camera.rotation.x += (targetRotation.current.x - camera.rotation.x) * 0.05;
  });

  return null;
};

export default CameraController;
