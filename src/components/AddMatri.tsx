import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp, getDocs } from "firebase/firestore";
import Papa from "papaparse";
import add from "../assets/add-benificaire.png";

interface FormData {
  nomArticle: string;
  caracts: string;
  quantity: number;
  created: any; // Update the type as per your Timestamp type from Firebase
  marche: string;
}

interface MarcheData {
  id: string;
  reference: string;
  intitule: string;
  provinciale: string;
}

const AddMatri: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nomArticle: "",
    caracts: "",
    quantity: 0,
    created: Timestamp.now(),
    marche: "", // Add marche field to the form data
  });
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");
  const [marches, setMarches] = useState<MarcheData[]>([]);
  const [newFieldName, setNewFieldName] = useState<String>("");
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  useEffect(() => {
    fetchMarches();
  }, []);

  const fetchMarches = async () => {
    try {
      const marcheCollection = collection(db, "marches");
      const marcheSnapshot = await getDocs(marcheCollection);
      const marcheList: MarcheData[] = marcheSnapshot.docs.map((doc) => ({
        id: doc.id,
        reference: doc.data().reference,
        intitule: doc.data().intitule,
        provinciale: doc.data().intitule
      }));
      setMarches(marcheList);
    } catch (error) {
      console.error("Error fetching marches:", error);
    }
  };

  const handleUpload = async (event: any) => {
    const file = event.target.files[0];
    setUploadError(""); // Clear any previous errors
    if (!file) {
      setUploadError("Please select a CSV file to upload.");
      return;
    }
    try {
      // Parse CSV data (replace with your Firestore collection reference)
      const csvData: string[][] = await new Promise((resolve, reject) => {
        Papa.parse(file, {
          complete: (results: any) => resolve(results.data),
          error: (error) => reject(error),
        });
      });
      const keys = csvData[0];
      const values = csvData.slice(1);
      const result = values.map((row) => {
        const obj: any = {};
        keys.forEach((key, index) => {
          obj[key] = row[index];
        });
        return obj;
      });

      for (let i = 0; i > result.length; i++) {
        await addToDB({ ...result[i] });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("An error occurred during upload. Please try again.");
    }
  };

  const handelChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setEditModalVisible(false);
  };

  const showAlert = (mesg: string) => {
    setAlertMessage(mesg);
    setTimeout(() => {
      setAlertMessage("");
    }, 5000); // Remove alert after 5 seconds
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "materiales"), formData);
      showAlert("Ajouté avec succès");
    } catch (err) {
      showAlert("Quelque chose s'est mal passé. Veuillez réessayer.");
      console.log(err);
    }
  };

  const addToDB = async (data: FormData) => {
    try {
      await addDoc(collection(db, "materiales"), data);
      showAlert("Ajouté avec succès");
    } catch (err) {
      showAlert("Quelque chose s'est mal passé. Veuillez réessayer.");
      console.log(err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="AddForm">
        {alertMessage && <div className="alert">{alertMessage}</div>}
        <div
          className="addChemp"
          style={{ display: "flex", alignItems: "center", border: "none" }}
        >
          <div>
            <select name="marche" onChange={handelChange}>
              <option value="">Choisir un marché</option>
              {marches.map((marche) => (
                <option key={marche.id} value={marche.reference}>
                  {marche.intitule} - {marche.reference}
                </option>
              ))}
            </select>
          </div>

          <div className="d-flext-block">
            <label>Nom de l'article</label>
            <input name="nomArticle" onChange={handelChange} />
          </div>
        </div>
        <div className="addChemp">
          <div>
            <label>Caractéristique</label>
            <input name="caracts" onChange={handelChange} />
          </div>
          <div>
            <label>Quantité</label>
            <input name="quantity" type="number" onChange={handelChange} />
          </div>
        </div>
        <img
          src={add}
          className="icon d-center"
          onClick={() => setEditModalVisible(true)}
        />

        <div className="spearatingLine">
          {" "}
          <span></span> <p>OU</p> <span></span>{" "}
        </div>
        <div>
          <input type="file" accept=".csv" onChange={handleUpload} />
          {uploadError && <p style={{ color: "red" }}>{uploadError}</p>}
        </div>
        <button type="submit">Ajouter</button>
      </form>
      {editModalVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setEditModalVisible(false)}>
              &times;
            </span>
            <h2>Ajouter nouveele column</h2>

            <div>
              <div>
                <label>Le nom de nouveaux chemp</label>
                <input
                  onChange={(e) => setNewFieldName(e.target.value)}
                  value={`${newFieldName}`}
                />
              </div>
              <div>
                <label>Le valeur de nouveaux Chemp </label>
                <input name={`${newFieldName}`} onChange={handelChange} />
              </div>
              <button type="button" onClick={() => setNewFieldName("")}>
                Ajouter une Column
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddMatri;
