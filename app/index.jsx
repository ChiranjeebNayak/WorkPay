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
  Animated,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

function index() {
  const [isEmployee, setIsEmployee] = useState(true);
  const [employeeLogin, setEmployeeLogin] = useState({ phone: '', password: '' });
  const [adminLogin, setAdminLogin] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
    >
      {/* Background gradient effect */}
      <View style={styles.backgroundGradient} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="briefcase-variant" size={40} color="#4da6ff" />
        </View>
        <Text style={styles.title}>Work Pay</Text>
        <Text style={styles.subtitle}>Manage your salary with ease</Text>
      </View>

      {/* Main Card */}
      <View style={styles.mainCard}>
        {/* Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.tab, isEmployee && styles.selectedTab]}
            onPress={() => setIsEmployee(true)}
          >
            <MaterialCommunityIcons 
              name="account" 
              size={20} 
              color={isEmployee ? "#4da6ff" : "#666"} 
            />
            <Text style={[styles.toggleText, isEmployee && styles.selectedToggleText]}>
              Employee
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, !isEmployee && styles.selectedTab]}
            onPress={() => setIsEmployee(false)}
          >
            <MaterialCommunityIcons 
              name="shield-account" 
              size={20} 
              color={!isEmployee ? "#4da6ff" : "#666"} 
            />
            <Text style={[styles.toggleText, !isEmployee && styles.selectedToggleText]}>
              Admin
            </Text>
          </TouchableOpacity>
        </View>

        {/* Forms */}
        <View style={styles.formContainer}>
          {isEmployee ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons name="phone" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    value={employeeLogin.phone}
                    onChangeText={(text) => setEmployeeLogin({ ...employeeLogin, phone: text })}
                    style={styles.input}
                    placeholder="Enter your phone number"
                    placeholderTextColor="#666"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    value={employeeLogin.password}
                    onChangeText={(text) => setEmployeeLogin({ ...employeeLogin, password: text })}
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#666"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <MaterialCommunityIcons 
                      name={showPassword ? "eye-off" : "eye"} 
                      size={20} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => router.push('/(employee)/(home)/Home')}
                style={styles.loginButton}
              >
                <MaterialCommunityIcons name="login" size={20} color="#fff" />
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons name="email" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    value={adminLogin.email}
                    onChangeText={(text) => setAdminLogin({ ...adminLogin, email: text })}
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#666"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    value={adminLogin.password}
                    onChangeText={(text) => setAdminLogin({ ...adminLogin, password: text })}
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#666"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <MaterialCommunityIcons 
                      name={showPassword ? "eye-off" : "eye"} 
                      size={20} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity 
                onPress={() => router.push('/(admin)/Dashboard')} 
                style={styles.loginButton}
              >
                <MaterialCommunityIcons name="shield-check" size={20} color="#fff" />
                <Text style={styles.buttonText}>Admin Access</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity 
                onPress={() => router.push({ 
                pathname: '/ForgotPassword', 
                params: { isEmployee: isEmployee } 
              })}
 style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Secure • Reliable • Easy</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1419',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(77, 166, 255, 0.05)',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    zIndex: 1,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(77, 166, 255, 0.1)',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(77, 166, 255, 0.3)',
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  mainCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1a2128',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  toggleContainer: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#0f1419',
    borderRadius: 12,
    padding: 4,
    marginBottom: 30,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  selectedTab: {
    backgroundColor: '#1a2128',
    shadowColor: '#4da6ff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  toggleText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedToggleText: {
    color: '#4da6ff',
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f1419',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    minHeight: 50,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 12,
  },
  eyeIcon: {
    padding: 4,
  },
  loginButton: {
    backgroundColor: '#4da6ff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#4da6ff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 20,
  },
  forgotPasswordText: {
    color: '#4da6ff',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
});