import { motion } from 'framer-motion';
import { VaultOrder } from '@/data/vaultOrders';

interface VaultOrderTabsProps {
  orders: VaultOrder[];
  activeOrder: string | null;
  onSelectOrder: (orderId: string) => void;
}

const VaultOrderTabs = ({ orders, activeOrder, onSelectOrder }: VaultOrderTabsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 px-6 py-12">
      {orders.map((order, index) => (
        <motion.button
          key={order.id}
          onClick={() => onSelectOrder(order.id)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
          className={`
            group relative p-8 border-2 transition-all duration-700
            ${activeOrder === order.id
              ? 'border-primary bg-primary/10 shadow-[0_0_40px_rgba(196,166,97,0.3)]'
              : 'border-border/30 hover:border-primary/50 hover:bg-primary/5'
            }
          `}
          style={{
            backgroundColor: activeOrder === order.id 
              ? `${order.colorTheme.glow}` 
              : undefined,
          }}
        >
          {/* Icon - Renaissance AI-generated image */}
          <div className="relative w-24 h-24 mb-4 mx-auto">
            <img 
              src={order.iconImage} 
              alt={`${order.title} icon`}
              className="w-full h-full object-cover rounded-lg opacity-80 
                         group-hover:opacity-100 group-hover:scale-110
                         transition-all duration-700 
                         shadow-[0_0_20px_rgba(0,0,0,0.5)]
                         group-hover:shadow-[0_0_30px_rgba(196,166,97,0.4)]"
            />
            {/* Golden overlay on hover */}
            <div 
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 
                         transition-opacity duration-500 pointer-events-none"
              style={{ backgroundColor: order.colorTheme.primary }}
            />
          </div>

          {/* Title */}
          <h3 className="font-ancient text-xl md:text-2xl text-foreground mb-2 
                         group-hover:text-primary transition-colors">
            {order.title.replace('Order of ', '')}
          </h3>

          {/* Microcopy */}
          <p className="text-xs text-muted-foreground tracking-wider mb-3 opacity-0 
                        group-hover:opacity-100 transition-opacity duration-500">
            {order.microcopy}
          </p>

          {/* Essence */}
          <p className="text-sm text-muted-foreground/80 italic leading-relaxed">
            {order.essence}
          </p>

          {/* Latin inscription (appears on hover) */}
          <motion.p
            className="absolute bottom-4 left-0 right-0 text-center text-xs 
                       text-primary/60 tracking-[0.2em] opacity-0 
                       group-hover:opacity-100 transition-opacity duration-500"
          >
            {order.latinInscription}
          </motion.p>

          {/* Hover glow effect */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 
                       transition-opacity duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${order.colorTheme.glow} 0%, transparent 70%)`,
            }}
          />
        </motion.button>
      ))}
    </div>
  );
};

export default VaultOrderTabs;
