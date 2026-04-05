import { useEffect, useState } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';

// 1. Move the variants OUTSIDE the component (cleaner)
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2 
    }
  }
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
        const params = new URLSearchParams(location.search);
      const keyword = params.get('keyword');
      
      const url = keyword 
        ? `http://localhost:3000/api/v1/products?keyword=${keyword}`
        : `http://localhost:3000/api/v1/products`;
      try {
        const { data } = await axios.get('http://localhost:3000/api/v1/products');
        setProducts(data.data); 
        setLoading(false);
      } catch (err) {
        console.error("Luxury Fetch Error:", err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Hero />
      
      <section className="py-20 px-6 md:px-20 bg-brand-dark">
        <div className="flex justify-between items-end mb-16">
          <div>
            <p className="text-brand-gold uppercase tracking-[0.3em] text-xs mb-2">Exclusive Collection</p>
            <h2 className="text-4xl md:text-5xl font-serif text-white">Signature Pieces</h2>
          </div>
          <div className="h-[1px] flex-1 bg-white/10 mx-10 mb-4 hidden md:block"></div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
             <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          // 2. We put the motion.div logic RIGHT HERE where the products live
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        )}
      </section>
    </motion.div>
  );
};

export default Home;