import { Link } from "react-router-dom";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";

export default function Navbar({isLoggedIn, onLogout, search, setSearch,userRole ,cartCount})
{
    return (
      <nav style={styles.navbar}>
        <div style={styles.left}>
          <h2 style={styles.brand}>Genz Fashion</h2>
        </div>
        <div style={styles.center}>
          <input
            type="text"
            placeholder="Search GenzStyle.com"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.right}>
          {!isLoggedIn ? (
            <>
              <Link to="/login" style={styles.link}>
                Login
              </Link>
              <Link to="/register" style={styles.link}>
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" style={styles.profileLink}>
                <FaUserCircle style={styles.icon} />
              </Link>
              {isLoggedIn && (
                <Link to="/cart" style={styles.cartLink}>
                  <FaShoppingCart style={styles.icon} />
                  {cartCount > 0 && (
                    <span style={styles.cartCount}>{cartCount}</span>
                  )}
                </Link>
              )}
              {userRole === "admin" && (
                <Link to="/admin" style={styles.link}>
                  Shop Control Center
                </Link>
              )}
              <button onClick={onLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    );
}
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap", // allow wrap on small screen
    padding: "4px 16px",
    background:
      "linear-gradient(to right,rgb(136, 77, 175),rgb(123, 197, 195))",
    color: "#fff",
    boxSizing: "border-box",
    borderBottom: "5px solid #5f2c82",
    width: "100%",
    minHeight: "50px",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  brand: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "bold",
  },
  searchInput: {
    padding: "8px 12px",
    borderRadius: "5px",
    border: "none",
    fontSize: "14px",
    width: "250px",
    maxWidth: "100%", // responsive
  },
  link: {
    marginLeft: "15px",
    color: "#fff",
    textDecoration: "none",
    fontWeight: "500",
    whiteSpace: "nowrap", // prevent text wrapping
  },
  icon: {
    fontSize: "24px",
    marginRight: "10px",
  },
  logoutBtn: {
    marginLeft: "15px",
    padding: "6px 12px",
    background: "#fff",
    color: "#5f2c82",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },
  left: {
    flex: "1 1 100%", // full width on small screens
    marginBottom: "10px",
  },
  center: {
    flex: "1 1 100%", // full width
    display: "flex",
    justifyContent: "center",
    marginBottom: "10px",
  },
  right: {
    flex: "1 1 100%", // stack on small screens
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
  },
  profileLink: {
    color: "#fff",
    textDecoration: "none",
    marginRight: "10px",
  },
  cartLink: {
    color: "#fff",
    textDecoration: "none",
    position: "relative",
    marginRight: "10px",
  },
  cartCount: {
    position: "absolute",
    top: "-6px",
    right: "-10px",
    background: "red",
    color: "#fff",
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: "12px",
  },
};
  