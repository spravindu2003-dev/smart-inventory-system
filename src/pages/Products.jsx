import { useEffect, useState } from 'react'
import '../styles/Products.css'

function Products() {
  const [products, setProducts] = useState([])

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [qty, setQty] = useState("")
  const [note, setNote] = useState("")
  const [minQty, setMinQty] = useState(5)

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  // LOAD
  useEffect(() => {
    const saved = localStorage.getItem("products")
    setProducts(saved ? JSON.parse(saved) : [])
  }, [])

  // SAVE
  const save = (data) => {
    localStorage.setItem("products", JSON.stringify(data))
    setProducts(data)
  }

  // ADD
  const addProduct = () => {
    if (!name || !price || !qty) return

    const newProduct = {
      name,
      price: Number(price),
      qty: Number(qty),
      minQty: Number(minQty),
      note: note || "",
      status: "active",
      history: [
        {
          action: "created",
          time: new Date().toLocaleString(),
          note: note || ""
        }
      ]
    }

    save([...products, newProduct])

    setName("")
    setPrice("")
    setQty("")
    setNote("")
    setMinQty(5)
  }

  // EDIT
  const editProduct = (index) => {
    const updated = [...products]
    const item = updated[index]

    const newName = prompt("Name:", item.name)
    if (newName === null) return

    const newPrice = prompt("Price:", item.price)
    if (newPrice === null) return

    const newQty = prompt("Qty:", item.qty)
    if (newQty === null) return

    const newNote = prompt("Note:", item.note || "")
    if (newNote === null) return

    updated[index] = {
      ...item,
      name: newName,
      price: Number(newPrice),
      qty: Number(newQty),
      note: newNote,
      history: [
        ...(item.history || []),
        {
          action: "edited",
          time: new Date().toLocaleString(),
          note: "Product edited"
        }
      ]
    }

    save(updated)
  }

  // TOGGLE
  const toggleStatus = (index) => {
    const updated = [...products]
    const item = updated[index]

    const reason = prompt(
      item.status === "active"
        ? "Why remove?"
        : "Why restore?"
    )

    updated[index] = {
      ...item,
      status: item.status === "active"
        ? "removed"
        : "active",
      history: [
        ...(item.history || []),
        {
          action: item.status === "active"
            ? "removed"
            : "restored",
          time: new Date().toLocaleString(),
          note: reason || ""
        }
      ]
    }

    save(updated)
  }

  // FILTER
  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase())

    const matchFilter =
      filter === "all" ? true : p.status === filter

    return matchSearch && matchFilter
  })

  return (
    <main className="products-page">

      <h2 className="products-title">
        Products
      </h2>

      {/* FORM */}
      <div className="products-form">

        <input placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input placeholder="Qty"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />

        <input placeholder="Min Qty"
          value={minQty}
          onChange={(e) => setMinQty(e.target.value)}
        />

        <input placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button
          className="products-add-btn"
          onClick={addProduct}
        >
          Add
        </button>

      </div>

      {/* CONTROLS */}
      <div className="products-controls">

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={() => setFilter("all")}>
          All
        </button>

        <button onClick={() => setFilter("active")}>
          Active
        </button>

        <button onClick={() => setFilter("removed")}>
          Removed
        </button>

      </div>

      {/* LIST */}
      <div className="products-list">

        {filtered.map((p, i) => {

          const lowStock =
            p.status === "active" &&
            Number(p.qty) <= Number(p.minQty || 5)

          return (
            <div
              key={i}
              className="products-card"
            >

              {/* LEFT */}
              <div className="products-left">

                <h3>{p.name}</h3>

                <small>Rs {p.price}</small>

                <div className="products-note">
                  {p.note || "No note"}
                </div>

              </div>

              {/* STOCK */}
              <div className="products-stock">

                <div className="products-stock-value">
                  {p.qty}
                </div>

                <div className="products-min">
                  Min: {p.minQty}
                </div>

                {lowStock && (
                  <div className="products-low">
                    ⚠ LOW
                  </div>
                )}

              </div>

              {/* STATUS */}
              <div
                className={`products-status ${
                  p.status === "removed"
                    ? "removed"
                    : ""
                }`}
              >
                {p.status}
              </div>

              {/* ACTIONS */}
              <div className="products-actions">

                <button
                  onClick={() => editProduct(i)}
                >
                  Edit
                </button>

                <button
                  onClick={() => toggleStatus(i)}
                >
                  {p.status === "active"
                    ? "Remove"
                    : "Restore"}
                </button>

              </div>

            </div>
          )
        })}

      </div>

    </main>
  )
}

export default Products