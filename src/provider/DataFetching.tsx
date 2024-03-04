// context.js
import React, { createContext, useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({ schools: [], matirs: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch data from Firebase
      try {
        const schools = await getSchools();
        const matirs = await getMatirs();
        setData({ schools, matirs });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ data, isLoading }}>
      {children}
    </DataContext.Provider>
  );
};
