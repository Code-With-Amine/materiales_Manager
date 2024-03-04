import { useState, useEffect } from "react";
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

function AddBenificier() {
  const [matirs, setMatirs] = useState([]);
  const [schools, setSchools] = useState([]);
  const [formData, setFormData] = useState({
    materileRef: null,
    schoolRef: null,
    quantityBenificer: 0,
  });
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const q = query(collection(db, "materiales"), orderBy("created", "desc"));
    onSnapshot(q, (querySnapshot) => {
      setMatirs(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
  }, []);

  useEffect(() => {
    const q = query(collection(db, "schools"), orderBy("schoolName", "desc"));
    onSnapshot(q, (querySnapshot) => {
      setSchools(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
  }, []);

  const handelChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handelAdd = async () => {
    try {
      await addDoc(collection(db, "beneficiaire"), formData);
      setAlertMessage("Successfully added");
      setTimeout(() => {
        setAlertMessage("");
      }, 3000); // Remove alert after 3 seconds
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    const oldQuantity = matirs.find((mat) => mat.id === formData.materileRef);
    const quantity = oldQuantity.data.quantity;
    const newQte = quantity - formData.quantityBenificer;
    const matiralekDocRef = doc(db, "materiales", formData.materileRef);
    try {
      await updateDoc(matiralekDocRef, {
        quantity: newQte,
      });

    } catch (err) {
      console.log(err);
    }
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    let err = false 
    // check if the quantity giving is less or equal to the one in the database
    matirs.forEach((matir) => {
      if (matir.id === formData.materileRef) {
        if (matir.data.quantity < parseInt(formData.quantityBenificer)) {
           err = true;
           setAlertMessage("quantity giving is greater than the ones in DB");
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
      {alertMessage && (
        <div className="alert">
          {alertMessage}
        </div>
      )}
      {matirs.length > 0 && schools.length > 0 ? (
        <form onSubmit={handelSubmit} className="AddForm">
          <div>
            <label> schools</label>
            <select name="schoolRef" onChange={handelChange} required>
              <option value="no-choose"> selecter une ecole</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {" "}
                  {school.data.schoolName}{" - "}{school.data.ville}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label> materials</label>
            <select name="materileRef" onChange={handelChange} required>
              <option value="no-choose"> selecter une materials</option>
              {matirs.map((matr) => (
                <option key={matr.id} value={matr.id}>
                  {" "}
                  {matr.data.nomArticle}{" "}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Quantity beneficiaire</label>
            <input
              type="number"
              name="quantityBenificer"
              onChange={handelChange}
              required
            />
          </div>
          <button type="submit">Add</button>
        </form>
      ) : (
        <p>there are no schools or materials set on the database</p>
      )}
    </div>
  );
}

export default AddBenificier;
