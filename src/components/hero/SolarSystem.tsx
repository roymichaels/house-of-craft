import Sun from "./Sun";
import Planet from "./Planet";
import OrbitPath from "./OrbitPath";
import AsteroidBelt from "./AsteroidBelt";
import { PLANETS, SUN_CONFIG, ASTEROID_BELT_CONFIG } from "@/data/solarSystemConfig";
import { useIsMobile } from "@/hooks/use-mobile";

interface SolarSystemProps {
  rotationSpeed?: number;
}

const SolarSystem = ({ rotationSpeed = 1 }: SolarSystemProps) => {
  const isMobile = useIsMobile();

  return (
    <group>
      {/* Central Sun */}
      <Sun radius={SUN_CONFIG.radius} glowIntensity={SUN_CONFIG.glowIntensity} />

      {/* Planets with orbital paths */}
      {PLANETS.map((planet) => (
        <group key={planet.name}>
          {/* Orbital path ring */}
          <OrbitPath radius={planet.orbitRadius} />
          
          {/* Planet */}
          <Planet
            {...planet}
            speedMultiplier={rotationSpeed}
          />
        </group>
      ))}

      {/* Asteroid Belt */}
      <AsteroidBelt
        innerRadius={ASTEROID_BELT_CONFIG.innerRadius}
        outerRadius={ASTEROID_BELT_CONFIG.outerRadius}
        count={isMobile ? ASTEROID_BELT_CONFIG.countMobile : ASTEROID_BELT_CONFIG.count}
      />
    </group>
  );
};

export default SolarSystem;
