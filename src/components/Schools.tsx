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

interface Material {
  id: string;
  nomArticle: string;
}

function Schools() {
  const [matirs, setMatirs] = useState<Material[]>([]);
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

  useEffect(() => {
    const q = query(collection(db, "materiales"));
    onSnapshot(q, (querySnapshot) => {
      setMatirs(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          nomArticle: doc.data().nomArticle,
        }))
      );
    });
  }, []);

  const handelShowMatirale = (matirId : string) => {
      let nomArticle;
      matirs.forEach(matir => {
        if(matir.id == matirId){
          return nomArticle = matir.nomArticle
        }
      });
      return nomArticle; 
  }

  const handleDelete = async (id: string) => {
    const taskDocRef = doc(db, "schools", id);
    try {
      await deleteDoc(taskDocRef);
      setAlertMessage("École supprimée avec succès.");
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
      setAlertMessage("École mise à jour avec succès.");
      setTimeout(() => {
        setAlertMessage("");
      }, 3000); // Remove alert after 3 seconds
    } catch (err) {
      alert(err);
    }
    finally {
      setEditModalVisible(false)
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

  const handelShowingKey = () => {
    let newArr: string[] = [];
    filteredSchools.forEach((school) => {
      const keysArr = Object.keys(school.data);
      if (newArr.length < keysArr.length) {
        newArr = [...keysArr];
      }
    });
    return newArr;
  };

  const handelEditedDataChange = (e: any) => {
    const {name, value} = e.target;
    setEditedData( (prev) => ({ ...prev, [name]: value }))
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
              {handelShowingKey().map(
                (key, index) => key !== "created" && <th key={index}>{key}</th>
              )}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredSchools.map((school, index) => (
              <tr className="table-row" key={index}>
                {handelShowingKey().map((value: string) => (
                  <>
                    {typeof school.data[value as keyof typeof school.data] !==
                      "object" && (
                      <td>
                        {school.data[value as keyof typeof school.data] ? (
                          value === 'idMat' ? handelShowMatirale(school.data[value as keyof typeof school.data]) :  school.data[value as keyof typeof school.data] 
                        ) : (
                          <>unset</>
                        )}
                      </td>
                    )}
                  </>
                ))}
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
        <Spinner />
      )}

      {editModalVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setEditModalVisible(false)}>
              &times;
            </span>
            <h2>Edit School</h2>
            <form onSubmit={handleUpdate}>
              {
                Object.keys(editedData).map((data, index) => (
                   data !== 'idMat' && data !=='marcherID' && data !=='created' && <input key={index} placeholder={`New value of ${data}`} name={data} onChange={handelEditedDataChange}/>
                  ) )
              }
              <button type="submit"> Mettre à jour </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Schools;
