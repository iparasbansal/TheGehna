import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// 1. IMPORT YOUR CENTRAL API TOOL
import api from '../api'; 
import { useCart } from '../main';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, RotateCcw, ShoppingBag } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // 2. UPDATED TO USE api.get (NO LOCALHOST STRING NEEDED)
        const { data } = await api.get(`/products/${id}`);
        
        if (data.success) {
          setProduct(data.data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Detail Fetch Error:", err);
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="h-screen bg-[#633131] flex items-center justify-center text-[#d4a34d] font-serif text-2xl animate-pulse">
      Loading Masterpiece...
    </div>
  );

  if (!product) return (
    <div className="h-screen bg-[#633131] flex items-center justify-center text-white font-serif">
      Masterpiece not found in The Vault.
    </div>
  );

  return (
    <div className="pt-32 pb-20 px-6 md:px-20 min-h-screen bg-[#633131] text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left: Sticky Image Gallery */}
        <div className="lg:sticky lg:top-32 h-fit">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/20"
          >
            <img 
              src={product.images?.[0]?.url || '/logo.png'} 
              alt={product.name} 
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
        </div>

        {/* Right: Product Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <p className="text-[#d4a34d] uppercase tracking-[0.4em] text-xs mb-4 font-bold">The Collection 2026</p>
            <h1 className="text-5xl md:text-6xl font-serif leading-tight text-white">{product.name}</h1>
            <p className="text-3xl text-[#d4a34d] font-bold mt-4 font-sans">₹{product.price}</p>
          </div>

          <p className="text-white/70 leading-relaxed text-lg font-light italic">
            {product.description || "A signature 1-gram gold masterpiece, handcrafted with precision to ensure timeless elegance. Designed for those who seek luxury within reach."}
          </p>

          <button 
            onClick={() => addToCart(product)}
            className="w-full py-5 bg-[#d4a34d] text-[#633131] font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all text-xl shadow-lg uppercase tracking-widest"
          >
            <ShoppingBag size={24} /> ADD TO LUXURY BAG
          </button>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-white/10">
            <div className="flex flex-col items-center text-center gap-2">
              <ShieldCheck className="text-[#d4a34d]" size={28} />
              <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Certified 1g Gold</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <Truck className="text-[#d4a34d]" size={28} />
              <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Fast Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <RotateCcw className="text-[#d4a34d]" size={28} />
              <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">7-Day Returns</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;