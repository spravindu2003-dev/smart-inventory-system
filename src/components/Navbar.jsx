import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav style={{
      padding: "10px",
      background: "#222",
      color: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      
      <h2>Smart Inventory System</h2>

      <div>
        <Link to="/" style={{ marginRight: "10px", color: "white", textDecoration: "none" }}>
          Dashboard
        </Link>

        <Link to="/products" style={{ marginRight: "10px", color: "white", textDecoration: "none" }}>
          Products
        </Link>

        <span style={{ marginRight: "10px" }}>Sales</span>
        <span>Reports</span>
      </div>

    </nav>
  )
}

export default Navbar