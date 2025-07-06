import { useLocation ,Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { FaStar, FaRegStar } from "react-icons/fa";

export default function OrderSuccess()
{
    const {state}=useLocation()
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [comment, setComment] = useState("");
    const [message, setMessage] = useState("");

    if(!state ) return <h2 style={{ textAlign: "center" }}>Order Not Found</h2>

    const { title, total, address, paymentMethod, productId } = state;

    const handleReviewSubmit=async()=>{
      if(!rating)
      {
        setMessage("Please select a rating");
        return;
      }
      try {
        await axios.post(
          `https://genzfashion-umr7.onrender.com/api/review/${productId}`,
          { rating, comment },
          { withCredentials: true }
        );
        setMessage("Review submitted successfully! ⭐");
        setTimeout(() => setMessage(""), 3000);
      } catch (err) {
        console.error("Review submit error:", err);
        setMessage(
          err.response?.data?.error || "Failed to submit review. Try again."
        );
        setTimeout(() => setMessage(""), 3000);
      }
    }

    return (
      <div style={styles.container}>
        <div style={styles.emoji}>✅🎁</div>
        <h2 style={styles.heading}>Order Placed Successfully</h2>
        <p style={styles.text}>
          <strong>Product:</strong>
          {title}
        </p>
        <p style={styles.text}>
          <strong>Total:</strong>
          {total}
        </p>
        <p style={styles.text}>
          <strong>Address:</strong>
          {address}
        </p>
        <p style={styles.text}>
          <strong>Payment Method:</strong>
          {paymentMethod}
        </p>
        <div style={{ marginTop: "30px" }}>
          <h3 style={{ marginBottom: "10px", color: "#333" }}>
            Rate this product
          </h3>
          <div style={{ fontSize: "24px", marginBottom: "10px" }}>
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled = (hovered || rating) >= star;
              const StarIcon = isFilled ? FaStar : FaRegStar;

              return (
                <StarIcon
                  key={star}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(star)}
                  style={{
                    cursor: "pointer",
                    color: isFilled ? "#f39c12" : "#ccc",
                    transition: "color 0.3s",
                    marginRight: 4,
                  }}
                />
              );
            })}
          </div>

          <textarea
            placeholder="Write your feedback..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={styles.textarea}
          ></textarea>
          <button onClick={handleReviewSubmit} style={styles.button}>
            Submit Review
          </button>
          {message && (
            <p style={{ marginTop: 10, color: "green" }}>{message}</p>
          )}
        </div>
        <Link to="/" style={styles.link}>
          Continue Shopping
        </Link>
      </div>
    );
}
const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "30px",
    background: "#e8fff0",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  emoji: {
    fontSize: "50px",
    marginBottom: "10px",
    animation: "bounce 1.5s infinite",
  },
  heading: {
    color: "#2e7d32",
    fontSize: "26px",
    marginBottom: "20px",
  },
  text: {
    fontSize: "18px",
    marginBottom: "10px",
  },
  link: {
    marginTop: "20px",
    display: "inline-block",
    padding: "10px 16px",
    background: "#5f2c82",
    color: "#fff",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
  },
  textarea: {
    width: "100%",
    maxWidth: "320px",
    minHeight: "60px",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#f5f7ff", // light purple-blue
    color: "#333",
    resize: "none",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    outline: "none",
    margin: "10px auto",
    display: "block",
  },
  button: {
    padding: "10px 16px",
    background: "#49a09d",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};