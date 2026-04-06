import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Eye, ShoppingBag, X } from 'lucide-react';
import API from '../api';
import { useCart } from '../main';
import { motion } from 'framer-motion'; // Added for smooth reveal

export default function Collection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const searchTerm = searchParams.get('search') || "";

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get("/products");
        setProducts(data.data);
      } catch (err) { 
        console.error("Vault Collection Error:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  if (loading) return <div className="h-screen bg-[#050505] flex items-center justify-center text-brand-gold animate-pulse tracking-[0.5em] text-xs">LOADING THE VAULT...</div>;

  return (
    <div className="bg-[#050505] min-h-screen pt-24 md:pt-32 px-4 md:px-24">
      {/* Search Header */}
      <div className="max-w-[1600px] mx-auto mb-12 md:mb-20">
        <h1 className="text-2xl md:text-6xl font-serif text-brand-gold uppercase tracking-[0.2em] md:tracking-widest">
          {searchTerm ? `FOUND: ${searchTerm}` : 'Full Collection'}
        </h1>
        <div className="h-[1px] w-16 md:w-24 bg-brand-gold mt-4 md:mt-6 opacity-40"></div>
      </div>

      {/* Grid: FIXED FOR MOBILE (2 COLUMNS) */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-12 pb-20">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <motion.div 
              key={product._id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 4) * 0.1 }}
              className="luxury-card border border-brand-gold/5 bg-black/20"
            >
              <div className="aspect-[3/4] overflow-hidden relative group">
                <img 
                  src={product.images?.[0]?.url || "/logo.png"} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  alt={product.name} 
                />
                
                {/* BUTTONS: Always visible on mobile (opacity-100), hidden on desktop until hover (md:opacity-0) */}
                <div className="absolute inset-0 bg-black/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={(e) => { e.stopPropagation(); addToCart(product); }} 
                    className="p-3 md:p-4 rounded-full border border-brand-gold/50 text-brand-gold bg-black/40 backdrop-blur-md hover:bg-brand-gold hover:text-black transition-all shadow-xl"
                  >
                    <ShoppingBag size={18} />
                  </button>
                </div>
              </div>

              <div className="p-3 md:p-6 border-t border-brand-gold/10">
                <h3 className="text-brand-gold text-[10px] md:text-xs tracking-widest font-serif uppercase truncate">
                  {product.name}
                </h3>
                <p className="text-white/60 text-sm md:text-lg mt-1 md:mt-2 font-mono">
                  ₹{product.price}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-40">
             <p className="text-brand-gold/40 tracking-[0.5em] md:tracking-[1em] uppercase text-xs">No pieces found in the vault</p>
             <button onClick={() => setSearchParams({})} className="mt-8 text-brand-gold border-b border-brand-gold/20 pb-1 text-[10px] tracking-widest hover:text-white transition-colors">VIEW ALL</button>
          </div>
        )}
      </div>
    </div>
  );
}