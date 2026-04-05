import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Hits your backend route: router.post('/forgotpassword', ...)
      await axios.post('/api/v1/users/forgotpassword', { email });
      setSent(true);
    } catch (err) {
      alert(err.response?.data?.message || "User not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#633131] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-black/20 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif text-[#d4a34d] uppercase tracking-widest">Reset Vault Key</h2>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mt-2">Security Protocol</p>
        </div>

        {!sent ? (
          <form onSubmit={handleRequest} className="space-y-6">
            <p className="text-white/60 text-sm text-center leading-relaxed">
              Enter your registered email. We will send a secure link to reset your access.
            </p>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input 
                type="email" placeholder="Email Address" required 
                className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-xl outline-none focus:border-[#d4a34d] text-white transition-all"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button disabled={loading} className="w-full py-4 bg-[#d4a34d] text-[#633131] font-bold rounded-xl hover:bg-white transition-all uppercase tracking-widest shadow-xl disabled:opacity-50">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto">
              <Mail className="text-brand-gold" size={32} />
            </div>
            <p className="text-white font-light">Check your inbox. A secure link has been sent to <span className="text-brand-gold">{email}</span>.</p>
          </div>
        )}

        <Link to="/login" className="flex items-center justify-center gap-2 mt-8 text-white/40 hover:text-white transition-colors text-sm">
          <ArrowLeft size={16} /> Back to Login
        </Link>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;