import { useEffect, useRef } from 'react';

const LavaBackground = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(canvasRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={canvasRef}
      className="absolute inset-0 overflow-hidden"
      style={{ isolation: 'isolate' }}
    >
      <div className="lava-base absolute inset-0" />

      <div className="lava-layer-1 absolute inset-0" />

      <div className="lava-layer-2 absolute inset-0" />

      <div className="lava-layer-3 absolute inset-0" />

      <div className="lava-hotspots absolute inset-0">
        <div className="hotspot hotspot-1" />
        <div className="hotspot hotspot-2" />
        <div className="hotspot hotspot-3" />
        <div className="hotspot hotspot-4" />
        <div className="hotspot hotspot-5" />
      </div>

      <div className="lava-texture absolute inset-0" />

      <div className="lava-cracks absolute inset-0" />

      <div className="lava-vignette absolute inset-0" />

      <div className="lava-grain absolute inset-0" />
    </div>
  );
};

export default LavaBackground;
