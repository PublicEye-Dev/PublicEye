import LoginPage from "./Pages/Auth/LoginPage";
import MapPage from "./Pages/Map/MapPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import CreatePetitionPage from "./Pages/CreatePetitionPage/CreatePetitionPage";
import CreateReportPage from "./Pages/CreateReportPage/CreateReportPage";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/petitie" element={<CreatePetitionPage />} />
        <Route path="/adauga-sesizare" element={<CreateReportPage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="/" element={<MapPage />} />
      </Routes>
    </BrowserRouter>
  );
}
