import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Auth/Login";
import BSCDashboard from "./pages/BSCDashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/performance-management/bsc/dashboard" element={<BSCDashboard/>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;