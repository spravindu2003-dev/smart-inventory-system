import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer
} from "recharts"

function Reports() {
  const [sales, setSales] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("sales") || "[]")
      const p = JSON.parse(localStorage.getItem("products") || "[]")

      setSales(Array.isArray(s) ? s : [])
      setProducts(Array.isArray(p) ? p : [])
    } catch (e) {
      setSales([])
      setProducts([])
    }
  }, [])

  // SAFE GROUPING
  const revenueMap = {}

  sales.forEach((s) => {
    const date = new Date(s.date).toLocaleDateString()

    if (!revenueMap[date]) {
      revenueMap[date] = 0
    }

    revenueMap[date] += Number(s.totalPrice || 0)
  })

  const revenueData = Object.keys(revenueMap).map((date) => ({
    date,
    revenue: revenueMap[date]
  }))

  const stockData = products.map((p) => ({
    name: p.name || "Unknown",
    stock: Number(p.qty || 0)
  }))

  const totalRevenue = sales.reduce(
    (sum, s) => sum + Number(s.totalPrice || 0),
    0
  )

  return (
    <main style={styles.page}>
      <h2>Reports</h2>

      {/* EMPTY CHECK */}
      {sales.length === 0 && products.length === 0 ? (
        <div style={styles.empty}>
          ⚠ No data found. Add products and sales first.
        </div>
      ) : (
        <>
          {/* CARDS */}
          <div style={styles.grid}>
            <div style={styles.card}>
              <h4>Total Revenue</h4>
              <p style={styles.value}>Rs {totalRevenue}</p>
            </div>

            <div style={styles.card}>
              <h4>Total Sales</h4>
              <p style={styles.value}>{sales.length}</p>
            </div>

            <div style={styles.card}>
              <h4>Products</h4>
              <p style={styles.value}>{products.length}</p>
            </div>
          </div>

          {/* CHART 1 */}
          <div style={styles.box}>
            <h3>Revenue Chart</h3>

            {revenueData.length === 0 ? (
              <p style={{ color: "#94a3b8" }}>No sales data</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#38bdf8"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* CHART 2 */}
          <div style={styles.box}>
            <h3>Stock Chart</h3>

            {stockData.length === 0 ? (
              <p style={{ color: "#94a3b8" }}>No product data</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="stock" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}
    </main>
  )
}

const styles = {
  page: {
    padding: "20px",
    background: "#0f172a",
    minHeight: "100vh",
    color: "white"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
    gap: "12px",
    marginBottom: "20px"
  },

  card: {
    background: "#1e293b",
    padding: "12px",
    borderRadius: "10px"
  },

  value: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#38bdf8"
  },

  box: {
    background: "#1e293b",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "15px"
  },

  empty: {
    padding: "20px",
    background: "#1e293b",
    borderRadius: "10px",
    color: "#fbbf24"
  }
}

export default Reports