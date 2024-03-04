import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

function AddMatri() {
  const [formData, setFormData] = useState({
    nomArticle: "",
    caracts: "",
    quantity: 0,
    created: Timestamp.now(),
  });
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (mesg) => {
    setAlertMessage(mesg);
      setTimeout(() => {
        setAlertMessage("");
      }, 5000); // Remove alert after 3 seconds
  }

  const handelChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await addDoc(collection(db, "materiales"), formData);
      showAlert('Successfully added');

    } catch (err) {
      showAlert('something went wrong please try again');
      console.log(err);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="AddForm">
      {alertMessage && (
        <div className="alert">
          {alertMessage}
        </div>
      )}
      <div>
        <label>nom de Article</label>
        <input
          name="nomArticle"
          onChange={handelChange}
        />
      </div>
      <div>
      <label>Caractristique</label>
        <input name="caracts" onChange={handelChange} />
      </div>
     <div>
      <label> Quantity </label>
        <input
            name="quantity"
            type="number"
            onChange={handelChange}
          />
     </div>
    
      <button type="submit">Add</button>
      <div>

      </div>
    </form>
  );
}

export default AddMatri