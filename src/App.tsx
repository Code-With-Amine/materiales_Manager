import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddSchool from "./components/AddSchool";
import Materiales from "./components/Materiales";
import AddBenificier from "./components/AddBenificier";
import AddMatri from "./components/AddMatri";
import Schools from "./components/Schools";
import Beneficiaires from "./components/Beneficiaires";
import MainComp from "./components/MainComp";
import BackHome from "./components/BackHome";
import "./Style/App.css";

function App() {
  return (
    <BrowserRouter>
    <BackHome />
      <Routes>
        <Route path="/" element={<MainComp />} />
        <Route path="addSchools" element={<AddSchool />} />
        <Route path="AddBenificier" element={<AddBenificier />} />
        <Route path="addMatriales" element={<AddMatri />} />
        <Route path="schools" element={<Schools />} />
        <Route path="materiales" element={<Materiales />} />
        <Route path="Beneficiaires" element={<Beneficiaires />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
