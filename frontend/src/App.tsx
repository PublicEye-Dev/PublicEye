import LoginPage from "./Pages/Auth/LoginPage";
import MapPage from "./Pages/Map/MapPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import CreatePetitionPage from "./Pages/CreatePetitionPage/CreatePetitionPage";
import CreateReportPage from "./Pages/CreateReportPage/CreateReportPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/petitie" element={<CreatePetitionPage />} />
        <Route path="/sesizare" element={<CreateReportPage />} />
        <Route path="/" element={<MapPage />} />
      </Routes>
    </BrowserRouter>
  );
}
