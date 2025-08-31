import React from 'react'
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';

function Dashboard() {
  const router = useRouter();
  
  // Sample data - replace with real data
  const stats = [
    { icon: 'user', iconSet: 'AntDesign', color: '#4A9EFF', count: '124', label: 'Total Employees' },
    { icon: 'user-check', iconSet: 'Feather', color: '#00D4AA', count: '98', label: 'Present Today' },
    { icon: 'user-x', iconSet: 'Feather', color: '#FF6B6B', count: '15', label: 'Absent Today' },
    { icon: 'timer-outline', iconSet: 'Ionicons', color: '#FFB800', count: '11', label: 'Late Arrivals' },
  ];

  const renderIcon = (iconName, iconSet, color, size = 28) => {
    switch(iconSet) {
      case 'AntDesign':
        return <AntDesign name={iconName} size={size} color={color} />;
      case 'Feather':
        return <Feather name={iconName} size={size} color={color} />;
      case 'Ionicons':
        return <Ionicons name={iconName} size={size} color={color} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>

        {/* header */}
        <View style={styles.header}>
                <Text style={styles.headerTitle}>Welcome Admin</Text>
                <TouchableOpacity onPress={() => router.replace('/')} style={styles.logoutButton}>
                    <MaterialIcons name="logout" size={24} color="#ffffff" />
                </TouchableOpacity>
        </View>

        <ScrollView>
        
        {/* Overview Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.overview}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.cardContent}>
                  <View style={[styles.iconContainer, { backgroundColor: `${stat.color}20` }]}>
                    {renderIcon(stat.icon, stat.iconSet, stat.color)}
                  </View>
                  <View style={styles.cardText}>
                    <Text style={styles.cardCount}>{stat.count}</Text>
                    <Text style={styles.cardLabel}>{stat.label}</Text>
                  </View>
                </View>
                <View style={[styles.cardAccent, { backgroundColor: stat.color }]} />
              </View>
            ))}
          </View>
        </View>

        {/* recent activity */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {/* Add recent activity content here */}
          <View style={styles.recentActivityContainer}>
                   <View style={styles.recentActivityItem}>
                                <View style={{gap:5}}>
                                    <Text style={{color:'#FFFFFF',fontSize:18}}>User A</Text>
                                    <Text style={{color:'#8A9BAE',fontSize:14}}>Checked in at 9:00 AM</Text>
                                </View>
                                <View style={{paddingHorizontal:10,paddingVertical:5,borderRadius:8,backgroundColor:'#1b947cff',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#ffffff',fontSize:14,fontWeight:'600'}}>Present</Text>
                                </View>
                   </View>
                    <View style={styles.recentActivityItem}>
                                <View style={{gap:5}}>
                                    <Text style={{color:'#FFFFFF',fontSize:18}}>User B</Text>
                                    <Text style={{color:'#8A9BAE',fontSize:14}}>Checked in at 9:10 AM</Text>
                                </View>
                                <View style={{paddingHorizontal:10,paddingVertical:5,borderRadius:8,backgroundColor:'#e68211ff',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#ffffff',fontSize:14,fontWeight:'600'}}>Late</Text>
                                </View>
                   </View>
                   <View style={styles.recentActivityItem}>
                                <View style={{gap:5}}>
                                    <Text style={{color:'#FFFFFF',fontSize:18}}>User C</Text>
                                    <Text style={{color:'#8A9BAE',fontSize:14}}>Checked in at 9:15 AM</Text>
                                </View>
                                <View style={{paddingHorizontal:10,paddingVertical:5,borderRadius:8,backgroundColor:'#1b947cff',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#ffffff',fontSize:14,fontWeight:'600'}}>Present</Text>
                                </View>
                   </View>
                   <View style={styles.recentActivityItem}>
                                <View style={{gap:5}}>
                                    <Text style={{color:'#FFFFFF',fontSize:18}}>User D</Text>
                                    <Text style={{color:'#8A9BAE',fontSize:14}}>- - | - -</Text>
                                </View>
                                <View style={{paddingHorizontal:10,paddingVertical:5,borderRadius:8,backgroundColor:'#a51212ff',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#ffffff',fontSize:14,fontWeight:'600'}}>Absent</Text>
                                </View>
                   </View>
          </View>
        </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default Dashboard

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
  sectionContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  overview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    backgroundColor: '#192633',
    borderRadius: 12,
    padding: 0,
    width: '48%',
    minHeight: 100,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  cardContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
  },
  cardCount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8A9BAE',
    lineHeight: 16,
  },
  cardAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  recentActivityContainer:{
    width: '100%',
    backgroundColor: '#192633',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  recentActivityItem:{
    width: '100%',
    backgroundColor: '#2A3441',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }
});