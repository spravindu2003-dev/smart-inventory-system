import { useEffect, useState } from 'react'

function Dashboard() {
  const [products, setProducts] = useState([])
  const [sales, setSales] = useState([])

  useEffect(() => {
    const savedProducts = localStorage.getItem('products')
    const parsedProducts = savedProducts ? JSON.parse(savedProducts) : []
    setProducts(Array.isArray(parsedProducts) ? parsedProducts : [])

    const savedSales = localStorage.getItem('sales')
    const parsedSales = savedSales ? JSON.parse(savedSales) : []
    setSales(Array.isArray(parsedSales) ? parsedSales : [])
  }, [])

  // ACTIVE PRODUCTS
  const activeProducts = products.filter(
    (item) => item.status === "active"
  )

  // REMOVED PRODUCTS
  const removedProducts = products.filter(
    (item) => item.status === "removed"
  ).length

  // LOW STOCK (SMART VERSION)
  const lowStockProducts = products.filter(
    (item) =>
      item.status === "active" &&
      Number(item.qty) <= Number(item.minQty || 5)
  ).length

  // TOTAL REVENUE
  const totalRevenue = sales.reduce(
    (sum, s) => sum + Number(s.totalPrice || 0),
    0
  )

  return (
    <main style={{ padding: "20px", background: "#0f172a", minHeight: "100vh", color: "white" }}>
      <h2>Dashboard</h2>

      {/* CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: "15px",
        marginTop: "20px"
      }}>

        {/* TOTAL */}
        <div style={card}>
          <h3>Total Products</h3>
          <p style={number}>{products.length}</p>
        </div>

        {/* ACTIVE */}
        <div style={card}>
          <h3>Active Products</h3>
          <p style={{ ...number, color: "#22c55e" }}>
            {activeProducts.length}
          </p>
        </div>

        {/* REMOVED */}
        <div style={card}>
          <h3>Removed Products</h3>
          <p style={{ ...number, color: "#ef4444" }}>
            {removedProducts}
          </p>
        </div>

        {/* LOW STOCK */}
        <div style={card}>
          <h3>Low Stock Alerts</h3>
          <p style={{ ...number, color: "#f97316" }}>
            {lowStockProducts}
          </p>
        </div>

        {/* REVENUE */}
        <div style={card}>
          <h3>Total Revenue</h3>
          <p style={{ ...number, color: "#38bdf8" }}>
            Rs. {totalRevenue}
          </p>
        </div>

      </div>

      {/* LOW STOCK LIST (IMPORTANT VISUAL) */}
      <div style={{ marginTop: "30px" }}>
        <h3>Low Stock Items</h3>

        {products
          .filter(
            (p) =>
              p.status === "active" &&
              Number(p.qty) <= Number(p.minQty || 5)
          )
          .map((p, i) => (
            <div key={i} style={alertBox}>
              ⚠ {p.name} → Stock: {p.qty} / Min: {p.minQty || 5}
            </div>
          ))}

      </div>
    </main>
  )
}

// STYLES
const card = {
  padding: "15px",
  background: "#1e293b",
  borderRadius: "10px",
  border: "1px solid #334155"
}

const number = {
  fontSize: "26px",
  fontWeight: "bold",
  marginTop: "10px"
}

const alertBox = {
  marginTop: "10px",
  padding: "10px",
  background: "#2a1212",
  border: "1px solid #ff4d4f",
  borderRadius: "8px",
  color: "#ff4d4f"
}

export default Dashboard