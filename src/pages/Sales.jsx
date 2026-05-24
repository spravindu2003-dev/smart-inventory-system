import { useEffect, useState } from "react"
import "../styles/Sales.css"
import { getSales, addSale, saveSales } from "../utils/salesStorage"

function Sales() {
  const [sales, setSales] = useState([])
  const [products, setProducts] = useState([])

  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState(null)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setSales(getSales())

    const savedProducts = localStorage.getItem("products")
    const parsed = savedProducts ? JSON.parse(savedProducts) : []
    setProducts(Array.isArray(parsed) ? parsed : [])
  }

  // 🔥 IMPORTANT: HISTORY LOGGER (FIX FOR ACTIVITY LOG)
  const updateProductHistory = (productName, action, note = "") => {
    const saved = localStorage.getItem("products")
    const products = saved ? JSON.parse(saved) : []

    const updated = products.map((p) => {
      if (p.name === productName) {
        return {
          ...p,
          history: [
            ...(p.history || []),
            {
              action,
              time: new Date().toLocaleString(),
              note
            }
          ]
        }
      }
      return p
    })

    localStorage.setItem("products", JSON.stringify(updated))
    setProducts(updated)
  }

  const saveProducts = (data) => {
    localStorage.setItem("products", JSON.stringify(data))
    setProducts(data)
  }

  const activeProducts = products.filter(
    (p) => p.status === "active"
  )

  const filteredProducts = activeProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const isLowStock = (p) =>
    p.status === "active" &&
    Number(p.qty) <= Number(p.minQty || 5)

  // ✅ SELL PRODUCT
  const sellProduct = () => {
    if (!selected) return alert("Select product")
    if (qty <= 0) return alert("Invalid quantity")
    if (qty > selected.qty) return alert("Not enough stock")

    const sale = {
      id: Date.now(),
      productName: selected.name,
      quantity: qty,
      unitPrice: selected.price,
      totalPrice: selected.price * qty,
      date: new Date().toLocaleString()
    }

    addSale(sale)

    const updated = [...products]
    const index = updated.findIndex(
      (p) => p.name === selected.name
    )

    if (index !== -1) {
      updated[index].qty -= qty

      saveProducts(updated)

      // 🔥 LOG: SOLD
      updateProductHistory(
        selected.name,
        "sold",
        `Sold ${qty} units`
      )

      // 🔥 LOG: LOW STOCK
      if (updated[index].qty <= (updated[index].minQty || 5)) {
        updateProductHistory(
          selected.name,
          "low stock",
          `Stock low: ${updated[index].qty}`
        )
      }
    }

    setSelected(null)
    setQty(1)
    loadData()
  }

  // 🔥 UNDO SALE
  const undoSale = (id) => {
    const sale = sales.find((s) => s.id === id)
    if (!sale) return

    if (!window.confirm("Undo this sale?")) return

    const updatedProducts = [...products]
    const index = updatedProducts.findIndex(
      (p) => p.name === sale.productName
    )

    if (index !== -1) {
      updatedProducts[index].qty += sale.quantity
      saveProducts(updatedProducts)

      // 🔥 LOG: UNDO SALE
      updateProductHistory(
        sale.productName,
        "undo sale",
        `Restored ${sale.quantity} units`
      )
    }

    const updatedSales = sales.filter((s) => s.id !== id)
    saveSales(updatedSales)

    loadData()
  }

  const totalRevenue = sales.reduce(
    (sum, s) => sum + Number(s.totalPrice || 0),
    0
  )

  return (
    <div className="sales-container">

      {/* HEADER */}
      <div className="sales-header">
        <h1>Sales Dashboard</h1>
        <p>Total Revenue: Rs {totalRevenue}</p>
      </div>

      {/* MAIN */}
      <div className="sales-grid-modern">

        {/* PRODUCTS */}
        <div className="sales-panel">
          <h3>Products</h3>

          <input
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sales-search"
          />

          <div className="sales-product-list">
            {filteredProducts.map((p) => (
              <div
                key={p.name}
                className={`product-card ${
                  selected?.name === p.name ? "active" : ""
                }`}
                onClick={() => setSelected(p)}
              >
                <div>
                  <strong>{p.name}</strong>
                  <p>
                    Stock: {p.qty}
                    {isLowStock(p) && " ⚠ LOW"}
                  </p>
                </div>
                <div>Rs {p.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK SELL */}
        <div className="sales-panel">
          <h3>Quick Sell</h3>

          {selected ? (
            <>
              <div className="selected-box">
                <h4>{selected.name}</h4>
                <p>Price: Rs {selected.price}</p>
                <p>Stock: {selected.qty}</p>
              </div>

              <div className="qty-box">
                <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>

                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                />

                <button onClick={() => setQty(qty + 1)}>+</button>
              </div>

              <button className="sell-btn" onClick={sellProduct}>
                Sell Now
              </button>
            </>
          ) : (
            <p className="hint">Select a product to start selling</p>
          )}
        </div>
      </div>

      {/* SALES HISTORY */}
      <div className="sales-history">
        <h3>Recent Sales</h3>

        {sales.length === 0 ? (
          <p>No sales found</p>
        ) : (
          sales
            .slice()
            .reverse()
            .map((s) => (
              <div key={s.id} className="sale-row">
                <div>
                  <strong>{s.productName}</strong>
                  <p>{s.date}</p>
                </div>

                <div>Qty: {s.quantity}</div>
                <div>Rs {s.totalPrice}</div>

                <button onClick={() => undoSale(s.id)}>
                  Undo
                </button>
              </div>
            ))
        )}
      </div>
    </div>
  )
}

export default Sales