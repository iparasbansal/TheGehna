import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../main'; 

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false); // To disable buttons
  const [cooldown, setCooldown] = useState(0);   // Timer for resending
  const [errorMessage, setErrorMessage] = useState(""); // Custom UI error
  const [formData, setFormData] = useState({ name: '', email: '', password: '', otp: '' });
  
  const navigate = useNavigate();
  const { checkUser } = useAuth(); 

  // --- Timer logic for "Resend OTP" ---
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendOtp = async () => {
    if (!formData.email) return setErrorMessage("Please enter your email first");
    if (cooldown > 0) return; // Prevent clicking while timer is active

    setLoading(true);
    setErrorMessage(""); 
    
    try {
      await axios.post('/api/v1/users/send-otp', { email: formData.email });
      setIsOtpSent(true);
      setCooldown(60); // 60-second cooldown after successful send
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Failed to send Access Key");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    
    if (!isLogin && !isOtpSent) return setErrorMessage("Please request an Access Key first.");

    setLoading(true);
    const endpoint = isLogin ? '/api/v1/users/login' : '/api/v1/users/register';
    
    try {
      const { data } = await axios.post(endpoint, formData);
      if (data.token) {
        localStorage.setItem('token', data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        await checkUser(); 
        navigate('/profile'); 
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Authentication Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#633131] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-black/20 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif text-[#d4a34d] tracking-widest uppercase">
            {isLogin ? 'Sign In' : 'Join The Club'}
          </h2>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] mt-2">THE GEHNA COLLECTION</p>
        </div>

        {/* --- PROFESSIONAL ERROR MESSAGE UI --- */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-red-500/10 border border-red-500/50 text-red-200 text-[11px] p-3 rounded-lg text-center mb-6 uppercase tracking-tighter"
            >
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <input 
              type="text" placeholder="Full Name" required
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-[#d4a34d] text-white transition-all"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          )}
          
          <div className="relative">
            <input 
              type="email" placeholder="Email" required 
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-[#d4a34d] text-white transition-all" 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
            {!isLogin && (
                <button 
                  type="button"
                  disabled={loading || cooldown > 0}
                  onClick={handleSendOtp}
                  className="absolute right-2 top-2 bottom-2 px-3 bg-[#d4a34d] text-[#633131] text-[10px] font-bold rounded-lg disabled:bg-white/10 disabled:text-white/30 transition-all uppercase"
                >
                  {loading ? '...' : cooldown > 0 ? `Wait ${cooldown}s` : 'Get Key'}
                </button>
            )}
          </div>
          
          <input 
            type="password" placeholder="Password" required 
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-[#d4a34d] text-white transition-all" 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
          />

          {!isLogin && isOtpSent && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <input 
                type="text" placeholder="6-Digit Access Key" required maxLength="6"
                className="w-full bg-[#d4a34d]/10 border border-[#d4a34d]/30 p-4 rounded-xl outline-none focus:border-[#d4a34d] text-[#d4a34d] text-center font-mono tracking-[1em]" 
                onChange={(e) => setFormData({...formData, otp: e.target.value})} 
              />
            </motion.div>
          )}

          <button 
            disabled={loading}
            className="w-full py-4 bg-[#d4a34d] text-[#633131] font-bold rounded-xl hover:bg-white disabled:bg-[#d4a34d]/50 transition-all uppercase tracking-widest shadow-xl"
          >
            {loading ? 'Authenticating...' : isLogin ? 'Enter The Vault' : 'Verify & Join'}
          </button>
        </form>

        {isLogin && (
            <div className="text-center mt-4">
            <Link to="/forgot-password" size={12} className="text-white/30 hover:text-[#d4a34d] transition-colors text-[10px] italic tracking-wide uppercase">
                Forgot Vault Key?
            </Link>
            </div>
        )}

        <p className="text-center mt-8 text-white/50 text-[11px] uppercase tracking-widest">
          {isLogin ? "New to The Gehna?" : "Already a member?"}
          <button onClick={() => {setIsLogin(!isLogin); setErrorMessage("");}} className="ml-2 text-[#d4a34d] hover:underline font-bold transition-all">
            {isLogin ? 'Join Now' : 'Login'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};
export default Auth;