import { useEffect, useState } from 'react';
import axios from 'axios';
import AddProductModal from '../components/AddProductModal';
import { Trash2, Edit, Plus } from 'lucide-react';

const AdminVault = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // Track which item to edit

  const fetchAll = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/api/v1/products');
      setProducts(data.data);
    } catch (err) {
      console.error("Vault Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openEditModal = (product) => {
    setEditingProduct(product); // Set the product data
    setIsModalOpen(true);       // Open the modal
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingProduct(null);    // Reset so "Add New" starts fresh
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if(window.confirm("Remove this masterpiece from the collection?")) {
      try {
        await axios.delete(`http://localhost:3000/api/v1/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchAll();
      } catch (err) {
        alert("Delete failed: Admin access required.");
      }
    }
  };

  return (
    <div className="pt-32 pb-20 px-10 min-h-screen bg-[#633131]">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-serif text-[#d4a34d] uppercase tracking-widest">Inventory Vault</h1>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-[#d4a34d] text-[#633131] px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white transition-all shadow-xl"
          >
            <Plus size={20} /> ADD NEW ITEM
          </button>
        </div>

        <AddProductModal 
          isOpen={isModalOpen} 
          onClose={handleClose} 
          refreshData={fetchAll} 
          editData={editingProduct} 
        />

        <div className="grid gap-4 mt-10">
          {products.map((p) => (
            <div key={p._id} className="bg-black/20 border border-white/5 p-4 rounded-2xl flex justify-between items-center group hover:border-[#d4a34d]/50 transition-all">
              <div className="flex gap-6 items-center">
                <img src={p.images?.[0]?.url || p.image} className="w-16 h-16 object-cover rounded-lg border border-white/10" alt={p.name} />
                <div>
                  <h3 className="text-white font-serif text-lg">{p.name}</h3>
                  <p className="text-[#d4a34d] text-sm font-bold">₹{p.price}</p>
                </div>
              </div>
              <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openEditModal(p)} 
                  className="p-3 bg-white/5 rounded-full text-white hover:text-[#d4a34d]"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(p._id)} 
                  className="p-3 bg-white/5 rounded-full text-white hover:text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminVault;