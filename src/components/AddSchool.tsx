import { useState, ChangeEvent, FormEvent } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

interface FormData {
  schoolName: string;
  Adress: string;
  email: string;
  phone: string;
  ville: string;
  created: Date | Timestamp;
}

function AddScholl() {
  const [formData, setFormData] = useState<FormData>({
    schoolName: "",
    Adress: "",
    email: "",
    phone: "",
    ville: "",
    created: Timestamp.now(),
  });
  const [alertMessage, setAlertMessage] = useState<string>("");

  const handelChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showAlert = (mesg: string) => {
    setAlertMessage(mesg);
    setTimeout(() => {
      setAlertMessage("");
    }, 5000); // Remove alert after 5 seconds
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "schools"), formData);
      showAlert('Successfully added');
    } catch (err) {
      showAlert('Something went wrong. Please try again.');
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
    </form>
  );
}

export default AddScholl;
