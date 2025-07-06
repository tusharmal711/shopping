import { Routes, Route } from "react-router-dom";
import axios from "axios"
import Navbar from "./component/Navbar";
import ProductUI from "./component/ProductUI";
import ProductAdmin from "./component/ProductAdmin";
import Register from "./component/Register";
import Login from "./component/Login";
import ProductDetails from "./component/ProductDetail";
import Profile from "./component/Profile";
import Checkout from "./component/Checkout";
import CartPage from "./component/CartPage";
import Footer from "./component/Footer";
import OrderSuccess from "./component/OrderSuccess";
import { useState ,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './App.css'
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState("");
  const [userRole, setUserRole] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.post(
        "https://genzfashion-umr7.onrender.com/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      setIsLoggedIn(false);
      setUserRole("");
      setCartItems([]);
      navigate("/"); // Redirect to home as guest
    } catch (err) {
      console.error("Logout failed", err);
    }
  };
  
  useEffect(() => {
    const fetchCart = async () => {
      if (!isLoggedIn) {
        setCartItems([]); 
        return;
      }
      try {
        const res = await axios.get(
          "https://genzfashion-umr7.onrender.com/api/cart",
          {
            withCredentials: true,
          }
        );

        const validItems = (res.data.cartItems || []).filter(
          (item) => item.productId !== null
        );

        setCartItems(validItems); // Set to state
      } catch (err) {
        console.error("Cart fetch error", err);
        setCartItems([]);
      }
    };

    fetchCart();
  }, [isLoggedIn]); // Refetch when user logs in

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="main-wrapper">
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        search={search}
        setSearch={setSearch}
        userRole={userRole}
        cartCount={cartCount}
      />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<ProductUI search={search} />} />
          <Route
            path="/login"
            element={
              <Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<ProductAdmin />} />
          <Route
            path="/product/:id"
            element={
              <ProductDetails
                isLoggedIn={isLoggedIn}
                setCartItems={setCartItems}
              />
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/cart"
            element={<CartPage setCartItems={setCartItems} />}
          />
          <Route path="/order-success" element={<OrderSuccess />} />
        </Routes>
      </div>
      {/* <Routes>
        <Route path="/" element={<ProductUI search={search} />} />
        <Route
          path="/login"
          element={
            <Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<ProductAdmin />} />
        <Route
          path="/product/:id"
          element={<ProductDetails isLoggedIn={isLoggedIn} />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes> */}
      <Footer />
    </div>
  );
}
export default App;
