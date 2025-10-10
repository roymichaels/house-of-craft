import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Vector3, MathUtils } from "three";
import { SceneMode } from "@/contexts/SceneContext";
import { chamberPaths } from "@/lib/cameraPaths";
import { useModalStore } from "@/stores/modalStore";
import { useSceneStore } from "@/contexts/SceneContext";

interface CameraControllerProps {
  mode: SceneMode;
  fov: number;
  position: { x: number; y: number; z: number };
}

const CameraController = ({ mode, fov, position }: CameraControllerProps) => {
  const { camera, size } = useThree();
  const activeModal = useModalStore(state => state.activeModal);
  const scrollProgress = useSceneStore(state => state.scrollProgress);
  const mousePosition = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const targetPosition = useRef(new Vector3());
  const targetLookAt = useRef(new Vector3());
  const targetFov = useRef(50);
  const targetRoll = useRef(0);
  const introComplete = useRef(false);

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

  // Update target when mode changes
  useEffect(() => {
    const path = chamberPaths[mode];
    targetPosition.current.set(...path.position);
    targetLookAt.current.set(...path.lookAt);
    targetFov.current = path.fov;
    targetRoll.current = path.roll;
  }, [mode]);

  useFrame((state) => {
    // Disable camera movement when modal is active
    if (activeModal !== 'none') {
      return;
    }

    // Quick intro dolly animation (0-2 seconds)
    const elapsed = state.clock.getElapsedTime();
    if (elapsed < 2 && !introComplete.current && camera instanceof PerspectiveCamera) {
      const progress = Math.min(elapsed / 2, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      camera.position.z = position.z + 1.5 - (1.5 * easeOut);
      
      if (elapsed >= 1.9) {
        introComplete.current = true;
      }
    }
    
    // Scroll-based camera animation throughout the entire page
    if (mode === 'hero') {
      // Hero section (0-15%): Dramatic zoom in
      const heroScrollProgress = Math.min(scrollProgress / 0.15, 1);
      const zoomAmount = heroScrollProgress * 2.5;
      const perspectiveShift = heroScrollProgress * 0.8;
      const fovShift = heroScrollProgress * 8;
      
      const easeInOutCubic = (t: number) => 
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      
      const easedProgress = easeInOutCubic(heroScrollProgress);
      
      const targetPos = new Vector3(
        targetPosition.current.x,
        targetPosition.current.y + (perspectiveShift * easedProgress),
        targetPosition.current.z - (zoomAmount * easedProgress)
      );
      
      camera.position.lerp(targetPos, 0.1);
      camera.lookAt(targetLookAt.current);
      
      if (camera instanceof PerspectiveCamera) {
        const targetFovValue = targetFov.current - (fovShift * easedProgress);
        camera.fov = MathUtils.lerp(camera.fov, targetFovValue, 0.08);
        camera.updateProjectionMatrix();
      }
    } else if (introComplete.current) {
      // Other sections (15-100%): Continue smooth cinematic movement
      // Map scroll progress to smooth camera transitions
      const sectionProgress = Math.max(0, (scrollProgress - 0.15) / 0.85); // Normalize 15-100% to 0-1
      const lerpSpeed = 0.015; // Slightly faster for smoother transitions
      
      // Smooth position transition with added scroll-based movement
      const scrollOffset = sectionProgress * 1.5; // Gentle forward movement
      const targetPos = new Vector3(
        targetPosition.current.x,
        targetPosition.current.y + (scrollOffset * 0.3),
        targetPosition.current.z - scrollOffset
      );
      
      camera.position.lerp(targetPos, lerpSpeed);
      
      // Smooth lookAt transition
      const currentLookAt = new Vector3();
      camera.getWorldDirection(currentLookAt);
      currentLookAt.add(camera.position);
      currentLookAt.lerp(targetLookAt.current, lerpSpeed);
      camera.lookAt(currentLookAt);
      
      // FOV transition with scroll influence
      if (camera instanceof PerspectiveCamera) {
        const scrollFovShift = sectionProgress * 3; // Subtle FOV change throughout scroll
        const targetFovValue = targetFov.current + scrollFovShift;
        camera.fov = MathUtils.lerp(camera.fov, targetFovValue, 0.03);
        camera.updateProjectionMatrix();
      }

      // Camera roll (z-axis rotation) for cinematic effect
      const targetRollRad = (targetRoll.current * Math.PI) / 180;
      const scrollRoll = sectionProgress * 0.02; // Gentle roll throughout page
      camera.rotation.z = MathUtils.lerp(camera.rotation.z, targetRollRad + scrollRoll, 0.02);
    }
    
    // Parallax effect - subtle camera rotation based on mouse (reduced strength)
    if (introComplete.current) {
      const parallaxStrength = 0.015;
      targetRotation.current.y = mousePosition.current.x * parallaxStrength;
      targetRotation.current.x = mousePosition.current.y * parallaxStrength;

      // Smooth lerp interpolation for parallax
      camera.rotation.y += (targetRotation.current.y - camera.rotation.y) * 0.03;
      camera.rotation.x += (targetRotation.current.x - camera.rotation.x) * 0.03;
    }
  });

  return null;
};

export default CameraController;
