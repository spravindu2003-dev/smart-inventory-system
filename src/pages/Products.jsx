import { useState, useEffect } from 'react'

function Products() {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [qty, setQty] = useState('')
  const [note, setNote] = useState('')

  // SEARCH + FILTER
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState("all")

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

  // EDIT PRODUCT
  const editProduct = (index) => {
    const updated = [...products]
    const item = updated[index]

    if (!item) return

    const newName = prompt("Edit product name:", item.name)
    if (newName === null) return

    const newPrice = prompt("Edit product price:", item.price)
    if (newPrice === null) return

    const newQty = prompt("Edit product quantity:", item.qty)
    if (newQty === null) return

    const newNote = prompt("Edit note:", item.note || "")
    if (newNote === null) return

    const changes = []

    if (item.name !== newName) {
      changes.push(`Name: ${item.name} -> ${newName}`)
    }

    if (item.price !== newPrice) {
      changes.push(`Price: ${item.price} -> ${newPrice}`)
    }

    if (item.qty !== newQty) {
      changes.push(`Qty: ${item.qty} -> ${newQty}`)
    }

    if ((item.note || "") !== newNote) {
      changes.push(`Note updated`)
    }

    updated[index] = {
      ...item,
      name: newName,
      price: newPrice,
      qty: newQty,
      note: newNote,
      history: [
        ...item.history,
        {
          action: "edited",
          time: new Date().toLocaleString(),
          note: changes.join(" | ") || "No changes"
        }
      ]
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

        <button
          onClick={addProduct}
          style={{ marginLeft: "10px" }}
        >
          Add
        </button>
      </div>

      {/* SEARCH */}
      <div style={{ marginBottom: "10px" }}>
        <input
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* FILTER */}
      <div style={{ marginBottom: "15px" }}>
        <button onClick={() => setFilter("all")}>All</button>

        <button
          onClick={() => setFilter("active")}
          style={{ marginLeft: "10px" }}
        >
          Active
        </button>

        <button
          onClick={() => setFilter("removed")}
          style={{ marginLeft: "10px" }}
        >
          Removed
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
            <th>Edit</th>
          </tr>
        </thead>

        <tbody>
          {products
            .filter((item) => {
              const matchStatus =
                filter === "all"
                  ? true
                  : item.status === filter

              const matchSearch =
                item.name
                  .toLowerCase()
                  .includes(search.toLowerCase())

              return matchStatus && matchSearch
            })
            .map((item, index) => {
              const history =
                Array.isArray(item.history)
                  ? item.history
                  : []

              const created =
                history.find(
                  (h) => h.action === "created"
                ) || history[0]

              const fullHistory = history
                .map(
                  (h) =>
                    `${h.action.toUpperCase()}: ${h.time}${
                      h.note ? " - " + h.note : ""
                    }`
                )
                .join("\n")

              return (
                <tr
                  key={index}
                  style={{
                    opacity:
                      item.status === "removed"
                        ? 0.5
                        : 1,
                    textDecoration:
                      item.status === "removed"
                        ? "line-through"
                        : "none"
                  }}
                >
                  <td
                    title={
                      created
                        ? `Created: ${created.time}\nNote: ${created.note || "None"}`
                        : ""
                    }
                  >
                    {item.name}
                  </td>

                  <td>{item.price}</td>

                  <td>{item.qty}</td>

                  <td
                    title={fullHistory}
                    style={{
                      color:
                        item.status === "active"
                          ? "green"
                          : "red",
                      fontWeight: "bold"
                    }}
                  >
                    {item.status === "active"
                      ? "Active"
                      : "Removed"}
                  </td>

                  <td title={fullHistory}>
                    <button
                      onClick={() =>
                        toggleStatus(index)
                      }
                    >
                      {item.status === "active"
                        ? "Remove"
                        : "Restore"}
                    </button>
                  </td>

                  <td title={fullHistory}>
                    <button
                      onClick={() =>
                        editProduct(index)
                      }
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </main>
  )
}

export default Products