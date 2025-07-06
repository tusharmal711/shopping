import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({ username: "", password: "", role: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  //handler for input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  //handler for submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Required field check
    if (!form.username || !form.password || !form.role) {
      setError("All fields are required.");
      setLoading(false);
      setTimeout(() => setError(""), 3000);
      return;
    }

    // 2. Password length
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      setTimeout(() => setError(""), 3000);
      return;
    }

    // 3. Password strength check
    const hasUpper = /[A-Z]/.test(form.password);
    const hasLower = /[a-z]/.test(form.password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(form.password);

    if (!hasUpper || !hasLower || !hasSpecial) {
      setError(
        "Password must include uppercase, lowercase, and special character."
      );
      setLoading(false);
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      const response = await axios.post(
        "https://genzfashion-umr7.onrender.com/api/auth/register",
        form
      );
      setError("");
      setSuccess(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        "Registration failed. Try another username.";
      setError(msg);
      setSuccess("");
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
        <h2 style={styles.heading}>Register</h2>

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
            placeholder="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "10px", fontSize: "14px" }}>
          Already have an account?{" "}
          <span
            style={{ color: "#5f2c82", cursor: "pointer", fontWeight: "bold" }}
            onClick={() => navigate("/login")}
          >
            Login
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
    backdropFilter: "blur(8px)", // gives frosted effect
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
