import { useEffect, useState } from 'react'

function Products() {
  const [products, setProducts] = useState([])

  // inputs
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [qty, setQty] = useState("")
  const [note, setNote] = useState("")
  const [minQty, setMinQty] = useState(5)

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  // SAFE LOAD
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = () => {
    try {
      const saved = localStorage.getItem("products")
      const parsed = saved ? JSON.parse(saved) : []
      setProducts(Array.isArray(parsed) ? parsed : [])
    } catch {
      setProducts([])
    }
  }

  // SAFE SAVE
  const saveProducts = (data) => {
    localStorage.setItem("products", JSON.stringify(data))
    setProducts(data)
  }

  // ADD PRODUCT
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

    saveProducts([...products, newProduct])

    setName("")
    setPrice("")
    setQty("")
    setNote("")
    setMinQty(5)
  }

  // EDIT PRODUCT
  const editProduct = (index) => {
    const updated = [...products]
    const item = updated[index]

    const newName = prompt("Edit Name:", item.name)
    if (newName === null) return

    const newPrice = prompt("Edit Price:", item.price)
    if (newPrice === null) return

    const newQty = prompt("Edit Qty:", item.qty)
    if (newQty === null) return

    const newNote = prompt("Edit Note:", item.note || "")
    if (newNote === null) return

    const history = item.history || []

    updated[index] = {
      ...item,
      name: newName,
      price: Number(newPrice),
      qty: Number(newQty),
      note: newNote,
      history: [
        ...history,
        {
          action: "edited",
          time: new Date().toLocaleString(),
          note: "Product updated"
        }
      ]
    }

    saveProducts(updated)
  }

  // REMOVE / RESTORE (WITH REASON)
  const toggleStatus = (index) => {
    const updated = [...products]
    const item = updated[index]

    const reason = prompt(
      item.status === "active"
        ? "Why remove this product?"
        : "Why restore this product?"
    )

    const history = item.history || []

    updated[index] = {
      ...item,
      status: item.status === "active" ? "removed" : "active",
      history: [
        ...history,
        {
          action: item.status === "active" ? "removed" : "restored",
          time: new Date().toLocaleString(),
          note: reason || ""
        }
      ]
    }

    saveProducts(updated)
  }

  // FILTER LOGIC
  const filtered = products.filter((p) => {
    const matchSearch = p.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchFilter =
      filter === "all" ? true : p.status === filter

    return matchSearch && matchFilter
  })

  return (
    <main style={styles.page}>
      <h2>Products</h2>

      {/* ADD PRODUCT */}
      <div style={styles.form}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input placeholder="Qty" value={qty} onChange={(e) => setQty(e.target.value)} />
        <input placeholder="Min Qty" value={minQty} onChange={(e) => setMinQty(e.target.value)} />
        <input placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />

        <button onClick={addProduct}>Add</button>
      </div>

      {/* SEARCH + FILTER */}
      <div style={styles.controls}>
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("active")}>Active</button>
        <button onClick={() => setFilter("removed")}>Removed</button>
      </div>

      {/* PRODUCT LIST */}
      <div style={styles.list}>
        {filtered.map((p, i) => {
          const lowStock =
            p.status === "active" &&
            Number(p.qty) <= Number(p.minQty || 5)

          return (
            <div key={i} style={styles.card}>

              {/* NAME (HOVER INFO RESTORED) */}
              <div
                title={`Time: ${p.history?.[0]?.time || "-"}\nNote: ${p.note || "No note"}`}
              >
                <h3 style={{ margin: 0 }}>{p.name}</h3>
                <small>Rs {p.price}</small>
              </div>

              {/* STOCK */}
              <div>
                <p style={{ margin: 0, color: lowStock ? "red" : "lightgreen" }}>
                  Stock: {p.qty}
                </p>
                <small>Min: {p.minQty}</small>

                {lowStock && (
                  <div style={{ color: "orange" }}>⚠ LOW STOCK</div>
                )}
              </div>

              {/* STATUS */}
              <div>
                <span
                  title={
                    p.history
                      ?.filter(h => h.action === "removed" || h.action === "restored")
                      ?.map(h => `${h.time} - ${h.note}`)
                      .join("\n") || ""
                  }
                  style={{
                    padding: "3px 8px",
                    borderRadius: "6px",
                    background: p.status === "active" ? "#14532d" : "#450a0a",
                    fontSize: "12px"
                  }}
                >
                  {p.status.toUpperCase()}
                </span>
              </div>

              {/* ACTIONS */}
              <div style={{ display: "flex", gap: "5px" }}>
                <button onClick={() => editProduct(i)}>Edit</button>
                <button onClick={() => toggleStatus(i)}>
                  {p.status === "active" ? "Remove" : "Restore"}
                </button>
              </div>

            </div>
          )
        })}
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

  form: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "10px"
  },

  controls: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px"
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  card: {
    background: "#1e293b",
    padding: "12px",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }
}

export default Products