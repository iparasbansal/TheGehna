import { useState, useRef, useEffect, useMemo } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Eye, ShoppingBag, X, ChevronDown } from "lucide-react"
import API from '../api' 
import { useCart } from '../main' 

// --- 3D ENGINE (CHAOTIC LISSAJOUS MOTION) ---
function FlyingCard({ product, index, onHover, isHovered, onClick }) {
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 })
  const timeRef = useRef(0)

  // TRUE RANDOMNESS PHYSICS
  const physics = useMemo(() => {
    const isMobile = window.innerWidth < 768;
    return {
      // Independent speeds for X, Y, and Z to break circular patterns
      speedX: 0.0001 + Math.random() * 0.00015,
      speedY: 0.00008 + Math.random() * 0.00012,
      speedZ: 0.00012 + Math.random() * 0.0001,
      
      // Responsive ranges
      rangeX: isMobile ? (120 + Math.random() * 80) : (400 + Math.random() * 200),
      rangeY: isMobile ? (60 + Math.random() * 60) : (150 + Math.random() * 100),
      rangeZ: isMobile ? (50 + Math.random() * 50) : (200 + Math.random() * 150),
      
      // Unique starting points
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      phaseZ: Math.random() * Math.PI * 2,

      // Variation in the "wobble" frequency
      wobble: 0.4 + Math.random() * 0.6
    }
  }, [index]);
  
  useEffect(() => {
    if (!product) return;
    const animate = () => {
      timeRef.current += 1
      const t = timeRef.current
      
      // Lissajous curves create "figure-eight" or "knot" paths instead of circles
      setPosition({
        x: Math.cos(t * physics.speedX + physics.phaseX) * physics.rangeX,
        y: Math.sin(t * physics.speedY * physics.wobble + physics.phaseY) * physics.rangeY,
        z: Math.sin(t * physics.speedZ + physics.phaseZ) * physics.rangeZ - 100
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
        willChange: "transform", // Vital for iPhone performance
      }}
      onMouseEnter={() => onHover(product._id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
    >
      <div className={`w-24 h-32 md:w-40 md:h-56 rounded-lg border border-brand-gold/20 transition-all duration-1000 ${isHovered ? 'border-brand-gold shadow-[0_0_80px_rgba(212,163,77,0.4)]' : 'bg-black/60 shadow-2xl'}`}>
        <img src={product.images?.[0]?.url || "/logo.png"} className="w-full h-20 md:h-32 object-cover rounded-t-lg opacity-90" alt={product.name} />
        <div className="p-1 md:p-3 text-center">
          <h3 className="text-brand-gold font-serif text-[6px] md:text-[8px] tracking-[0.2em] uppercase truncate">{product.name}</h3>
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

  if (loading) return <div className="h-screen w-full bg-[#050505] flex items-center justify-center"><div className="w-10 h-10 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" /></div>

  return (
    <div className="bg-[#050505] text-ivory min-h-screen font-sans selection:bg-brand-gold overflow-x-hidden">
      
      {/* BACKGROUND LAYERS */}
      <div className="fixed inset-0 z-0 bg-[#050505]" />
      <div className="fixed inset-0 z-0 bg-gradient-to-tr from-black via-brand-dark/20 to-brand-maroon/10" />
      <div className="fixed inset-0 pointer-events-none z-[5] bg-[radial-gradient(circle_at_center,rgba(212,163,77,0.12)_0%,transparent_50%)]" />

      {/* HERO SECTION */}
      <motion.section style={{ opacity }} className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="z-20 text-center pointer-events-none relative px-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 2, ease: "easeOut" }}>
            <h1 className="text-5xl md:text-9xl lg:text-[9vw] font-serif tracking-[0.2em] md:tracking-[0.4em] uppercase leading-none text-[#d4a34d] drop-shadow-[0_0_50px_rgba(212,163,77,0.6)] filter brightness-125">
              THE GEHNA
            </h1>
            <p className="text-[#d4a34d]/60 tracking-[0.8em] md:tracking-[1.5em] text-[8px] md:text-[11px] uppercase mt-8 md:mt-12 md:ml-[1.5em] font-light">
              THE INFINITE VAULT
            </p>
          </motion.div>
        </div>

        {/* WANDERING CARDS - ACTIVE ON ALL SCREENS */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ perspective: "1200px", transformStyle: "preserve-3d" }}>
          {products.slice(0, 6).map((p, i) => (
            <FlyingCard key={p._id} product={p} index={i} onHover={setHoveredCard} isHovered={hoveredCard === p._id} onClick={() => setSelectedProduct(p)} />
          ))}
        </div>
        
        <div className="absolute bottom-12 z-30 flex flex-col items-center gap-4">
           <button onClick={() => gridRef.current?.scrollIntoView({ behavior: 'smooth' })} className="px-8 md:px-10 py-4 rounded-full border border-brand-gold/30 bg-black/40 backdrop-blur-sm text-brand-gold text-[9px] md:text-[10px] tracking-[0.3em] uppercase hover:bg-brand-gold hover:text-black transition-all">
              Browse Collection
           </button>
           <ChevronDown className="text-brand-gold/40 animate-bounce" size={20} />
        </div>
      </motion.section>

      {/* PRODUCT GRID - OPTIMIZED FOR MOBILE */}
      <section ref={gridRef} className="relative z-20 py-20 md:py-40 px-4 md:px-24 max-w-[1600px] mx-auto bg-[#050505]">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-16">
          {products.map((product) => (
            <motion.div 
              key={product._id} 
              className="group cursor-pointer relative flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#080808] border border-brand-gold/10 shadow-2xl">
                <img 
                  src={product.images?.[0]?.url || "/logo.png"} 
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-1000" 
                  alt={product.name} 
                />
                
                {/* DESKTOP HOVER OVERLAY */}
                <div className="hidden md:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 items-center justify-center gap-6">
                  <button onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }} className="p-4 rounded-full border border-brand-gold/40 text-brand-gold backdrop-blur-xl hover:bg-brand-gold hover:text-black transition-all"><Eye size={18} /></button>
                  <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="p-4 rounded-full border border-brand-gold/40 text-brand-gold backdrop-blur-xl hover:bg-brand-gold hover:text-black transition-all"><ShoppingBag size={18} /></button>
                </div>

                {/* MOBILE BOTTOM BAR (Solves brightness & usability issues) */}
                <div className="flex md:hidden absolute bottom-0 left-0 right-0 h-12 bg-black/70 backdrop-blur-md border-t border-brand-gold/20 items-center justify-around">
                   <button onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }} className="flex items-center gap-2 text-brand-gold/90">
                      <Eye size={14} />
                      <span className="text-[7px] tracking-widest uppercase">View</span>
                   </button>
                   <div className="h-4 w-[1px] bg-brand-gold/10" />
                   <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="flex items-center gap-2 text-brand-gold/90">
                      <ShoppingBag size={14} />
                      <span className="text-[7px] tracking-widest uppercase">Add</span>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)}>
            <motion.div onClick={e => e.stopPropagation()} className="relative max-w-4xl w-full bg-[#0a0a0a] border border-brand-gold/20 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-brand-gold"><X size={24} /></button>
              <div className="h-64 md:h-full bg-black"><img src={selectedProduct.images?.[0]?.url} className="w-full h-full object-cover" alt={selectedProduct.name} /></div>
              <div className="p-8 md:p-12 flex flex-col justify-center gap-6">
                <h2 className="text-3xl md:text-5xl font-serif text-brand-gold uppercase leading-tight">{selectedProduct.name}</h2>
                <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-[0.2em]">{selectedProduct.description || "Exquisite 1-gram gold acquisition."}</p>
                <div className="text-2xl font-mono text-brand-gold">₹{selectedProduct.price}</div>
                <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="w-full py-4 bg-brand-gold text-black font-bold uppercase tracking-[0.2em]">Add to Vault</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-16 text-center border-t border-brand-gold/5 opacity-40">
         <p className="text-brand-gold text-[8px] md:text-[10px] tracking-[0.5em] uppercase italic">© 2025 THE GEHNA • SANGRUR</p>
      </footer>
    </div>
  )
}