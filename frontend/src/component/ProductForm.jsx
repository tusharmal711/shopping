import { useState, useEffect } from "react";

export default function ProductForm({ onSave, product }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    images: [],
  });

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title || "",
        description: product.description || "",
        price: product.price || "",
        images: [],
      });
    } else {
      setForm({ title: "", description: "", price: "", images: [] });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleImageChange = (e) => {
    setForm((prevForm) => ({
      ...prevForm,
      images: [...e.target.files],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, description, price, images } = form;

    if (!title || !description || !price || images.length === 0) return;

    onSave(form); // ✅ Let parent handle Add or Update

    setForm({ title: "", description: "", price: "", images: [] });
    e.target.reset(); // ✅ clear file input
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Product Title"
        value={form.title}
        style={styles.input}
        onChange={handleChange}
      />
      <input
        type="text"
        name="description"
        placeholder="Product Description"
        value={form.description}
        style={styles.input}
        onChange={handleChange}
      />
      <input
        type="number"
        name="price"
        placeholder="Give Price"
        value={form.price}
        style={styles.input}
        onChange={handleChange}
      />
      <input
        type="file"
        name="images"
        multiple
        style={styles.input}
        onChange={handleImageChange}
      />
      <button type="submit" style={styles.button}>
        {product ? "Update" : "Add"} Product
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: "grid",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#49a09d",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};
