import { useState, useEffect } from "react";
import { collection, updateDoc, doc, getDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase";

interface AddModel {
  show: boolean;
  marcherID: string;
  idMat: string;
  nomArticle: string;
}

interface FormData {
  schoolRef: string;
  quantity: number;
  ref: string;
}

interface ModelAddSchoolProps {
  handelModel: (value: AddModel) => void;
  addSchoolModel: AddModel;
}

const ModelAddSchool: React.FC<ModelAddSchoolProps> = ({
  handelModel,
  addSchoolModel,
}) => {
  const [newFieldName, setNewFieldName] = useState<String>("");
  const [formData, setFormData] = useState<FormData>({
    schoolRef: "",
    quantity: 0,
    ref: "",
  });
  const [alertMessage, setAlertMessage] = useState<string>("");

  const handelChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handelSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { schoolRef, quantity } = formData;
    if (schoolRef && quantity > 0) {
      const matiralekDocRef = doc(db, "materiales", addSchoolModel.idMat);

      try {
        const matiralekDocSnap = await getDoc(matiralekDocRef);
        const oldQuantity = matiralekDocSnap.data()?.quantity || 0;

        if (Number(quantity) <= Number(oldQuantity)) {
          await updateDoc(matiralekDocRef, {
            quantity: oldQuantity - quantity,
          });
        } else {
          const newSchoolData = {
            schoolName: formData.schoolRef,
            quantity: formData.quantity,
            idMat: addSchoolModel.idMat,
            marcherID: addSchoolModel.marcherID,
            ref: formData.ref,
          };
          await addDoc(collection(db, "schools"), newSchoolData);
          setAlertMessage("Nouvelle école ajoutée avec succès");
        }
        setTimeout(() => {
          setAlertMessage("");
        }, 3000);
      } catch (err: any) {
        setAlertMessage(err);
      }
    } else {
      setAlertMessage(
        "Veuillez sélectionner une école et spécifier une quantité valide"
      );
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span
          className="close"
          onClick={() =>
            handelModel({
              show: false,
              marcherID: addSchoolModel.marcherID,
              idMat: addSchoolModel.idMat,
              nomArticle: "",
            })
          }
        >
          &times;
        </span>
        <h2>Modifier le matériau</h2>
        {alertMessage && <div className="alert">{alertMessage}</div>}
        <form onSubmit={handelSubmit}>
          <label>Numero de Marcher</label>
          <input value={addSchoolModel.marcherID} disabled={true} />
          <label>Nom de l'article</label>
          <input value={addSchoolModel.nomArticle} disabled={true} />{" "}
          <label>Nom de Etablisment</label>
          <input name="schoolRef" onChange={handelChange} required />
          <label>reference de Etablisment</label>
          <input name="ref" onChange={handelChange} required />
          <label>Quantité</label>
          <input
            type="number"
            name="quantity"
            onChange={handelChange}
            required
          />
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
          <button type="submit">Mettre à jour</button>
        </form>
      </div>
    </div>
  );
};

export default ModelAddSchool;
