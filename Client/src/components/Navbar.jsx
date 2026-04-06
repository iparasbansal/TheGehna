import { useState, useEffect, useRef } from 'react';
import { ShoppingBag, User, Search, X } from 'lucide-react';
import { useCart, useAuth } from '../main'; 
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { cart, setIsOpen } = useCart(); 
  const { user, loading } = useAuth(); 
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // 1. SCROLL LOGIC
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. CLOSE SEARCH ON CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. SEARCH EXECUTION LOGIC
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== "") {
      // Navigates to collection page with the query: /collection?search=kada
      navigate(`/collection?search=${searchQuery.trim()}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 px-6 md:px-16 
      ${scrolled ? 'py-4 bg-brand-dark/90 backdrop-blur-2xl border-b border-white/5' : 'py-8 bg-transparent'}`}>
      
      <div className="max-w-[1800px] mx-auto flex justify-between items-center">
        
        {/* LOGO SECTION */}
        <div className="flex-1 flex justify-start items-center gap-10">
          <Link to="/" className="shrink-0">
            <img src="/logobg.png" alt="THE GEHNA" className={`transition-all duration-700 ${scrolled ? 'h-10' : 'h-14'}`} />
          </Link>
          
          {!searchOpen && (
            <div className="hidden lg:flex gap-8 reveal">
              <Link to="/collection" className="nav-link">Collection</Link>
              <Link to="/heritage" className="nav-link">Heritage</Link>
            </div>
          )}
        </div>

        {/* TOOLKIT SECTION */}
        <div className="flex items-center gap-6 md:gap-10">
          
          {/* INLINE SEARCH BAR */}
          <div ref={searchRef}>
            {!searchOpen ? (
              <button onClick={() => setSearchOpen(true)} className="text-brand-gold/60 hover:text-brand-gold transition-all p-2">
                <Search size={19} strokeWidth={1} />
              </button>
            ) : (
              <div className="search-container reveal flex items-center gap-3">
                <Search size={16} className="text-brand-gold" />
                <input 
                  autoFocus
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchSubmit}
                  className="search-input uppercase"
                  placeholder="SEARCH COLLECTION..." 
                />
                <button onClick={() => setSearchOpen(false)}><X size={14} className="opacity-30 hover:opacity-100" /></button>
              </div>
            )}
          </div>

          {/* USER & CART */}
          <div className="flex items-center gap-6">
            {user ? (
              <Link to="/profile" className="w-8 h-8 rounded-full border border-brand-gold/20 flex items-center justify-center font-bold text-brand-gold text-[10px]">
                {user.name[0].toUpperCase()}
              </Link>
            ) : (
              <Link to="/login" className="text-brand-gold/60 hover:text-brand-gold"><User size={20} strokeWidth={1} /></Link>
            )}
            
            <div className="relative cursor-pointer" onClick={() => setIsOpen(true)}>
              <ShoppingBag size={20} strokeWidth={1} className="text-brand-gold/60 hover:text-brand-gold" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-gold text-black text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                  {cart.length}
                </span>
              )}
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;