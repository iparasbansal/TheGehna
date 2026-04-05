import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from "../main";
import { X, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { cart, isOpen, setIsOpen, removeFromCart, total } = useCart();

  const navigate = useNavigate();

const handleCheckoutClick = () => {
  setIsOpen(false);
  navigate('/checkout');
};

  return (
    <AnimatePresence>
      {isOpen && (
        <>
        <motion.div 
  className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-brand-maroon border-l border-white/10 z-[101] p-8 shadow-2xl flex flex-col"
></motion.div>

          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-[#0a0a0a] border-l border-brand-gold/30 z-[101] p-8 shadow-2xl flex flex-col"
>
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-serif text-brand-gold">Your Luxury Bag</h2>
              <X className="text-white/50 cursor-pointer hover:text-white" onClick={() => setIsOpen(false)} />
            </div>

            <div className="flex-grow overflow-y-auto space-y-6">
              {cart.length === 0 ? (
                <p className="text-white/30 italic text-center mt-20">The bag is empty...</p>
              ) : (
                cart.map((item, index) => (
                  <div key={index} className="flex gap-4 items-center bg-[#141414] p-4 rounded-xl border border-white/5 hover:border-brand-gold/40 transition-all duration-500">
                    <img src={item.images[0]?.url} className="w-16 h-16 object-cover rounded-lg" alt="" />
                    <div className="flex-grow">
                      <h4 className="text-sm text-white font-serif">{item.name}</h4>
                      <p className="text-brand-gold text-xs">₹{item.price}</p>
                    </div>
                    <Trash2 size={16} className="text-white/20 hover:text-red-500 cursor-pointer" onClick={() => removeFromCart(item._id)} />
                  </div>
                ))
              )}
            </div>

            <div className="mt-auto pt-8 border-t border-white/10">
              <div className="flex justify-between mb-6">
                <span className="text-white/50 uppercase tracking-widest text-xs">Total Value</span>
                <span className="text-brand-gold font-bold text-xl">₹{total}</span>
              </div>
              <button 
  onClick={handleCheckoutClick}
  className="w-full py-4 bg-brand-gold text-brand-maroon font-bold rounded-xl"
>
  Proceed to Checkout
</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;