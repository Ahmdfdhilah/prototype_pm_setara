import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Auth/Login';
import BSCDashboard from './pages/BSCDashboard';
import MPMInfoTarget from './pages/MPMInputTarget';
import MPMInputActual from './pages/MPMInputAktual';
import MPMActionPlan from './pages/MPMActionPlan';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/performance-management/bsc/dashboard"
            element={<BSCDashboard />}
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/performance-management/mpm/input-target"
            element={<MPMInfoTarget />}
          />
          <Route
            path="/performance-management/mpm/input-aktual"
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
