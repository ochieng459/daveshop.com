import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CartContext";
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/:category" element={<ProductsPage />} />
          <Route path="/product/:type/:id" element={<ProductDetail />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
