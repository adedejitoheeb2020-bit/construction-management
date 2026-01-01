import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import DashboardLayout from "./layouts/DashboardLayout";
import Notifications from "./pages/Notifications";
import ProjectTabsLayout from "./layouts/ProjectTabLayout";
import ProjectDetailsPage from "./pages/ProjectDetails";
import ProjectMaterialsPage from "./pages/ProjectMaterial";
import LookAheadSiteLead from "./pages/LookAheadSiteLead";
import LookAheadProcurement from "./pages/LookAheadProcurement";
import LookAheadPage from "./pages/LookAheadPage";
import LookAheadDetails from "./pages/LookAheadDetails";
import LookAheadSubmit from "./pages/LookAheadSubmit";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/lookahead/:id/create-lookahead" element={<LookAheadSubmit />} />
          <Route path="/lookahead/:id" element={<LookAheadDetails />} />
          <Route path="/lookaheads/:id/siteLead" element={<LookAheadSiteLead />} />
          <Route path="/lookaheads/:id/procurement" element={<LookAheadProcurement />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="projects/:id" element={<ProjectTabsLayout />}>
            <Route index element={<ProjectDetailsPage />} />
            <Route path="materials" element={<ProjectMaterialsPage />} />
            <Route path="lookaheads" element={<LookAheadPage />} />
              
              
          </Route>  
        </Route>
        
        
        
        

      </Routes>
    </BrowserRouter>
  );
}
