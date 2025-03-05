import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Auth/Login";
import BSCDashboard from "./pages/BSCDashboard";
import BSCInputPage from "./pages/BSCInput";
import IPMPage from "./pages/IPM";
import PeriodMaster from "./pages/PeriodMaster";
import MPMInputActual from './pages/MPMInputAktual';
import MPMInfoTarget from "./pages/MPMInputTarget";
import PerformanceManagementDashboard from "./pages/PerformanceManagementDashboard";
import MPMActionPlan from "./pages/MPMActionPlan";
import PerformanceManagementHome from "./pages/PerformanceManagementHome";
import UserDetailPage from "./pages/UserDetail";
import EmployeeIPMDetailsPage from "./pages/EmployeeIPMDetails";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PerformanceManagementHome/>} />
          <Route path="/user-profile" element={<UserDetailPage/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/performance-management/bsc/dashboard" element={<BSCDashboard/>} />
          <Route path="/performance-management/dashboard" element={<PerformanceManagementDashboard/>} />
          <Route path="/performance-management/bsc/input" element={<BSCInputPage/>} />
          <Route path="/performance-management/ipm" element={<IPMPage/>} />
          <Route path="/performance-management/ipm/:employeeId/details" element={<EmployeeIPMDetailsPage/>} />
          <Route path="/performance-management/period-master" element={<PeriodMaster/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/performance-management/bsc/dashboard"
            element={<BSCDashboard />}
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/performance-management/mpm/target-input"
            element={<MPMInfoTarget />}
          />
          <Route
            path="/performance-management/mpm/actual-input"
            element={<MPMInputActual />}
          />
          <Route
            path="/performance-management/mpm/action-plan"
            element={<MPMActionPlan />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;