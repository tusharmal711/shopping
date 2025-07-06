import { useState } from "react";
import { Link } from "react-router-dom";
export default function ProductGrid({ products = [] }) {
  return (
    <div style={styles.grid}>
      {products.map((p) => (
        <HoverCard key={p._id} product={p} />
      ))}
    </div>
  );
}

function HoverCard({ product }) {
  const [hover, setHover] = useState(false);

  return (
    <Link
      to={`/product/${product._id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          ...styles.card,
          transform: hover ? "scale(1.05)" : "scale(1)",
          boxShadow: hover
            ? "0 4px 12px rgba(0,0,0,0.2)"
            : "0 2px 8px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
          cursor: "pointer",
          background: "linear-gradient(to bottom right, #f0f0ff, #e9f5f2)",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <img src={product.image} alt={product.title} style={styles.image} />
        <h3>{product.title}</h3>
        <p style={styles.price}>₹{product.price}</p>
      </div>
    </Link>
    // <div
    //   style={{
    //     ...styles.card,
    //     transform: hover ? "scale(1.05)" : "scale(1)",
    //     boxShadow: hover
    //       ? "0 4px 12px rgba(0,0,0,0.2)"
    //       : "0 2px 8px rgba(0,0,0,0.1)",
    //     transition: "all 0.3s ease",
    //     cursor: "pointer",
    //   }}
    //   onMouseEnter={() => setHover(true)}
    //   onMouseLeave={() => setHover(false)}
    // >
    //   <img src={product.image} alt={product.title} style={styles.image} />
    //   <h3>{product.title}</h3>
    //   <p style={styles.price}>₹{product.price}</p>
    //   <p style={styles.desc}>{product.description}</p>
    // </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gap: "20px",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  },
  card: {
    border: "1px solid #ddd",
    padding: "15px",
    borderRadius: "10px",
    backgroundColor: "#fff",
    textAlign: "center",
  },
  image: {
    width: "80%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "6px",
  },
  price: {
    color: "#49a09d",
    fontWeight: "bold",
    marginTop: "8px",
  },
  desc: {
    fontSize: "14px",
    color: "#666",
    marginTop: "4px",
  },
};
