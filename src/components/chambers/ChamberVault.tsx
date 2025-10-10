import { Text3D } from "../3d/ui/Text3D";
import { InfoPanel3D } from "../3d/ui/InfoPanel3D";
import { ProductCard3D } from "../3d/ui/ProductCard3D";
import { useModalStore } from "@/stores/modalStore";
import { relics } from "@/data/relics";

interface ChamberVaultProps {
  lightColor: string;
}

const ChamberVault = ({ lightColor }: ChamberVaultProps) => {
  const { openModal } = useModalStore();
  const vaultRelics = Object.values(relics).filter(r => r.chamber === 'vault');

  const productPositions: [number, number, number][] = [
    [-1.8, 1, -2],
    [-0.6, 1, -2],
    [0.6, 1, -2],
    [1.8, 1, -2],
  ];

  return (
    <group>
      {/* Section Header */}
      <Text3D 
        content="SELECTED OBJECTS"
        position={[0, 3, -2]}
        fontSize={0.4}
        color="#C4A661"
        entranceDelay={0.5}
      />
      
      <InfoPanel3D
        content="Chosen for precision, presence, and permanence."
        position={[0, 2.2, -1.8]}
        width={5}
        height={0.6}
        fontSize={0.12}
        entranceDelay={1}
      />
      
      {/* Product Gallery Cards */}
      {vaultRelics.slice(0, 4).map((relic, i) => (
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
          entranceDelay={1.5 + i * 0.2}
        />
      ))}
    </group>
  );
};

export default ChamberVault;
