import { useEffect, useState } from "react"
import "../styles/Sales.css"

import { ProductService } from "../services/productService"
import { SalesService } from "../services/salesService"

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
    setSales(SalesService.getAllSales())
    setProducts(ProductService.getAllProducts())
  }

  const saveProducts = (data) => {
    ProductService.saveProducts(data)
    setProducts(data)
  }

  const updateProductHistory = (productName, action, note = "") => {
    const products = ProductService.getAllProducts()

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

    ProductService.saveProducts(updated)
    setProducts(updated)
  }

  const activeProducts = products.filter(p => p.status === "active")

  const filteredProducts = activeProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const isLowStock = (p) =>
    p.status === "active" &&
    Number(p.qty) <= Number(p.minQty || 5)

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

    SalesService.addSale(sale)

    const updated = [...products]
    const index = updated.findIndex(p => p.name === selected.name)

    if (index !== -1) {
      updated[index].qty -= qty
      saveProducts(updated)

      updateProductHistory(
        selected.name,
        "sold",
        `Sold ${qty} units`
      )

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

  const undoSale = (id) => {
    const sale = sales.find(s => s.id === id)
    if (!sale) return

    if (!window.confirm("Undo this sale?")) return

    const products = ProductService.getAllProducts()

    const updatedProducts = products.map(p => {
      if (p.name === sale.productName) {
        return {
          ...p,
          qty: p.qty + sale.quantity
        }
      }
      return p
    })

    ProductService.saveProducts(updatedProducts)

    updateProductHistory(
      sale.productName,
      "undo sale",
      `Restored ${sale.quantity} units`
    )

    const updatedSales = sales.filter(s => s.id !== id)
    SalesService.saveSales(updatedSales)

    loadData()
  }

  const totalRevenue = sales.reduce(
    (sum, s) => sum + Number(s.totalPrice || 0),
    0
  )

  return (
    <div className="sales-container">

      <div className="sales-header">
        <h1>Sales Dashboard</h1>
        <p>Total Revenue: Rs {totalRevenue}</p>
      </div>

      <div className="sales-grid-modern">

        <div className="sales-panel">
          <h3>Products</h3>

          <input
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="sales-product-list">
            {filteredProducts.map((p) => (
              <div
                key={p.name}
                className={`product-card ${selected?.name === p.name ? "active" : ""}`}
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

        <div className="sales-panel">
          <h3>Quick Sell</h3>

          {selected ? (
            <>
              <p>{selected.name}</p>

              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
              />

              <button onClick={sellProduct}>
                Sell
              </button>
            </>
          ) : (
            <p>Select product</p>
          )}
        </div>

      </div>

      <div>
        <h3>Sales History</h3>

        {sales.map(s => (
          <div key={s.id}>
            {s.productName} - {s.quantity}
            <button onClick={() => undoSale(s.id)}>
              Undo
            </button>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Sales