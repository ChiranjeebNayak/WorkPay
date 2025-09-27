import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { url } from '../../../constants/EnvValue';
import { useContextData } from '../../../context/EmployeeContext';
import { getToken } from '../../../services/ApiService';
import { formatDay } from "../../../utils/TimeUtils";


function LeaveRequests() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pendingLeaves');
  const [data,setData] = useState([]);
  const {showToast} = useContextData();
  const {id} = useLocalSearchParams();

  const fetchLeaveRequest = async ()=>{
    try{
         let apiUrl = id ? `${url}/api/leaves/summary/${id}` : `${url}/api/leaves/summary`;
       const response = await axios.get(apiUrl, {
        headers: {
          authorization: `Bearer ${await getToken()}`
        }
      });
      const data = response.data;
      setData(data);
      console.log(data.office)
    }catch(error){
      showToast(error.response.data.error,'Error');
      console.error("Error fetching leaves request",error)
    }
  }

    const handleAcceptReject = async (id,type)=>{
    try{
       const response = await axios.post(`${url}/api/leaves/update-status`,
        {
          leaveId:id,
          status:type
        }, {
        headers: {
          authorization: `Bearer ${await getToken()}`
        }
      });
      const data = response.data;
      if(data.message){
        showToast(data.message,"Success")
        fetchLeaveRequest();
      }
    }catch(error){
       showToast(error.response.data.error,"Error")
      console.error("Error fetching leaves request",error)
    }
  }


useEffect(()=>{
  fetchLeaveRequest();
},[])



  const tabs = [
    { key: 'pendingLeaves', label: 'Pending Leaves', count: data?.pendingLeaves?.length },
    { key: 'approvedLeaves', label: 'Approved Leaves', count: data?.approvedLeaves?.length },
    { key: 'rejectedLeaves', label: 'Rejected Leaves', count: data?.rejectedLeaves?.length },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'pendingLeaves': return '#FFB800';
      case 'approvedLeaves': return '#1b947cff';
      case 'rejectedLeaves': return '#a51212ff';
      default: return '#FFB800';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pendingLeaves': return 'Pending';
      case 'approvedLeaves': return 'Accepted';
      case 'rejectedLeaves': return 'Rejected';
      default: return 'Pending';
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <AntDesign name="left" size={20} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Leave Requests</Text>
          {/* placeholder */}
          <View/>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText
            ]}>
              {tab.label} ({tab.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <View style={styles.requestsContainer}>
          {data?.[activeTab]?.map((request, index) => (
            <View key={request.id} style={styles.requestItem}>
              <View style={styles.requestInfo}>
                <Text style={styles.requestName}>{request?.employee.name}</Text>
                <Text style={styles.requestType}>{request?.type}</Text>
                <Text style={styles.requestDates}>{formatDay(request?.fromDate) }- { formatDay(request.toDate)}</Text>
                <Text style={styles.requestReason}>{request.reason}</Text>
              </View>
              
              <View style={styles.requestActions}>
                {activeTab === 'pendingLeaves' ? (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.acceptButton]}
                      onPress={() => handleAcceptReject(request.id,"APPROVED")}
                    >
                      <AntDesign name="check" size={16} color="#ffffff" />
                      <Text style={styles.actionButtonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.rejectButton]}
                      onPress={() => handleAcceptReject(request.id,"REJECTED")}
                    >
                      <AntDesign name="close" size={16} color="#ffffff" />
                      <Text style={styles.actionButtonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(activeTab) }]}>
                    <Text style={styles.statusText}>{getStatusLabel(activeTab)}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default LeaveRequests

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1419',
  },
  header: {
    padding: 20,
    backgroundColor: '#192633',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#2A3441',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#2A3441',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#2A3441',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#192633',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#2A3441',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#4A9EFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8A9BAE',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  requestsContainer: {
    padding: 20,
    gap: 12,
  },
  requestItem: {
    backgroundColor: '#192633',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  requestInfo: {
    marginBottom: 12,
    gap: 4,
  },
  requestName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  requestType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A9EFF',
  },
  requestDates: {
    fontSize: 14,
    color: '#8A9BAE',
  },
  requestReason: {
    fontSize: 13,
    color: '#8A9BAE',
    fontStyle: 'italic',
  },
  requestActions: {
    alignItems: 'flex-end',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  acceptButton: {
    backgroundColor: '#00D4AA',
  },
  rejectButton: {
    backgroundColor: '#FF6B6B',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});