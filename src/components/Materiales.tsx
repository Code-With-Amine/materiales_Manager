import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  collection,
  query,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import deleteIcon from "../assets/bin.png";
import editIcon from "../assets/edit.png";
import add from "../assets/add.png";
import Spinner from "./Spinner";
import { useParams } from "react-router-dom";
import ModelAddSchool from "./ModelAddSchool";

interface Material {
  id: string;
  data: {
    nomArticle: string;
    quantity: number;
    caracts: string[] | string;
  };
}

interface AddModel {
  show: boolean;
  marcherID: string;
  idMat: string;
  nomArticle: string;
}

function Materiales() {
  const { MatID }: any = useParams();
  const [matirs, setMatirs] = useState<Material[]>([]);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [filteredMatirs, setFilteredMatirs] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [addSchoolModel, setAddSchoolModel] = useState<AddModel>({
    show: false,
    marcherID: MatID,
    idMat: "",
    nomArticle: ''
  });
  const [editedData, setEditedData] = useState<Material["data"]>({
    nomArticle: "",
    quantity: 0,
    caracts: [],
  });

  useEffect(() => {
    const q = query(collection(db, "materiales"), where("marche", "==", MatID));
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
    setFilteredMatirs(matirs);
  }, [matirs]);

  const handleDelete = async (id: string) => {
    const taskDocRef = doc(db, "materiales", id);
    try {
      await deleteDoc(taskDocRef);
      setAlertMessage("Matériau supprimé avec succès.");
      setTimeout(() => {
        setAlertMessage("");
      }, 3000); // Supprimer l'alerte après 3 secondes
    } catch (err) {
      alert(err);
    }
  };

  const handleEdit = (matir: Material) => {
    setSelectedMaterial(matir);
    setEditedData(matir.data);
    setEditModalVisible(true);
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedMaterial) return;

    const matiralekDocRef = doc(db, "materiales", selectedMaterial.id);
    try {
      await updateDoc(matiralekDocRef, editedData);
      setAlertMessage("Matériau mis à jour avec succès.");
      setTimeout(() => {
        setAlertMessage("");
      }, 3000); // Supprimer l'alerte après 3 secondes
    } catch (err) {
      alert(err);
    } finally {
      setEditModalVisible(false);
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setFilteredMatirs(
      matirs.filter((matir) =>
        matir.data.nomArticle.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const handleQuantitySearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = parseInt(e.target.value);
    if (searchValue) {
      setFilteredMatirs(
        matirs.filter(
          (beneficiaire) => beneficiaire.data.quantity >= searchValue
        )
      );
    }
  };

  const handelShowingKey = () => {
    let newArr: string[] = [];
    filteredMatirs.forEach((matri) => {
      const keysArr = Object.keys(matri.data);
      if (newArr.length < keysArr.length) {
        newArr = [...keysArr];
      }
    });
    return newArr;
  };

  return (
    <>
      {alertMessage && <div className="alert">{alertMessage}</div>}

      <div className="search-container">
        <input
          type="text"
          placeholder="Rechercher par nom d'article"
          onChange={handleSearch}
          className="search-bar"
        />

        <input
          type="number"
          placeholder="Rechercher par quantité"
          onChange={handleQuantitySearch}
          className="search-bar"
        />
      </div>

      {filteredMatirs.length > 0 ? (
        <table>
          <thead>
            <tr>
              {handelShowingKey().map(
                (key, index) => key !== "created" && <th key={index}>{key}</th>
              )}
              <th></th>
            </tr>
          </thead>
          <tbody>
                {filteredMatirs.map((matir, index) => (
                  <tr className="table-row" key={index}>
                    {handelShowingKey().map((value: string) => (
                      <>
                        {typeof matir.data[value as keyof typeof matir.data] !==
                          "object" && (
                          <td>
                            {matir.data[value as keyof typeof matir.data] ? (
                              matir.data[value as keyof typeof matir.data]
                            ) : (
                              <>unset</>
                            )}
                          </td>
                        )}
                      </>
                    ))}
                    <td key={index}>
                      <img
                        src={deleteIcon}
                        alt="Icône de suppression"
                        className="icon"
                        onClick={() => handleDelete(matir.id)}
                      />
                      <img
                        src={editIcon}
                        alt="Icône d'édition"
                        className="icon"
                        onClick={() => handleEdit(matir)}
                      />
                      <img
                        src={add}
                        alt="Icône d'édition"
                        className="icon"
                        onClick={() =>
                          setAddSchoolModel((prev) => ({
                            ...prev,
                            show: true,
                            nomArticle: matir.data.nomArticle,
                            idMat: matir.id
                          }))
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Spinner />
          )}

        {addSchoolModel.show && (
          <ModelAddSchool
            handelModel={setAddSchoolModel}
            addSchoolModel={addSchoolModel}
          />
        )}

        {editModalVisible && (
          <div className="modal">
            <div className="modal-content">
              <span
                className="close"
                onClick={() => setEditModalVisible(false)}
              >
                &times;
              </span>
              <h2>Modifier le matériau</h2>
              <form onSubmit={handleUpdate}>
                <label>Nom de l'article</label>
                <input
                  type="text"
                  value={editedData.nomArticle}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      nomArticle: e.target.value,
                    })
                  }
                />
                <label>Quantité</label>
                <input
                  type="number"
                  value={editedData.quantity}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      quantity: Number(e.target.value),
                    })
                  }
                />
                <label>Caractéristiques</label>
                <input
                  type="text"
                  value={editedData.caracts}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      caracts: e.target.value,
                    })
                  }
                />
                <button type="submit">Mettre à jour</button>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }

export default Materiales;

