import ViewDepartmentPage from "./Pages/ViewDepartmentPage/ViewDepartmentPage"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ControlPanelPage from "./Pages/ControlPanelPage/ControlPanelPage";
import "./App.css";



export default function App() {

  return( <BrowserRouter>
      <Routes>
        <Route path="/departament-admin" element={<ViewDepartmentPage/>} />
        <Route path="/card-control-panel" element={<ControlPanelPage/>} />
      </Routes>
    </BrowserRouter>)
}
