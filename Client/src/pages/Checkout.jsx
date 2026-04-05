import { useState } from 'react';
import { useCart } from '../main';
import { motion } from 'framer-motion';

const Checkout = () => {
  const { cart, total } = useCart();
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', address: '', city: 'Sangrur', pincode: ''
  });

  const handleOrder = async (e) => {
    e.preventDefault();
    // This is where we will trigger Razorpay later
    console.log("Processing order for THE GEHNA...", formData);
    alert("Proceeding to Secure Payment...");
  };

  return (
    <div className="pt-32 pb-20 px-6 md:px-20 min-h-screen bg-brand-maroon">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left: Shipping Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-3xl font-serif text-brand-gold mb-8">Shipping Details</h2>
          <form onSubmit={handleOrder} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" placeholder="Full Name" required className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-brand-gold text-white" />
              <input type="email" placeholder="Email Address" required className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-brand-gold text-white" />
            </div>
            <input type="text" placeholder="Street Address" required className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-brand-gold text-white" />
            <div className="grid grid-cols-2 gap-6">
              <input type="text" placeholder="City" value={formData.city} className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none text-white" />
              <input type="text" placeholder="Pincode" required className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-brand-gold text-white" />
            </div>
            <button className="w-full py-5 bg-brand-gold text-brand-maroon font-bold rounded-2xl hover:bg-white transition-all uppercase tracking-widest text-lg shadow-xl">
              Pay Now ₹{total}
            </button>
          </form>
        </motion.div>

        {/* Right: Order Summary */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-black/20 p-8 rounded-3xl border border-white/5 h-fit">
          <h2 className="text-xl font-serif text-brand-gold mb-6 border-b border-white/10 pb-4">Order Summary</h2>
          <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6">
            {cart.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-white/70">{item.name}</span>
                <span className="text-brand-gold font-bold">₹{item.price}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-6 flex justify-between items-center">
            <span className="text-lg text-white uppercase tracking-widest">Grand Total</span>
            <span className="text-2xl text-brand-gold font-bold">₹{total}</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Checkout;