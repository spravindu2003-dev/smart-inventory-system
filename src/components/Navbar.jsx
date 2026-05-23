import { Link, useNavigate } from "react-router-dom";
import { getUser, logoutUser } from "../utils/auth";

function Navbar() {
  const user = getUser();
  const navigate = useNavigate();

  const logout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      
      {/* LEFT - BRAND */}
      <div style={styles.left}>
        <div style={styles.logo}>
          📦 Smart Inventory
        </div>

        <div style={styles.links}>
          <Link to="/" style={styles.link}>Dashboard</Link>
          <Link to="/products" style={styles.link}>Products</Link>
          <Link to="/sales" style={styles.link}>Sales</Link>
          <Link to="/reports" style={styles.link}>Reports</Link>

          {user?.role === "admin" && (
            <Link to="/log" style={styles.link}>
              Activity Log
            </Link>
          )}
        </div>
      </div>

      {/* RIGHT - USER INFO */}
      <div style={styles.right}>
        
        <div style={styles.userBox}>
          <span style={styles.userName}>
            👤 {user?.username}
          </span>

          <span
            style={{
              ...styles.role,
              background:
                user?.role === "admin"
                  ? "#f59e0b"
                  : "#3b82f6",
            }}
          >
            {user?.role}
          </span>
        </div>

        <button onClick={logout} style={styles.logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    background: "linear-gradient(90deg, #0f172a, #1e293b)",
    color: "white",
    borderBottom: "1px solid #334155",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: "30px",
  },

  logo: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#38bdf8",
  },

  links: {
    display: "flex",
    gap: "15px",
  },

  link: {
    color: "#cbd5e1",
    textDecoration: "none",
    fontSize: "14px",
    padding: "6px 10px",
    borderRadius: "6px",
    transition: "0.2s",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  userBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  userName: {
    fontSize: "14px",
    color: "#e2e8f0",
  },

  role: {
    fontSize: "12px",
    padding: "3px 8px",
    borderRadius: "999px",
    color: "white",
    fontWeight: "bold",
  },

  logout: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Navbar;