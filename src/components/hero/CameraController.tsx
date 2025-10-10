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
      // Start further back for longer intro dolly (focus pull)
      camera.position.set(position.x, position.y, position.z + 1.5);
      camera.updateProjectionMatrix();
    }
  }, [camera, fov, position]);

  useFrame((state) => {
    // Extended intro dolly animation (0-5 seconds) with focus pull
    const elapsed = state.clock.getElapsedTime();
    if (elapsed < 5 && camera instanceof PerspectiveCamera) {
      const progress = Math.min(elapsed / 5, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      camera.position.z = position.z + 1.5 - (1.5 * easeOut);
      
      // Subtle camera sway (breathing effect)
      const sway = Math.sin(elapsed * 0.5) * 0.02;
      camera.position.y = position.y + sway;
    }

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
