import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';

function LeaveRequests() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pending');

  // Sample leave requests data
  const leaveRequests = {
    pending: [
      { id: 1, name: 'John Smith', leaveType: 'Annual Leave', dates: '5-8 Sep 2025', reason: 'Family vacation' },
      { id: 2, name: 'Sarah Johnson', leaveType: 'Sick Leave', dates: '3-4 Sep 2025', reason: 'Medical checkup' },
      { id: 3, name: 'Mike Wilson', leaveType: 'Personal Leave', dates: '10-12 Sep 2025', reason: 'Personal matters' },
      { id: 4, name: 'Emma Davis', leaveType: 'Maternity Leave', dates: '15 Sep - 15 Dec 2025', reason: 'Maternity leave' },
      { id: 5, name: 'Robert Brown', leaveType: 'Annual Leave', dates: '20-25 Sep 2025', reason: 'Wedding ceremony' },
    ],
    accepted: [
      { id: 6, name: 'Alice Cooper', leaveType: 'Annual Leave', dates: '1-3 Sep 2025', reason: 'Weekend getaway' },
      { id: 7, name: 'David Lee', leaveType: 'Sick Leave', dates: '28-29 Aug 2025', reason: 'Flu recovery' },
      { id: 8, name: 'Lisa Wang', leaveType: 'Personal Leave', dates: '25-26 Aug 2025', reason: 'House moving' },
    ],
    rejected: [
      { id: 9, name: 'Tom Anderson', leaveType: 'Annual Leave', dates: '15-20 Sep 2025', reason: 'Vacation conflict with project deadline' },
      { id: 10, name: 'Kate Miller', leaveType: 'Personal Leave', dates: '12-13 Sep 2025', reason: 'Insufficient notice period' },
    ]
  };

  const tabs = [
    { key: 'pending', label: 'Pending', count: leaveRequests.pending.length },
    { key: 'accepted', label: 'Accepted', count: leaveRequests.accepted.length },
    { key: 'rejected', label: 'Rejected', count: leaveRequests.rejected.length },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#FFB800';
      case 'accepted': return '#1b947cff';
      case 'rejected': return '#a51212ff';
      default: return '#FFB800';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      default: return 'Pending';
    }
  };

  const handleAccept = (requestId) => {
    // Handle accept logic here
    console.log('Accept request:', requestId);
  };

  const handleReject = (requestId) => {
    // Handle reject logic here
    console.log('Reject request:', requestId);
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
          {leaveRequests[activeTab].map((request, index) => (
            <View key={request.id} style={styles.requestItem}>
              <View style={styles.requestInfo}>
                <Text style={styles.requestName}>{request.name}</Text>
                <Text style={styles.requestType}>{request.leaveType}</Text>
                <Text style={styles.requestDates}>{request.dates}</Text>
                <Text style={styles.requestReason}>{request.reason}</Text>
              </View>
              
              <View style={styles.requestActions}>
                {activeTab === 'pending' ? (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.acceptButton]}
                      onPress={() => handleAccept(request.id)}
                    >
                      <AntDesign name="check" size={16} color="#ffffff" />
                      <Text style={styles.actionButtonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.rejectButton]}
                      onPress={() => handleReject(request.id)}
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