// useContext
import { createContext, useContext, useState } from 'react';
// 1. Create Context
const OfficeContext = createContext();

// 2. Create Provider Component
export const OfficeProvider = ({ children }) => {
  const [officeData, setOfficeData] = useState([]);


  

  return (
    <OfficeContext.Provider value={{ officeData, setOfficeData }}>
      {children}
    </OfficeContext.Provider>
  );
};

// 3. Custom Hook for using context
export const useOfficeContextData = () => useContext(OfficeContext);

