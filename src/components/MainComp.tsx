import { Link, useNavigate } from "react-router-dom";
import addSchool from "../assets/add-school.png";
import addMatirale from "../assets/add-material.png";
import school from "../assets/school.png";
import materiale from "../assets/see-materials.png";
import { useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

interface Marcher {
  reference: string;
  intitule: string;
}

function MainComp() {
  const [marches, setMarcher] = useState<Marcher[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "marches"));
    onSnapshot(q, (querySnapshot) => {
      setMarcher(
        querySnapshot.docs.map((doc) => ({
          reference: doc.data().reference,
          intitule: doc.data().intitule,
        }))
      );
    });
  }, []);

  return (
    <div className="main-container">
      <div className="item-link">
        {" "}
        <img src={school} alt="icône école" />{" "}
        <Link to="/schools">Établisment</Link>
      </div>
      <div className="item-link">
        {" "}
        <img src={materiale} alt="icône matériel" />{" "}
        <select onChange={(e) => navigate(`/materiales/${e.target.value}`)}>
          <option>Selecter une Marcher</option>
          {marches.length > 0 &&
            marches.map((marche, index) => (
              <option key={index} value={marche.reference}>
                {marche.intitule} - {marche.reference}
              </option>
            ))}
        </select>
      </div>

      <div className="item-link">
        {" "}
        <img src={addSchool} alt="icône ajouter école" />{" "}
        <Link to="/addSchools">Ajouter une Établisment</Link>
      </div>
      <div className="item-link">
        {" "}
        <img src={addMatirale} alt="icône ajouter matériel" />{" "}
        <select onChange={(e) => navigate(e.target.value)}>
          <option>Ajouter des</option>
          <option value="/addMatriales">Matériaux</option>
          <option value="/addMarches">Marches</option>
        </select>
      </div>
  
    </div>
  );
}

export default MainComp;
