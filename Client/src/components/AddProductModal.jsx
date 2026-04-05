import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Upload } from 'lucide-react';

const AddProductModal = ({ isOpen, onClose, refreshData, editData }) => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [productData, setProductData] = useState({
    name: '', price: '', description: '', category: 'Necklace'
  });

  // Sync internal state with editData whenever modal opens/changes
  useEffect(() => {
    if (editData) {
      setProductData({
        name: editData.name,
        price: editData.price,
        description: editData.description,
        category: editData.category || 'Necklace'
      });
    } else {
      setProductData({ name: '', price: '', description: '', category: 'Necklace' });
      setImage(null);
    }
  }, [editData, isOpen]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  const token = localStorage.getItem('token');
  
  const formData = new FormData();
  formData.append('name', productData.name);
  formData.append('price', productData.price);
  formData.append('description', productData.description);
  formData.append('category', productData.category);

  // 1. IMAGE CHECK: Only append if 'image' is a new File object
  // If we are editing and didn't pick a new photo, 'image' might be null/string
  if (image && typeof image !== 'string') {
    formData.append('image', image); 
    console.log("Sending NEW file to Cloudinary");
} else {
    console.log("No new file selected, keeping existing image");
}

  try {
    // 2. DYNAMIC URL & METHOD
    // If editData exists, we are UPDATING. If not, we are ADDING.
    const url = editData 
      ? `http://localhost:3000/api/v1/products/${editData._id}` 
      : `http://localhost:3000/api/v1/products`;
    
    const method = editData ? 'put' : 'post';

    await axios({
      method: method,
      url: url,
      data: formData,
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data' 
      }
    });

    alert(editData ? "Masterpiece Updated!" : "New Item Added to Vault!");
    refreshData(); // This calls fetchAll() in AdminVault
    onClose();
  } catch (err) {
    console.error("Vault Error:", err.response?.data || err.message);
    alert("Error: " + (err.response?.data?.message || "Internal Server Error"));
  } finally {
    setLoading(false);
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-sm p-6">
      <div className="bg-[#633131] w-full max-w-2xl rounded-3xl border border-white/10 p-8 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white"><X /></button>
        
        <h2 className="text-3xl font-serif text-[#d4a34d] mb-8 uppercase tracking-widest text-center">
          {editData ? "Refine Masterpiece" : "Add New Piece"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <input 
              type="text" placeholder="Product Name" required 
              value={productData.name}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#d4a34d]" 
              onChange={(e) => setProductData({...productData, name: e.target.value})} 
            />
            <input 
              type="number" placeholder="Price (₹)" required 
              value={productData.price}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#d4a34d]" 
              onChange={(e) => setProductData({...productData, price: e.target.value})} 
            />
            <textarea 
              placeholder="Description" 
              value={productData.description}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white h-32 outline-none focus:border-[#d4a34d]" 
              onChange={(e) => setProductData({...productData, description: e.target.value})} 
            />
          </div>

          <div className="flex flex-col gap-4">
            <label className="border-2 border-dashed border-white/10 rounded-2xl h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all text-white/40">
              <Upload size={40} className="mb-2 text-[#d4a34d]" />
              {image ? <span className="text-[#d4a34d] text-xs font-bold">{image.name}</span> : <span>{editData ? "Change Photo" : "Upload 4K Photo"}</span>}
              <input type="file" hidden accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            </label>
            
            <button disabled={loading} className="w-full py-5 bg-[#d4a34d] text-[#633131] font-bold rounded-xl hover:bg-white transition-all uppercase tracking-widest shadow-xl disabled:opacity-50">
              {loading ? "Processing..." : editData ? "Apply Changes" : "Finalize & Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;