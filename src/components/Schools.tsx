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

interface School {
  id: string;
  data: {
    schoolName: string;
    Adress: string;
    phone: string;
    email: string;
    ville: string;
  };
}

function Schools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [editedData, setEditedData] = useState<School["data"]>({
    schoolName: "",
    Adress: "",
    phone: "",
    email: "",
    ville: "",
  });

  useEffect(() => {
    const fillSchools = () => {
      const q = query(collection(db, "schools"), orderBy("schoolName", "desc"));
      onSnapshot(q, (querySnapshot) => {
        const fetchedSchools = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data() as School["data"],
        }));
        setSchools(fetchedSchools);
        setFilteredSchools(fetchedSchools); // Update filteredSchools after fetching data
      });
    };

    fillSchools();
  }, []);

  const handleDelete = async (id: string) => {
    const taskDocRef = doc(db, "schools", id);
    try {
      await deleteDoc(taskDocRef);
      setAlertMessage("School deleted successfully.");
      setTimeout(() => {
        setAlertMessage("");
      }, 3000); // Remove alert after 3 seconds
    } catch (err) {
      alert(err);
    }
  };

  const handleEdit = (school: School) => {
    setSelectedSchool(school);
    setEditedData(school.data);
    setEditModalVisible(true);
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const schoolDocRef = doc(db, "schools", selectedSchool!.id);
    try {
      await updateDoc(schoolDocRef, editedData);
      setAlertMessage("School updated successfully.");
      setTimeout(() => {
        setAlertMessage("");
      }, 3000); // Remove alert after 3 seconds
    } catch (err) {
      alert(err);
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setFilteredSchools(
      schools.filter((school) =>
        school.data.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const showFirstLetters = (word: string) => {
    return `${word.substring(0, 20)} ...`;
  };

  return (
    <>
      {alertMessage && <div className="alert">{alertMessage}</div>}

      <input
        type="text"
        placeholder="Search by school name"
        onChange={handleSearch}
        className="search-bar"
      />

      {filteredSchools.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>nom de L'ecole</th>
              <th>Adress</th>
              <th>Phone</th>
              <th>email</th>
              <th>ville</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredSchools.map((school) => (
              <tr className="table-row" key={school.id}>
                <td>{school.data.schoolName}</td>
                <td title={school.data.Adress}>{showFirstLetters(school.data.Adress)}</td>
                <td>{school.data.phone}</td>
                <td>{school.data.email}</td>
                <td>{school.data.ville}</td>
                <td>
                  <img
                    src={deleteIcon}
                    alt="delete Icon"
                    className="icon"
                    onClick={() => handleDelete(school.id)}
                  />
                  <img
                    src={editIcon}
                    alt="edit Icon"
                    className="icon"
                    onClick={() => handleEdit(school)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>There are no schools registered.</p>
      )}

      {editModalVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setEditModalVisible(false)}>
              &times;
            </span>
            <h2>Edit School</h2>
            <form onSubmit={handleUpdate}>
              <label>School Name</label>
              <input
                type="text"
                value={editedData.schoolName}
                onChange={(e) =>
                  setEditedData({ ...editedData, schoolName: e.target.value })
                }
              />
              <label>Address</label>
              <input
                type="text"
                value={editedData.Adress}
                onChange={(e) =>
                  setEditedData({ ...editedData, Adress: e.target.value })
                }
              />
              <label>Phone</label>
              <input
                type="text"
                value={editedData.phone}
                onChange={(e) =>
                  setEditedData({ ...editedData, phone: e.target.value })
                }
              />
              <label>Email</label>
              <input
                type="email"
                value={editedData.email}
                onChange={(e) =>
                  setEditedData({ ...editedData, email: e.target.value })
                }
              />
              <label>Ville</label>
              <input
                type="text"
                value={editedData.ville}
                onChange={(e) =>
                  setEditedData({ ...editedData, ville: e.target.value })
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

export default Schools;
