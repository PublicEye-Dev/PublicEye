import ViewDepartmentPage from "./Pages/ViewDepartmentPage/ViewDepartmentPage"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";



export default function App() {

  return( <BrowserRouter>
      <Routes>
        <Route path="/departament-admin" element={<ViewDepartmentPage/>} />
      </Routes>
    </BrowserRouter>)
}
