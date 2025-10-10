import { Text3D } from "../3d/ui/Text3D";
import { InfoPanel3D } from "../3d/ui/InfoPanel3D";
import { ProductCard3D } from "../3d/ui/ProductCard3D";
import { useModalStore } from "@/stores/modalStore";
import { relics } from "@/data/relics";

interface ChamberMasteryProps {
  lightColor: string;
  accentColor: string;
}

const ChamberMastery = ({ lightColor }: ChamberMasteryProps) => {
  const { openModal } = useModalStore();
  const masteryRelics = Object.values(relics).filter(r => r.chamber === 'mastery');

  const productPositions: [number, number, number][] = [
    [-1.5, 1.5, -2],
    [0, 1.5, -2],
    [1.5, 1.5, -2],
  ];

  return (
    <group>
      {/* Section Header - 3D Holographic Text */}
      <Text3D 
        content="OBJECTS OF MASTERY"
        position={[0, 3, -2]}
        fontSize={0.4}
        color="#C4A661"
        entranceDelay={0.5}
      />
      
      <InfoPanel3D
        content="Designed for men who master hours, not chase them."
        position={[0, 2.2, -1.8]}
        width={5}
        height={0.6}
        fontSize={0.12}
        entranceDelay={1}
      />
      
      {/* Interactive Product Cards in Space */}
      {masteryRelics.slice(0, 3).map((relic, i) => (
        <ProductCard3D
          key={i}
          title={relic.title}
          category={relic.category}
          image={relic.image}
          position={productPositions[i]}
          onClick={() => openModal('object', {
            title: relic.title,
            category: relic.category,
            description: relic.description,
            image: relic.image,
            story: relic.story,
            price: relic.price
          })}
          color={lightColor}
          entranceDelay={1.5 + i * 0.3}
        />
      ))}
    </group>
  );
};

export default ChamberMastery;
