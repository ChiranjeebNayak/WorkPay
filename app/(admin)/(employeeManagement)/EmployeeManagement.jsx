import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getToken } from '../../../services/ApiService';

function EmployeeManagement() {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(true);
  const [editingEmployee, setEditingEmployee] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email:'',
    phone:'',
    baseSalary: '',
    overtimeRate: '',
    officeId: 1
  });

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:5000/api/employees/getAll',{
        headers: {
          authorization: `Bearer ${await getToken()}`
        }
      });
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  }

  const addEmployee = async () => {
    if (!validateForm()) return;
    try {
      const response = await axios.post('http://10.0.2.2:5000/api/employees/add', {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        baseSalary: formData.baseSalary,
        overtimeRate: formData.overtimeRate,
        officeId: formData.officeId,
        password: "welcome123"
      }, {
        headers: {
          authorization: `Bearer ${await getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Employee added:', response.data.data);
      setModalVisible(false);
      fetchEmployees();
    } catch (error) {
      console.log("Data",formData.name,formData.phone,formData.email,formData.baseSalary,formData.overtimeRate,formData.officeId);
      console.error('Error adding employee:', error);
    }
  };


  const editEmployee = async () => {
    if (!validateForm()) return;
    try {
      const response = await axios.put(`http://10.0.2.2:5000/api/employees/update/${editingEmployee.id}`, {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        baseSalary: formData.baseSalary,
        overtimeRate: formData.overtimeRate,
        officeId: formData.officeId
      }, {
        headers: {
          authorization: `Bearer ${await getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Employee edited:', response.data.data);
      setModalVisible(false);
      fetchEmployees();
    } catch (error) {
      console.log("Data",formData.name,formData.phone,formData.email,formData.baseSalary,formData.overtimeRate,formData.officeId);
      console.error('Error editing employee:', error);
    }
  }

  const deleteEmployee = async (employee) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete ${employee.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
            try {
              const response = await axios.delete(`http://10.0.2.2:5000/api/employees/delete/${employee.id}`, {
                headers: {
                  authorization: `Bearer ${await getToken()}`
                }
              });
              console.log('Employee deleted:', response.data.message);
              fetchEmployees();
            } catch (error) {
              console.error('Error deleting employee:', error);
            }
          }
        }
      ]
    );
  }

  const handleEmployeeAddandEdit = (type) => {
    if (type === 'add') {
      addEmployee();
    } else if (type === 'edit') {
      editEmployee();
    }
  }

  // Sample data - replace with API call
  useEffect(() => {
    fetchEmployees();
  }, []);


  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.phone.includes(searchQuery)
      );
      setFilteredEmployees(filtered);
    }
  }, [searchQuery, employees]);

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      baseSalary: '',
      overtimeRate: '',
      officeId: 1,
    });
    setEditingEmployee(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (employee) => {
    setFormData({
      name: employee.name,
      phone: employee.phone,
      email: employee.email,
      baseSalary: employee.baseSalary.toString(),
      overtimeRate: employee.overtimeRate.toString(),
      officeId: employee.officeId,
    });
    setEditingEmployee(employee);
    setModalVisible(true);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter employee name');
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Error', 'Please enter phone number');
      return false;
    }
    if (!formData.baseSalary || isNaN(formData.baseSalary)) {
      Alert.alert('Error', 'Please enter valid base salary');
      return false;
    }
    if (!formData.overtimeRate || isNaN(formData.overtimeRate)) {
      Alert.alert('Error', 'Please enter valid overtime rate');
      return false;
    }
    return true;
  };



  const renderEmployeeCard = ({ item }) => (
    <View style={styles.employeeCard}>
      <View style={styles.cardContent}>
        <View style={styles.employeeInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.employeeDetails}>
            <Text style={styles.employeeName}>{item.name}</Text>
            <Text style={styles.employeePhone}>{item.phone}</Text>
            {/* <Text style={styles.employeeRole}>{item.role}</Text> */}
          </View>
        </View>
        
        <View style={styles.salaryInfo}>
          <Text style={styles.salaryLabel}>Base Salary</Text>
          <Text style={styles.salaryAmount}>₹{item.baseSalary}</Text>
          <Text style={styles.overtimeRate}>OT: ₹{item.overtimeRate}/hr</Text>
        </View>
      </View>
      
      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.viewButton]} 
          onPress={() => router.push(
           { pathname:`/EmployeeDetails`,
             params: { id: item.id } 
             
            })}
        >
          <Feather name="eye" size={16} color="#4A90E2" />
          <Text style={[styles.actionText, { color: '#4A90E2' }]}>View</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]} 
          onPress={() => openEditModal(item)}
        >
          <Feather name="edit-2" size={16} color="#F5A623" />
          <Text style={[styles.actionText, { color: '#F5A623' }]}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={() => deleteEmployee(item)}
        >
          <Feather name="trash-2" size={16} color="#D0021B" />
          <Text style={[styles.actionText, { color: '#D0021B' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" translucent={false} backgroundColor="#192633" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Employee Management</Text>
        </View>
        <TouchableOpacity onPress={openAddModal} style={styles.addButton}>
          <AntDesign name="plus" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Feather name="search" size={20} color="#8A9BAE" style={styles.searchIcon} />
          <TextInput 
            placeholder="Search employees..." 
            placeholderTextColor="#8A9BAE" 
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Employee List */}
      <View style={styles.listContainer}>
        <FlatList
          data={filteredEmployees}
          renderItem={renderEmployeeCard}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* Add/Edit Employee Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <AntDesign name="close" size={24} color="#8A9BAE" />
                </TouchableOpacity>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(text) => setFormData({...formData, name: text})}
                    placeholder="Enter full name"
                    placeholderTextColor="#8A9BAE"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.phone}
                    onChangeText={(text) => setFormData({...formData, phone: text})}
                    placeholder="+91 9876543210"
                    placeholderTextColor="#8A9BAE"
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(text) => setFormData({...formData, email: text})}
                    placeholder="Enter email"
                    placeholderTextColor="#8A9BAE"
                    keyboardType="email-address"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Base Salary (₹)</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.baseSalary}
                    onChangeText={(text) => setFormData({...formData, baseSalary: text})}
                    placeholder="35000"
                    placeholderTextColor="#8A9BAE"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Overtime Rate (₹/hour)</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.overtimeRate}
                    onChangeText={(text) => setFormData({...formData, overtimeRate: text})}
                    placeholder="250"
                    placeholderTextColor="#8A9BAE"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={()=>{
                  handleEmployeeAddandEdit(editingEmployee ? 'edit' : 'add');
                }}>
                  <Text style={styles.saveButtonText}>
                    {editingEmployee ? 'Update' : 'Add'} Employee
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default EmployeeManagement

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111a22',
  },
  header: {
    padding: 16,
    backgroundColor: '#192633',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#192633',
    borderBottomWidth: 1,
    borderBottomColor: '#2A3441',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111a22',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  employeeCard: {
    backgroundColor: '#192633',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    marginBottom: 12,
  },
  employeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  employeeDetails: {
    flex: 1,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  employeePhone: {
    fontSize: 14,
    color: '#8A9BAE',
    marginBottom: 2,
  },
  employeeRole: {
    fontSize: 12,
    color: '#4A90E2',
    backgroundColor: '#4A90E215',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  salaryInfo: {
    backgroundColor: '#111a22',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  salaryLabel: {
    fontSize: 12,
    color: '#8A9BAE',
  },
  salaryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  overtimeRate: {
    fontSize: 16,
    color: '#8A9BAE',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 4,
  },
  viewButton: {
    backgroundColor: '#4A90E215',
  },
  editButton: {
    backgroundColor: '#F5A62315',
  },
  deleteButton: {
    backgroundColor: '#D0021B15',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#192633',
    borderRadius: 12,
    width: '100%',
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2A3441',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  formContainer: {
    padding: 20,
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#111a22',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  roleOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  roleOptionSelected: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  roleText: {
    color: '#8A9BAE',
    fontSize: 14,
    fontWeight: '500',
  },
  roleTextSelected: {
    color: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A3441',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#8A9BAE',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});