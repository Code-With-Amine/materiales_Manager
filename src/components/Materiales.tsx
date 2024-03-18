import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import deleteIcon from "../assets/bin.png";
import editIcon from "../assets/edit.png";
import Spinner from "./Spinner";

interface Material {
  id: string;
  data: {
    nomArticle: string;
    quantity: number;
    caracts: string[] | string;
  };
}

function Materiales() {
  const [matirs, setMatirs] = useState<Material[]>([]);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [filteredMatirs, setFilteredMatirs] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [editedData, setEditedData] = useState<Material["data"]>({
    nomArticle: "",
    quantity: 0,
    caracts: [],
  });

  useEffect(() => {
    const q = query(collection(db, "materiales"), orderBy("created", "desc"));
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
              <th>Nom de l'article</th>
              <th>Quantité</th>
              <th>Caractéristiques</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredMatirs.map((matir) => (
              <tr className="table-row" key={matir.id}>
                <td>{matir.data.nomArticle}</td>
                <td>{matir.data.quantity}</td>
                <td>
                  {Array.isArray(matir.data.caracts) ? (
                    matir.data.caracts.map((car, ind) => (
                      <span key={ind}> {car} </span>
                    ))
                  ) : (
                    <span> {matir.data.caracts} </span>
                  )}
                </td>
                <td>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <Spinner />
      )}

      {editModalVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setEditModalVisible(false)}>
              &times;
            </span>
            <h2>Modifier le matériau</h2>
            <form onSubmit={handleUpdate}>
              <label>Nom de l'article</label>
              <input
                type="text"
                value={editedData.nomArticle}
                onChange={(e) =>
                  setEditedData({ ...editedData, nomArticle: e.target.value })
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
                  setEditedData({ ...editedData, caracts: e.target.value })
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
