import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import UserDashboard from "./pages/UserDashboard";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900 text-white">

        {/* Navbar */}
        <nav className="p-4 bg-slate-800 flex gap-6">
          <Link to="/">User</Link>
          <Link to="/admin">Electric Dept</Link>
        </nav>

        <Routes>
          <Route path="/" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;