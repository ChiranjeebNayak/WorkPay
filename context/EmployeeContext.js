// useContext
import { createContext, useContext, useState } from 'react';

// 1. Create Context
const AppContext = createContext();

// 2. Create Provider Component
export const EmployeeProvider = ({ children }) => {
  const [employeeData, setEmployeeData] = useState({});


  return (
    <AppContext.Provider value={{ employeeData, setEmployeeData }}>
      {children}
    </AppContext.Provider>
  );
};

// 3. Custom Hook for using context
export const useContextData = () => useContext(AppContext);
