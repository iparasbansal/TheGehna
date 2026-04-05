import { motion } from 'framer-motion';
import { ShoppingBag, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useCart } from '../main';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

  // 1. Logic MUST live inside the component
  const handleAddToCart = (e) => { 
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 40,
      spread: 70,
      origin: { x, y },
      colors: ['#d4a34d', '#f9e27e', '#b8860b'], 
      ticks: 200,
      gravity: 1.2,
      scalar: 0.7,
      shapes: ['circle'],
    });

    // --- ADD THIS LINE HERE ---
    addToCart(product); 
    // --------------------------

    console.log(`Added ${product.name} to luxury bag`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden group p-4 backdrop-blur-sm"
    >
      <div className="relative h-80 overflow-hidden rounded-2xl bg-brand-maroon/10">
        <img 
          src={product.images[0]?.url || 'https://via.placeholder.com/400x400?text=The+Gehna+Gold'} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
           {/* Find the Eye Icon in your ProductCard.jsx */}
<Link 
  to={`/product/${product._id}`} // This sends the user to /product/12345
  className="bg-white text-black p-3 rounded-full hover:bg-brand-gold transition-colors"
>
  <Eye size={20} />
</Link>
           
           {/* 2. Button is now inside the return block where it belongs */}
           <button 
              onClick={handleAddToCart}
              className="bg-brand-gold text-brand-maroon p-3 rounded-full hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(212,163,77,0.3)]"
           >
              <ShoppingBag size={20} />
           </button>
        </div>
      </div>

      <div className="mt-6 px-2 pb-2">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-serif text-white group-hover:text-brand-gold transition-colors">
            {product.name}
          </h3>
          <span className="text-brand-gold font-bold">₹{product.price}</span>
        </div>
        <p className="text-xs text-white/40 uppercase tracking-widest font-sans">
          {product.category || '1-Gram Gold'}
        </p>
      </div>
    </motion.div>
  );
};

export default ProductCard;