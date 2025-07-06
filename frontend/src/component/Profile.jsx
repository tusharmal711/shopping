import { useEffect, useState } from "react";
import axios from "axios";
export default function Profile() {
    const[user,setUser]=useState(null)
    const [orders, setOrders] = useState([]);
    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const res = await axios.get(
            "https://genzfashion-umr7.onrender.com/api/auth/profile",
            {
              withCredentials: true,
            }
          );
          console.log("Created At:", res.data.user.createdAt);
          setUser(res.data.user);
        } catch (err) {
          console.error("Profile fetch failed", err);
        }
      };

      fetchProfile();
    }, []);

    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const res = await axios.get(
            "https://genzfashion-umr7.onrender.com/api/orders/my-orders",
            {
              withCredentials: true,
            }
          );
          setOrders(res.data.orders);
        } catch (err) {
          console.error("Failed to fetch orders", err);
        }
      };

      fetchOrders();
    }, []);

if(!user)
{
    return <p style={styles.loading}>Loading profile...</p>;
}

return (
  <div style={styles.container}>
    <div style={styles.card}>
      <h2 style={styles.title}>Profile</h2>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
      <p>
        <strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}
      </p>
      <h3 style={{ marginTop: "20px", color: "#fff" }}>My Orders</h3>
      {orders.length === 0 ? (
        <p style={{ color: "#fff" }}>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              background: "#fff",
              padding: "10px",
              borderRadius: "8px",
              margin: "10px 0",
              color: "#333",
            }}
          >
            <p>
              <strong>Order ID:</strong> {order._id}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Total:</strong> ₹{order.totalAmount}
            </p>
            <p>
              <strong>Ordered On:</strong>{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  </div>
);
}

const styles = {
  container: {
    minHeight: "calc(100vh - 60px)",
    background: "linear-gradient(to bottom right, #f0f0ff, #e9f5f2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },
  card: {
    background: "linear-gradient(to right, #5f2c82, #49a09d)",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
    maxWidth: "400px",
    width: "100%",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    color: "#5f2c82",
  },
  loading: {
    padding: "20px",
    textAlign: "center",
    fontSize: "18px",
    color: "#5f2c82",
  },
};