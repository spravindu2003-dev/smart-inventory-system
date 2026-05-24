import { useEffect, useState } from 'react'
import '../styles/Products.css'

import {
  ProductService
} from '../services/productService'

function Products() {

  const [products, setProducts] =
    useState([])

  // FORM STATES
  const [name, setName] =
    useState("")

  const [price, setPrice] =
    useState("")

  const [qty, setQty] =
    useState("")

  const [note, setNote] =
    useState("")

  const [minQty, setMinQty] =
    useState(5)

  // FILTER STATES
  const [search, setSearch] =
    useState("")

  const [filter, setFilter] =
    useState("all")

  // LOAD PRODUCTS
  useEffect(() => {

    const savedProducts =
      ProductService.getAllProducts()

    setProducts(savedProducts)

  }, [])

  // SAVE PRODUCTS
  const saveProducts = (data) => {

    ProductService.saveProducts(data)

    setProducts(data)
  }

  // ADD PRODUCT
  const addProduct = () => {

    if (!name || !price || !qty) {
      alert("Please fill all fields")
      return
    }

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
          time:
            new Date().toLocaleString(),
          note: note || ""
        }
      ]
    }

    const updatedProducts = [
      ...products,
      newProduct
    ]

    saveProducts(updatedProducts)

    // RESET FORM
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

    const newName =
      prompt("Name:", item.name)

    if (newName === null) return

    const newPrice =
      prompt("Price:", item.price)

    if (newPrice === null) return

    const newQty =
      prompt("Qty:", item.qty)

    if (newQty === null) return

    const newNote =
      prompt(
        "Note:",
        item.note || ""
      )

    if (newNote === null) return

    const history =
      item.history || []

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
          time:
            new Date().toLocaleString(),
          note: "Product edited"
        }
      ]
    }

    saveProducts(updated)
  }

  // REMOVE / RESTORE
  const toggleStatus = (index) => {

    const updated = [...products]

    const item = updated[index]

    const reason = prompt(

      item.status === "active"
        ? "Why remove?"
        : "Why restore?"

    )

    const history =
      item.history || []

    updated[index] = {

      ...item,

      status:
        item.status === "active"
          ? "removed"
          : "active",

      history: [
        ...history,
        {
          action:
            item.status === "active"
              ? "removed"
              : "restored",

          time:
            new Date().toLocaleString(),

          note: reason || ""
        }
      ]
    }

    saveProducts(updated)
  }

  // FILTER PRODUCTS
  const filteredProducts =
    products.filter((p) => {

      const matchSearch =
        p.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

      const matchFilter =

        filter === "all"
          ? true
          : p.status === filter

      return (
        matchSearch &&
        matchFilter
      )
    })

  return (

    <main className="products-page">

      <h2 className="products-title">
        Products
      </h2>

      {/* ADD FORM */}
      <div className="products-form">

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Quantity"
          value={qty}
          onChange={(e) =>
            setQty(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Minimum Qty"
          value={minQty}
          onChange={(e) =>
            setMinQty(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Note"
          value={note}
          onChange={(e) =>
            setNote(e.target.value)
          }
        />

        <button
          className="products-add-btn"
          onClick={addProduct}
        >
          Add Product
        </button>

      </div>

      {/* FILTERS */}
      <div className="products-controls">

        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <button
          onClick={() =>
            setFilter("all")
          }
        >
          All
        </button>

        <button
          onClick={() =>
            setFilter("active")
          }
        >
          Active
        </button>

        <button
          onClick={() =>
            setFilter("removed")
          }
        >
          Removed
        </button>

      </div>

      {/* PRODUCT LIST */}
      <div className="products-list">

        {filteredProducts.map(
          (p, i) => {

            const lowStock =

              p.status === "active" &&

              Number(p.qty)
                <=
              Number(
                p.minQty || 5
              )

            return (

              <div
                key={i}
                className="products-card"
              >

                {/* INFO */}
                <div>

                  <h3>{p.name}</h3>

                  <small>
                    Rs {p.price}
                  </small>

                  <div className="products-note">

                    {p.note || "No note"}

                  </div>

                </div>

                {/* STOCK */}
                <div className="products-stock">

                  <div className="products-qty">
                    {p.qty}
                  </div>

                  <div className="products-min">

                    Min: {p.minQty}

                  </div>

                  {lowStock && (

                    <div className="products-low-stock">

                      ⚠ LOW

                    </div>

                  )}

                </div>

                {/* STATUS */}
                <div
                  className={
                    p.status === "active"
                      ? "products-status-active"
                      : "products-status-removed"
                  }
                >
                  {p.status}
                </div>

                {/* ACTIONS */}
                <div className="products-actions">

                  <button
                    onClick={() =>
                      editProduct(i)
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      toggleStatus(i)
                    }
                  >
                    {p.status === "active"
                      ? "Remove"
                      : "Restore"}
                  </button>

                </div>

              </div>
            )
          }
        )}

      </div>

    </main>
  )
}

export default Products