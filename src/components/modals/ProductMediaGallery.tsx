import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { MediaItem } from "@/stores/modalStore";
import { Play } from "lucide-react";

interface ProductMediaGalleryProps {
  media: MediaItem[];
  title: string;
}

export const ProductMediaGallery = ({ media, title }: ProductMediaGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = media[activeIndex];

  return (
    <div className="relative h-full flex flex-col gap-3">
      {/* Main Media Display */}
      <div className="relative flex-1 flex items-center justify-center rounded-lg overflow-hidden 
                      bg-gradient-to-br from-black/80 to-obsidian-core/90 
                      border border-ancient-gold/20 group">
        
        {/* Cinematic lighting overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-ancient-gold/5 to-transparent 
                        pointer-events-none z-10" />
        
        <AnimatePresence mode="wait">
          {activeItem.type === 'image' ? (
            <TransformWrapper
              key={activeIndex}
              initialScale={1}
              minScale={1}
              maxScale={3}
              centerOnInit
            >
              <TransformComponent>
                <motion.div
                  className="w-full h-full flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={activeItem.url}
                    alt={`${title} - Image ${activeIndex + 1}`}
                    className="w-full h-full object-contain aspect-square"
                  />
                </motion.div>
              </TransformComponent>
            </TransformWrapper>
          ) : (
            <motion.div
              key={activeIndex}
              className="w-full h-full flex items-center justify-center aspect-square"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <video
                src={activeItem.url}
                controls
                className="w-full h-full object-contain"
                poster={activeItem.thumbnail}
              >
                Your browser does not support the video tag.
              </video>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Thumbnail Navigation */}
      {media.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-ancient-gold/20 
                        scrollbar-track-transparent">
          {media.map((item, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden 
                         border-2 transition-all duration-300
                         ${activeIndex === index 
                           ? 'border-ancient-gold shadow-[0_0_20px_rgba(196,166,97,0.4)]' 
                           : 'border-ancient-gold/20 hover:border-ancient-gold/50'
                         }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={item.thumbnail || item.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Video indicator */}
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center 
                                bg-black/40 backdrop-blur-[1px]">
                  <Play className="w-4 h-4 text-ancient-gold" fill="currentColor" />
                </div>
              )}
              
              {/* Active indicator glow */}
              {activeIndex === index && (
                <motion.div
                  className="absolute inset-0 bg-ancient-gold/10"
                  layoutId="activeThumbnail"
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};
