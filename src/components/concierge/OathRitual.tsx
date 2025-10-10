import { useState } from "react";
import { motion } from "framer-motion";
import { OrderLanguage } from "@/lib/orderLanguage";
import { toast } from "sonner";

const OathRitual = () => {
  const [name, setName] = useState("");
  const [sworn, setSworn] = useState(false);

  const handleSwearOath = () => {
    if (!name.trim()) {
      toast.error("You must speak your name to swear the oath");
      return;
    }
    
    localStorage.setItem("house-oath-sworn", name);
    setSworn(true);
    
    setTimeout(() => {
      toast.success("Welcome to The Inner Chamber", {
        description: `${name}, you are now bound to The Order.`
      });
    }, 1000);
  };

  if (sworn) {
    return (
      <motion.div 
        className="text-center space-y-8 py-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-radial from-ancient-gold/20 via-ancient-gold/10 to-transparent" />
        <h3 className="font-ancient text-3xl text-ancient-gold tracking-wider">
          Welcome, {name}
        </h3>
        <p className="text-ancient-silver/60 text-sm tracking-widest uppercase">
          You Are Now Bound to The Order
        </p>
      </motion.div>
    );
  }

  return (
    <div className="text-center space-y-8 py-8">
      <motion.p 
        className="font-ancient text-2xl md:text-3xl text-ancient-gold tracking-wider"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {OrderLanguage.latin.circle}
      </motion.p>
      
      <motion.p 
        className="text-muted-foreground italic text-base md:text-lg leading-relaxed max-w-md mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        "To command others, one must first command himself."
      </motion.p>
      
      <motion.div
        className="space-y-4 pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <input 
          type="text"
          placeholder="Speak your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSwearOath()}
          className="w-full max-w-sm mx-auto block px-6 py-3 bg-background/50 border border-ancient-gold/30 rounded-md text-center font-ancient text-ancient-gold placeholder:text-ancient-silver/40 focus:outline-none focus:border-ancient-gold/60 transition-colors"
        />
        
        <button 
          onClick={handleSwearOath}
          className="group relative px-8 py-3 font-ancient text-ancient-gold text-lg tracking-wider hover:text-ancient-gold/80 transition-colors"
        >
          <span className="relative z-10">{OrderLanguage.actions.swear}</span>
          <span className="absolute inset-0 border border-ancient-gold/50 rounded-md group-hover:border-ancient-gold/80 transition-colors" />
          <span className="absolute inset-0 bg-ancient-gold/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </motion.div>
    </div>
  );
};

export default OathRitual;
