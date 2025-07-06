import axios from "axios";
import { useState, useEffect, useRef } from "react";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";

export default function ProductAdmin() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [message, setMessage] = useState("");

  const formRef = useRef(null);
  const listRef = useRef(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "https://genzfashion-umr7.onrender.com/api/products/all"
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setMessage("❌ Failed to load products.");
    }
  };

  const handleSave = async (product) => {
    try {
      const isUpdating = !!editProduct;
      const formData = new FormData();
      formData.append("title", product.title);
      formData.append("description", product.description);
      formData.append("price", product.price);
      product.images.forEach((img) => formData.append("images", img));

      const url = isUpdating
        ? `https://genzfashion-umr7.onrender.com/api/products/update/${editProduct._id}`
        : "https://genzfashion-umr7.onrender.com/api/products/add";

      const method = isUpdating ? axios.put : axios.post;

      await method(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setEditProduct(null);
      fetchProducts();
      setMessage(isUpdating ? "✅ Product updated!" : "✅ Product added!");
      setTimeout(
        () => listRef.current?.scrollIntoView({ behavior: "smooth" }),
        200
      );
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      console.error("Save error:", err);
      setMessage("❌ Failed to save product.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(
        `https://genzfashion-umr7.onrender.com/api/products/delete/${id}`
      );
      fetchProducts();
      setMessage("🗑️ Product deleted!");
      setTimeout(
        () => formRef.current?.scrollIntoView({ behavior: "smooth" }),
        100
      );
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      console.error("Delete error:", err);
      setMessage("❌ Failed to delete product.");
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setTimeout(
      () => formRef.current?.scrollIntoView({ behavior: "smooth" }),
      100
    );
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={styles.container}>
      <div ref={formRef}>
        <h1 style={styles.title}>Product Manager</h1>
        {message && <div style={styles.message}>{message}</div>}
        <ProductForm onSave={handleSave} product={editProduct} />
      </div>
      <div ref={listRef}>
        <ProductList
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    background: "linear-gradient(to bottom right, #f0f0ff, #e9f5f2)",
    border: "1px solid #ccc",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "10px",
  },
  message: {
    backgroundColor: "#d4edda",
    color: "#155724",
    padding: "10px 15px",
    margin: "15px 0",
    border: "1px solid #c3e6cb",
    borderRadius: "5px",
    textAlign: "center",
    fontWeight: "bold",
  },
};
