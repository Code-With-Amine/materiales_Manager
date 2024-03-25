import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddSchool from "./components/AddSchool";
import AddMarches from "./components/AddMarches";
import Materiales from "./components/Materiales";
import AddBenificier from "./components/AddBenificier";
import AddMatri from "./components/AddMatri";
import Schools from "./components/Schools";
import MainComp from "./components/MainComp";
import BackHome from "./components/BackHome";
import "./Style/App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="page-container">
        <BackHome />
        <Routes>
          <Route path="/" element={<MainComp />} />
          <Route path="addSchools" element={<AddSchool />} />
          <Route path="AddBenificier" element={<AddBenificier />} />
          <Route path="addMatriales" element={<AddMatri />} />
          <Route path="addMarches" element={<AddMarches />} />
          <Route path="schools" element={<Schools />} />
          <Route path="materiales/:MatID" element={<Materiales />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
