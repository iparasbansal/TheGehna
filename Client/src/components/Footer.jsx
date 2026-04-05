const Footer = () => {
  return (
    <footer className="relative bg-[#050505] pt-20 pb-10 px-10 border-t border-white/5">
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-serif text-brand-gold tracking-widest uppercase font-bold">The Gehna</h2>
          <p className="text-white/40 text-[10px] mt-2 uppercase tracking-[0.4em] font-bold">Luxury Within Reach</p>
        </div>
        
        <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">
          <a href="#" className="hover:text-brand-gold transition-colors">Instagram</a>
          <a href="#" className="hover:text-brand-gold transition-colors">Facebook</a>
          <a href="#" className="hover:text-brand-gold transition-colors">Contact</a>
        </div>
      </div>
      
      <div className="mt-10 pt-6 border-t border-white/5 text-[9px] text-white/20 uppercase tracking-[0.4em] text-center">
        © 2026 THE GEHNA COLLECTION • SANGRUR
      </div>
    </footer>
  );
};

export default Footer;