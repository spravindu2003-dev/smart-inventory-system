import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import ActivityLog from './pages/ActivityLog'

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/sales" element={<h2>Sales Page</h2>} />
        <Route path="/reports" element={<h2>Reports Page</h2>} />
        <Route path="/log" element={<ActivityLog />} />
      </Routes>
    </div>
  )
}

export default App