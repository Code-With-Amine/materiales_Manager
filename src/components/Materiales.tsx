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
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
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
      setAlertMessage("Material deleted successfully.");
      setTimeout(() => {
        setAlertMessage("");
      }, 3000); // Remove alert after 3 seconds
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
      setAlertMessage("Material updated successfully.");
      setTimeout(() => {
        setAlertMessage("");
      }, 3000); // Remove alert after 3 seconds
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

  return (
    <>
      {alertMessage && <div className="alert">{alertMessage}</div>}

      <input
        type="text"
        placeholder="Search by article name"
        onChange={handleSearch}
        className="search-bar"
      />

      {filteredMatirs.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>nom de L'article</th>
              <th>quantity</th>
              <th>caracts</th>
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
                    matir.data.caracts.map((car) => <span> {car} </span>)
                  ) : (
                    <span> {matir.data.caracts} </span>
                  )}
                </td>
                <td>
                  <img
                    src={deleteIcon}
                    alt="delete Icon"
                    className="icon"
                    onClick={() => handleDelete(matir.id)}
                  />
                  <img
                    src={editIcon}
                    alt="edit Icon"
                    className="icon"
                    onClick={() => handleEdit(matir)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>There are no materiales registered.</p>
      )}

      {editModalVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setEditModalVisible(false)}>
              &times;
            </span>
            <h2>Edit Material</h2>
            <form onSubmit={handleUpdate}>
              <label>Article Name</label>
              <input
                type="text"
                value={editedData.nomArticle}
                onChange={(e) =>
                  setEditedData({ ...editedData, nomArticle: e.target.value })
                }
              />
              <label>Quantity</label>
              <input
                type="number"
                value={editedData.quantity}
                onChange={(e) =>
                  setEditedData({ ...editedData, quantity: Number(e.target.value) })
                }
              />
              <label>Characteristics</label>
              <input
                type="text"
                value={editedData.caracts}
                onChange={(e) =>
                  setEditedData({ ...editedData, caracts: e.target.value })
                }
              />
              <button type="submit">Update</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Materiales;
