import { useEffect, useState } from 'react'

function ActivityLog() {
  const [logs, setLogs] = useState([])
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = () => {
    const saved = localStorage.getItem('products')
    const parsed = saved ? JSON.parse(saved) : []

    let allLogs = []

    parsed.forEach((product) => {
      const history = Array.isArray(product.history)
        ? product.history
        : []

      // NORMAL HISTORY LOGS
      history.forEach((item) => {
        allLogs.push({
          product: product.name,
          action: item.action,
          time: item.time,
          note: item.note
        })
      })

      // 🟡 LOW STOCK LOG (SMART FEATURE)
      if (
        product.status === "active" &&
        Number(product.qty) <= Number(product.minQty || 5)
      ) {
        allLogs.push({
          product: product.name,
          action: "low stock",
          time: new Date().toLocaleString(),
          note: `Stock low (${product.qty}/${product.minQty || 5})`
        })
      }
    })

    // latest first
    allLogs.reverse()
    setLogs(allLogs)
  }

  const getColor = (action) => {
    if (action === "created") return "#888"
    if (action === "edited") return "#a855f7"
    if (action === "removed") return "#ef4444"
    if (action === "restored") return "#22c55e"
    if (action === "sold") return "#3b82f6"
    if (action === "undo sale") return "#f97316"
    if (action === "low stock") return "#ff4d4f"

    return "#000"
  }

  const filteredLogs = logs.filter((item) => {
    if (filter === "all") return true
    return item.action === filter
  })

  return (
    <main style={{
      padding: "20px",
      background: "#0f172a",
      minHeight: "100vh",
      color: "white"
    }}>
      <h2>Activity Log</h2>

      {/* FILTERS */}
      <div style={{ marginBottom: "20px" }}>
        {[
          "all",
          "created",
          "edited",
          "removed",
          "restored",
          "sold",
          "undo sale",
          "low stock"
        ].map((type, i) => (
          <button
            key={i}
            onClick={() => setFilter(type)}
            style={{
              marginRight: "8px",
              padding: "6px 10px",
              background: "#1e293b",
              color: "white",
              border: "1px solid #334155",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div style={{
        background: "#1e293b",
        borderRadius: "10px",
        padding: "10px"
      }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse"
        }}>
          <thead>
            <tr style={{ color: "#94a3b8", textAlign: "left" }}>
              <th>Time</th>
              <th>Product</th>
              <th>Action</th>
              <th>Note</th>
            </tr>
          </thead>

          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "#94a3b8" }}>
                  No logs found
                </td>
              </tr>
            ) : (
              filteredLogs.map((item, index) => (
                <tr key={index} style={{ borderTop: "1px solid #334155" }}>
                  <td style={{ padding: "8px" }}>{item.time}</td>

                  <td style={{ padding: "8px" }}>{item.product}</td>

                  <td
                    style={{
                      padding: "8px",
                      color: getColor(item.action),
                      fontWeight: "bold",
                      textTransform: "capitalize"
                    }}
                  >
                    {item.action}
                  </td>

                  <td style={{ padding: "8px", color: "#cbd5e1" }}>
                    {item.note || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default ActivityLog