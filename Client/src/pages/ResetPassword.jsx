import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams(); // Grabs the token from the URL
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Passwords do not match");

    setLoading(true);
    try {
      // Hits your backend: router.put('/resetpassword/:token', ...)
      await axios.put(`/api/v1/users/resetpassword/${token}`, { password });
      alert("Vault Access Restored! Please login with your new password.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Token is invalid or has expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#633131] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-black/20 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#d4a34d]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-[#d4a34d]" size={30} />
          </div>
          <h2 className="text-2xl font-serif text-[#d4a34d] uppercase tracking-widest">New Vault Key</h2>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mt-2">Secure your account</p>
        </div>

        <form onSubmit={handleReset} className="space-y-6">
          <div className="space-y-4">
            <input 
              type="password" placeholder="New Password" required 
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-[#d4a34d] text-white"
              onChange={(e) => setPassword(e.target.value)}
            />
            <input 
              type="password" placeholder="Confirm New Password" required 
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-[#d4a34d] text-white"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button disabled={loading} className="w-full py-4 bg-[#d4a34d] text-[#633131] font-bold rounded-xl hover:bg-white transition-all uppercase tracking-widest shadow-xl disabled:opacity-50">
            {loading ? "Updating Vault..." : "Update Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;