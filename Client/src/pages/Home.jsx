import { useState, useRef, useEffect, useMemo } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles, ChevronDown, Eye, ShoppingBag, X } from "lucide-react"
import API from '../api' 
import { useCart } from '../main' 

function FlyingCard({ product, index, onHover, isHovered, onClick }) {
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 })
  const timeRef = useRef(0)

  const physics = useMemo(() => ({
    speed: 0.0002 + (index * 0.00005), 
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
        const { data } = await API.get("/products")
        setProducts(data.data)
      } catch (err) { 
        console.error("Vault Connection Failed:", err) 
      } finally { 
        setLoading(false) 
      }
    }
    fetch()
  }, [])

  if (loading) return <div className="h-screen w-full bg-obsidian flex items-center justify-center"><div className="w-10 h-10 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" /></div>

  return (
    <div className="bg-obsidian text-ivory min-h-screen font-sans selection:bg-brand-gold">
      
      <div className="fixed inset-0 z-0 bg-[#050505]" />
      <div className="fixed inset-0 z-0 bg-gradient-to-tr from-black via-brand-dark/20 to-brand-maroon/10" />
      <div className="fixed inset-0 pointer-events-none z-[5] bg-[radial-gradient(circle_at_center,rgba(212,163,77,0.12)_0%,transparent_50%)]" />

      <motion.section style={{ opacity }} className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="z-20 text-center pointer-events-none relative px-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 2, ease: "easeOut" }}>
            <h1 className="text-5xl md:text-9xl lg:text-[9vw] font-serif tracking-[0.2em] md:tracking-[0.4em] uppercase leading-none text-[#d4a34d] drop-shadow-[0_0_50px_rgba(212,163,77,0.6)] selection:text-gold filter brightness-125">
              THE GEHNA
            </h1>
            <p className="text-[#d4a34d]/60 tracking-[0.8em] md:tracking-[1.5em] text-[8px] md:text-[11px] uppercase mt-8 md:mt-12 md:ml-[1.5em] font-light">
              THE INFINITE VAULT
            </p>
          </motion.div>
        </div>

        {/* 3D MAJESTIC ORBIT (Hidden on small screens to prevent clutter) */}
        <div className="hidden md:flex absolute inset-0 items-center justify-center" style={{ perspective: "2500px", transformStyle: "preserve-3d" }}>
          {products.slice(0, 8).map((p, i) => (
            <FlyingCard key={p._id} product={p} index={i} onHover={setHoveredCard} isHovered={hoveredCard === p._id} onClick={() => setSelectedProduct(p)} />
          ))}
        </div>
        
        <div className="absolute bottom-12 z-30 flex flex-col items-center gap-4">
           <button onClick={() => gridRef.current?.scrollIntoView({ behavior: 'smooth' })} className="px-8 md:px-10 py-4 rounded-full border border-brand-gold/30 bg-black/40 backdrop-blur-sm text-brand-gold text-[9px] md:text-[10px] tracking-[0.3em] uppercase hover:bg-brand-gold hover:text-black transition-all duration-500">
              Browse Collection
           </button>
           <ChevronDown className="text-brand-gold/40 animate-bounce" size={20} />
        </div>
      </motion.section>

      {/* PRODUCT GRID - FIXED FOR MOBILE (2 COLUMNS) */}
      <section ref={gridRef} className="relative z-20 py-20 md:py-40 px-4 md:px-24 max-w-[1600px] mx-auto bg-[#050505]">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12 md:gap-x-16 md:gap-y-32">
          {products.map((product) => (
            <motion.div 
              key={product._id} 
              className="group cursor-pointer relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#080808] border border-brand-gold/10 shadow-2xl">
                <img src={product.images?.[0]?.url || "/logo.png"} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-1000" alt={product.name} />
                
                {/* BUTTONS: Always visible on Mobile (opacity-100), Hidden-until-hover on Desktop (md:opacity-0) */}
                <div className="absolute inset-0 bg-black/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-3 md:gap-6">
                  <button onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }} className="p-3 md:p-4 rounded-full border border-brand-gold/40 text-brand-gold backdrop-blur-xl hover:bg-brand-gold hover:text-black transition-all">
                    <Eye size={16} className="md:size-[18px]" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="p-3 md:p-4 rounded-full border border-brand-gold/40 text-brand-gold backdrop-blur-xl hover:bg-brand-gold hover:text-black transition-all">
                    <ShoppingBag size={16} className="md:size-[18px]" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 md:mt-10 flex flex-col md:flex-row justify-between items-start md:items-baseline border-b border-brand-gold/10 pb-4 md:pb-6">
                  <h4 className="text-xs md:text-xl font-serif tracking-[0.1em] text-brand-gold uppercase">{product.name}</h4>
                  <span className="text-brand-gold/60 font-mono text-[10px] md:text-sm">₹{product.price}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* QUICK VIEW MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-md flex items-center justify-center p-4 md:p-6" onClick={() => setSelectedProduct(null)}>
            <motion.div onClick={e => e.stopPropagation()} className="relative max-w-4xl w-full bg-[#0a0a0a] border border-brand-gold/20 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto md:overflow-hidden">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 md:top-6 md:right-6 z-10 text-brand-gold hover:scale-125 transition-transform"><X size={24} md:size={28} /></button>
              <div className="h-64 md:h-full bg-black"><img src={selectedProduct.images?.[0]?.url} className="w-full h-full object-cover" alt={selectedProduct.name} /></div>
              <div className="p-8 md:p-12 flex flex-col justify-center gap-6 md:gap-8">
                <h2 className="text-3xl md:text-5xl font-serif text-brand-gold uppercase leading-tight">{selectedProduct.name}</h2>
                <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-[0.2em] leading-relaxed">{selectedProduct.description || "Exquisite 1-gram gold acquisition."}</p>
                <div className="text-2xl md:text-3xl font-mono text-brand-gold tracking-tighter">₹{selectedProduct.price}</div>
                <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="w-full py-4 md:py-5 bg-brand-gold text-black font-bold uppercase tracking-[0.2em] md:tracking-[0.4em] hover:bg-white transition-all duration-500">Add to Vault</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-16 md:py-24 text-center border-t border-brand-gold/5 opacity-40">
         <p className="text-brand-gold text-[8px] md:text-[10px] tracking-[0.5em] md:tracking-[0.8em] uppercase italic">© 2026 THE GEHNA • SANGRUR</p>
      </footer>
    </div>
  )
}