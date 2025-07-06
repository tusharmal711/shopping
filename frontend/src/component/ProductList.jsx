export default function ProductList({products,onEdit,onDelete})
{
    return (
      <div style={styles.grid}>
        {products.map((p) => (
          <div key={p._id} style={styles.card}>
            <img src={p.image} alt={p.title} style={styles.image} />
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <p>₹{p.price}</p>
            <button onClick={() => onEdit(p)} style={styles.edit}>
              Edit
            </button>
            <button onClick={() => onDelete(p._id)} style={styles.delete}>
              Delete
            </button>
          </div>
        ))}
      </div>
    );
}
const styles = {
  grid: {
    display: "grid",
    gap: "20px",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "15px",
    textAlign: "center",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "6px",
  },
  edit: {
    marginRight: "10px",
    backgroundColor: "#f0ad4e",
    color: "#fff",
    padding: "8px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  delete: {
    backgroundColor: "#d9534f",
    color: "#fff",
    padding: "8px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};