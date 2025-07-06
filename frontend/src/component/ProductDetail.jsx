import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"
import { useState ,useEffect,useRef } from "react";
export default function ProductDetails({ isLoggedIn, setCartItems }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"
  const [quantity, setQuantity] = useState(1);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const reviewRef = useRef(null);

  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`https://genzfashion-umr7.onrender.com/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Product not found", err));
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `https://genzfashion-umr7.onrender.com/api/review/${id}`
        );
        setReviews(res.data.reviews);

        // Calculate average rating
        const total = res.data.reviews.reduce((acc, r) => acc + r.rating, 0);
        const average = res.data.reviews.length
          ? total / res.data.reviews.length
          : 0;
        setAvgRating(average);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };

    fetchReviews();
  }, [id]);

  if (!product) return <div style={{ padding: 20 }}>Loading...</div>;

  const sizeOptions = ["s", "M", "L", "XL", "XXL", "XXXL"];
  // return (
  //   <div style={styles.container}>
  //     <img src={product.image} alt={product.title} style={styles.image}></img>
  //     <h2>{product.title}</h2>
  //     <p style={styles.price}>₹{product.price}</p>
  //     <p>{product.description}</p>

  //     {isLoggedIn ? (
  //       <div style={styles.actions}>
  //         <button style={styles.button}>Add to Cart</button>
  //         <button style={styles.button}>Write a Review</button>
  //       </div>
  //     ) : (
  //       <p style={{ marginTop: "10px", color: "#888" }}>
  //         Please login to add to cart or white a review
  //       </p>
  //     )}
  //   </div>
  // );

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setMessage("Please select a size.");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    try {
      const res = await axios.post(
        "https://genzfashion-umr7.onrender.com/api/cart/add",
        { productId: product._id, size: selectedSize, quantity: quantity },
        { withCredentials: true }
      );
      
      setMessage("Added to cart successfully!");
      setMessageType("success");
      setTimeout(() => setMessage(""), 3000);
      const cartRes = await axios.get(
        "https://genzfashion-umr7.onrender.com/api/cart",
        {
          withCredentials: true,
        }
      );
      setCartItems(cartRes.data.cartItems||[]);
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to add to cart");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  //handle buy now
  const handleBuyNow = () => {
    if (!selectedSize) {
      setMessage("Please select a size.");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    navigate("/checkout", {
      state: {
        productId: product._id,
        title: product.title,
        price: product.price,
        size: selectedSize,
        quantity: quantity,
        image: product.images?.[0],
        images:product.images
      },
    });
  };
  
  const scrollToReviews = () => {
    reviewRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <div style={styles.galleryWrapper}>
          {product.images?.map((img, index) => (
            <div key={index} style={styles.imageCard}>
              <img
                src={img}
                alt={`${product.title}-${index}`}
                style={styles.image}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={styles.right}>
        <h2>{product.title}</h2>
        <p style={styles.price}>₹{product.price}</p>
        <button
          style={{
            marginTop: "10px",
            padding: "8px 12px",
            backgroundColor: "#e0e0e0",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          onClick={scrollToReviews}
        >
          ⭐ {avgRating.toFixed(1)} ({reviews.length} reviews)
        </button>

        <p style={styles.desc}>{product.description}</p>

        <div style={styles.sizeWrapper}>
          <strong>Select Size: </strong>
          <div style={styles.sizeOptions}>
            {sizeOptions.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                style={{
                  ...styles.sizeButton,
                  backgroundColor: selectedSize === size ? "#5f2c82" : "#eee",
                  color: selectedSize === size ? "#fff" : "#000",
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.qtyWrapper}>
          <strong>Quantity:</strong>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => {
              setQuantity(Number(e.target.value));
            }}
            style={styles.qtyInput}
          ></input>
        </div>

        {isLoggedIn ? (
          <div style={styles.actions}>
            <button style={styles.cartBtn} onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button style={styles.buyNowBtn} onClick={handleBuyNow}>
              Buy Now
            </button>
            {message && (
              <div
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  color: messageType === "success" ? "green" : "red",
                  background: "#f2f2f2",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  width: "fit-content",
                }}
              >
                {message}
              </div>
            )}
          </div>
        ) : (
          <p style={styles.loginMessage}>
            Please login to add to cart or write a review.
          </p>
        )}

        <div
          ref={reviewRef}
          style={{
            marginTop: "40px",
            padding: "20px",
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Customer Reviews</h3>
          {reviews.length > 0 ? (
            reviews.map((r, i) => (
              <div
                key={i}
                style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}
              >
                <strong>{r.user?.username || "Anonymous"}</strong>
                <p>{"⭐".repeat(r.rating)}</p>
                <p>{r.comment}</p>
              </div>
            ))
          ) : (
            <p style={{ color: "#777" }}>No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
const styles = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    padding: "40px 20px",
    gap: "30px",
    fontFamily: "Arial, sans-serif",
    background: "linear-gradient(to bottom right, #f0f0ff, #e9f5f2)",
  },
  left: {
    flex: "1",
    minWidth: "300px",
    textAlign: "center",
    padding: "30px 10px",
    borderRadius: "10px",
  },
  galleryWrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
    justifyItems: "center",
  },
  imageCard: {
    background: "#fff",
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "220px",
  },
  image: {
    width: "100%",
    maxWidth: "400px",
    height: "auto",
    borderRadius: "10px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
  },
  right: {
    flex: "1",
    minWidth: "300px",
    padding: "20px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  },
  price: {
    color: "#49a09d",
    fontSize: "20px",
    fontWeight: "bold",
    marginTop: "10px",
  },
  desc: {
    margin: "15px 0",
    lineHeight: "1.6",
  },
  sizeWrapper: {
    margin: "20px 0",
  },
  sizeOptions: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  sizeButton: {
    padding: "8px 16px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s",
  },
  cartBtn: {
    marginTop: "20px",
    padding: "10px 20px",
    background: "#5f2c82",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },
  actions: {
    marginTop: "20px",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  buyNowBtn: {
    marginTop: "20px",
    padding: "10px 20px",
    background: "#49a09d",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },

  loginMessage: {
    marginTop: "20px",
    fontSize: "15px",
    color: "#888",
    fontStyle: "italic",
  },
  qtyWrapper: {
    marginTop: "15px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  qtyInput: {
    width: "60px",
    padding: "6px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
};