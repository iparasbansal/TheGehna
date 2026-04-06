import { MapPin, ShieldCheck, Sparkles, Heart, Phone } from 'lucide-react';

export default function Heritage() {
  // Your official shop address
  const address = "SCO 63, New Qila Market Rd, Nabha Gate, Partap Nagar, Sangrur, Punjab 148001";

  return (
    <div className="bg-[#050505] text-white min-h-screen pb-20 selection:bg-brand-gold selection:text-black">
      
      {/* 1. HERO SECTION - ATMOSPHERIC ENTRANCE */}
      <section className="h-[70vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        {/* Subtle Golden Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,163,77,0.08)_0%,transparent_70%)] pointer-events-none" />
        
        <h1 className="text-5xl md:text-8xl font-serif text-brand-gold tracking-[0.3em] reveal uppercase">
          The Heritage
        </h1>
        <p className="text-brand-gold/40 tracking-[0.8em] text-[9px] md:text-[11px] uppercase mt-8 reveal delay-1">
          Rooted in Tradition • Designed for the Modern
        </p>
        <div className="mt-12 w-[1px] h-24 bg-gradient-to-b from-brand-gold to-transparent opacity-30 reveal delay-2"></div>
      </section>

      {/* 2. THE STORY SECTION (Editorial Split Layout) */}
      <section className="max-w-[1400px] mx-auto px-8 md:px-20 py-20 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* BRAND STORY TEXT */}
        <div className="reveal delay-1 order-2 lg:order-1">
          <h2 className="text-3xl font-serif text-brand-gold mb-10 uppercase tracking-[0.2em] leading-tight">
            A Celebration of <br /> Timeless Elegance
          </h2>
          <div className="space-y-8 text-white/70 font-['Tenor_Sans'] leading-relaxed tracking-wide text-sm md:text-base text-justify">
            <p>
              THE GEHNA is more than a jewellery brand — it is a celebration of timeless elegance, 
              rooted in tradition yet designed for the modern woman. Inspired by India’s rich heritage 
              of adornment, each piece reflects the grace, strength, and individuality that jewellery 
              has symbolized for centuries.
            </p>
            <p>
              We bring together the essence of classic craftsmanship and contemporary design through 
              our one-gram gold creations, making luxury both accessible and wearable every day. 
              At THE GEHNA, we believe jewellery is not just worn — it is lived.
            </p>
            <p>
              From sacred traditions like mangalsutras to everyday statement pieces, our collections 
              are thoughtfully curated to become a part of your personal story. Every design embodies 
              attention to detail, durability, and beauty, ensuring that you carry a touch of heritage 
              with you, wherever life takes you.
            </p>
            <p className="text-brand-gold/90 italic border-l border-brand-gold/30 pl-6 py-2">
              THE GEHNA stands for authenticity, elegance, and trust — redefining how modern India 
              experiences gold-inspired jewellery.
            </p>
          </div>
        </div>

        {/* FEATURED BRAND PHOTO */}
        <div className="luxury-card reveal delay-2 aspect-[4/5] relative order-1 lg:order-2 group">
          <img 
            src="/GehnaFront.jpg" // Replace this with a high-quality photo of your shop or jewelry
            alt="The Gehna Craftsmanship"
            className="w-full h-full object-contain p-10 lg:p-20 opacity-60 group-hover:opacity-100 transition-opacity duration-1000 bg-black/40"
          />
          <div className="absolute inset-0 border-[1px] border-brand-gold/10 m-4 pointer-events-none" />
        </div>
      </section>

      {/* 3. CORE BRAND PILLARS */}
      <section className="bg-white/[0.02] py-32 border-y border-brand-gold/5">
        <div className="max-w-[1200px] mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-20 text-center">
          <div className="reveal delay-1">
            <ShieldCheck className="mx-auto text-brand-gold mb-6" size={36} strokeWidth={1} />
            <h3 className="font-serif text-brand-gold tracking-[0.3em] mb-4 uppercase text-xs">Authenticity</h3>
            <p className="text-[10px] text-white/30 leading-loose tracking-widest uppercase">Genuine 1-Gram Gold artistry that stands the test of time.</p>
          </div>
          <div className="reveal delay-2">
            <Sparkles className="mx-auto text-brand-gold mb-6" size={36} strokeWidth={1} />
            <h3 className="font-serif text-brand-gold tracking-[0.3em] mb-4 uppercase text-xs">Elegance</h3>
            <p className="text-[10px] text-white/30 leading-loose tracking-widest uppercase">Designed to empower the modern woman effortlessly.</p>
          </div>
          <div className="reveal delay-3">
            <Heart className="mx-auto text-brand-gold mb-6" size={36} strokeWidth={1} />
            <h3 className="font-serif text-brand-gold tracking-[0.3em] mb-4 uppercase text-xs">Legacy</h3>
            <p className="text-[10px] text-white/30 leading-loose tracking-widest uppercase">Redefining the gold experience from the heart of Sangrur.</p>
          </div>
        </div>
      </section>

      {/* 4. LOCATION & MAP SECTION */}
      <section className="max-w-[1400px] mx-auto px-8 md:px-20 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
          
          <div className="lg:col-span-1 reveal">
            <h2 className="text-4xl font-serif text-brand-gold uppercase tracking-tighter">The Vault</h2>
            <p className="text-white/40 mt-6 font-['Tenor_Sans'] tracking-[0.2em] uppercase text-[10px]">Experience our artistry in person.</p>
            
            <div className="mt-12 space-y-8">
              <div className="flex items-start gap-5 text-white/60 group">
                <MapPin className="text-brand-gold shrink-0 transition-transform group-hover:scale-110" size={22} />
                <div>
                  <p className="text-xs uppercase tracking-widest text-brand-gold mb-2">Location</p>
                  <p className="text-sm leading-relaxed font-light">{address}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-5 text-white/60 group">
                <Phone className="text-brand-gold shrink-0 transition-transform group-hover:scale-110" size={22} />
                <div>
                  <p className="text-xs uppercase tracking-widest text-brand-gold mb-2">Connect</p>
                  <p className="text-sm font-light">+91 8856840000</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`)}
              className="btn-gold mt-12 w-full tracking-[0.4em] text-[10px]"
            >
              Get Directions
            </button>
          </div>

          {/* GOOGLE MAPS IFRAME - COLORFUL AS REQUESTED */}
          <div className="lg:col-span-2 h-[500px] luxury-card reveal delay-2 overflow-hidden border border-brand-gold/20">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d215.4175895387326!2d75.84310257184093!3d30.24615980968419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39105142938bff03%3A0xf5c8171031084c16!2sTHE%20GEHNA!5e0!3m2!1sen!2sin!4v1775495528869!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="THE GEHNA Location - New Qila Market"
            ></iframe>
          </div>
        </div>
      </section>

      {/* 5. FOOTER MARKER */}
      <div className="text-center py-20 opacity-20 reveal">
        <p className="font-serif text-[10px] tracking-[1em] uppercase">The Infinite Era</p>
      </div>
    </div>
  );
}