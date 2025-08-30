import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ScrollView, 
  Modal, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';


const holidaysData = [
  {
    month: "August 2025",
    holidays: [
      { date: "09", name: "Independence Day" },
      { date: "15", name: "Labor Day" },
    ],
  },
  {
    month: "September 2025",
    holidays: [
      { date: "05", name: "Teacher's Day" },
      { date: "10", name: "Ganesh Chaturthi" },
      { date: "28", name: "Community Festival" },
    ],
  },
  {
    month: "October 2025",
    holidays: [
      { date: "02", name: "Gandhi Jayanti" },
      { date: "20", name: "Dussehra" },
      { date: "31", name: "Halloween" },
    ],
  },
];


function Leave() {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLeave, setIsLeave] = useState(true);
  const [leaveHistory, setLeaveHistory] = useState([
    { id: '1', startDate: '2025-01-15', endDate: '2025-01-15', type: 'Paid', status: 'Approved' },
    { id: '2', startDate: '2025-03-22', endDate: '2025-03-23', type: 'Paid', status: 'Approved' },
    { id: '3', startDate: '2025-06-10', endDate: '2025-06-11', type: 'Unpaid', status: 'Pending' },
    { id: '4', startDate: '2025-07-05', endDate: '2025-07-06', type: 'Paid', status: 'Rejected' },
    { id: '5', startDate: '2025-08-18', endDate: '2025-08-19', type: 'Paid', status: 'Approved' },
    { id: '6', startDate: '2025-09-10', endDate: '2025-09-11', type: 'Unpaid', status: 'Pending' },
    { id: '7', startDate: '2025-10-12', endDate: '2025-10-13', type: 'Paid', status: 'Approved' },
    { id: '8', startDate: '2025-11-15', endDate: '2025-11-15', type: 'Unpaid', status: 'Pending' },
  ]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const applyLeave = () => {
    if (!startDate || !endDate) return;
    const newLeave = {
      id: Math.random().toString(),
      startDate: startDate,
      endDate: endDate,
      type: leaveHistory.length >= 10 ? 'Unpaid' : 'Paid',
      status: 'Pending'
    };
    setLeaveHistory([newLeave, ...leaveHistory]);
    setStartDate('');
    setEndDate('');
    setModalVisible(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return '#4CAF50';
      case 'Pending': return '#FF9800';
      case 'Rejected': return '#F44336';
      default: return '#888';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return 'check-circle';
      case 'Pending': return 'clock-outline';
      case 'Rejected': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const getTypeColor = (type) => {
    return type === 'Paid' ? '#1e90ff' : '#ff6b35';
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Header */}
        <Text style={styles.headerText}>Leave Management</Text>

        {/* Leaves Summary */}
        <View style={styles.summaryContainer}>
          <MaterialCommunityIcons name="calendar-check" size={50} color="#1e90ff" />
          {/* summary details */}
          <View style={styles.summaryDetails}>
            <View style={{alignItems:'center',gap:10}}>
              <Text style={styles.summaryHeader}>10</Text>
              <Text style={{color: '#fff'}}>Total Leaves</Text>
            </View>
            <View style={{alignItems:'center',gap:10}}>
              <Text style={styles.summaryHeader}>5</Text>
              <Text style={{color: '#fff'}}>Used</Text>
            </View>
            <View style={{alignItems:'center',gap:10}}>
              <Text style={styles.summaryHeader}>5</Text>
              <Text style={{color: '#fff'}}>Remaining</Text>
            </View>
          </View>
          <View style={{width:'100%',height:10,borderRadius:10,backgroundColor:'#fff',overflow:'hidden'}}>
            <View style={{width:'100%',height:'100%',backgroundColor:'#1e90ff',borderRadius:10,transform:[{translateX:`${((5/10)*100)-100}%`}]}}></View>
          </View>
        </View>

        {/* Apply Leave Button */}
        <TouchableOpacity 
          style={styles.applyButton} 
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.applyButtonText}>Apply Leave</Text>
        </TouchableOpacity>

        {/* Leave History */}
        <View style={styles.historyContainer}>

            {/* Toggle */}  
            <View style={styles.toggleContainer}>
                  <TouchableOpacity
                    style={isLeave ? styles.selectedTab : styles.unselectedTab}
                    onPress={() => setIsLeave(true)}
                  >
                    <MaterialCommunityIcons 
                      name="calendar-clock" 
                      size={20} 
                      color={isLeave ? '#ffffff' : '#ccc'} 
                    />
                    <Text style={[styles.toggleText, { color: isLeave ? '#ffffff' : '#ccc' }]}>
                      Leave History
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={!isLeave ? styles.selectedTab : styles.unselectedTab}
                    onPress={() => setIsLeave(false)}
                  >
                    <MaterialCommunityIcons 
                      name="calendar-star" 
                      size={20} 
                      color={!isLeave ? '#ffffff' : '#ccc'} 
                    />
                    <Text style={[styles.toggleText, { color: !isLeave ? '#ffffff' : '#ccc' }]}>
                      Holidays
                    </Text>
                  </TouchableOpacity>
             </View>

          {/* leave container */}
        {isLeave ? <View style={{width:'100%'}}>
              {/* <Text style={styles.historyTitle}>Leave History</Text> */}
                        {/* <View style={{flexDirection:'row',justifyContent:'space-between',padding:15,marginBottom:10,backgroundColor:'#1e1e2a',borderRadius:10}}>
                          <Text style={{color:'#fff'}}>Date</Text>
                          <Text style={{color:'#fff'}}>Type</Text>
                          <Text style={{color:'#fff'}}>Status</Text>
                        </View> */}
                        {leaveHistory.map((item)=>(
                          <View key={item.id} style={styles.historyItem}>
                            <View style={styles.leaveLeftSection}>
                              <MaterialCommunityIcons 
                                name="calendar-outline" 
                                size={24} 
                                color="#1e90ff" 
                                style={styles.leaveIcon}
                              />
                              <View style={styles.leaveDateContainer}>
                                {item.startDate === item.endDate ? (
                                  <Text style={styles.historyDate}>Leave On: {item.startDate}</Text>
                                ) : (
                                  <View style={{gap:4}}>
                                    <Text style={styles.historyDate}>From: {item.startDate}</Text>
                                    <Text style={styles.historyDate}>To: {item.endDate}</Text>
                                  </View>
                                )}
                              </View>
                            </View>
                            
                            <View style={styles.leaveRightSection}>
                              <View style={[styles.leaveTypeBadge, { backgroundColor: getTypeColor(item.type) }]}>
                                <Text style={styles.leaveTypeText}>{item.type}</Text>
                              </View>
                              <View style={styles.leaveStatusContainer}>
                                <MaterialCommunityIcons 
                                  name={getStatusIcon(item.status)} 
                                  size={18} 
                                  color={getStatusColor(item.status)} 
                                />
                                <Text style={[styles.historyStatus, { color: getStatusColor(item.status) }]}>
                                  {item.status}
                                </Text>
                              </View>
                            </View>
                          </View>
                        ))}
          </View> :


          <View style={{width:'100%'}}>
                      {/* holidays container */}
            {/* <Text style={styles.historyTitle}>Holidays</Text> */}
            <View style={{width:'100%',gap:15}}>
                      {holidaysData.map((monthItem, index) => (
                          <View key={index} style={styles.holidayMonth}>
                            <Text style={styles.holidayMonthText}>{monthItem.month}</Text>
                            <View style={styles.holidayList}>
                              {monthItem.holidays.map((holiday, idx) => (
                                <View key={idx} style={styles.holidayItem}>
                                  <Text style={styles.holidayDate}>{holiday.date}</Text>
                                  <Text style={styles.holidayName}>{holiday.name}</Text>
                                </View>
                              ))}
                            </View>
                          </View>
                       ))}
            </View>
                        
          </View>}
         
        </View>

      </ScrollView>

      {/* Apply Leave Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Apply Leave</Text>
            
            {/* Start Date Picker */}
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowStartPicker(true)}
            >
              <Text style={{ color: startDate ? '#fff' : '#888' }}>
                {startDate ? startDate : 'Start Date (YYYY-MM-DD)'}
              </Text>
            </TouchableOpacity>
         {showStartPicker && (
                <DateTimePicker
                    value={startDate ? new Date(startDate) : new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                    setShowStartPicker(false);
                    if (selectedDate) setStartDate(selectedDate.toISOString().slice(0, 10));
                    }}
                    minimumDate={new Date()} // <-- Prevents selecting before today
                    maximumDate={endDate ? new Date(endDate) : undefined}
                />
                )}
            {/* End Date Picker */}
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowEndPicker(true)}
            >
              <Text style={{ color: endDate ? '#fff' : '#888' }}>
                {endDate ? endDate : 'End Date (YYYY-MM-DD)'}
              </Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={endDate ? new Date(endDate) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowEndPicker(false);
                  if (selectedDate) setEndDate(selectedDate.toISOString().slice(0, 10));
                }}
                minimumDate={startDate ? new Date(startDate) : undefined}
              />
            )}

            <TouchableOpacity style={styles.modalButton} onPress={applyLeave}>
              <Text style={styles.modalButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, { backgroundColor: '#ff4d6d', marginTop: 10 }]} 
              onPress={() => { setStartDate(null); setEndDate(null); setModalVisible(false); }}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  )
}

