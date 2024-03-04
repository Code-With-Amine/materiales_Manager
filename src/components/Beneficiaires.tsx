import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import deleteIcon from "../assets/bin.png";
import { db } from "../firebase";

function Beneficiaires() {
  const [matirs, setMatirs] = useState([]);
  const [schools, setSchools] = useState([]);
  const [beneficiaires, setBeneficiaires] = useState([]);
  const [beneficiaireData, setBeneficiaireData] = useState([]);
  const [filteredBeneficiaires, setFilteredBeneficiaires] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const q = query(collection(db, "materiales"), orderBy("created", "desc"));
    onSnapshot(q, (querySnapshot) => {
      setMatirs(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
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
          data: doc.data(),
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
          data: doc.data(),
        }))
      );
    });
  }, []);

  useEffect(() => {
    const data = beneficiaires.map((ben) => {
      const obj = {
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

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "beneficiaire", id));
      setBeneficiaireData(beneficiaireData.filter((item) => item.id !== id));
      setFilteredBeneficiaires(
        filteredBeneficiaires.filter((item) => item.id !== id)
      );
      setAlertMessage("Beneficiary deleted successfully.");
      setTimeout(() => {
        setAlertMessage("");
      }, 3000); // Remove alert after 3 seconds
    } catch (error) {
            setAlertMessage("Error deleting document try again later.");
            console.error("Error deleting document: ", error);
    }
  };

  const handleSearch = (e) => {
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
