import { Link } from "react-router-dom";
import addBenificier from "../assets/add-benificaire.png";
import addSchool from "../assets/add-school.png";
import addMatirale from "../assets/add-material.png";
import school from "../assets/school.png";
import materiale from "../assets/see-materials.png";
import benficaire from "../assets/see-benificaires.png";

function MainComp() {
  return (
    <div className="main-container">
      <div className="item-link">
        {" "}
        <img src={school} alt="icône école" /> <Link to="/schools">Écoles</Link>
      </div>
      <div className="item-link">
        {" "}
        <img src={materiale} alt="icône matériel" />{" "}
        <Link to="/materiales">Matériaux</Link>
      </div>
      <div className="item-link">
        {" "}
        <img src={benficaire} alt="icône bénéficiaires" />{" "}
        <Link to="/Beneficiaires">Bénéficiaires</Link>
      </div>

      <div className="item-link">
        {" "}
        <img src={addSchool} alt="icône ajouter école" />{" "}
        <Link to="/addSchools">Ajouter une école</Link>
      </div>
      <div className="item-link">
        {" "}
        <img src={addMatirale} alt="icône ajouter matériel" />{" "}
        <Link to="/addMatriales">Ajouter des matériaux</Link>
      </div>
      <div className="item-link">
        {" "}
        <img src={addBenificier} alt="icône ajouter bénéficiaire" />{" "}
        <Link to="/AddBenificier">Ajouter un bénéficiaire</Link>
      </div>
    </div>
  );
}

export default MainComp;
