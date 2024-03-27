import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import Papa from "papaparse";

interface FormData {
  reference: string;
  intitule: string;
  provinciale: string;
  created: any; // Update the type as per your Timestamp type from Firebase
}

const AddMarches: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    reference: "",
    intitule: "",
    provinciale: "",
    created: Timestamp.now(),
  });
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadError(""); // Clear any previous errors
    if (!file) {
      setUploadError("Please select a CSV file to upload.");
      return;
    }
    try {
      // Parse CSV data (replace with your Firestore collection reference)
      const csvData = await new Promise<string[][]>((resolve, reject) => {
        Papa.parse(file, {
          complete: (results) => resolve(results.data as string[][]),
          error: (error) => reject(error),
        });
      });

      const keys = csvData[0];
      const values = csvData.slice(1);
      const result = values.map((row) => {
        const obj: any = {};
        keys.forEach((key, index) => {
          obj[key] = row[index];
        });
        return obj;
      });

      for (let i = 0; i > result.length; i++) {
        await addToDB({ ...result[i] });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("An error occurred during upload. Please try again.");
    }
  };

  const handelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    name !== "" &&
      value !== "" &&
      setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage("");
    }, 5000); // Remove alert after 5 seconds
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "marches"), formData);
      showAlert("Added successfully");
    } catch (err) {
      showAlert("Something went wrong. Please try again.");
      console.log(err);
    }
  };

  const addToDB = async (data: FormData) => {
    try {
      await addDoc(collection(db, "marches"), data);
      showAlert("Added successfully");
    } catch (err) {
      showAlert("Something went wrong. Please try again.");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="AddForm">
      {alertMessage && <div className="alert">{alertMessage}</div>}
      <div className="d-flext-block">
        <label>Reference</label>
        <input name="reference" onChange={handelChange} />
      </div>
      <div className="d-flext-block">
        <label>intitule</label>
        <input name="intitule" onChange={handelChange} />
      </div>
      <div className="d-flext-block">
        <label>provinciale</label>
        <input name="provinciale" onChange={handelChange} />
      </div>
      <div>
        <input type="file" accept=".csv" onChange={handleUpload} />
        {uploadError && <p style={{ color: "red" }}>{uploadError}</p>}
      </div>
      <button type="submit">Add</button>
    </form>
  );
};

export default AddMarches;
