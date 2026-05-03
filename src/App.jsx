import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'

import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import ActivityLog from './pages/ActivityLog'
import Sales from './pages/Sales'
import Reports from './pages/Reports'

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/log" element={<ActivityLog />} />
      </Routes>
    </div>
  )
}

export default App