import { useState, FormEvent, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import Papa from "papaparse";
import add from "../assets/add-benificaire.png";

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
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);

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

  useEffect(() => {
    if (formData.marcherID !== "") {
      const q = query(
        collection(db, "materiales"),
        where("marche", "==", formData.marcherID)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        setMatir(
          querySnapshot.docs.map((doc) => ({
            id: doc.id,
            nomArticle: doc.data().nomArticle,
          }))
        );
      });
      return () => unsubscribe();
    }
  }, [formData.marcherID]);

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

  const handelChange = (e: any) => {
    const { name, value } = e.target;
    name !== "" &&
      value !== "" &&
      setFormData((prev) => ({ ...prev, [name]: value }));
    setEditModalVisible(false);
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
    <>
      <form onSubmit={handleSubmit} className="AddForm">
        {alertMessage && <div className="alert">{alertMessage}</div>}
        <div className="d-flex">
          <div>
            <select name="marcherID" onChange={handelChange} required>
              <option value="">Choisir un marché</option>
              {marches.map((marche) => (
                <option key={marche.id} value={marche.reference}>
                  {marche.intitule} - {marche.reference}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select name="idMat" onChange={handelChange} required>
              <option value="">Choisir un marché</option>
              {matirs.map((matir) => (
                <option key={matir.id} value={matir.id}>
                  {matir.nomArticle}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="d-flex">
          <div>
            <label>Nom de l'école</label>
            <input name="schoolName" onChange={handelChange} required />
          </div>
          <div>
            <label>Téléphone</label>
            <input name="phone" onChange={handelChange} />
          </div>
        </div>

        <div className="d-flex">
          <div>
            <label>Reference de l'école</label>
            <input name="ref" onChange={handelChange} required />
          </div>
          <div>
            <label>quantity</label>
            <input
              name="quantity"
              type="number"
              onChange={handelChange}
              required
            />
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
}

export default AddScholl;
