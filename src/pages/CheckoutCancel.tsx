import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useModalStore } from '@/stores/modalStore';

const CheckoutCancel = () => {
  const navigate = useNavigate();
  const openModal = useModalStore((state) => state.openModal);

  const handleViewCart = () => {
    navigate('/');
    setTimeout(() => {
      openModal('cart');
    }, 100);
  };

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
          <XCircle className="w-24 h-24 text-[#8C8C8C]" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-['Ancient_Medium'] text-[#C7A869] mb-4">
          Checkout Cancelled
        </h1>

        <p className="text-xl text-[#8C8C8C] mb-8">
          Your payment was not processed.
        </p>

        <div className="space-y-4">
          <p className="text-[#8C8C8C]">
            Your cart items have been saved. You can return to complete your purchase at any time.
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
              onClick={handleViewCart}
              className="bg-[#C7A869] hover:bg-[#B39858] text-black gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              View Cart
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutCancel;
