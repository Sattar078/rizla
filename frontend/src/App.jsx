import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Shop from './pages/Shop';
import Profile from './pages/Profile';
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import OrderHistory from './pages/OrderHistory';
import OrderDetails from './pages/OrderDetails';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';


const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-indigo-600">Rizla Boutique</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-indigo-600">Shop</Link>
            {user ? (
              <>
                <Link to="/wishlist" className="text-gray-700 hover:text-indigo-600">Wishlist</Link>
                <Link to="/cart" className="text-gray-700 hover:text-indigo-600">Cart</Link>
                <Link to="/orders" className="text-gray-700 hover:text-indigo-600">Orders</Link>
                <Link to="/profile" className="text-gray-700 hover:text-indigo-600">Profile ({user.name})</Link>
                <button onClick={logout} className="text-gray-700 hover:text-red-600 text-sm font-medium">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
                <Link to="/signup" className="text-white bg-indigo-600 px-3 py-1.5 rounded-md hover:bg-indigo-700">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/products/:id" element={<ProductDetails />} />

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/orders/:orderId" element={<OrderDetails />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<div>Admin Dashboard</div>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
