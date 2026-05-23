import { useEffect, useState } from 'react'
import '../styles/Dashboard.css'

function Dashboard() {
  const [products, setProducts] = useState([])
  const [sales, setSales] = useState([])

  // LOAD DATA
  useEffect(() => {
    loadDashboardData()
  }, [])

  // TEMPORARY STORAGE (Future backend-ready)
  const loadDashboardData = () => {
    try {
      const savedProducts =
        localStorage.getItem('products')

      const parsedProducts = savedProducts
        ? JSON.parse(savedProducts)
        : []

      setProducts(
        Array.isArray(parsedProducts)
          ? parsedProducts
          : []
      )

      const savedSales =
        localStorage.getItem('sales')

      const parsedSales = savedSales
        ? JSON.parse(savedSales)
        : []

      setSales(
        Array.isArray(parsedSales)
          ? parsedSales
          : []
      )
    } catch (error) {
      console.log('Dashboard load error:', error)

      setProducts([])
      setSales([])
    }
  }

  // ACTIVE PRODUCTS
  const activeProducts = products.filter(
    (item) => item.status === 'active'
  )

  // REMOVED PRODUCTS
  const removedProducts = products.filter(
    (item) => item.status === 'removed'
  ).length

  // LOW STOCK PRODUCTS
  const lowStockProducts = products.filter(
    (item) =>
      item.status === 'active' &&
      Number(item.qty) <= Number(item.minQty || 5)
  )

  // TOTAL REVENUE
  const totalRevenue = sales.reduce(
    (sum, sale) =>
      sum + Number(sale.totalPrice || 0),
    0
  )

  return (
    <main className="dashboard-page">

      <h2>Dashboard</h2>

      {/* DASHBOARD CARDS */}
      <div className="dashboard-grid">

        {/* TOTAL PRODUCTS */}
        <div className="dashboard-card">
          <h3>Total Products</h3>

          <p className="dashboard-number">
            {products.length}
          </p>
        </div>

        {/* ACTIVE PRODUCTS */}
        <div className="dashboard-card">
          <h3>Active Products</h3>

          <p
            className="dashboard-number"
            style={{ color: '#22c55e' }}
          >
            {activeProducts.length}
          </p>
        </div>

        {/* REMOVED PRODUCTS */}
        <div className="dashboard-card">
          <h3>Removed Products</h3>

          <p
            className="dashboard-number"
            style={{ color: '#ef4444' }}
          >
            {removedProducts}
          </p>
        </div>

        {/* LOW STOCK */}
        <div className="dashboard-card">
          <h3>Low Stock Alerts</h3>

          <p
            className="dashboard-number"
            style={{ color: '#f97316' }}
          >
            {lowStockProducts.length}
          </p>
        </div>

        {/* REVENUE */}
        <div className="dashboard-card">
          <h3>Total Revenue</h3>

          <p
            className="dashboard-number"
            style={{ color: '#38bdf8' }}
          >
            Rs. {totalRevenue}
          </p>
        </div>

      </div>

      {/* LOW STOCK SECTION */}
      <div className="low-stock-section">

        <h3>Low Stock Items</h3>

        {lowStockProducts.length === 0 ? (
          <div className="alert-box">
            No low stock items
          </div>
        ) : (
          lowStockProducts.map((product, index) => (
            <div
              key={index}
              className="alert-box"
            >
              ⚠ {product.name}
              {' '}→ Stock: {product.qty}
              {' '} / Min: {product.minQty || 5}
            </div>
          ))
        )}

      </div>

    </main>
  )
}

export default Dashboard