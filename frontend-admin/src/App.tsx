import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ViewDepartmentPage from "./Pages/ViewDepartmentPage/ViewDepartmentPage";
import LoginPage from "./Pages/Auth/LoginPage";
import MapPage from "./Pages/Map/MapPage";
import ProtectedRoute from "./Components/Layout/ProtectedRoute";
import CreateReportPage from "./Pages/Report/CreateReportPage";
import "./App.css";
import ControlPanelPage from "./Pages/ControlPanelPage/ControlPanelPage";
import ManageReportPage from "./Pages/ManageReportPage/ManageReportPage";
import ControlPanelDepartamentPage from "./Pages/ControlPanelDepartmentPage/ControlPanelDepartmentPage";
import ViewAllReportsPage from "./Pages/ViewAllReportsPage/ViewAllReportsPage";
import EditCategoryPage from "./Pages/EditCategoryPage/EditCategoryPage";
import ViewAllUsersPage from "./Pages/ViewAllUsersPage/ViewAllUsersPage";

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
          path="/sesizari"
          element={
            <ProtectedRoute roles={["ADMIN", "OPERATOR"]}>
              <ViewAllReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/departament-admin/:id"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <ViewDepartmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/administrare-sesizare/:id"
          element={
            <ProtectedRoute roles={["ADMIN", "OPERATOR"]}>
              <ManageReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestionare-departamente"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <ControlPanelDepartamentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editare-categorie"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <EditCategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestionare-useri"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <ViewAllUsersPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
