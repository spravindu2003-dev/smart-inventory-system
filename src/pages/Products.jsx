import { useState, useEffect } from 'react'

function Products() {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [qty, setQty] = useState('')
  const [note, setNote] = useState('')

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products))
  }, [products])

  const addProduct = () => {
    if (!name || !price || !qty) return

    const newProduct = {
      name,
      price,
      qty,
      note: note || "",
      addedAt: new Date().toLocaleString()
    }

    setProducts([...products, newProduct])

    setName('')
    setPrice('')
    setQty('')
    setNote('')
  }

  return (
    <main style={{ padding: "20px" }}>
      <h2>Products</h2>

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
          Add Product
        </button>
      </div>

      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>

        <tbody>
          {products.map((item, index) => (
            <tr
              key={index}
              title={`Added: ${item.addedAt}${item.note ? `\nNote: ${item.note}` : '\nNote: None'}`}
            >
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

export default Products