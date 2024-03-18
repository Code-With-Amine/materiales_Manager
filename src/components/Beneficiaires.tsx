import { useState, useEffect, ChangeEvent } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import deleteIcon from "../assets/bin.png";
import { db } from "../firebase";
import Spinner from "./Spinner";

interface Beneficiaire {
  id: string;
  data: {
    materileRef: string;
    quantityBenificer: number;
    schoolRef: string;
  };
}

interface BeneficiaireData {
  materileRef: string;
  quantityBenificer: number;
  schoolRef: string;
}

interface Material {
  id: string;
  data: {
    nomArticle: string;
    caracts: string;
  };
}

interface School {
  id: string;
  data: {
    schoolName: string;
    phone: string;
    ville: string;
  };
}

function Beneficiaires() {
  const [matirs, setMatirs] = useState<Material[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [beneficiaires, setBeneficiaires] = useState<Beneficiaire[]>([]);
  const [beneficiaireData, setBeneficiaireData] = useState<any[]>([]); // Any temporarily, should replace with a proper type
  const [filteredBeneficiaires, setFilteredBeneficiaires] = useState<any[]>([]); // Any temporarily, should replace with a proper type
  const [alertMessage, setAlertMessage] = useState<string>("");

  useEffect(() => {
    const q = query(collection(db, "materiales"), orderBy("created", "desc"));
    onSnapshot(q, (querySnapshot) => {
      setMatirs(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data() as Material["data"],
        }))
      );
    });
  }, []);

  useEffect(() => {
    const q = query(collection(db, "schools"), orderBy("schoolName", "desc"));
    onSnapshot(q, (querySnapshot) => {
      setSchools(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data() as School["data"],
        }))
      );
    });
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "beneficiaire"),
      orderBy("quantityBenificer", "desc")
    );
    onSnapshot(q, (querySnapshot) => {
      setBeneficiaires(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data() as BeneficiaireData,
        }))
      );
    });
  }, []);

  useEffect(() => {
    const data = beneficiaires.map((ben) => {
      const obj: any = {
        id: ben.id,
        quantityBenificer: ben.data.quantityBenificer,
      };
      matirs.forEach((m) => {
        if (ben.data.materileRef === m.id) {
          obj["nomArticle"] = m.data.nomArticle;
          obj["caracts"] = m.data.caracts;
        }
      });
      schools.forEach((school) => {
        if (ben.data.schoolRef === school.id) {
          obj["schoolName"] = school.data.schoolName;
          obj["phone"] = school.data.phone;
          obj["ville"] = school.data.ville;
        }
      });
      return obj;
    });
    setBeneficiaireData(data);
    setFilteredBeneficiaires(data); // Initially set filteredBeneficiaires to all data
  }, [schools, matirs, beneficiaires]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "beneficiaire", id));
      setBeneficiaireData((prevState) =>
        prevState.filter((item) => item.id !== id)
      );
      setFilteredBeneficiaires((prevState) =>
        prevState.filter((item) => item.id !== id)
      );
      setAlertMessage("Bénéficiaire supprimé avec succès.");
      setTimeout(() => {
        setAlertMessage("");
      }, 3000); // Remove alert after 3 seconds
    } catch (error) {
      setAlertMessage(
        "Erreur lors de la suppression du document. Veuillez réessayer plus tard."
      );
      console.error("Erreur lors de la suppression du document : ", error);
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setFilteredBeneficiaires(
      beneficiaireData.filter(
        (beneficiaire) =>
          beneficiaire.schoolName.toLowerCase().includes(searchTerm) ||
          beneficiaire.nomArticle.toLowerCase().includes(searchTerm) ||
          beneficiaire.ville.toLowerCase().includes(searchTerm)
      )
    );
  };

  const handleQuantitySearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = parseInt(e.target.value);
    if (searchValue) {
      setFilteredBeneficiaires(
        beneficiaireData.filter(
          (beneficiaire) => beneficiaire.quantityBenificer >= searchValue
        )
      );
    }
  };

  return (
    <div>
      {alertMessage && <div className="alert">{alertMessage}</div>}
      <div className="search-container">
        <input
          type="text"
          placeholder="Rechercher par école, nom de l'article ou ville"
          onChange={handleSearch}
          className="search-bar"
        />
        <input
          type="number"
          placeholder="Rechercher par quantité"
          onChange={handleQuantitySearch}
          className="search-bar"
        />
      </div>
      {filteredBeneficiaires.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Nom de l'article</th>
              <th>Quantité</th>
              <th>Caractéristiques</th>
              <th>Nom de l'école</th>
              <th>Téléphone</th>
              <th>Ville</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBeneficiaires.map((beneficiaire) => (
              <tr key={beneficiaire.id} className="table-row">
                <td>{beneficiaire.nomArticle}</td>
                <td>{beneficiaire.quantityBenificer}</td>
                <td>{beneficiaire.caracts}</td>
                <td>{beneficiaire.schoolName}</td>
                <td>{beneficiaire.phone}</td>
                <td>{beneficiaire.ville}</td>
                <td>
                  <img
                    src={deleteIcon}
                    alt="Icône de suppression"
                    className="icon"
                    onClick={() => handleDelete(beneficiaire.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <Spinner />
      )}
    </div>
  );
}

export default Beneficiaires;
