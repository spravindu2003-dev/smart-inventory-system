import { useEffect, useState } from 'react'

function ActivityLog() {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('products')
    const products = saved ? JSON.parse(saved) : []

    let allLogs = []

    products.forEach(p => {
      if (Array.isArray(p.history)) {
        p.history.forEach(h => {
          allLogs.push({
            product: p.name,
            action: h.action,
            time: h.time,
            note: h.note
          })
        })
      }
    })

    setLogs(allLogs.reverse())
  }, [])

  return (
    <div style={{ padding: "20px" }}>
      <h2>Activity Log</h2>

      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Action</th>
            <th>Time</th>
            <th>Note</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log, i) => (
            <tr key={i}>
              <td>{log.product}</td>
              <td>{log.action}</td>
              <td>{log.time}</td>
              <td>{log.note || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ActivityLog