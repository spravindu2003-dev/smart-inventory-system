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

      history.forEach((item) => {
        allLogs.push({
          product: product.name,
          action: item.action,
          time: item.time,
          note: item.note
        })
      })
    })

    allLogs.reverse()
    setLogs(allLogs)
  }

  const getColor = (action) => {
    if (action === "removed") return "red"
    if (action === "restored") return "green"
    if (action === "sold") return "blue"
    if (action === "undo sale") return "orange"
    return "gray"
  }

  const filteredLogs = logs.filter((item) => {
    if (filter === "all") return true
    return item.action === filter
  })

  return (
    <main style={{ padding: "20px" }}>
      <h2>Activity Log</h2>

      {/* FILTERS */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setFilter("all")}>All</button>

        <button
          onClick={() => setFilter("created")}
          style={{ marginLeft: "10px" }}
        >
          Created
        </button>

        <button
          onClick={() => setFilter("removed")}
          style={{ marginLeft: "10px" }}
        >
          Removed
        </button>

        <button
          onClick={() => setFilter("restored")}
          style={{ marginLeft: "10px" }}
        >
          Restored
        </button>

        <button
          onClick={() => setFilter("sold")}
          style={{ marginLeft: "10px" }}
        >
          Sold
        </button>

        <button
          onClick={() => setFilter("undo sale")}
          style={{ marginLeft: "10px" }}
        >
          Undo Sale
        </button>
      </div>

      {/* TABLE */}
      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%" }}
      >
        <thead>
          <tr>
            <th>Time</th>
            <th>Product</th>
            <th>Action</th>
            <th>Note</th>
          </tr>
        </thead>

        <tbody>
          {filteredLogs.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                style={{ textAlign: "center" }}
              >
                No logs found
              </td>
            </tr>
          ) : (
            filteredLogs.map((item, index) => (
              <tr key={index}>
                <td>{item.time}</td>
                <td>{item.product}</td>

                <td
                  style={{
                    color: getColor(item.action),
                    fontWeight: "bold",
                    textTransform: "capitalize"
                  }}
                >
                  {item.action}
                </td>

                <td>
                  {item.note || "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  )
}

export default ActivityLog

