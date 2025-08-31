import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

function index() {
  const [isEmployee, setIsEmployee] = useState(true);
  const [employeeLogin, setEmployeeLogin] = useState({ phone: '', password: '' });
  const [adminLogin, setAdminLogin] = useState({ email: '', password: '' });
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Logo Placeholder</Text>
        <Text style={styles.title}>Work Pay</Text>
      </View>

      {/* Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={isEmployee ? styles.selectedTab : styles.unselectedTab}
          onPress={() => setIsEmployee(true)}
        >
          <Text style={styles.toggleText}>Employee Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={!isEmployee ? styles.selectedTab : styles.unselectedTab}
          onPress={() => setIsEmployee(false)}
        >
          <Text style={styles.toggleText}>Admin</Text>
        </TouchableOpacity>
      </View>

      {/* Forms */}
      <View style={styles.formContainer}>
        {isEmployee ? (
          <>
            <Text style={styles.label}>Phone Number:</Text>
            <TextInput
              value={employeeLogin.phone}
              onChangeText={(text) => setEmployeeLogin({ ...employeeLogin, phone: text })}
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor="#aaa"
              keyboardType="phone-pad"
            />
            <Text style={styles.label}>Password:</Text>
            <TextInput
              value={employeeLogin.password}
              onChangeText={(text) => setEmployeeLogin({ ...employeeLogin, password: text })}
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#aaa"
              secureTextEntry
            />
            <TouchableOpacity
              onPress={() => router.push('/(employee)/(home)/Home')}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              value={adminLogin.email}
              onChangeText={(text) => setAdminLogin({ ...adminLogin, email: text })}
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
            />
            <Text style={styles.label}>Password:</Text>
            <TextInput
              value={adminLogin.password}
              onChangeText={(text) => setAdminLogin({ ...adminLogin, password: text })}
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#aaa"
              secureTextEntry
            />
            <TouchableOpacity onPress={() => router.push('/(admin)/Dashboard')} style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111a22',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 5,
  },
  title: {
    fontSize: 36,
    color: '#fff',
    fontWeight: '700',
  },
  toggleContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#222',
    borderRadius: 10,
    height: 50,
    marginBottom: 25,
    overflow: 'hidden',
  },
  selectedTab: {
    flex: 1,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unselectedTab: {
    flex: 1,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  formContainer: {
    width: '100%',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#1172d4',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
