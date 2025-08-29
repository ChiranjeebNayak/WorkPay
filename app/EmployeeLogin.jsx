import { useState } from 'react';
import {KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'

function EmployeeLogin() {

    const [isEmployee, setIsEmployee] = useState(true);

  return (
 <KeyboardAvoidingView
        behavior="padding"
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        {/* header */}
            <View style={styles.header}>
                <Text style={{color:'#fff', fontSize:24}}>Logo PlaceHolder</Text>
                <Text style={styles.title}>Work Pay</Text>
            </View>
        {/* toggle tab */}
            <View style={styles.toggleContainer}>
                <TouchableOpacity style={isEmployee ? styles.selectedTab : styles.unselectedTab} onPress={() => setIsEmployee(true)}>
                    <Text style={styles.toggleText}>Employee Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={!isEmployee ? styles.selectedTab : styles.unselectedTab} onPress={() => setIsEmployee(false)}>
                    <Text style={styles.toggleText}>Admin</Text>
                </TouchableOpacity>
            </View>

        {/* employee form */}
            {isEmployee && (
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Phone Number:</Text>
                    <TextInput style={styles.input} placeholder="Enter your phone number" placeholderTextColor="#aaa" />
                    <Text style={styles.label}>Password:</Text>
                    <TextInput style={styles.input} placeholder="Enter your password" placeholderTextColor="#aaa" secureTextEntry />
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            )}
        {/*Admin form */}
            {!isEmployee && (
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Email:</Text>
                    <TextInput style={styles.input} placeholder="Enter your email" placeholderTextColor="#aaa" />
                    <Text style={styles.label}>Password:</Text>
                <TextInput style={styles.input} placeholder="Enter your password" placeholderTextColor="#aaa" secureTextEntry />
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
        )}
    </KeyboardAvoidingView>
  )
}

export default EmployeeLogin

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"#111921"
  },
  header:{
    width: '100%',
    gap:20,
    alignItems:'center',
  },
  title:{
    fontSize:40,
    color:'#fff',
    fontWeight:700
  },
  toggleContainer:{
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#222',
    borderRadius:10,
    marginTop: 20,
    height: 50,
  },
  toggleText:{
    color:'#fff',
    fontSize:18,
    fontWeight:600
  },
  selectedTab:{
    height: '100%',
    backgroundColor: '#333',
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  unselectedTab:{
    height: '100%',
    backgroundColor: '#222',
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  formContainer:{
    width: '90%',
    marginTop: 20
  },
  label:{
    color:'#fff',
    fontSize:18,
    marginBottom: 5
  },
  input:{
    backgroundColor: '#222',
    borderRadius: 5,
    padding: 10,
    color: '#fff',
    marginBottom: 15
  },
  button:{
    backgroundColor: '#1172d4',
    borderRadius: 5,
    padding: 12,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText:{
    color: '#fff',
    fontSize: 18
  }

})
