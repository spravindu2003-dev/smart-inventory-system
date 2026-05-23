import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ActivityLog from "./pages/ActivityLog";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import Login from "./pages/Login";

import { getUser } from "./utils/auth";

function App() {
  const user = getUser();

  return (
    <div>
      {user && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/products"
          element={user ? <Products /> : <Navigate to="/login" />}
        />

        <Route
          path="/sales"
          element={user ? <Sales /> : <Navigate to="/login" />}
        />

        <Route
          path="/reports"
          element={user ? <Reports /> : <Navigate to="/login" />}
        />

        <Route
          path="/log"
          element={
            user?.role === "admin" ? (
              <ActivityLog />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;