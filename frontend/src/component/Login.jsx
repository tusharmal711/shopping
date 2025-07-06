import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login({ setIsLoggedIn, setUserRole }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.username || !form.password) {
      setError("Both fields are required.");
      setLoading(false);
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      const response = await axios.post(
        "https://genzfashion-umr7.onrender.com/api/auth/login",
        form,
        {
          withCredentials: true,
        }
      );
      setSuccess(response.data.message);
      setError("");
      setIsLoggedIn(true);
      setUserRole(response.data.user.role)
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      const msg =
        err.response?.data?.error || "Login failed. Check credentials.";
      setError(msg);
      setTimeout(() => {
        setError("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.heading}>Login</h2>

        {success && (
          <div style={styles.successWrapper} className="fade-in">
            <div style={styles.success}>{success}</div>
          </div>
        )}

        {error && (
          <div style={styles.errorWrapper} className="fade-in">
            <div style={styles.error}>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "10px", fontSize: "14px" }}>
          Don't have an account?{" "}
          <span
            style={{ color: "#5f2c82", cursor: "pointer", fontWeight: "bold" }}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "calc(100vh - 60px)", // subtract navbar height
    background: "linear-gradient(to right, #5f2c82, #49a09d)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    padding: "0px 20px",
    marginTop: "0", // remove any top margin
    position: "relative",
  },
  formBox: {
    background:
      "linear-gradient(to bottom right, rgba(255,255,255,0.9), rgba(240,240,240,0.8))",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
    width: "100%",
    maxWidth: "400px",
    backdropFilter: "blur(8px)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#5f2c82",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#5f2c82",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
  },
  successWrapper: {
    marginBottom: "15px",
    width: "100%",
  },
  success: {
    backgroundColor: "#ddffdd",
    color: "#256029",
    padding: "10px",
    border: "1px solid #256029",
    borderRadius: "5px",
    fontSize: "14px",
    textAlign: "center",
  },
  errorWrapper: {
    marginBottom: "15px",
    width: "100%",
  },
  error: {
    backgroundColor: "#ffdddd",
    color: "#d8000c",
    padding: "10px",
    border: "1px solid #d8000c",
    borderRadius: "5px",
    fontSize: "14px",
    textAlign: "center",
  },
};

