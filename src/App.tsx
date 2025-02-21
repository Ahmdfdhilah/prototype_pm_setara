import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Auth/Login";
import BSCDashboard from "./pages/BSCDashboard";
import BSCInputPage from "./pages/BSCInput";
import IPMPage from "./pages/IPM";
import PeriodMaster from "./pages/PeriodMaster";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/performance-management/bsc/dashboard" element={<BSCDashboard/>} />
          <Route path="/performance-management/bsc/input" element={<BSCInputPage/>} />
          <Route path="/performance-management/ipm" element={<IPMPage/>} />
          <Route path="/performance-management/period-master" element={<PeriodMaster/>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;