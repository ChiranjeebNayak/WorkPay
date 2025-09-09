import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContextData } from '../../context/EmployeeContext';
import { getToken } from '../../services/ApiService';
import { formatDay } from "../../utils/TimeUtils";

function Leave() {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLeave, setIsLeave] = useState(true);
  const [holidaysData, setHolidaysData] = useState([]);
  const [isLoadingHolidays, setIsLoadingHolidays] = useState(false);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const currentYear = new Date().getFullYear();
  const {employeeData} = useContextData()

  const fetchHolidays = async () => {
    try {
      setIsLoadingHolidays(true);
      const response = await axios.get(`http://10.0.2.2:5000/api/holidays/getAll`, {
        headers: {
          authorization: `Bearer ${await getToken()}`
        }
      });
      
      // Transform the response to match the frontend format
      
      const transformedHolidays = response.data.map(monthItem => ({
        month: `${monthItem.month} ${currentYear}`,
        holidays: monthItem.holidays.map(holiday => ({
          date: new Date(holiday.date).getDate().toString().padStart(2, "0"),
          name: holiday.description
        }))
      }));
      
      setHolidaysData(transformedHolidays);
    } catch (error) {
      console.error('Error fetching holidays:', error);
      // Keep default empty array if API fails
      setHolidaysData([]);
    } finally {
      setIsLoadingHolidays(false);
    }
  };

  const fetchLeavesHistory = async ()=>{
    try{
       const response = await axios.get(`http://10.0.2.2:5000/api/leaves/employee-leaves?year=${currentYear}`, {
        headers: {
          authorization: `Bearer ${await getToken()}`
        }
      });
      setLeaveHistory(response.data.leaves)
    }catch(error){
       console.error('Error fetching Leaves History:', error);
    }
  }

  useEffect(() => {
    fetchHolidays();
    fetchLeavesHistory();
  }, []);

  const applyLeave = async () => {
    if (!startDate || !endDate || !description.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }
    
  try{
       const response = await axios.post(`http://10.0.2.2:5000/api/leaves/apply`,{
        reason:description,
        startDate:startDate,
        endDate:endDate
       }, {
        headers: {
          authorization: `Bearer ${await getToken()}`,
        }
      });
      if(response.data.message){
    setStartDate('');
    setEndDate('');
    setDescription('');
    setModalVisible(false);
    Alert.alert('Success', 'Leave application submitted successfully');
      }
    }catch(error){
       console.error('Error Applying leave:', error);
    }
    
   
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return '#00E676';
      case 'PENDING': return '#FF9800';
      case 'REJECTED': return '#FF5252';
      default: return '#888';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED': return 'check-circle';
      case 'PENDING': return 'clock-outline';
      case 'REJECTED': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const getTypeColor = (type) => {
    return type === 'PAID' ? '#1e90ff' : '#ff6b35';
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Enhanced Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Leave Management</Text>
          <Text style={styles.headerSubtext}>Manage your time off efficiently</Text>
        </View>

        {/* Enhanced Leaves Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryIconContainer}>
            <MaterialCommunityIcons name="calendar-check" size={32} color="#1e90ff" />
          </View>
          <View style={styles.summaryContent}>
            <View style={styles.summaryStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{employeeData.leaveBalance + leaveHistory.filter((i)=>i.status === "APPROVED" && i.type === "PAID").reduce((acc,i)=>acc+i.totalDays,0)}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{leaveHistory.filter((i)=>i.status === "APPROVED" && i.type === "PAID").reduce((acc,i)=>acc+i.totalDays,0)}</Text>
                <Text style={styles.statLabel}>Used</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{employeeData.leaveBalance}</Text>
                <Text style={styles.statLabel}>Available</Text>
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${((leaveHistory.filter((i)=>i.status === "APPROVED" && i.type === "PAID").reduce((acc,i)=>acc+i.totalDays,0))/(employeeData.leaveBalance + leaveHistory.filter((i)=>i.status === "APPROVED" && i.type === "PAID").reduce((acc,i)=>acc+i.totalDays,0)))*100}%` }]} />
              </View>
              <Text style={styles.progressText}>{((leaveHistory.filter((i)=>i.status === "APPROVED" && i.type === "PAID").reduce((acc,i)=>acc+i.totalDays,0))/(employeeData.leaveBalance + leaveHistory.filter((i)=>i.status === "APPROVED" && i.type === "PAID").reduce((acc,i)=>acc+i.totalDays,0)))*100}% used</Text>
            </View>
          </View>
        </View>

        {/* Enhanced Apply Leave Button */}
        <TouchableOpacity 
          style={styles.applyButton} 
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#fff" />
          <Text style={styles.applyButtonText}>Apply for Leave</Text>
        </TouchableOpacity>

        {/* Enhanced Toggle and Content */}
        <View style={styles.contentContainer}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={isLeave ? styles.selectedTab : styles.unselectedTab}
              onPress={() => setIsLeave(true)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons 
                name="history" 
                size={18} 
                color={isLeave ? '#ffffff' : '#8a9ba8'} 
              />
              <Text style={[styles.toggleText, { color: isLeave ? '#ffffff' : '#8a9ba8' }]}>
                Leave History
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={!isLeave ? styles.selectedTab : styles.unselectedTab}
              onPress={() => setIsLeave(false)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons 
                name="calendar-star" 
                size={18} 
                color={!isLeave ? '#ffffff' : '#8a9ba8'} 
              />
              <Text style={[styles.toggleText, { color: !isLeave ? '#ffffff' : '#8a9ba8' }]}>
                Holidays
              </Text>
            </TouchableOpacity>
          </View>

          {isLeave ? (
            <View style={styles.historyContainer}>
              {leaveHistory.length > 0 ?
              leaveHistory?.map((item) => (
                <View key={item.id} style={styles.leaveCard}>
                  <View style={styles.leaveCardHeader}>
                    <View style={styles.leaveCardLeft}>
                      <MaterialCommunityIcons 
                        name="calendar-outline" 
                        size={20} 
                        color="#1e90ff" 
                      />
                      <View>
                        {item.fromDate === item.toDate ? (
                          <Text style={styles.leaveDateText}>{item?.fromDate}</Text>
                        ) : (
                          <Text style={styles.leaveDateText}>
                            {formatDay(item.fromDate)} - {formatDay(item.toDate)}
                          </Text>
                        )}
                        <Text style={styles.leaveDaysText}>
                          {item.totalDays} day(s)
                        </Text>
                      </View>
                    </View>
                    <View style={styles.leaveCardRight}>
                      <View style={[styles.leaveTypeBadge, { backgroundColor: getTypeColor(item.type) }]}>
                        <Text style={styles.leaveTypeText}>{item.type}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <Text style={styles.leaveDescription}>{item.reason}</Text>
                  
                  <View style={styles.leaveCardFooter}>
                    <View style={styles.statusContainer}>
                      <MaterialCommunityIcons 
                        name={getStatusIcon(item.status)} 
                        size={16} 
                        color={getStatusColor(item.status)} 
                      />
                      <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            :
            (<View style={styles.emptyContainer}>
                  <MaterialCommunityIcons name="calendar-remove" size={48} color="#8a9ba8" />
                  <Text style={styles.emptyText}>No Leaves available</Text>
                </View>)
            }
            </View>
          ) : (
            <View style={styles.holidaysContainer}>
              {isLoadingHolidays ? (
                <View style={styles.loadingContainer}>
                  <MaterialCommunityIcons name="loading" size={32} color="#1e90ff" />
                  <Text style={styles.loadingText}>Loading holidays...</Text>
                </View>
              ) : holidaysData.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <MaterialCommunityIcons name="calendar-remove" size={48} color="#8a9ba8" />
                  <Text style={styles.emptyText}>No holidays available</Text>
                </View>
              ) : (
                holidaysData.map((monthItem, index) => (
                  <View key={index} style={styles.holidayMonthCard}>
                    <Text style={styles.holidayMonthTitle}>{monthItem.month}</Text>
                    <View style={styles.holidayGrid}>
                      {monthItem.holidays.map((holiday, idx) => (
                        <View key={idx} style={styles.holidayCard}>
                          <View style={styles.holidayDateContainer}>
                            <Text style={styles.holidayDate}>{holiday.date}</Text>
                          </View>
                          <Text style={styles.holidayName}>{holiday.name}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Enhanced Apply Leave Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Apply for Leave</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons name="close" size={24} color="#8a9ba8" />
              </TouchableOpacity>
            </View>
            
            {/* Start Date Picker */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>From Date</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowStartPicker(true)}
              >
                <MaterialCommunityIcons name="calendar-outline" size={20} color="#8a9ba8" />
                <Text style={[styles.dateText, { color: startDate ? '#fff' : '#8a9ba8' }]}>
                  {startDate || 'Select start date'}
                </Text>
              </TouchableOpacity>
            </View>

            {showStartPicker && (
              <DateTimePicker
                value={startDate ? new Date(startDate) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowStartPicker(false);
                  if (selectedDate) setStartDate(selectedDate.toISOString().slice(0, 10));
                }}
                minimumDate={new Date()}
                maximumDate={endDate ? new Date(endDate) : undefined}
              />
            )}

            {/* End Date Picker */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>To Date</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowEndPicker(true)}
              >
                <MaterialCommunityIcons name="calendar-outline" size={20} color="#8a9ba8" />
                <Text style={[styles.dateText, { color: endDate ? '#fff' : '#8a9ba8' }]}>
                  {endDate || 'Select end date'}
                </Text>
              </TouchableOpacity>
            </View>

            {showEndPicker && (
              <DateTimePicker
                value={endDate ? new Date(endDate) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowEndPicker(false);
                  if (selectedDate) setEndDate(selectedDate.toISOString().slice(0, 10));
                }}
                minimumDate={startDate ? new Date(startDate) : new Date()}
              />
            )}

            {/* Description Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Reason for Leave</Text>
              <TextInput
                style={styles.descriptionInput}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter the reason for your leave request..."
                placeholderTextColor="#8a9ba8"
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => {
                  setStartDate('');
                  setEndDate('');
                  setDescription('');
                  setModalVisible(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={applyLeave}
              >
                <MaterialCommunityIcons name="send-outline" size={18} color="#fff" />
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default Leave;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#0f1419',
  },
  container: {
    padding: 20,
    paddingBottom: 30,
  },
  headerContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  headerSubtext: {
    fontSize: 14,
    color: '#8a9ba8',
    fontWeight: '400',
  },
  summaryContainer: {
    backgroundColor: '#192633',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(30, 144, 255, 0.2)',
  },
  summaryIconContainer: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  summaryContent: {
    gap: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#8a9ba8',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(138, 155, 168, 0.3)',
  },
  progressBarContainer: {
    gap: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1e90ff',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#8a9ba8',
    textAlign: 'center',
    fontWeight: '500',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e90ff',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 24,
    gap: 8,
    shadowColor: '#1e90ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  applyButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  contentContainer: {
    flex: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#192633',
    borderRadius: 16,
    padding: 6,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2a3441',
  },
  selectedTab: {
    flex: 1,
    backgroundColor: '#1e90ff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#1e90ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  unselectedTab: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  historyContainer: {
    gap: 12,
  },
  leaveCard: {
    backgroundColor: '#192633',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2a3441',
  },
  leaveCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  leaveCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  leaveCardRight: {
    alignItems: 'flex-end',
  },
  leaveDateText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  leaveDaysText: {
    color: '#8a9ba8',
    fontSize: 12,
    fontWeight: '500',
  },
  leaveDescription: {
    color: '#b8c5d1',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  leaveCardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  leaveTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
  },
  leaveTypeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  holidaysContainer: {
    gap: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    color: '#8a9ba8',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    color: '#8a9ba8',
    fontSize: 16,
    fontWeight: '500',
  },
  holidayMonthCard: {
    backgroundColor: '#1a2332',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2a3441',
  },
  holidayMonthTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  holidayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  holidayCard: {
    width: '48%',
    backgroundColor: 'rgba(30, 144, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(30, 144, 255, 0.2)',
  },
  holidayDateContainer: {
    backgroundColor: '#1e90ff',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  holidayDate: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  holidayName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(15, 20, 25, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1a2332',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2a3441',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f1419',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#2a3441',
    gap: 12,
  },
  dateText: {
    fontSize: 15,
    flex: 1,
  },
  descriptionInput: {
    backgroundColor: '#0f1419',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#2a3441',
    color: '#ffffff',
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#8a9ba8',
    fontSize: 15,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#1e90ff',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#1e90ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});