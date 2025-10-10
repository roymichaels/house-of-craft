import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // Clear the cart after successful checkout
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8 flex justify-center"
        >
          <CheckCircle2 className="w-24 h-24 text-[#C7A869]" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-['Ancient_Medium'] text-[#C7A869] mb-4">
          Order Confirmed
        </h1>

        <p className="text-xl text-[#8C8C8C] mb-8">
          Your order has been successfully placed.
        </p>

        {sessionId && (
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6 mb-8">
            <p className="text-sm text-[#666666] mb-2">Order Reference</p>
            <p className="text-[#C7A869] font-mono text-sm break-all">
              {sessionId}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-[#8C8C8C]">
            A confirmation email has been sent to your email address with order details and tracking information.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Return Home
            </Button>
            
            <Button
              onClick={() => navigate('/#vault')}
              className="bg-[#C7A869] hover:bg-[#B39858] text-black"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutSuccess;
