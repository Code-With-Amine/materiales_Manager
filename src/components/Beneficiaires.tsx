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
      setAlertMessage("Beneficiary deleted successfully.");
      setTimeout(() => {
        setAlertMessage("");
      }, 3000); // Remove alert after 3 seconds
    } catch (error) {
      setAlertMessage("Error deleting document. Please try again later.");
      console.error("Error deleting document: ", error);
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

  return (
    <div>
      {alertMessage && <div className="alert">{alertMessage}</div>}
      <input
        type="text"
        placeholder="Search by school, article name, or city"
        onChange={handleSearch}
        className="search-bar"
      />
      <table>
        <thead>
          <tr>
            <th>Article Name</th>
            <th>Quantity</th>
            <th>Caracts</th>
            <th>School Name</th>
            <th>Phone</th>
            <th>City</th>
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
                  alt="delete Icon"
                  className="icon"
                  onClick={() => handleDelete(beneficiaire.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Beneficiaires;
