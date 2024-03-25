import { useState, FormEvent, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import Papa from "papaparse";

interface FormData {
  ref: string;
  schoolName: string;
  email: string;
  phone: string;
  ville: string;
  marcherID: string | null;
  idMat: string | null;
  quantity: number | null;
  created: Date | Timestamp;
}

interface Marches {
  id: string;
  intitule: string;
  reference: string;
}
interface Materiaux {
  id: string;
  nomArticle: string;
}

function AddScholl() {
  const [formData, setFormData] = useState<FormData>({
    ref: "",
    schoolName: "",
    email: "",
    phone: "",
    ville: "",
    quantity: null,
    marcherID: null,
    idMat: null,
    created: Timestamp.now(),
  });
  const [marches, setMarche] = useState<Marches[]>([]);
  const [matirs, setMatir] = useState<Materiaux[]>([]);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");
  const [newFieldName, setNewFieldName] = useState<String>("");

  useEffect(() => {
    const q = query(collection(db, "materiales"), orderBy("created", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMatir(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          nomArticle: doc.data().nomArticle,
        }))
      );
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "marches"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMarche(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          reference: doc.data().reference,
          intitule: doc.data().intitule,
        }))
      );
    });
    return () => unsubscribe();
  }, []);

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // check if all fields are filled correctlly
    /*let err = false;
    const values = Object.values(formData);
    values.forEach((value) => {
      if (value === "" || value == undefined || value == null) {
        showAlert("Tout les champ est obligatoire");
        return (err = true);
      }
    });
    if (err) return;
    */
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
      <div className="d-flex">
        <div>
          <select name="marcherID" onChange={handelChange}>
            <option value="">Choisir un marché</option>
            {marches.map((marche) => (
              <option key={marche.id} value={marche.reference}>
                {marche.intitule} - {marche.reference}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select name="idMat" onChange={handelChange}>
            <option value="">Choisir un marché</option>
            {matirs.map((matir) => (
              <option key={matir.id} value={matir.id}>
                {matir.nomArticle}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label>Reference de l'école</label>
        <input name="ref" onChange={handelChange} />
      </div>

      <div className="d-flex">
        <div>
          <label>Nom de l'école</label>
          <input name="schoolName" onChange={handelChange} />
        </div>
        <div>
          <label>Téléphone</label>
          <input name="phone" onChange={handelChange} />
        </div>
      </div>

      <div className="d-flex">
        <div>
          <label>Ville</label>
          <input name="ville" onChange={handelChange} />
        </div>
        <div>
          <label>quantity</label>
          <input name="quantity" type="number" onChange={handelChange} />
        </div>
      </div>

      <button type="button" onClick={() => setNewFieldName("")}>
        Ajouter une Column
      </button>
      <div className="addChemp">
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
