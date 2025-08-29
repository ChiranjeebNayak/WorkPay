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

function Leave() {
  const [modalVisible, setModalVisible] = useState(false);
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
          <Text style={styles.historyTitle}>Leave History</Text>
          {/* <View style={{flexDirection:'row',justifyContent:'space-between',padding:15,marginBottom:10,backgroundColor:'#1e1e2a',borderRadius:10}}>
            <Text style={{color:'#fff'}}>Date</Text>
            <Text style={{color:'#fff'}}>Type</Text>
            <Text style={{color:'#fff'}}>Status</Text>
          </View> */}
          {leaveHistory.map((item)=>(
            <View key={item.id} style={styles.historyItem}>
                
              
                {item.startDate === item.endDate ? (<Text style={styles.historyDate}>Leave On: {item.startDate}</Text>) : (
                <View style={{gap:10}}>
                  <Text style={styles.historyDate}>Leave From: {item.startDate} </Text>
                  <Text style={styles.historyDate}>Leave To: {item.endDate}</Text>
                </View>
                )}

              <Text style={styles.historyDate}>{item.date}</Text>
              <Text style={styles.historyType}>{item.type}</Text>
              <Text style={styles.historyStatus}>{item.status}</Text>
            </View>
          ))}
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
    marginBottom: 10
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#2a323d',
    borderRadius: 10
  },
  historyDate: {
    color: '#fff',
    fontWeight: 'bold'
  },
  historyType: {
    color: '#1e90ff',
    fontWeight: 'bold'
  },
  historyStatus: {
    color: '#fff',
    fontWeight: 'bold'
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
  summaryDetails:{
    flexDirection:'row',
    justifyContent:'space-between',
    width:'100%',
    backgroundColor:'#1e1e2a',
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
});