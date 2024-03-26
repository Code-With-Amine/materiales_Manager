import { useState, useEffect } from "react";
import { collection, doc, getDocs, addDoc } from "firebase/firestore";
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
  schoolName: string;
}

interface School {
  id: string;
  name: string;
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
  const [existingSchools, setExistingSchools] = useState<School[]>([]);
  const [formData, setFormData] = useState<FormData>({
    schoolRef: "",
    quantity: 0,
    ref: "",
    schoolName: "",
  });
  const [alertMessage, setAlertMessage] = useState<string>("");

  useEffect(() => {
    const fetchExistingSchools = async () => {
      const schoolsCollection = collection(db, "schools");
      const querySnapshot = await getDocs(schoolsCollection);
      const schoolsList: School[] = [];
      querySnapshot.forEach((doc) => {
        schoolsList.push({
          id: doc.id,
          name: doc.data().schoolName,
          ref: doc.data().ref,
        });
      });
      setExistingSchools(schoolsList);
    };

    fetchExistingSchools();
  }, []);

  const handelChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name === "schoolRef") {
      const selectedSchool = existingSchools.find(
        (school) => school.id === value
      );
      if (selectedSchool) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          ref: selectedSchool.ref,
          schoolName: selectedSchool.name,
        }));
      }
    } else {
      name !== "" &&
        value !== "" &&
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handelSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (
        formData.schoolRef !== "" &&
        formData.quantity > 0 &&
        addSchoolModel.idMat !== "" &&
        addSchoolModel.marcherID !== ""
      ) {
        const newSchoolData = {
          schoolName: formData.schoolName,
          ref: formData.ref,
          quantity: formData.quantity,
          idMat: addSchoolModel.idMat,
          marcherID: addSchoolModel.marcherID,
        };
        await addDoc(collection(db, "schools"), newSchoolData);

        setAlertMessage("École ajoutée avec succès");
      } else {
        setAlertMessage(
          "Veuillez sélectionner une école et spécifier une quantité valide"
        );
      }

      setTimeout(() => {
        setAlertMessage("");
      }, 3000);
    } catch (err: any) {
      setAlertMessage(err);
    } finally {
      handelModel({
        show: true,
        marcherID: addSchoolModel.marcherID,
        idMat: addSchoolModel.idMat,
        nomArticle: addSchoolModel.nomArticle,
      });
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
              nomArticle: addSchoolModel.nomArticle,
            })
          }
        >
          &times;
        </span>
        <h2>Ajouter une École</h2>
        {alertMessage && <div className="alert">{alertMessage}</div>}
        <form onSubmit={handelSubmit}>
          <label>Numéro de Marché</label>
          <input value={addSchoolModel.marcherID} disabled={true} />
          <label>Nom de l'article</label>
          <input value={addSchoolModel.nomArticle} disabled={true} />
          <label>Sélectionner une École</label>
          <select name="schoolRef" onChange={handelChange} required>
            <option value="">Sélectionner une école...</option>
            {existingSchools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name} - {school.ref}
              </option>
            ))}
          </select>
          <label>Référence de l'École</label>
          <input name="ref" value={formData.ref} disabled={true} required />
          <label>Quantité</label>
          <input
            type="number"
            name="quantity"
            onChange={handelChange}
            required
          />

          <button type="submit">Ajouter</button>
        </form>
      </div>
    </div>
  );
};

export default ModelAddSchool;
