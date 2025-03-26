import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Auth/Login";
import BSCDashboard from "./pages/BSCDashboard";
import BSCEntryPage from "./pages/BSCEntry";
import IPMPage from "./pages/IPM";
import PeriodMaster from "./pages/PeriodMaster";
import MPMTargets from "./pages/MPMTargets";
import PerformanceManagementDashboard from "./pages/PerformanceManagementDashboard";
import MPMActionPlan from "./pages/MPMActionPlan";
import PerformanceManagementHome from "./pages/PerformanceManagementHome";
import UserDetailPage from "./pages/UserDetail";
import EmployeeIPMDetailsPage from "./pages/EmployeeIPMDetails";
import TeamKPIActionPlans from "./pages/TeamKPIActionPlan";
import TeamIndividualActionPlans from "./pages/TeamIndividualActionPlans";
import MPMActualEntry from "./pages/MPMActualEntry";
import MPMActualList from "./pages/MPMActualList";
import MPMTargetList from "./pages/MPMTargetsList";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PerformanceManagementHome />} />
          <Route path="/user-profile" element={<UserDetailPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/performance-management/bsc/dashboard" element={<BSCDashboard />} />
          <Route path="/performance-management/dashboard" element={<PerformanceManagementDashboard />} />
          <Route path="/performance-management/bsc/input" element={<BSCEntryPage />} />
          <Route path="/performance-management/ipm" element={<IPMPage />} />
          <Route path="/performance-management/ipm/:employeeId/details" element={<EmployeeIPMDetailsPage />} />
          <Route path="/performance-management/period-master" element={<PeriodMaster />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/performance-management/bsc/dashboard"
            element={<BSCDashboard />}
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/performance-management/mpm/target"
            element={<MPMTargetList />}
          />
          <Route
            path="/performance-management/mpm/target/:targetId"
            element={<MPMTargets />}
          />
          <Route
            path="/performance-management/mpm/target/:targetId/entri/:mpmId/teams"
            element={<TeamKPIActionPlans />}
          />
          <Route
            path="/performance-management/mpm/target/:targetId/entri/:mpmId/teams/:teamId"
            element={<TeamIndividualActionPlans />}
          />
          <Route
            path="/performance-management/mpm/actual"
            element={<MPMActualList />}
          />
          <Route
            path="/performance-management/mpm/actual/:mpmActualId"
            element={<MPMActualEntry />}
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