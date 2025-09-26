import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
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
import { url } from '../../../constants/EnvValue';
import { useContextData } from "../../../context/EmployeeContext";
import { getToken } from '../../../services/ApiService';


function EmployeeManagement() {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [employeeToStatusUpdate, setEmployeeToStatusUpdate] = useState(null);
  const [isAdding, setIsAdding] = useState(true);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const {showToast} = useContextData();
  const [officeData,setOfficeData] = useState({});
  
  // Date picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Form state  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email:'',
    baseSalary: '',
    overtimeRate: '',
    joinedDate: '',
    officeId: officeData?.id,
  });

    const fetchOfficeDetails = async () => {
    try {
      const response = await axios.get(`${url}/api/offices/`, {
        headers: {
          authorization: `Bearer ${await getToken()}`
        }
      });

      // Populate form data with fetched data
      const data = response.data;
      setOfficeData(data);
    } catch (error) {
      showToast(error.response.data.error,"Error")
      console.error('Error fetching office details:', error);
    }
  }

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${url}/api/employees/getAll`,{
        headers: {
          authorization: `Bearer ${await getToken()}`
        }
      });
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } catch (error) {
      showToast(error.response.data.error,'Error');
      console.error('Error fetching employees:', error);
    }
  }

  const addEmployee = async () => {
    if (!validateForm()) return;
    try {
      const response = await axios.post(`${url}/api/employees/add`, {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        baseSalary: formData.baseSalary,
        overtimeRate: formData.overtimeRate,
        joinedDate: formData.joinedDate,
        officeId: formData.officeId,
        password: formData.phone
      }, {
        headers: {
          authorization: `Bearer ${await getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Employee added:', response.data.data);
      showToast(response.data.message,"Success")
      setModalVisible(false);
      fetchEmployees();
    } catch (error) {
        showToast(error.response.data.error,"Error")
      console.log("Data",formData.name,formData.phone,formData.email,formData.baseSalary,formData.overtimeRate,formData.joinedDate,formData.officeId);
      console.error('Error adding employee:', error);
    }
  };

  const editEmployee = async () => {
    if (!validateForm()) return;
    try {
      const response = await axios.put(`${url}/api/employees/update/${editingEmployee.id}`, {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        baseSalary: formData.baseSalary,
        overtimeRate: formData.overtimeRate,
        joinedDate: formData.joinedDate,
        officeId: formData.officeId
      }, {
        headers: {
          authorization: `Bearer ${await getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Employee edited:', response.data.data);
       showToast(response.data.message,"Success")
      setModalVisible(false);
      fetchEmployees();
    } catch (error) {
       showToast(error.response.data.error,"Error")
      console.log("Data",formData.name,formData.phone,formData.email,formData.baseSalary,formData.overtimeRate,formData.joinedDate,formData.officeId);
      console.error('Error editing employee:', error);
    }
  }

  const showStatusUpdateConfirmation = (employee) => {
    setEmployeeToStatusUpdate(employee);
    setStatusModalVisible(true);
  };

  const confirmStatusUpdate = async () => {
    if (!employeeToStatusUpdate) return;
    
    try {
      const response = await axios.put(`${url}/api/employees/update-status/${employeeToStatusUpdate.id}`,
      {
        status: employeeToStatusUpdate.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
      }, {
        headers: {
          authorization: `Bearer ${await getToken()}`
        }
      });
      showToast(response.data.message,"Success")
      setStatusModalVisible(false);
      setEmployeeToStatusUpdate(null);
      fetchEmployees();
    } catch (error) {
       showToast(error.response.data.error,"Error")
      console.error('Error Updating employee Status :', error);
    }
  };

  const cancelStatusUpdate = () => {
    setStatusModalVisible(false);
    setEmployeeToStatusUpdate(null);
  };

  const handleEmployeeAddandEdit = (type) => {
    if (type === 'add') {
      addEmployee();
    } else if (type === 'edit') {
      editEmployee();
    }
  }

  // Date picker handlers
  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      setFormData({...formData, joinedDate: formattedDate});
    }
  };

  // Sample data - replace with API call
  useEffect(() => {
    fetchEmployees();
    fetchOfficeDetails();
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
      joinedDate: '',
      officeId: officeData?.id ,
    });
    setEditingEmployee(null);
    setSelectedDate(new Date());
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
      joinedDate: employee.joinedDate || '',
      officeId: employee.officeId,
    });
    
    // Set the selected date for the date picker
    if (employee.joinedDate) {
      setSelectedDate(new Date(employee.joinedDate));
    }
    
    setEditingEmployee(employee);
    setModalVisible(true);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showToast('Please enter employee name','Error');
      return false;
    }
    if (!formData.phone.trim()) {
      showToast( 'Please enter phone number','Error');
      return false;
    }

    if (formData.phone.trim().length !== 10 || !/^\d{10}$/.test(formData.phone.trim())) {
      showToast( 'Please enter valid 10-digit phone number','Error');
      return false;
    }
    if (!formData.baseSalary || isNaN(formData.baseSalary)) {
      showToast( 'Please enter valid base salary','Error');
      return false;
    }
    if (!formData.overtimeRate || isNaN(formData.overtimeRate)) {
      showToast('Error', 'Please enter valid overtime rate','Error');
      return false;
    }
    if (!formData.joinedDate.trim()) {
      showToast('Please select joined date','Error');
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
          </View>
          <View style={{marginLeft: 'auto',borderRadius: 4,backgroundColor: item.status === 'ACTIVE' ? '#4CAF50' : '#F44336',paddingHorizontal: 8,paddingVertical: 2,alignSelf: 'flex-start',}}>
                <Text style={[styles.employeeRole,{color:"#ffffff",fontWeight:"bold"}]}>{item.status}</Text>
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
        
        {/* <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={() => showDeleteConfirmation(item)}
        >
          <Feather name="trash-2" size={16} color="#D0021B" />
          <Text style={[styles.actionText, { color: '#D0021B' }]}>Delete</Text>
        </TouchableOpacity> */}

          {/* Active Inactive button */}
          <TouchableOpacity
            style={[styles.actionButton, item.status === 'ACTIVE' ? styles.deleteButton : {backgroundColor: '#4CAF5015'}]}
            onPress={() => showStatusUpdateConfirmation(item)}
          >
            <Feather name={item.status === 'ACTIVE' ? "pause" : "play"} size={16} color={item.status === 'ACTIVE' ? "#D0021B" : "#4CAF50"} />
            <Text style={[styles.actionText, { color: item.status === 'ACTIVE' ? '#D0021B' : '#4CAF50' }]}>
              {item.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
            </Text>
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
                    maxLength={10}
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
                  <Text style={styles.inputLabel}>Joined Date</Text>
                  <TouchableOpacity 
                    style={styles.datePickerButton} 
                    onPress={showDatePickerModal}
                  >
                    <Text style={[styles.datePickerText, !formData.joinedDate && styles.placeholderText]}>
                      {formData.joinedDate || 'Select joined date'}
                    </Text>
                    <AntDesign name="calendar" size={20} color="#8A9BAE" />
                  </TouchableOpacity>
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

      {/* Custom Delete Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={statusModalVisible}
        onRequestClose={cancelStatusUpdate}
      >
        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModalContent}>
            <View style={styles.deleteIconContainer}>
              <View style={styles.deleteIcon}>
                <Feather name="check-circle" size={32} color="#0dc025ff" />
              </View>
            </View>

            <Text style={styles.deleteTitle}>Update Employee Status</Text>
            <Text style={styles.deleteMessage}>
              Are you sure you want to update the status of {' '}
              <Text style={styles.employeeNameHighlight}>
                {employeeToStatusUpdate?.name}
              </Text>{' '}
              from {employeeToStatusUpdate?.status === 'ACTIVE' ? <Text style={{color: '#0dc025ff',fontWeight: 'bold'}}>
                ACTIVE</Text> : <Text style={{color: '#D0021B',fontWeight: 'bold'}}>INACTIVE</Text>} 
                {` `} to {` `}
                {employeeToStatusUpdate?.status === 'ACTIVE' ? <Text style={{color: '#D0021B',fontWeight: 'bold'}}>INACTIVE</Text> : 
                <Text style={{color: '#0dc025ff',fontWeight: 'bold'}}>ACTIVE</Text>}?
            </Text>

            <View style={styles.deleteModalActions}>
              <TouchableOpacity 
                style={styles.deleteCancelButton} 
                onPress={cancelStatusUpdate}
              >
                <Text style={styles.deleteCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteConfirmButton} 
                onPress={confirmStatusUpdate}
              >
                <Text style={styles.deleteConfirmButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}
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
  
  // Date Picker Styles
  datePickerButton: {
    backgroundColor: '#111a22',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#2A3441',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datePickerText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  placeholderText: {
    color: '#8A9BAE',
  },

  // Custom Delete Modal Styles
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  deleteModalContent: {
    backgroundColor: '#192633',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  deleteIconContainer: {
    marginBottom: 20,
  },
  deleteIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#58d31115',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#58d31130',
  },
  deleteTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  deleteMessage: {
    fontSize: 16,
    color: '#8A9BAE',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  employeeNameHighlight: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  deleteModalActions: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  deleteCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2A3441',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  deleteCancelButtonText: {
    color: '#8A9BAE',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteConfirmButton: {
    flex: 1,
    backgroundColor: '#0dc025ff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#0dc025ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  deleteConfirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
