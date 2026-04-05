import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../main'; // 1. Import the hook from main.jsx

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  
  // 2. Get checkUser from the AuthProvider context
  const { checkUser } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const endpoint = isLogin ? '/api/v1/users/login' : '/api/v1/users/register';
    
    try {
      const { data } = await axios.post(endpoint, formData);
      
      if (data.token) {
        // 3. Store the token immediately
        localStorage.setItem('token', data.token);
        
        // 4. Manually set the header so the next call works instantly
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        
        // 5. FETCH USER DATA NOW (Before navigating)
        // This fills the 'user' state in main.jsx so Profile.jsx can see it
        await checkUser(); 

        alert(isLogin ? "Access Granted to The Vault" : "Welcome to the Royal Club");
        
        // 6. Navigate to Profile directly
        navigate('/profile'); 
      }
    } catch (err) {
      console.error("Connection Failed:", err);
      alert(err.response?.data?.message || "Authentication Failed. Please check your credentials.");
    }
  };
  // ... rest of your return code

  return (
    <div className="min-h-screen bg-[#633131] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-black/20 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-2xl"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif text-[#d4a34d] tracking-widest uppercase">
            {isLogin ? 'Sign In' : 'Join The Club'}
          </h2>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] mt-2 tracking-widest">THE GEHNA COLLECTION</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <input 
                  type="text" placeholder="Full Name" required
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-[#d4a34d] text-white transition-all"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          <input 
            type="email" placeholder="Email" required 
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-[#d4a34d] text-white transition-all" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />
          
          <div className="space-y-2">
            <input 
              type="password" placeholder="Password" required 
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-[#d4a34d] text-white transition-all" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
            
            {/* --- NEW FORGOT PASSWORD LINK --- */}
            {isLogin && (
              <div className="text-right">
                <Link to="/forgot-password" size={12} className="text-white/30 hover:text-[#d4a34d] transition-colors text-xs italic tracking-wide">
                  Forgot Vault Key?
                </Link>
              </div>
            )}
          </div>

          <button className="w-full py-4 bg-[#d4a34d] text-[#633131] font-bold rounded-xl hover:bg-white transition-all uppercase tracking-widest shadow-xl mt-4">
            {isLogin ? 'Enter The Vault' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-8 text-white/50 text-sm">
          {isLogin ? "New to The Gehna?" : "Already a member?"}
          <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-[#d4a34d] hover:underline font-bold transition-all">
            {isLogin ? 'Join Now' : 'Login'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};
export default Auth;