import { useAuth } from '../main';
import { motion } from 'framer-motion';
import { Package, LogOut, Shield, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    // We use window.location here to ensure a full state wipe
    window.location.href = '/login'; 
  };

  // 1. IMPORTANT: While 'loading' is true, show the spinner and STOP.
  // This prevents the "Vault Access Denied" screen from flickering.
  if (loading) {
    return (
      <div className="h-screen bg-[#633131] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-[#d4a34d] animate-spin" />
        <p className="text-[#d4a34d] font-serif tracking-widest animate-pulse">VERIFYING ACCESS...</p>
      </div>
    );
  }

  // 2. Only check if 'user' is missing AFTER loading is complete
  if (!user) {
    return (
      <div className="h-screen bg-[#633131] flex flex-col items-center justify-center text-white gap-4 text-center px-6">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
          <Shield className="text-red-500" size={40} />
        </div>
        <h2 className="text-3xl font-serif">Vault Access Denied</h2>
        <p className="text-white/40 max-w-xs">Your session has expired or you are not authorized to view this vault.</p>
        <button 
          onClick={() => navigate('/login')} 
          className="mt-4 px-8 py-3 bg-[#d4a34d] text-[#633131] rounded-xl font-bold hover:bg-white transition-all shadow-lg"
        >
          Login to your account
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 md:px-20 min-h-screen bg-[#633131] text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-10"
      >
        {/* Header Card */}
        <div className="bg-black/20 p-8 md:p-12 rounded-[40px] border border-white/10 flex flex-col md:flex-row items-center gap-10 shadow-2xl backdrop-blur-md">
          <div className="w-32 h-32 bg-[#d4a34d] rounded-full flex items-center justify-center text-[#633131] text-5xl font-serif font-bold shadow-lg">
            {user.name?.[0].toUpperCase()}
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
              <h1 className="text-4xl md:text-5xl font-serif text-[#d4a34d]">{user.name}</h1>
              {user.role === 'admin' && (
                <span className="px-3 py-1 bg-[#d4a34d]/20 text-[#d4a34d] text-[10px] uppercase tracking-widest rounded-full border border-[#d4a34d]/30 font-bold">Admin</span>
              )}
            </div>
            <p className="text-white/40 font-light tracking-wide">{user.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-4 bg-white/5 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all border border-white/5 group"
            title="Logout"
          >
            <LogOut size={24} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/5 p-8 rounded-[30px] border border-white/5 space-y-4">
            <h3 className="text-[#d4a34d] font-serif text-xl flex items-center gap-3">
              <Package size={22} /> Recent Acquisitions
            </h3>
            <p className="text-white/30 italic text-sm">Your order history is currently empty.</p>
          </div>

          {user.role === 'admin' && (
            <div className="bg-[#d4a34d]/5 p-8 rounded-[30px] border border-[#d4a34d]/20 space-y-6">
              <div>
                <h3 className="text-[#d4a34d] font-serif text-xl flex items-center gap-3">
                  <Shield size={22} /> Executive Control
                </h3>
                <p className="text-white/50 text-xs mt-1">Manage THE GEHNA inventory and orders.</p>
              </div>
              <button 
                onClick={() => navigate('/admin/vault')}
                className="w-full py-4 bg-[#d4a34d] text-[#633131] font-bold rounded-xl hover:bg-white transition-all uppercase tracking-widest text-sm shadow-xl"
              >
                Access Admin Vault
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;