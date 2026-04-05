import { X, Search } from 'lucide-react';
// 1. ADD 'useEffect' TO YOUR IMPORTS HERE
import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // 2. This hook will now work because of the import above
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // 3. This will push the search term to your Home page URL
      navigate(`/?keyword=${query.trim()}`);
      onClose();
      setQuery(''); 
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed inset-0 z-[200] bg-[#633131]/95 backdrop-blur-3xl flex items-center justify-center p-6"
        >
          {/* Close Button - Top Right */}
          <button 
            onClick={onClose} 
            className="absolute top-10 right-10 z-[210] p-4 bg-white/5 rounded-full text-[#d4a34d] hover:bg-[#d4a34d] hover:text-[#633131] transition-all duration-300"
          >
            <X size={32} />
          </button>
          
          <form onSubmit={handleSearch} className="w-full max-w-5xl relative">
            <input 
              autoFocus
              type="text" 
              placeholder="SEARCH THE VAULT..." 
              className="w-full bg-transparent border-b-2 border-[#d4a34d]/30 p-6 text-4xl md:text-7xl font-serif text-[#d4a34d] outline-none focus:border-[#d4a34d] transition-all placeholder:text-[#d4a34d]/10 tracking-widest uppercase"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d4a34d] hover:scale-125 transition-transform">
              <Search size={48} />
            </button>
            <div className="mt-8 flex gap-6 text-[10px] font-bold tracking-[0.4em] text-[#d4a34d]/40 uppercase">
              <span>Press Enter to Explore</span>
              <span className="text-[#d4a34d]/10">|</span>
              <span>THE GEHNA EXCLUSIVE</span>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;