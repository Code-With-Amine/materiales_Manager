import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

interface Material {
  id: string;
  data: {
    nomArticle: string;
    quantity: number;
  };
}

interface School {
  id: string;
  data: {
    schoolName: string;
    ville: string;
  };
}

interface FormData {
  materileRef: string | null;
  schoolRef: string | null;
  quantityBenificer: number;
}

function AddBenificier() {
  const [matirs, setMatirs] = useState<Material[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [formData, setFormData] = useState<FormData>({
    materileRef: null,
    schoolRef: null,
    quantityBenificer: 0,
  });
  const [alertMessage, setAlertMessage] = useState<string>("");

  useEffect(() => {
    const q = query(collection(db, "materiales"), orderBy("created", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMatirs(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data() as Material["data"],
        }))
      );
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "schools"), orderBy("schoolName", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setSchools(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data() as School["data"],
        }))
      );
    });
    return () => unsubscribe();
  }, []);

  const handelChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handelAdd = async () => {
    try {
      await addDoc(collection(db, "beneficiaire"), formData);
      setAlertMessage("Ajouté avec succès");
      setTimeout(() => {
        setAlertMessage("");
      }, 3000); // Remove alert after 3 seconds
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    const oldQuantity = matirs.find((mat) => mat.id === formData.materileRef);
    if (oldQuantity) {
      const quantity = oldQuantity.data.quantity;
      const newQte = quantity - formData.quantityBenificer;
      const matiralekDocRef = doc(db, "materiales", formData.materileRef!); // Specify type assertion for formData.materileRef
      try {
        await updateDoc(matiralekDocRef, {
          quantity: newQte,
        });
      } catch (err: any) {
        setAlertMessage(err);
      }
    }
  };

  const handelSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let err = false;
    // check if the quantity giving is less or equal to the one in the database
    matirs.forEach((matir) => {
      if (matir.id === formData.materileRef) {
        if (matir.data.quantity < formData.quantityBenificer) {
          err = true;
          setAlertMessage("la quantité donnée est supérieure à celle de DB");
          return;
        }
      }
    });
    if (!err) {
      // add to the beneficiaire table
      handelAdd();

      // update the matirale table
      handleUpdate();
    }
  };

  return (
    <div>
      {alertMessage && <div className="alert">{alertMessage}</div>}
      {matirs.length > 0 && schools.length > 0 ? (
        <form onSubmit={handelSubmit} className="AddForm">
          <div>
            <label>Écoles</label>
            <select name="schoolRef" onChange={handelChange} required>
              <option value="no-choose">Sélectionnez une école</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.data.schoolName} - {school.data.ville}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Matériaux</label>
            <select name="materileRef" onChange={handelChange} required>
              <option value="no-choose">Sélectionnez un matériau</option>
              {matirs.map((matr) => (
                <option key={matr.id} value={matr.id}>
                  {matr.data.nomArticle}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Quantité bénéficiaire</label>
            <input
              type="number"
              name="quantityBenificer"
              onChange={handelChange}
              required
            />
          </div>
          <button type="submit">Ajouter</button>
        </form>
      ) : (
        <p>Aucune école ou matériau n'est défini dans la base de données</p>
      )}
    </div>
  );
}

export default AddBenificier;
