import { useState } from 'react';
import { ShoppingBag, User, Search } from 'lucide-react';
import { useCart, useAuth } from '../main'; 
import { Link } from 'react-router-dom';
import SearchOverlay from './SearchOverlay';

const Navbar = () => {
  const { cart, setIsOpen } = useCart(); 
  const { user, loading } = useAuth(); 
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] flex justify-between items-center px-8 md:px-16 py-8 bg-transparent">
        
        {/* TOP LEFT LOGO - IMAGE ONLY */}
        <div className="flex-1 flex justify-start">
          <Link to="/" className="group relative">
            <img 
              src="/logobg.png" 
              alt="THE GEHNA" 
              className="h-10 md:h-14 w-auto object-contain transition-all duration-700 
                         group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(212,163,77,0.4)]" 
            />
            {/* Elegant underline reveal */}
            <div className="absolute -bottom-2 left-0 w-0 h-[1px] bg-brand-gold transition-all duration-700 group-hover:w-full opacity-20"></div>
          </Link>
        </div>
        
        {/* RIGHT SIDE - MINIMALIST ICON TOOLKIT */}
        <div className="flex gap-10 text-brand-gold/60 items-center">
          
          {/* Minimalist Search Icon */}
          <button 
            onClick={() => setSearchOpen(true)}
            className="hover:text-brand-gold cursor-pointer transition-all hover:scale-125 duration-300 outline-none"
          >
            <Search size={18} strokeWidth={1.2} />
          </button>

          {/* DYNAMIC AVATAR SECTION */}
          {loading ? (
            <div className="w-5 h-5 border border-brand-gold/30 border-t-brand-gold rounded-full animate-spin"></div>
          ) : user ? (
            <Link 
                to="/profile" 
                className="relative group flex items-center"
            >
                <div className="w-9 h-9 rounded-full border border-brand-gold/10 flex items-center justify-center bg-white/5 group-hover:border-brand-gold/40 transition-all duration-700 shadow-[0_0_20px_rgba(212,163,77,0.1)]">
                  <span className="text-[10px] font-bold tracking-widest text-brand-gold">
                      {user.name[0].toUpperCase()}
                  </span>
                </div>
                {/* Orbital Ring Animation */}
                <div className="absolute inset-[-3px] rounded-full border border-brand-gold/0 group-hover:border-brand-gold/20 transition-all duration-1000 scale-50 group-hover:scale-100 opacity-0 group-hover:opacity-100"></div>
            </Link>
          ) : (
            <Link to="/login" className="hover:text-brand-gold transition-all duration-500 hover:scale-125">
                <User size={19} strokeWidth={1.2} />
            </Link>
          )}
          
          {/* THE VAULT BAG */}
          <div className="relative cursor-pointer group" onClick={() => setIsOpen(true)}>
            <ShoppingBag size={19} strokeWidth={1.2} className="group-hover:text-brand-gold transition-all duration-300" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-gold text-black text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-black shadow-[0_0_10px_#d4a34d]">
                {cart.length}
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Global Search Component */}
      <SearchOverlay 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
      />
    </>
  );
};

export default Navbar;