import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Brand Logo in Background */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.05 }}
        transition={{ duration: 2 }}
        className="absolute z-0"
      >
        <img src="/images.jpeg" alt="Logo BG" className="w-[800px] filter grayscale invert" />
      </motion.div>

      <div className="relative z-10 text-center px-4">
        <motion.p 
          initial={{ opacity: 0, tracking: "0.1em" }}
          animate={{ opacity: 1, tracking: "0.5em" }}
          transition={{ duration: 1 }}
          className="text-brand-gold uppercase text-sm mb-6 font-sans"
        >
          Luxury Within Reach
        </motion.p>
        
        <motion.h1 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-6xl md:text-8xl font-serif text-white mb-8"
        >
          The <span className="text-brand-gold">Gehna</span>
        </motion.h1>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 bg-brand-gold text-brand-maroon font-bold rounded-full transition-shadow hover:shadow-[0_0_30px_rgba(212,163,77,0.4)]"
        >
          DISCOVER THE COLLECTION
        </motion.button>
      </div>

      {/* Floating 4K Jewelry Placeholder */}
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-10 bottom-10 w-64 h-64 md:block hidden"
      >
        <img src="/logo.png" alt="Jewelry" className="drop-shadow-2xl" />
      </motion.div>
    </section>
  );
};


export default Hero;