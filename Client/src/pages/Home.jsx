import { useState, useRef, useEffect, useMemo } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles, ChevronDown, Eye, ShoppingBag, X } from "lucide-react"
import axios from 'axios'
import { useCart } from '../main' 

// --- 3D ENGINE (CLEAN ELLIPTICAL MOTION) ---
function FlyingCard({ product, index, onHover, isHovered, onClick }) {
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 })
  const timeRef = useRef(0)

  const physics = useMemo(() => ({
    // Slower, more majestic speed for professionalism
    speed: 0.0002 + (index * 0.00005), 
    // Wider orbits to keep the center name clear
    rangeX: 450 + (index % 4) * 40,
    rangeY: 120 + (index % 3) * 30,
    depth: 200 + (index % 2) * 100,
    phase: (index / 8) * Math.PI * 2,
  }), [index]);
  
  useEffect(() => {
    if (!product) return;
    const animate = () => {
      timeRef.current += 1
      const t = timeRef.current * physics.speed + physics.phase
      
      // Clean, majestic elliptical paths
      setPosition({
        x: Math.cos(t) * physics.rangeX,
        y: Math.sin(t * 0.5) * physics.rangeY,
        z: Math.sin(t) * physics.depth - 150
      })
      requestAnimationFrame(animate)
    }
    const animId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animId)
  }, [product, physics]);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 cursor-pointer"
      style={{
        transform: `translate(-50%, -50%) translate3d(${position.x}px, ${position.y}px, ${position.z}px) scale(${isHovered ? 1.4 : 1})`,
        transformStyle: "preserve-3d",
        zIndex: isHovered ? 1000 : Math.round(position.z + 500),
      }}
      onMouseEnter={() => onHover(product._id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
    >
      <div className={`w-40 h-56 rounded-lg border border-brand-gold/20 transition-all duration-1000 ${isHovered ? 'border-brand-gold shadow-[0_0_80px_rgba(212,163,77,0.4)]' : 'bg-black/60 shadow-2xl'}`}>
        <img src={product.images?.[0]?.url || "/logo.png"} className="w-full h-32 object-cover rounded-t-lg opacity-90" alt={product.name} />
        <div className="p-3 text-center">
          <h3 className="text-brand-gold font-serif text-[8px] tracking-[0.2em] uppercase">{product.name}</h3>
          <p className="text-white/20 text-[6px] mt-2 tracking-widest uppercase font-mono">24K Acquisition</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const [products, setProducts] = useState([])
  const [hoveredCard, setHoveredCard] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const { addToCart } = useCart() 
  const gridRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/v1/products")
        setProducts(data.data)
      } catch (err) { console.error(err) } finally { setLoading(false) }
    }
    fetch()
  }, [])

  if (loading) return <div className="h-screen w-full bg-obsidian flex items-center justify-center"><div className="w-10 h-10 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" /></div>

  return (
    <div className="bg-obsidian text-ivory min-h-screen font-sans selection:bg-brand-gold">
      
      {/* 1. ATMOSPHERIC LAYERS */}
      <div className="fixed inset-0 z-0 bg-[#050505]" />
      <div className="fixed inset-0 z-0 bg-gradient-to-tr from-black via-brand-dark/20 to-brand-maroon/10" />
      
      {/* 2. THE CENTRAL "CLEARING" GLOW */}
      <div className="fixed inset-0 pointer-events-none z-[5] bg-[radial-gradient(circle_at_center,rgba(212,163,77,0.12)_0%,transparent_50%)]" />

      {/* HERO SECTION */}
      <motion.section style={{ opacity }} className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        
        {/* --- HIGH-CONTRAST GOLDEN BRANDING --- */}
        <div className="z-20 text-center pointer-events-none relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 2, ease: "easeOut" }}
          >
            {/* The Text with Outer Glow instead of Box */}
            <h1 className="text-6xl md:text-9xl lg:text-[9vw] font-serif tracking-[0.4em] uppercase leading-none 
                           text-[#d4a34d] drop-shadow-[0_0_50px_rgba(212,163,77,0.6)] 
                           selection:text-gold filter brightness-125">
              THE GEHNA
            </h1>
            <p className="text-[#d4a34d]/60 tracking-[1.5em] text-[9px] md:text-[11px] uppercase mt-12 ml-[1.5em] font-light">
              THE INFINITE VAULT
            </p>
          </motion.div>
        </div>

        {/* 3D MAJESTIC ORBIT (Wider range to prevent overlap) */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "2500px", transformStyle: "preserve-3d" }}>
          {products.slice(0, 8).map((p, i) => (
            <FlyingCard key={p._id} product={p} index={i} onHover={setHoveredCard} isHovered={hoveredCard === p._id} onClick={() => setSelectedProduct(p)} />
          ))}
        </div>
        
        <div className="absolute bottom-12 z-30 flex flex-col items-center gap-4">
           <button onClick={() => gridRef.current?.scrollIntoView({ behavior: 'smooth' })} className="px-10 py-4 rounded-full border border-brand-gold/30 bg-black/40 backdrop-blur-sm text-brand-gold text-[10px] tracking-[0.3em] uppercase hover:bg-brand-gold hover:text-black transition-all duration-500">
              Browse Collection
           </button>
           <ChevronDown className="text-brand-gold/40 animate-bounce" size={24} />
        </div>
      </motion.section>

      {/* PRODUCT GRID */}
      <section ref={gridRef} className="relative z-20 py-40 px-6 md:px-24 max-w-[1600px] mx-auto bg-[#050505]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-32">
          {products.map((product) => (
            <motion.div key={product._id} className="group cursor-pointer relative">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#080808] border border-brand-gold/10 shadow-2xl">
                <img src={product.images?.[0]?.url || "/logo.png"} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-1000" alt={product.name} />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-6">
                  <button onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }} className="p-4 rounded-full border border-brand-gold/40 text-brand-gold backdrop-blur-xl hover:bg-brand-gold hover:text-black transition-all"><Eye size={18} /></button>
                  <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="p-4 rounded-full border border-brand-gold/40 text-brand-gold backdrop-blur-xl hover:bg-brand-gold hover:text-black transition-all"><ShoppingBag size={18} /></button>
                </div>
              </div>
              <div className="mt-10 flex justify-between items-baseline border-b border-brand-gold/10 pb-6">
                  <h4 className="text-xl font-serif tracking-[0.1em] text-brand-gold uppercase">{product.name}</h4>
                  <span className="text-brand-gold/60 font-mono text-sm">₹{product.price}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* QUICK VIEW MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setSelectedProduct(null)}>
            <motion.div onClick={e => e.stopPropagation()} className="relative max-w-4xl w-full bg-[#0a0a0a] border border-brand-gold/20 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 z-10 text-brand-gold hover:scale-125 transition-transform"><X size={28} /></button>
              <div className="h-full bg-black"><img src={selectedProduct.images?.[0]?.url} className="w-full h-full object-cover" alt={selectedProduct.name} /></div>
              <div className="p-12 flex flex-col justify-center gap-8">
                <h2 className="text-5xl font-serif text-brand-gold uppercase leading-tight">{selectedProduct.name}</h2>
                <p className="text-white/40 text-xs uppercase tracking-[0.2em] leading-relaxed">{selectedProduct.description || "Exquisite 1-gram gold acquisition."}</p>
                <div className="text-3xl font-mono text-brand-gold tracking-tighter">₹{selectedProduct.price}</div>
                <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="w-full py-5 bg-brand-gold text-black font-bold uppercase tracking-[0.4em] hover:bg-white transition-all duration-500">Add to Vault</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-24 text-center border-t border-brand-gold/5 opacity-40">
         <p className="text-brand-gold text-[10px] tracking-[0.8em] uppercase italic">© 2026 THE GEHNA • SANGUR</p>
      </footer>
    </div>
  )
}