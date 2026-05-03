import { useEffect, useState } from 'react'
import { getSales } from '../utils/sales'

function Sales() {
  const [sales, setSales] = useState([])
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    loadSales()
  }, [])

  const loadSales = () => {
    const data = getSales()
    setSales(data)
  }

  // TOTAL REVENUE
  const totalRevenue = sales.reduce(
    (sum, s) => sum + s.totalPrice,
    0
  )

  // TODAY FILTER
  const today = new Date().toDateString()

  const todaySales = sales.filter(
    (s) => new Date(s.date).toDateString() === today
  )

  const todayRevenue = todaySales.reduce(
    (sum, s) => sum + s.totalPrice,
    0
  )

  // FILTERED DATA
  const filteredSales =
    filter === "today"
      ? todaySales
      : sales

  return (
    <main style={{ padding: "20px" }}>
      <h2>Sales & Revenue</h2>

      {/* SUMMARY CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginTop: "20px"
        }}
      >
        <div style={cardStyle("#e6f0ff")}>
          <h3>Total Revenue</h3>
          <p style={numberStyle}>
            Rs. {totalRevenue}
          </p>
        </div>

        <div style={cardStyle("#e6ffe6")}>
          <h3>Today Revenue</h3>
          <p style={numberStyle}>
            Rs. {todayRevenue}
          </p>
        </div>

        <div style={cardStyle("#fff5cc")}>
          <h3>Total Sales</h3>
          <p style={numberStyle}>
            {sales.length}
          </p>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setFilter("all")}>
          All Sales
        </button>

        <button
          onClick={() => setFilter("today")}
          style={{ marginLeft: "10px" }}
        >
          Today
        </button>
      </div>

      {/* SALES TABLE */}
      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", marginTop: "20px" }}
      >
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {filteredSales.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No sales found
              </td>
            </tr>
          ) : (
            filteredSales.map((s, i) => (
              <tr key={i}>
                <td>{s.productName}</td>
                <td>{s.quantity}</td>
                <td>{s.unitPrice}</td>
                <td style={{ fontWeight: "bold" }}>
                  {s.totalPrice}
                </td>
                <td>
                  {new Date(s.date).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  )
}

// UI helper styles
const cardStyle = (bg) => ({
  padding: "20px",
  background: bg,
  borderRadius: "10px"
})

const numberStyle = {
  fontSize: "28px",
  fontWeight: "bold"
}

export default Sales