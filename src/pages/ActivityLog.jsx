import { useEffect, useState } from 'react'
import "../styles/ActivityLog.css"

function ActivityLog() {

  const [logs, setLogs] = useState([])
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = () => {

    const saved =
      localStorage.getItem("products")

    const parsed =
      saved ? JSON.parse(saved) : []

    let allLogs = []

    parsed.forEach((product) => {

      const history =
        Array.isArray(product.history)
          ? product.history
          : []

      history.forEach((item) => {

        // REMOVE DUPLICATE LOW STOCK LOGS
        if (
          item.action === "low stock"
        ) {

          const alreadyExists =
            allLogs.some(
              (log) =>
                log.product === product.name &&
                log.action === "low stock" &&
                log.note === item.note
            )

          if (alreadyExists) {
            return
          }
        }

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

    if (action === "created")
      return "#888"

    if (action === "edited")
      return "#a855f7"

    if (action === "removed")
      return "#ef4444"

    if (action === "restored")
      return "#22c55e"

    if (action === "sold")
      return "#3b82f6"

    if (action === "undo sale")
      return "#f97316"

    if (action === "low stock")
      return "#ff4d4f"

    return "#000"
  }

  const filteredLogs =
    logs.filter((item) => {

      if (filter === "all")
        return true

      return item.action === filter
    })

  return (

    <main className="activity-page">

      <h2>Activity Log</h2>

      {/* FILTERS */}
      <div className="activity-filters">

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
            onClick={() =>
              setFilter(type)
            }
            className="activity-filter-btn"
          >
            {type}
          </button>

        ))}

      </div>

      {/* TABLE */}
      <div className="activity-table-wrap">

        <table className="activity-table">

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
                  className="activity-empty"
                >
                  No logs found
                </td>
              </tr>

            ) : (

              filteredLogs.map((item, index) => (

                <tr
                  key={index}
                  className="activity-row"
                >

                  <td className="activity-cell">
                    {item.time}
                  </td>

                  <td className="activity-cell">
                    {item.product}
                  </td>

                  <td
                    className="activity-cell"
                    style={{
                      color: getColor(item.action),
                      fontWeight: "bold",
                      textTransform: "capitalize"
                    }}
                  >
                    {item.action}
                  </td>

                  <td className="activity-cell activity-note">
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