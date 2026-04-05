import { useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [formData, setFormData] = useState({
    name: '', price: '', category: 'Necklace', description: '', stock: 1
  });

  const [file, setFile] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Luxury brands use FormData for multi-part uploads (images + text)
  const data = new FormData();
  data.append('name', formData.name);
  data.append('price', formData.price);
  data.append('description', formData.description);
  data.append('image', file); // The actual 4K file

  try {
    await axios.post('http://localhost:3000/api/v1/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert("💎 Masterpiece Securely Uploaded!");
  } catch (err) {
    console.error(err);
  }
};

// Add this input to your form:
<input 
  type="file" 
  onChange={(e) => setFile(e.target.files[0])}
  className="mt-4 text-xs text-brand-gold file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-gold file:text-brand-maroon hover:file:bg-white transition-all"
/>

  return (
    <div className="pt-32 pb-20 px-10 min-h-screen bg-brand-dark text-white">
      <h1 className="text-4xl font-serif text-brand-gold mb-10">Inventory Vault</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl bg-zinc-900/50 p-8 rounded-3xl border border-brand-gold/20">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-brand-gold">Product Name</label>
            <input 
              className="bg-black/50 border border-white/10 p-3 rounded-xl focus:border-brand-gold outline-none"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-brand-gold">Price (₹)</label>
            <input 
              type="number"
              className="bg-black/50 border border-white/10 p-3 rounded-xl focus:border-brand-gold outline-none"
              onChange={(e) => setFormData({...formData, price: e.target.value})}
            />
          </div>
        </div>
        
        <button className="mt-10 w-full py-4 bg-brand-gold text-brand-maroon font-bold rounded-xl hover:bg-white transition-colors">
          UPLOAD TO SHOWROOM
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;