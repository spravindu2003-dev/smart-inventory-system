import { useEffect, useState } from 'react'
import { addSale } from '../utils/sales'

function Dashboard() {
  const [products, setProducts] = useState([])
  const [selectedIndex, setSelectedIndex] = useState('')
  const [sellQty, setSellQty] = useState(1)
  const [lastSale, setLastSale] = useState(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = () => {
    const saved = localStorage.getItem('products')
    const parsed = saved ? JSON.parse(saved) : []
    setProducts(Array.isArray(parsed) ? parsed : [])
  }

  const saveProducts = (updated) => {
    localStorage.setItem('products', JSON.stringify(updated))
    setProducts(updated)
  }

  // ACTIVE PRODUCTS ONLY
  const activeProducts = products
    .map((item, index) => ({ ...item, realIndex: index }))
    .filter((item) => item.status === "active")

  // SELECTED PRODUCT
  const selectedProduct =
    selectedIndex !== ''
      ? activeProducts[selectedIndex]
      : null

  // SELL PRODUCT
  const sellProduct = () => {
    if (selectedProduct === null) {
      alert("Select product first")
      return
    }

    const qtyToSell = Number(sellQty)

    if (qtyToSell <= 0) {
      alert("Invalid quantity")
      return
    }

    const realIndex = selectedProduct.realIndex
    const updated = [...products]
    const item = updated[realIndex]

    if (qtyToSell > Number(item.qty)) {
      alert("Not enough stock")
      return
    }

    const ok = window.confirm(
      `Sell ${qtyToSell} ${item.name}?`
    )

    if (!ok) return

    // 🔥 STEP 1: CREATE SALE RECORD (NEW)
    const saleRecord = {
      id: Date.now(),
      productId: realIndex,
      productName: item.name,
      quantity: qtyToSell,
      unitPrice: Number(item.price),
      totalPrice: Number(item.price) * qtyToSell,
      date: new Date().toISOString()
    }

    // 🔥 STEP 2: SAVE TO SALES SYSTEM
    addSale(saleRecord)

    const history = Array.isArray(item.history)
      ? item.history
      : []

    updated[realIndex] = {
      ...item,
      qty: Number(item.qty) - qtyToSell,
      history: [
        ...history,
        {
          action: "sold",
          time: new Date().toLocaleString(),
          note: `Sold ${qtyToSell}`
        }
      ]
    }

    saveProducts(updated)

    setLastSale({
      realIndex,
      name: item.name,
      qty: qtyToSell
    })

    setSellQty(1)
  }

  // UNDO SALE
  const undoSale = () => {
    if (!lastSale) return

    const updated = [...products]
    const item = updated[lastSale.realIndex]

    const history = Array.isArray(item.history)
      ? item.history
      : []

    updated[lastSale.realIndex] = {
      ...item,
      qty: Number(item.qty) + Number(lastSale.qty),
      history: [
        ...history,
        {
          action: "undo sale",
          time: new Date().toLocaleString(),
          note: `Restored ${lastSale.qty}`
        }
      ]
    }

    saveProducts(updated)
    setLastSale(null)
  }

  // COUNTS
  const totalProducts = products.length
  const removedProducts = products.filter(
    (item) => item.status === "removed"
  ).length

  const lowStockProducts = products.filter(
    (item) =>
      item.status === "active" &&
      Number(item.qty) <= 5
  ).length

  return (
    <main style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      {/* TOP ANALYTICS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginTop: "20px"
        }}
      >
        <div style={{
          padding: "20px",
          background: "#f2f2f2",
          borderRadius: "10px"
        }}>
          <h3>Total Products</h3>
          <p style={{ fontSize: "28px", fontWeight: "bold" }}>
            {totalProducts}
          </p>
        </div>

        <div style={{
          padding: "20px",
          background: "#e8ffe8",
          borderRadius: "10px"
        }}>
          <h3>Active Products</h3>
          <p style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "green"
          }}>
            {activeProducts.length}
          </p>
        </div>

        <div style={{
          padding: "20px",
          background: "#ffe8e8",
          borderRadius: "10px"
        }}>
          <h3>Removed Products</h3>
          <p style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "red"
          }}>
            {removedProducts}
          </p>
        </div>

        <div style={{
          padding: "20px",
          background: "#fff5cc",
          borderRadius: "10px"
        }}>
          <h3>Low Stock</h3>
          <p style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#b8860b"
          }}>
            {lowStockProducts}
          </p>
        </div>
      </div>

      {/* SELL CENTER */}
      <div
        style={{
          marginTop: "40px",
          padding: "25px",
          background: "#f9f9f9",
          borderRadius: "12px"
        }}
      >
        <h2>Sell Products</h2>

        <select
          value={selectedIndex}
          onChange={(e) =>
            setSelectedIndex(e.target.value)
          }
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px"
          }}
        >
          <option value="">
            Select Product
          </option>

          {activeProducts.map((item, index) => (
            <option key={index} value={index}>
              {item.name}
            </option>
          ))}
        </select>

        {selectedProduct && (
          <div style={{ marginTop: "20px" }}>
            <p>Price: {selectedProduct.price}</p>

            <p style={{
              color:
                Number(selectedProduct.qty) <= 5
                  ? "red"
                  : "green",
              fontWeight: "bold"
            }}>
              Stock: {selectedProduct.qty}
            </p>

            <div style={{ marginTop: "15px" }}>
              <button
                onClick={() =>
                  setSellQty(Math.max(1, sellQty - 1))
                }
              >
                -
              </button>

              <input
                type="number"
                min="1"
                value={sellQty}
                onChange={(e) =>
                  setSellQty(Number(e.target.value))
                }
                style={{
                  width: "60px",
                  textAlign: "center",
                  margin: "0 10px"
                }}
              />

              <button
                onClick={() =>
                  setSellQty(sellQty + 1)
                }
              >
                +
              </button>
            </div>

            <button
              onClick={sellProduct}
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "10px"
              }}
            >
              Sell Now
            </button>
          </div>
        )}

        {lastSale && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#e6f7ff",
              borderRadius: "10px"
            }}
          >
            Sold {lastSale.qty} {lastSale.name}

            <button
              onClick={undoSale}
              style={{ marginLeft: "15px" }}
            >
              Undo Sale
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

export default Dashboard