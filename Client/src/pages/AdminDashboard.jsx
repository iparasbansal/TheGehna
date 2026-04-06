import { useState } from 'react';
// 1. IMPORT YOUR CENTRAL API TOOL
import api from '../api'; 
import Papa from 'papaparse'; 

const AdminDashboard = () => {
  const [formData, setFormData] = useState({
    name: '', price: '', category: 'Necklace', description: ''
  });
  const [file, setFile] = useState(null);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  // --- 1. Single Product Upload Logic ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // No need to manually grab token; api.js handles it now!
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('image', file); 

    try {
      // 2. UPDATED TO USE api.post
      await api.post('/products', data, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("💎 Masterpiece Securely Uploaded!");
    } catch (err) {
      console.error("Upload Error:", err);
      alert(err.response?.data?.error || "Server Error");
    }
  };

  // --- 2. Bulk CSV Upload Logic ---
  const handleBulkUpload = (e) => {
    const csvFile = e.target.files[0];
    if (!csvFile) return;

    setIsBulkLoading(true);

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          // 3. UPDATED TO USE api.post FOR BULK
          const response = await api.post('/products/bulk', results.data);
          alert(`✅ Success: ${response.data.count} items added to The Vault!`);
        } catch (err) {
          console.error("Bulk Error:", err);
          alert("Bulk Upload Error: " + (err.response?.data?.error || "Check CSV format"));
        } finally {
          setIsBulkLoading(false);
          e.target.value = null; // Reset input
        }
      }
    });
  };

  return (
    <div className="pt-32 pb-20 px-10 min-h-screen bg-[#633131] text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif text-[#d4a34d] mb-2 tracking-widest uppercase">Inventory Vault</h1>
        <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] mb-12">THE GEHNA ADMINISTRATION</p>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* --- SECTION: MANUAL UPLOAD --- */}
          <section className="bg-black/20 backdrop-blur-md p-8 rounded-3xl border border-white/5 shadow-2xl">
            <h3 className="text-[#d4a34d] text-xs font-bold uppercase tracking-widest mb-6">Manual Entry</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-[#d4a34d]/60">Product Name</label>
                  <input 
                    className="bg-white/5 border border-white/10 p-3 rounded-xl focus:border-[#d4a34d] outline-none text-sm transition-all"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-[#d4a34d]/60">Price (₹)</label>
                  <input 
                    type="number"
                    className="bg-white/5 border border-white/10 p-3 rounded-xl focus:border-[#d4a34d] outline-none text-sm transition-all"
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-[#d4a34d]/60">Product Image</label>
                <input 
                  type="file" 
                  onChange={(e) => setFile(e.target.files[0])}
                  className="text-xs text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-[#d4a34d] file:text-[#633131] cursor-pointer hover:file:bg-white transition-all"
                />
              </div>

              <button className="w-full py-4 bg-[#d4a34d] text-[#633131] font-bold rounded-xl hover:bg-white transition-all uppercase text-xs tracking-widest shadow-xl">
                Upload Single Item
              </button>
            </form>
          </section>

          {/* --- SECTION: BULK UPLOAD --- */}
          <section className="bg-black/20 backdrop-blur-md p-8 rounded-3xl border border-dashed border-[#d4a34d]/30 flex flex-col justify-center items-center text-center h-full min-h-[300px]">
            <div className="mb-6">
              <h3 className="text-[#d4a34d] text-xs font-bold uppercase tracking-widest mb-2">Bulk Collection Upload</h3>
              <p className="text-white/40 text-[10px] max-w-[200px] mx-auto uppercase">Upload a CSV file to add multiple articles at once</p>
            </div>

            <label className="cursor-pointer group">
              <div className="flex flex-col items-center p-10 bg-white/5 rounded-2xl border border-white/10 group-hover:border-[#d4a34d] transition-all">
                <span className="text-3xl mb-4">📄</span>
                <span className="text-[10px] font-bold uppercase text-[#d4a34d]">
                  {isBulkLoading ? "Processing Collection..." : "Choose CSV File"}
                </span>
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleBulkUpload} 
                  className="hidden" 
                  disabled={isBulkLoading}
                />
              </div>
            </label>
            
            <p className="mt-4 text-[9px] text-white/20 italic">Format: name, price, category, description, imageUrl</p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;