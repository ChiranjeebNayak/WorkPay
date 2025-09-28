// useContext
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
// 1. Create Context
const AppContext = createContext();

// 2. Create Provider Component
export const EmployeeProvider = ({ children }) => {
  const [employeeData, setEmployeeData] = useState({});
    const [toast, setToast] = useState({ visible: false, message: '',type:'' });
 const opacity = useRef(new Animated.Value(0)).current; 

  const showToast = useCallback((message,type) => {
    setToast({ visible: true, message:message,type:type });

    // fade in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // auto close after 3s
    setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setToast({ visible: false, message: '',type:'' }));
    }, 3000);
  }, []);

  return (
    <AppContext.Provider value={{ employeeData, setEmployeeData ,showToast}}>
      {children}
       {toast.visible && (
        <Animated.View style={[styles.toast,{opacity,backgroundColor:toast.type==="Success"?"#2ecc71":toast.type==="Warning"?"#f39c12":"#e74c3c"}]}>
          {toast.type === "Success" ?
          <AntDesign name="checkcircleo" size={24} color="white" />:
          toast.type === "Warning" ?
          <AntDesign name="warning" size={24} color="white" />:
          <MaterialIcons name="error-outline" size={24} color="white" />
          }
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      )}
    </AppContext.Provider>
  );
};

// 3. Custom Hook for using context
export const useContextData = () => useContext(AppContext);

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: '#4da6ff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 6,
    width:"90%",
    flexDirection:"row",
    alignItems:"flex-start",
    gap:20
  },
  toastText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    width:"90%"
  },
});
