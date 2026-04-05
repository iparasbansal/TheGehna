import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import Footer from './components/Footer'; 
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard';
import CartDrawer from './components/CartDrawer';
import Checkout from './pages/Checkout';
import AdminVault from './pages/AdminVault';
import ProtectedRoute from './components/ProtectedRoute';
import Auth from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';



function App() {
  return (
    <Router>
      <CustomCursor /> 
      {/* We use flex-col and min-h-screen to keep the footer pinned to the bottom */}
      <div className="min-h-screen bg-brand-dark flex flex-col">
        <Navbar />
        <CartDrawer />
        {/* The 'flex-grow' ensures this area takes up all available space */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin/vault" element={<ProtectedRoute isAdmin={true}> <AdminVault /></ProtectedRoute>} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin-vault" element={<AdminDashboard />} />
          </Routes>
        </main>
        
        {/* 2. Place the Footer here, outside the Routes */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;