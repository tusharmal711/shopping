import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CartPage({setCartItems}) {
  const [localCart, setLocalCart] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCart = async () => {
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

        setLocalCart(validItems);
        setCartItems(validItems);
      } catch (err) {
        console.error("Failed to fetch cart", err);
      }
    };

    fetchCart();
  }, []);
  

  useEffect(() => {
    const sum = localCart.reduce((acc, item) => {
      if (!item.productId) return acc; // skip if product is null
      return acc + item.productId.price * item.quantity;
    }, 0);
    setTotal(sum);
  }, [localCart]);
  

  if (localCart.length === 0) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "40px" }}>
        🛒 Your cart is empty.
      </h2>
    );
  }
  const handleBuyNow = (item) => {
    navigate("/checkout", {
      state: {
        productId: item.productId._id,
        title: item.productId.title,
        price: item.productId.price,
        image: item.productId.images?.[0],
        images:item.productId.images,
        size: item.size,
        quantity: item.quantity,
      },
    });
  };
  const handleRemove = async (item) => {
    try {
      await axios.post(
        "https://genzfashion-umr7.onrender.com/api/cart/remove",
        {
          productId: item.productId._id,
          size: item.size,
        },
        {
          withCredentials: true,
        }
      );
      const res = await axios.get(
        "https://genzfashion-umr7.onrender.com/api/cart",
        {
          withCredentials: true,
        }
      );
      // Remove from UI
      setLocalCart(res.data.cartItems || []);
      setCartItems(res.data.cartItems || []);
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Your Cart</h2>
      <div style={styles.cartItems}>
        {localCart.map((item, index) => {
          if (!item.productId) return null; // Skip if product info is missing

          return (
            <div key={index} style={styles.card}>
              <img
                src={item.productId.images?.[0]}
                alt={item.productId.title}
                style={styles.image}
              />
              <div style={styles.details}>
                <h3>{item.productId.title}</h3>
                <p>Size: {item.size}</p>
                <p>Qty: {item.quantity}</p>
                <p style={styles.price}>
                  ₹{item.productId.price} × {item.quantity}
                </p>
                <p style={styles.subtotal}>
                  Subtotal: ₹{item.productId.price * item.quantity}
                </p>
                <div style={styles.buttonGroup}>
                  <button
                    style={styles.buyNowBtn}
                    onClick={() => handleBuyNow(item)}
                  >
                    Buy Now
                  </button>
                  <button
                    style={styles.removeBtn}
                    onClick={() => handleRemove(item)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <h3 style={styles.total}>Total Amount: ₹{total}</h3>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "20px",
    background: "linear-gradient(to bottom right, #f0f0ff, #e9f5f2)",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    fontSize: "28px",
    marginBottom: "30px",
  },
  cartItems: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  card: {
    display: "flex",
    background: "#fff",
    borderRadius: "10px",
    padding: "16px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    alignItems: "center",
  },
  image: {
    width: "150px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "10px",
    marginRight: "20px",
  },
  details: {
    flex: 1,
  },
  price: {
    color: "#5f2c82",
    fontWeight: "bold",
  },
  subtotal: {
    marginTop: "8px",
    fontWeight: "bold",
  },
  total: {
    textAlign: "right",
    marginTop: "30px",
    fontSize: "20px",
    color: "#49a09d",
  },
  buttonGroup: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  buyNowBtn: {
    padding: "8px 16px",
    backgroundColor: "#49a09d",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  removeBtn: {
    padding: "8px 16px",
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};