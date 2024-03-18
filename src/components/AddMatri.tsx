import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import Papa from "papaparse";

function AddMatri() {
  const [formData, setFormData] = useState({
    nomArticle: "",
    caracts: "",
    quantity: 0,
    created: Timestamp.now(),
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [uploadError, setUploadError] = useState("");

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

      for (const row of csvData.slice(1)) {
        await addToDB({
          nomArticle: row[0],
          caracts: row[1],
          quantity: parseInt(row[2], 10),
          created: Timestamp.now(),
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("An error occurred during upload. Please try again.");
    }
  };

  const handelChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showAlert = (mesg: string) => {
    setAlertMessage(mesg);
    setTimeout(() => {
      setAlertMessage("");
    }, 5000); // Remove alert after 5 seconds
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "materiales"), formData);
      showAlert("Ajouté avec succès");
    } catch (err) {
      showAlert("Quelque chose s'est mal passé. Veuillez réessayer.");
      console.log(err);
    }
  };

  const addToDB = async (data: any) => {
    try {
      await addDoc(collection(db, "materiales"), data);
      showAlert("Ajouté avec succès");
    } catch (err) {
      showAlert("Quelque chose s'est mal passé. Veuillez réessayer.");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="AddForm">
      {alertMessage && <div className="alert">{alertMessage}</div>}
      <div>
        <label>Nom de l'article</label>
        <input name="nomArticle" onChange={handelChange} />
      </div>
      <div>
        <label>Caractéristique</label>
        <input name="caracts" onChange={handelChange} />
      </div>
      <div>
        <label>Quantité</label>
        <input name="quantity" type="number" onChange={handelChange} />
      </div>
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
  );
}

export default AddMatri;
