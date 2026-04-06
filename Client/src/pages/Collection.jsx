import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Eye, ShoppingBag, X } from 'lucide-react';
// 1. IMPORT YOUR CENTRAL API TOOL
import API from '../api';
import { useCart } from '../main';

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
        // 2. UPDATED TO USE API.GET
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

  // Filter logic whenever products or search term changes
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

  if (loading) return <div className="h-screen bg-obsidian flex items-center justify-center text-brand-gold animate-pulse">LOADING THE VAULT...</div>;

  return (
    <div className="bg-[#050505] min-h-screen pt-32 px-6 md:px-24">
      {/* Search Header */}
      <div className="max-w-[1600px] mx-auto mb-20 reveal">
        <h1 className="text-4xl md:text-6xl font-serif text-brand-gold uppercase tracking-widest">
          {searchTerm ? `FOUND: ${searchTerm}` : 'Full Collection'}
        </h1>
        <div className="h-[1px] w-24 bg-brand-gold mt-6 opacity-40"></div>
      </div>

      {/* Grid */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 pb-20">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <div key={product._id} className={`luxury-card reveal delay-${(index % 3) + 1}`}>
              <div className="aspect-[3/4] overflow-hidden relative group">
                <img src={product.images?.[0]?.url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={product.name} />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button onClick={() => addToCart(product)} className="p-3 rounded-full border border-brand-gold/50 text-brand-gold hover:bg-brand-gold hover:text-black transition-all">
                    <ShoppingBag size={18} />
                  </button>
                </div>
              </div>
              <div className="p-6 border-t border-brand-gold/10">
                <h3 className="text-brand-gold text-xs tracking-widest font-serif uppercase">{product.name}</h3>
                <p className="text-white/60 text-lg mt-2 font-mono">₹{product.price}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-40">
             <p className="text-brand-gold/40 tracking-[1em] uppercase">No pieces found in the vault</p>
             <button onClick={() => setSearchParams({})} className="mt-8 text-brand-gold border-b border-brand-gold/20 pb-1 text-[10px] tracking-widest">VIEW ALL</button>
          </div>
        )}
      </div>
    </div>
  );
}