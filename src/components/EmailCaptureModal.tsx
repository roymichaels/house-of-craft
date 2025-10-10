import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { toast } from "sonner";

const EmailCaptureModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if user has already signed up or dismissed
    const hasSignedUp = localStorage.getItem("apollon_email_signup");
    const hasDismissed = sessionStorage.getItem("apollon_email_dismissed");

    if (!hasSignedUp && !hasDismissed) {
      // Show modal after 3 seconds
      const timer = setTimeout(() => setIsOpen(true), 3000);
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
      <DialogContent className="sm:max-w-md grain">
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader>
          <DialogTitle className="text-2xl font-ancient text-ancient-gold">Join The Order</DialogTitle>
          <DialogDescription className="text-base pt-2">
            Receive early access to APOLLON's curated instruments and sacred teachings. <span className="text-primary font-medium">10% initiation discount</span> granted.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 text-base beam-ripple"
          >
            {isSubmitting ? "Processing..." : "Take the Oath"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By subscribing, you agree to receive marketing communications. Unsubscribe anytime.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmailCaptureModal;
