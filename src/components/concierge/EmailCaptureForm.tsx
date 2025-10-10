import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { OrderLanguage } from "@/lib/orderLanguage";

const EmailCaptureForm = () => {
  const [email, setEmail] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Store in localStorage
    localStorage.setItem("apollo_email_signup", email);
    localStorage.setItem("apollo_initiation_code", "APOLLO10");
    
    toast.success("Welcome to APOLLO! Your initiation code: APOLLO10", {
      duration: 8000,
      description: "You have been granted early access to sacred instruments and teachings.",
    });

    setHasSubmitted(true);
  };

  if (hasSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 max-w-2xl mx-auto py-12"
      >
        <h3 className="font-ancient text-3xl text-ancient-gold tracking-wide">
          The Oath is Sworn
        </h3>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Your initiation code has been granted. May clarity guide your journey.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <p className="font-ancient text-ancient-gold text-sm tracking-widest uppercase">
          {OrderLanguage.latin.circle}
        </p>
        <h2 className="text-4xl md:text-5xl font-serif text-ancient-gold">
          Tempus Domini Solis
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
          Join The Order and receive early access to APOLLO's curated instruments and sacred teachings.
        </p>
        <p className="text-ancient-gold font-medium text-xl">
          10% initiation gift granted.
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div className="space-y-3">
          <Label htmlFor="email" className="text-sm font-ancient tracking-wider text-muted-foreground uppercase">
            Your Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            required
            className="h-14 border-ancient-gold/30 focus:border-ancient-gold transition-colors bg-background/50 text-lg"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-14 text-base bg-ancient-gold/10 border border-ancient-gold/50 hover:bg-ancient-gold/20 hover:border-ancient-gold text-ancient-gold font-ancient tracking-widest uppercase transition-all duration-300"
        >
          Take the Oath
        </Button>

        <p className="text-xs text-muted-foreground/70 text-center leading-relaxed">
          By subscribing, you agree to receive marketing communications. Unsubscribe anytime.
        </p>
      </motion.form>
    </div>
  );
};

export default EmailCaptureForm;
