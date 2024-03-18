import { useState, ChangeEvent, FormEvent } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import Papa from "papaparse";

interface FormData {
  schoolName: string;
  Adress: string;
  email: string;
  phone: string;
  ville: string;
  created: Date | Timestamp;
}

function AddScholl() {
  const [formData, setFormData] = useState<FormData>({
    schoolName: "",
    Adress: "",
    email: "",
    phone: "",
    ville: "",
    created: Timestamp.now(),
  });
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");

  const handleUpload = async (event: any) => {
    const file = event.target.files[0];
    setUploadError(""); // Clear any previous errors
    if (!file) {
      setUploadError("Please select an csv file to upload.");
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
        const data = await addToDB({
          schoolName: row[0],
          ville: row[1],
          Adress: row[2],
          email: row[3],
          phone: row[4],
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("An error occurred during upload. Please try again.");
    }
  };

  const handelChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showAlert = (mesg: string) => {
    setAlertMessage(mesg);
    setTimeout(() => {
      setAlertMessage("");
    }, 5000); // Remove alert after 5 seconds
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // check if all fields are filled correctlly
    let err = false;
    const values = Object.values(formData);
    values.forEach((value) => {
      if (value === "" || value == undefined || value == null) {
        showAlert("Tout les champ est obligatoire");
        return (err = true);
      }
    });
    if (err) return;
    addToDB(formData);
  };

  const addToDB = async (data: any) => {
    try {
      await addDoc(collection(db, "schools"), data);
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
        <label>Nom de l'école</label>
        <input name="schoolName" onChange={handelChange} />
      </div>
      <div>
        <label>Adresse</label>
        <input name="Adress" onChange={handelChange} />
      </div>
      <div>
        <label>Email</label>
        <input name="email" type="email" onChange={handelChange} />
      </div>
      <div>
        <label>Téléphone</label>
        <input name="phone" onChange={handelChange} />
      </div>
      <div>
        <label>Ville</label>
        <input name="ville" onChange={handelChange} />
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

export default AddScholl;
