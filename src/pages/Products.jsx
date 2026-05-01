import { useState, useEffect } from 'react'

function Products() {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [qty, setQty] = useState('')
  const [note, setNote] = useState('')

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('products')
      const parsed = saved ? JSON.parse(saved) : []
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products))
  }, [products])

  // ADD PRODUCT
  const addProduct = () => {
    if (!name || !price || !qty) return

    const newProduct = {
      name,
      price,
      qty,
      note,
      status: "active",
      history: [
        {
          action: "created",
          time: new Date().toLocaleString(),
          note: note || ""
        }
      ]
    }

    setProducts([...products, newProduct])

    setName('')
    setPrice('')
    setQty('')
    setNote('')
  }

  // REMOVE / RESTORE
  const toggleStatus = (index) => {
    const updated = [...products]
    const item = updated[index]

    if (!item) return

    const history = Array.isArray(item.history) ? item.history : []

    if (item.status === "active") {
      const reason = prompt("Why remove this item? (optional)")

      updated[index] = {
        ...item,
        status: "removed",
        history: [
          ...history,
          {
            action: "removed",
            time: new Date().toLocaleString(),
            note: reason || ""
          }
        ]
      }
    } else {
      const reason = prompt("Why restore this item? (optional)")

      updated[index] = {
        ...item,
        status: "active",
        history: [
          ...history,
          {
            action: "restored",
            time: new Date().toLocaleString(),
            note: reason || ""
          }
        ]
      }
    }

    setProducts(updated)
  }

  return (
    <main style={{ padding: "20px" }}>
      <h2>Products</h2>

      {/* INPUTS */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ marginLeft: "10px" }}
        />

        <input
          placeholder="Quantity"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          style={{ marginLeft: "10px" }}
        />

        <input
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ marginLeft: "10px" }}
        />

        <button onClick={addProduct} style={{ marginLeft: "10px" }}>
          Add
        </button>
      </div>

      {/* TABLE */}
      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No products yet
              </td>
            </tr>
          ) : (
            products.map((item, index) => {

              const history = Array.isArray(item.history) ? item.history : []

              const created = history.find(h => h.action === "created") || history[0]

              const fullHistory = history
                .map(h => `${h.action.toUpperCase()}: ${h.time}${h.note ? " - " + h.note : ""}`)
                .join("\n")

              return (
                <tr
                  key={index}
                  style={{
                    opacity: item.status === "removed" ? 0.5 : 1,
                    textDecoration: item.status === "removed" ? "line-through" : "none"
                  }}
                >

                  {/* SAFE CREATED DATA */}
                  <td title={created ? `Created: ${created.time}\nNote: ${created.note || "None"}` : ""}>
                    {item.name}
                  </td>

                  <td title={created ? `Created: ${created.time}\nNote: ${created.note || "None"}` : ""}>
                    {item.price}
                  </td>

                  <td title={created ? `Created: ${created.time}\nNote: ${created.note || "None"}` : ""}>
                    {item.qty}
                  </td>

                  {/* STATUS */}
                  <td
                    title={fullHistory}
                    style={{
                      color: item.status === "active" ? "green" : "red",
                      fontWeight: "bold"
                    }}
                  >
                    {item.status === "active" ? "Active" : "Removed"}
                  </td>

                  {/* ACTION */}
                  <td title={fullHistory}>
                    <button onClick={() => toggleStatus(index)}>
                      {item.status === "active" ? "Remove" : "Restore"}
                    </button>
                  </td>

                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </main>
  )
}

export default Products