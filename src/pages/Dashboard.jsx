function Dashboard() {
  return (
    <main style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        
        <div style={{ padding: "20px", background: "#f2f2f2", flex: 1 }}>
          <h3>Products</h3>
          <p>120</p>
        </div>

        <div style={{ padding: "20px", background: "#f2f2f2", flex: 1 }}>
          <h3>Sales</h3>
          <p>45</p>
        </div>

        <div style={{ padding: "20px", background: "#f2f2f2", flex: 1 }}>
          <h3>Low Stock</h3>
          <p>8</p>
        </div>

      </div>
    </main>
  )
}

export default Dashboard