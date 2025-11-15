import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ViewDepartmentPage from "./Pages/ViewDepartmentPage/ViewDepartmentPage";
import LoginPage from "./Pages/Auth/LoginPage";
import MapPage from "./Pages/Map/MapPage";
import ProtectedRoute from "./Components/Layout/ProtectedRoute";
import CreateReportPage from "./Pages/Report/CreateReportPage";
import "./App.css";
import ControlPanelPage from "./Pages/ControlPanelPage/ControlPanelPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MapPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adauga-sesizare"
          element={
            <ProtectedRoute>
              <CreateReportPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/card-control-panel"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <ControlPanelPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/departament-admin"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <ViewDepartmentPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
