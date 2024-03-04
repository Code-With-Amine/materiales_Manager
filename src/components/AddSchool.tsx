import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

function AddScholl() {
  const [formData, setFormData] = useState({
    schoolName: "",
    Adress: "",
    email: "",
    phone: "",
    ville: "",
    created: Timestamp.now(),
  });
  const [alertMessage, setAlertMessage] = useState("");

  const handelChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showAlert = (mesg) => {
    setAlertMessage(mesg);
      setTimeout(() => {
        setAlertMessage("");
      }, 5000); // Remove alert after 3 seconds
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await addDoc(collection(db, "schools"), formData);
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
        <label>nom de L'ecole</label>
        <input
          name="schoolName"
          onChange={handelChange}
        />
      </div>
      <div>
      <label>Adress</label>
        <input name="Adress" onChange={handelChange} />
      </div>
     <div>
      <label> email </label>
        <input
            name="email"
            type="email"
            onChange={handelChange}
          />
     </div>
     <div>
      <label>phone</label>
        <input name="phone" onChange={handelChange} />
      </div>
      <div>
      <label>ville</label>
        <input name="ville" onChange={handelChange} />
      </div>
    
      <button type="submit">Add</button>
      <div>

      </div>
    </form>
  );
}

export default AddScholl;