export default Leave;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#111a22',
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  summaryContainer: {
    width: '95%',
    padding: 20,
    backgroundColor: '#1e262f',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    gap: 20
  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  },
  applyButton: {
    width: '95%',
    padding: 15,
    backgroundColor: '#1e90ff',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  historyContainer: {
    width: '95%',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center'
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    marginBottom: 12,
    backgroundColor: '#2a323d',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3a424d',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leaveLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  leaveIcon: {
    marginRight: 12,
    opacity: 0.8,
  },
  leaveDateContainer: {
    flex: 1,
  },
  leaveRightSection: {
    alignItems: 'flex-end',
    gap: 8,
  },
  leaveTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  leaveTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  leaveStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  historyDate: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 18,
  },
  historyType: {
    color: '#1e90ff',
    fontWeight: 'bold'
  },
  historyStatus: {
    fontWeight: '600',
    fontSize: 13,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: '85%',
    padding: 20,
    backgroundColor: '#1e262f',
    borderRadius: 10,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20
  },
  input: {
    width: '100%',
    padding: 10,
    backgroundColor: '#111a22',
    color: '#fff',
    borderRadius: 8,
    marginBottom: 20
  },
  modalButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#1e90ff',
    borderRadius: 10,
    alignItems: 'center'
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  summaryHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  summaryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  toggleContainer: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#233648',
    borderRadius: 12,
    padding: 4,
    marginBottom: 25,
    gap: 4,
  },
  selectedTab: {
    flex: 1,
    backgroundColor: '#4da6ff',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: "#4da6ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  unselectedTab: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  holidayMonth:{
    gap:10,
    paddingHorizontal:10,
  },
  holidayList: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  holidayItem:{
    width: '48%',
    padding: 10,
    backgroundColor: '#2a323d',
    borderRadius: 8,
    alignItems: 'center',
    gap: 5
  },
  holidayMonthText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  holidayDate: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  holidayName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});