import { useEffect, useState } from 'react'
import { getSales, addSale, saveSales } from '../utils/sales'

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

    const savedProducts = localStorage.getItem("products")
    const parsed = savedProducts ? JSON.parse(savedProducts) : []
    setProducts(Array.isArray(parsed) ? parsed : [])
  }

  const activeProducts = products.filter(
    (item) => item.status === "active"
  )

  // SELL PRODUCT
  const sellProduct = () => {
    if (selectedIndex === '') {
      alert("Select product")
      return
    }

    const product = activeProducts[selectedIndex]
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
      date: new Date().toLocaleString()
    }

    addSale(sale)

    const updated = [...products]

    const realIndex = products.findIndex(
      (p) => p.name === product.name
    )

    updated[realIndex].qty =
      Number(updated[realIndex].qty) - quantity

    localStorage.setItem(
      "products",
      JSON.stringify(updated)
    )

    setQty(1)
    setSelectedIndex('')
    loadData()
  }

  // UNDO SALE
  const undoSale = (saleId) => {
    const targetSale = sales.find(
      (item) => item.id === saleId
    )

    if (!targetSale) return

    const ok = window.confirm(
      `Undo sale of ${targetSale.productName}?`
    )

    if (!ok) return

    // Restore stock
    const updatedProducts = [...products]

    const productIndex = updatedProducts.findIndex(
      (p) => p.name === targetSale.productName
    )

    if (productIndex !== -1) {
      updatedProducts[productIndex].qty =
        Number(updatedProducts[productIndex].qty) +
        Number(targetSale.quantity)

      localStorage.setItem(
        "products",
        JSON.stringify(updatedProducts)
      )
    }

    // Remove sale
    const updatedSales = sales.filter(
      (item) => item.id !== saleId
    )

    saveSales(updatedSales)

    loadData()
  }

  const totalRevenue = sales.reduce(
    (sum, item) => sum + Number(item.totalPrice),
    0
  )

  return (
    <main style={styles.page}>
      <h2 style={styles.title}>Sales Dashboard</h2>

      {/* TOP CARDS */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <p>Total Sales</p>
          <h2>{sales.length}</h2>
        </div>

        <div style={styles.card}>
          <p>Total Revenue</p>
          <h2>Rs. {totalRevenue}</h2>
        </div>
      </div>

      {/* QUICK SELL */}
      <div style={styles.sellCard}>
        <h3>Quick Sell</h3>

        <select
          value={selectedIndex}
          onChange={(e) =>
            setSelectedIndex(e.target.value)
          }
          style={styles.input}
        >
          <option value="">
            Select Product
          </option>

          {activeProducts.map((item, index) => (
            <option
              key={index}
              value={index}
            >
              {item.name} (Stock {item.qty})
            </option>
          ))}
        </select>

        <div style={styles.qtyRow}>
          <button
            style={styles.qtyBtn}
            onClick={() =>
              setQty(Math.max(1, qty - 1))
            }
          >
            -
          </button>

          <input
            type="number"
            value={qty}
            onChange={(e) =>
              setQty(Number(e.target.value))
            }
            style={styles.qtyInput}
          />

          <button
            style={styles.qtyBtn}
            onClick={() =>
              setQty(qty + 1)
            }
          >
            +
          </button>
        </div>

        <button
          onClick={sellProduct}
          style={styles.sellBtn}
        >
          Sell Now
        </button>
      </div>

      {/* SALES TABLE */}
      <div style={styles.tableWrap}>
        <h3>Recent Sales</h3>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan="5">
                  No sales found
                </td>
              </tr>
            ) : (
              sales
                .slice()
                .reverse()
                .map((item) => (
                  <tr key={item.id}>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>
                      Rs. {item.totalPrice}
                    </td>
                    <td>{item.date}</td>
                    <td>
                      <button
                        style={styles.undoBtn}
                        onClick={() =>
                          undoSale(item.id)
                        }
                      >
                        Undo
                      </button>
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

const styles = {
  page: {
    padding: "20px",
    background: "#0f172a",
    minHeight: "100vh",
    color: "white"
  },

  title: {
    marginBottom: "20px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "15px"
  },

  card: {
    background: "#1e293b",
    padding: "15px",
    borderRadius: "12px"
  },

  sellCard: {
    marginTop: "20px",
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px"
  },

  input: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px"
  },

  qtyRow: {
    display: "flex",
    gap: "10px",
    marginTop: "15px"
  },

  qtyBtn: {
    width: "45px",
    fontSize: "20px"
  },

  qtyInput: {
    flex: 1,
    textAlign: "center"
  },

  sellBtn: {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    background: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "8px"
  },

  tableWrap: {
    marginTop: "25px",
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px"
  },

  table: {
    width: "100%",
    marginTop: "15px"
  },

  undoBtn: {
    background: "#f97316",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px"
  }
}

export default Sales