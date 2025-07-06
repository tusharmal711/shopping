import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Checkout() {
  const { state } = useLocation();
  const navigate=useNavigate()

  const[address,setAddress]=useState("")
  const[paymentMethod,setPaymentMethod]=useState("cash on delivery")
  const [errorMessage, setErrorMessage] = useState("");


  if (!state) return <div>No product selected</div>;
  const { productId,title, price, image, images, size, quantity } = state;

  const total=quantity*price;

  const handleOrder=async()=>{
    if(!address.trim())
    {
      setErrorMessage("Please enter a delivery address");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    try{
      const orderData={
        items:[
          {productId,title,price,image,quantity,size},
        ],
        totalAmount:total
      }
      const res = await axios.post(
        "https://genzfashion-umr7.onrender.com/api/orders/place",
        orderData,
        { withCredentials: true }
      );
      navigate("/order-success", {
        state: {
          productId,
          title,
          total,
          address,
          paymentMethod,
        },
      });
    }
    catch (err) {
      console.error("Failed to place order:", err);
      setErrorMessage("Failed to place order. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
    
  }


  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Checkout</h2>
      <div style={styles.content}>
        <img src={image} alt={title} style={styles.image} />
        <div style={styles.details}>
          <h3 style={styles.title}>{title}</h3>
          <p style={styles.size}>Size: {size}</p>
          <p style={styles.quantity}>Quantity: {quantity}</p>
          <p style={styles.price}>Total: ₹{total}</p>

          <textarea
            placeholder="enter delivery address "
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={styles.textarea}
          />

          <select
            style={styles.select}
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option>Cash on Delivery</option>
            <option>Credit Card</option>
            <option>UPI</option>
          </select>
          {errorMessage && (
            <div
              style={{ color: "red", marginTop: "10px", fontWeight: "bold" }}
            >
              {errorMessage}
            </div>
          )}
          <button style={styles.button} onClick={handleOrder}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "30px",
    background: "linear-gradient(to bottom right, #f0f0ff, #e9f5f2)",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "28px",
    marginBottom: "30px",
    color: "#333",
  },
  content: {
    display: "flex",
    flexWrap: "wrap",
    gap: "30px",
    alignItems: "center",
  },
  image: {
    width: "280px",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },
  details: {
    flex: "1",
    minWidth: "260px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  quantity: {
    fontSize: "16px",
    marginBottom: "10px",
  },
  price: {
    color: "#49a09d",
    fontWeight: "bold",
    fontSize: "18px",
    marginBottom: "10px",
  },
  size: {
    fontSize: "16px",
    marginBottom: "20px",
  },
  textarea: {
    width: "100%",
    maxWidth: "400px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#f9f9ff",
    color: "#333", 
    minHeight: "60px", 
    resize: "none", 
    marginBottom: "15px",
    boxShadow: "inset 0 4px 4px rgba(26, 25, 25, 0.1)", // subtle inner shadow
  },

  select: {
    width: "100%",
    maxWidth: "420px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#f0f8ff", // very soft bluish background
    color: "#333",
    marginBottom: "20px",
    marginRight:"20px",
    cursor: "pointer",
  },

  button: {
    padding: "10px 20px",
    marginTop:"20px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    background: "#5f2c82",
    color: "#fff",
  },
};
  