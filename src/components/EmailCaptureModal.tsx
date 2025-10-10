import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { toast } from "sonner";
import { OrderLanguage } from "@/lib/orderLanguage";

const EmailCaptureModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Migrate old storage keys
    const oldHouseKey = localStorage.getItem("house-visited");
    if (oldHouseKey) {
      localStorage.removeItem("house-visited");
    }

    // Check if user has already signed up or dismissed
    const hasSignedUp = localStorage.getItem("apollon_email_signup");
    const hasDismissed = sessionStorage.getItem("apollon_email_dismissed");
    const hasEnteredRitual = localStorage.getItem("apollon-visited");

    // Only show if user has completed ritual entry, hasn't signed up, and hasn't dismissed
    if (hasEnteredRitual && !hasSignedUp && !hasDismissed) {
      // Show modal after 5 seconds (gives time for ritual entry to complete)
      const timer = setTimeout(() => setIsOpen(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    // TODO: Connect to Lovable Cloud to store email and generate discount code
    // For now, store in localStorage
    localStorage.setItem("apollon_email_signup", email);
    localStorage.setItem("apollon_initiation_code", "APOLLON10");

    toast.success("Welcome to APOLLON! Your initiation code: APOLLON10", {
      duration: 8000,
      description: "You have been granted early access to sacred instruments and teachings.",
    });

    setIsOpen(false);
    setIsSubmitting(false);
  };

  const handleDismiss = () => {
    sessionStorage.setItem("apollon_email_dismissed", "true");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-md border-ancient-gold/20 grain animate-scale-in">
        {/* Golden orb accent */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-gradient-radial from-ancient-gold/40 via-ancient-gold/10 to-transparent blur-2xl pointer-events-none" />
        
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ancient-gold/50 focus:ring-offset-2"
        >
          <X className="h-4 w-4 text-ancient-gold" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader className="space-y-3 pt-2">
          {/* Latin inscription */}
          <p className="text-xs tracking-[0.3em] text-ancient-gold/60 uppercase text-center font-order">
            {OrderLanguage.latin.circle}
          </p>
          
          {/* Main title */}
          <DialogTitle className="text-3xl font-apollon text-ancient-gold text-center tracking-wide">
            Join The Order
          </DialogTitle>
          
          {/* Description */}
          <DialogDescription className="text-center text-base leading-relaxed pt-1">
            Receive early access to APOLLON's curated instruments and sacred teachings.
            <span className="block mt-2 text-ancient-gold font-medium">
              10% initiation gift granted.
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-order tracking-wider text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 border-ancient-gold/20 focus:border-ancient-gold transition-colors bg-background/50"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-base bg-ancient-gold/10 border border-ancient-gold/50 hover:bg-ancient-gold/20 hover:border-ancient-gold text-ancient-gold font-order tracking-wider beam-ripple transition-all duration-300"
          >
            {isSubmitting ? "Processing..." : "Take the Oath"}
          </Button>

          <p className="text-xs text-muted-foreground/70 text-center leading-relaxed">
            By subscribing, you agree to receive marketing communications. Unsubscribe anytime.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmailCaptureModal;
