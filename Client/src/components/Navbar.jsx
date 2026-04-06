import { useState, useEffect, useRef } from 'react';
import { ShoppingBag, User, Search, X, Menu } from 'lucide-react'; // Added Menu icon
import { useCart, useAuth } from '../main'; 
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // For smooth mobile menu

const Navbar = () => {
  const { cart, setIsOpen } = useCart(); 
  const { user } = useAuth(); 
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile state
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== "") {
      navigate(`/collection?search=${searchQuery.trim()}`);
      setSearchOpen(false);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 px-4 md:px-16 
      ${scrolled ? 'py-3 md:py-4 bg-black/90 backdrop-blur-2xl border-b border-brand-gold/10' : 'py-6 md:py-8 bg-transparent'}`}>
      
      <div className="max-w-[1800px] mx-auto flex justify-between items-center">
        
        {/* LEFT: LOGO & DESKTOP LINKS */}
        <div className="flex-1 flex justify-start items-center gap-6 md:gap-10">
          {/* MOBILE MENU TRIGGER */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden text-brand-gold/60 p-1"
          >
            <Menu size={24} strokeWidth={1} />
          </button>

          <Link to="/" className="shrink-0">
            <img src="/logobg.png" alt="THE GEHNA" className={`transition-all duration-700 ${scrolled ? 'h-8 md:h-10' : 'h-10 md:h-14'}`} />
          </Link>
          
          <div className="hidden lg:flex gap-8">
            <Link to="/collection" className="nav-link text-[10px] tracking-[0.2em] uppercase">Collection</Link>
            <Link to="/heritage" className="nav-link text-[10px] tracking-[0.2em] uppercase">Heritage</Link>
          </div>
        </div>

        {/* RIGHT: SEARCH, USER, CART */}
        <div className="flex items-center gap-4 md:gap-10">
          
          <div ref={searchRef} className="hidden md:block">
            {!searchOpen ? (
              <button onClick={() => setSearchOpen(true)} className="text-brand-gold/60 hover:text-brand-gold transition-all p-2">
                <Search size={19} strokeWidth={1} />
              </button>
            ) : (
              <div className="search-container flex items-center gap-3">
                <input 
                  autoFocus
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchSubmit}
                  className="bg-transparent border-b border-brand-gold/30 outline-none text-brand-gold uppercase text-[10px] tracking-widest w-40"
                  placeholder="SEARCH..." 
                />
                <button onClick={() => setSearchOpen(false)}><X size={14} className="text-brand-gold/30" /></button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-5 md:gap-8">
            {user ? (
              <Link to="/profile" className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-brand-gold/20 flex items-center justify-center font-bold text-brand-gold text-[9px] md:text-[10px]">
                {user.name[0].toUpperCase()}
              </Link>
            ) : (
              <Link to="/login" className="text-brand-gold/60"><User size={20} strokeWidth={1} /></Link>
            )}
            
            <div className="relative cursor-pointer" onClick={() => setIsOpen(true)}>
              <ShoppingBag size={20} strokeWidth={1} className="text-brand-gold/60" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-gold text-black text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE OVERLAY MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.5 }}
            className="fixed inset-0 z-[200] bg-black flex flex-col p-8 lg:hidden"
          >
            <div className="flex justify-between items-center mb-16">
               <img src="/logobg.png" className="h-8" alt="Logo" />
               <button onClick={() => setMobileMenuOpen(false)} className="text-brand-gold"><X size={30} strokeWidth={1} /></button>
            </div>

            <div className="flex flex-col gap-10">
              <Link to="/collection" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-serif text-brand-gold uppercase tracking-widest">Collection</Link>
              <Link to="/heritage" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-serif text-brand-gold uppercase tracking-widest">Heritage</Link>
              
              <div className="mt-10 border-t border-brand-gold/10 pt-10">
                <p className="text-brand-gold/40 text-[10px] tracking-[0.3em] uppercase mb-6">Search The Vault</p>
                <div className="flex items-center gap-4 border-b border-brand-gold/20 pb-2">
                  <Search size={18} className="text-brand-gold" />
                  <input 
                    type="text" 
                    placeholder="FIND AN ARTICLE..."
                    className="bg-transparent outline-none text-brand-gold uppercase text-sm tracking-widest w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchSubmit}
                  />
                </div>
              </div>
            </div>

            <div className="mt-auto pb-10">
               <p className="text-brand-gold/20 text-[8px] tracking-[0.5em] uppercase italic">© 2026 THE GEHNA • SANGRUR</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;