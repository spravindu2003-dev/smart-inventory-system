import { useEffect, useState } from 'react'
import { getSales, addSale } from '../utils/sales'

function Sales() {
  const [sales, setSales] = useState([])
  const [products, setProducts] = useState([])
  const [selectedIndex, setSelectedIndex] = useState('')
  const [qty, setQty] = useState(1)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const salesData = getSales()
    setSales(salesData)

    const productsData = JSON.parse(localStorage.getItem("products") || "[]")
    setProducts(productsData)
  }

  const activeProducts = products.filter(p => p.status === "active")

  // ✅ SELL PRODUCT (FIXED + CLEAN)
  const sellProduct = () => {
    if (selectedIndex === '') {
      alert("Select product")
      return
    }

    const product = activeProducts.find((_, i) => i == selectedIndex)

    if (!product) return

    const quantity = Number(qty)

    if (quantity <= 0) {
      alert("Invalid quantity")
      return
    }

    if (quantity > Number(product.qty)) {
      alert("Not enough stock")
      return
    }

    const sale = {
      id: Date.now(),
      productName: product.name,
      quantity,
      unitPrice: Number(product.price),
      totalPrice: Number(product.price) * quantity,
      date: new Date().toISOString()
    }

    addSale(sale)

    // update stock
    const updated = [...products]
    const realIndex = updated.findIndex(p => p.name === product.name)

    updated[realIndex] = {
      ...updated[realIndex],
      qty: Number(updated[realIndex].qty) - quantity,
      history: [
        ...(updated[realIndex].history || []),
        {
          action: "sold",
          time: new Date().toLocaleString(),
          note: `Sold ${quantity}`
        }
      ]
    }

    localStorage.setItem("products", JSON.stringify(updated))

    setQty(1)
    setSelectedIndex('')
    loadData()
  }

  const totalRevenue = sales.reduce(
    (sum, s) => sum + Number(s.totalPrice || 0),
    0
  )

  const today = new Date().toDateString()

  const todaySales = sales.filter(
    s => new Date(s.date).toDateString() === today
  )

  return (
    <main style={styles.page}>
      <h2 style={styles.title}>Sales System</h2>

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
          <h4>Today Sales</h4>
          <p style={styles.value}>{todaySales.length}</p>
        </div>
      </div>

      {/* SELL BOX */}
      <div style={styles.sellBox}>
        <h3>Quick Sell</h3>

        <div style={styles.row}>
          <select
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(e.target.value)}
            style={styles.input}
          >
            <option value="">Select Product</option>
            {activeProducts.map((p, i) => (
              <option key={i} value={i}>
                {p.name} (Stock: {p.qty})
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            style={{ ...styles.input, width: "90px" }}
          />

          <button onClick={sellProduct} style={styles.button}>
            Sell
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div style={styles.tableBox}>
        <h3>Recent Sales</h3>

        <table style={styles.table}>
          <thead>
            <tr style={styles.head}>
              <th>Product</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan="4" style={styles.empty}>
                  No sales yet
                </td>
              </tr>
            ) : (
              sales.slice(-10).reverse().map((s, i) => (
                <tr key={i} style={styles.row}>
                  <td>{s.productName}</td>
                  <td>{s.quantity}</td>
                  <td style={{ color: "#38bdf8", fontWeight: "bold" }}>
                    Rs {s.totalPrice}
                  </td>
                  <td style={{ color: "#94a3b8" }}>
                    {new Date(s.date).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}

/* DARK MODERN UI */
const styles = {
  page: {
    padding: "20px",
    background: "#0f172a",
    minHeight: "100vh",
    color: "white"
  },

  title: {
    marginBottom: "15px"
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
    borderRadius: "10px",
    border: "1px solid #334155"
  },

  value: {
    fontSize: "20px",
    fontWeight: "bold",
    marginTop: "5px",
    color: "#38bdf8"
  },

  sellBox: {
    background: "#1e293b",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "15px",
    border: "1px solid #334155"
  },

  row: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
    flex: 1
  },

  button: {
    padding: "10px 14px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  tableBox: {
    background: "#1e293b",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #334155"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    color: "white"
  },

  head: {
    textAlign: "left",
    color: "#94a3b8"
  },

  row: {
    borderTop: "1px solid #334155"
  },

  empty: {
    textAlign: "center",
    padding: "20px",
    color: "#94a3b8"
  }
}

export default Sales