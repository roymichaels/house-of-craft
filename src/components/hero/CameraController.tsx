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

    // Extended intro dolly animation (0-5 seconds) with focus pull
    const elapsed = state.clock.getElapsedTime();
    if (elapsed < 5 && !introComplete.current && camera instanceof PerspectiveCamera) {
      const progress = Math.min(elapsed / 5, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      camera.position.z = position.z + 1.5 - (1.5 * easeOut);
      
      // Subtle camera sway (breathing effect)
      const sway = Math.sin(elapsed * 0.5) * 0.02;
      camera.position.y = position.y + sway;
      
      if (elapsed >= 4.9) {
        introComplete.current = true;
      }
    } else if (introComplete.current) {
      // Scroll-based zoom and perspective shift for hero mode
      if (mode === 'hero' && scrollProgress < 0.2) {
        // Zoom in as user scrolls (0-20% scroll range)
        const scrollZoom = scrollProgress * 5; // 0 to 1 over first 20% of scroll
        const zoomAmount = scrollZoom * 2; // Zoom in by 2 units max
        const perspectiveShift = scrollZoom * 0.5; // Slight upward tilt
        
        camera.position.z = position.z - zoomAmount;
        camera.position.y = position.y + perspectiveShift;
        
        // Adjust FOV for dramatic zoom effect
        if (camera instanceof PerspectiveCamera) {
          camera.fov = MathUtils.lerp(50, 45, scrollZoom);
          camera.updateProjectionMatrix();
        }
      } else {
        // Cinematic camera transitions for other modes - slower for unified temple flow
        const lerpSpeed = 0.01;
        camera.position.lerp(targetPosition.current, lerpSpeed);
        
        // Smooth lookAt transition
        const currentLookAt = new Vector3();
        camera.getWorldDirection(currentLookAt);
        currentLookAt.add(camera.position);
        currentLookAt.lerp(targetLookAt.current, lerpSpeed);
        camera.lookAt(currentLookAt);
        
        // FOV transition with smooth easing
        if (camera instanceof PerspectiveCamera) {
          camera.fov = MathUtils.lerp(camera.fov, targetFov.current, 0.03);
          camera.updateProjectionMatrix();
        }

        // Camera roll (z-axis rotation) for cinematic effect
        const targetRollRad = (targetRoll.current * Math.PI) / 180;
        camera.rotation.z = MathUtils.lerp(camera.rotation.z, targetRollRad, 0.02);
      }
      
      // Parallax effect - subtle camera rotation based on mouse (reduced strength)
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
