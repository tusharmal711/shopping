// src/components/Footer.jsx
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.columns}>
        {/* Column 1: Logo & About */}
        <div style={styles.column}>
          <h3 style={styles.heading}>Genz Fashion</h3>
          <p style={styles.text}>
            Trendy & Traditional Wear for Every Generation.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div style={styles.column}>
          <h4 style={styles.subHeading}>Quick Links</h4>
          <ul style={styles.list}>
            <li>
              <a href="/" style={styles.link}>
                Home
              </a>
            </li>
            <li>
              <a href="/products" style={styles.link}>
                Products
              </a>
            </li>
            <li>
              <a href="/login" style={styles.link}>
                Login
              </a>
            </li>
            <li>
              <a href="/register" style={styles.link}>
                Register
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div style={styles.column}>
          <h4 style={styles.subHeading}>Contact Us</h4>
          <p style={styles.text}>📍 Kolkata, India</p>
          <p style={styles.text}>📞 +91-9831546122</p>
          <p style={styles.text}>✉️ tania@genzfashion.com</p>
        </div>

        {/* Column 4: Social Media */}
        <div style={styles.column}>
          <h4 style={styles.subHeading}>Follow Us</h4>
          <div style={styles.socialIcons}>
            <FaFacebookF style={styles.icon} />
            <FaTwitter style={styles.icon} />
            <FaInstagram style={styles.icon} />
            <FaLinkedinIn style={styles.icon} />
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div style={styles.bottomBar}>
        <p style={{ margin: 0 }}>
          © {new Date().getFullYear()} Genz Fashion. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: "linear-gradient(to right, #5f2c82, #49a09d)",
    color: "#fff",
    padding: "40px 20px 10px",
    fontFamily: "Arial, sans-serif",
    borderTop: "5px solid #5f2c82",
  },
  columns: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "30px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  column: {
    flex: "1",
    minWidth: "220px",
  },
  heading: {
    fontSize: "22px",
    marginBottom: "15px",
  },
  subHeading: {
    fontSize: "18px",
    marginBottom: "10px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    display: "block",
    marginBottom: "8px",
  },
  text: {
    fontSize: "14px",
    marginBottom: "6px",
  },
  socialIcons: {
    display: "flex",
    gap: "12px",
    marginTop: "8px",
  },
  icon: {
    fontSize: "20px",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  bottomBar: {
    borderTop: "1px solid rgba(255,255,255,0.2)",
    textAlign: "center",
    padding: "15px 0",
    marginTop: "20px",
    fontSize: "13px",
    opacity: 0.9,
  },
};
