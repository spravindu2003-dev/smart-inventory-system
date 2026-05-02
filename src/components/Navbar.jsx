import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav
      style={{
        padding: "10px",
        background: "#222",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <h2>Smart Inventory System</h2>

      <div>
        <Link to="/" style={{ marginRight: "10px", color: "white", textDecoration: "none" }}>
          Dashboard
        </Link>

        <Link to="/products" style={{ marginRight: "10px", color: "white", textDecoration: "none" }}>
          Products
        </Link>

        <Link to="/log" style={{ marginRight: "10px", color: "white", textDecoration: "none" }}>
          Activity Log
        </Link>

        <Link to="/sales" style={{ marginRight: "10px", color: "white", textDecoration: "none" }}>
          Sales
        </Link>

        <Link to="/reports" style={{ color: "white", textDecoration: "none" }}>
          Reports
        </Link>
      </div>
    </nav>
  )
}

export default Navbar