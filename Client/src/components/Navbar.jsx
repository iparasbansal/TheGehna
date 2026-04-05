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
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 md:px-16 py-6 backdrop-blur-md bg-gradient-to-b from-black/90 via-black/40 to-transparent transition-all duration-700">
        
        {/* TOP LEFT LOGO - IMAGE BASED */}
        <div className="flex-1 flex justify-start">
          <Link to="/" className="group relative">
            <img 
              src="/logobg.png" 
              alt="THE GEHNA" 
              className="h-12 md:h-20 w-auto object-contain transition-all duration-700 
                         filter brightness-110 contrast-110 
                         group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(212,163,77,0.5)]" 
            />
            {/* Minimalist brand line that appears on hover */}
            <div className="absolute -bottom-2 left-0 w-0 h-[1px] bg-brand-gold transition-all duration-700 group-hover:w-full opacity-30"></div>
          </Link>
        </div>
        
        {/* RIGHT SIDE - THE TOOLKIT */}
        <div className="flex gap-10 text-white/60 items-center">
          
          {/* Futuristic Search Trigger */}
          <div 
            onClick={() => setSearchOpen(true)}
            className="group cursor-pointer flex items-center gap-2"
          >
            <Search size={18} className="group-hover:text-brand-gold group-hover:scale-125 transition-all duration-300" />
            <span className="hidden lg:block text-[9px] font-bold tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
              SEARCH VAULT
            </span>
          </div>

          {/* DYNAMIC AVATAR SECTION */}
          {loading ? (
            <div className="w-5 h-5 border border-brand-gold/30 border-t-brand-gold rounded-full animate-spin"></div>
          ) : user ? (
            <Link 
                to="/profile" 
                className="relative group flex items-center"
            >
                <div className="w-10 h-10 rounded-full border border-brand-gold/20 flex items-center justify-center bg-white/5 group-hover:border-brand-gold transition-all duration-700 shadow-[0_0_30px_rgba(212,163,77,0.15)]">
                  <span className="text-[10px] font-black tracking-widest text-brand-gold">
                      {user.name[0].toUpperCase()}
                  </span>
                </div>
                {/* Orbital Ring Animation */}
                <div className="absolute inset-[-4px] rounded-full border border-brand-gold/0 group-hover:border-brand-gold/20 transition-all duration-1000 scale-50 group-hover:scale-100 opacity-0 group-hover:opacity-100"></div>
            </Link>
          ) : (
            <Link to="/login" className="hover:text-brand-gold transition-all duration-500 hover:scale-125">
                <User size={20} />
            </Link>
          )}
          
          {/* THE VAULT BAG */}
          <div className="relative cursor-pointer group" onClick={() => setIsOpen(true)}>
            <ShoppingBag size={22} className="group-hover:text-brand-gold transition-all duration-300" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-gold text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black shadow-[0_0_10px_#d4a34d]">
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