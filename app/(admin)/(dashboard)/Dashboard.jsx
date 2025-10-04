import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { url } from '../../../constants/EnvValue';
import { useContextData } from '../../../context/EmployeeContext';
import { useOfficeContextData } from '../../../context/OfficeContext';
import { getToken, removeToken } from '../../../services/ApiService';
import { formatDay } from "../../../utils/TimeUtils";


function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAttendanceFinalized, setIsAttendanceFinalized] = useState(false);
  const {showToast} = useContextData();
  const {setOfficeData} = useOfficeContextData();
  const [currentOffice,setCurrentOffice] = useState('all');  
  const [showOfficeList,setShowOfficeList] = useState(false);
  const [isEmployeesAvailable,setIsEmployeesAvailable] = useState(false);

  // Modified dashboardDetails to accept officeId parameter
  const dashboardDetails = async (officeId) => {
    try {
      let apiUrl =  `${url}/api/attendances/getTodayAttendance/${officeId}`
        
      const response = await axios.get(apiUrl, {
        headers: {
          authorization: `Bearer ${await getToken()}`,
          'Content-Type': 'application/json',
        }
      });
      const data = response.data;
      setData(data);
      setOfficeData(data.offices);
      setCurrentOffice(data.office.id);
    } catch (error) {
      showToast(error?.response?.data?.error ,'Error');
      console.error('Error fetching dashboard details:', error);
      return null;
    }
  }

  const handleFinalizeAttendance = async () => {
    try {
      setLoading(true);
       let apiUrl =  `${url}/api/attendances/finalizeAttendance/${currentOffice}`

      const response = await axios.post(apiUrl, {}, {
        headers: {
          authorization: `Bearer ${await getToken()}`
        }
      });
      showToast(response.data.message || "Attendance finalized", "Success");
      await dashboardDetails(currentOffice); // refresh stats after finalization
      await checkAttendanceFinalization(currentOffice); // update finalization status
    } catch (error) {
      showToast(error?.response?.data?.error || "Failed to finalize attendance", "Error");
      console.error("Error finalizing attendance:", error);
    } finally {
      setLoading(false);
    }
  }

  const checkAttendanceFinalization = async (officeId) => {
    try {
      console.log(officeId)
      let apiUrl =  `${url}/api/attendances/checkBulkAttendanceStatus/${officeId}`

      const response = await axios.get(apiUrl, {
        headers: {
          authorization: `Bearer ${await getToken()}`
        }
      });
      setIsAttendanceFinalized(response.data.isBulkMarkingCompleted);
      setIsEmployeesAvailable(response.data.totalEmployees > 0);
    } catch (error) {
      console.error('Error checking attendance finalization:', error);
    }
  }

  // Modified office selection handler
  const handleOfficeSelect = (officeId) => {
    setCurrentOffice(officeId);
    setShowOfficeList(false);
    dashboardDetails(officeId); // Immediately fetch data for selected office
    if(officeId !== "all"){
        checkAttendanceFinalization(officeId);
    }

  }


  useEffect(() => {
    dashboardDetails('all');
    if(currentOffice !== "all"){
        checkAttendanceFinalization(officeId);
    }
  }, []);
  
  const stats = [
    { icon: 'user', iconSet: 'AntDesign', color: '#4A9EFF', label: 'Total Employees',field:"totalEmployees" },
    { icon: 'user-check', iconSet: 'Feather', color: '#00D4AA', label: 'Present Today',field:"totalPresent" ,status:"PRESENT"},
    { icon: 'user-x', iconSet: 'Feather', color: '#FF6B6B', label: 'Absent Today',field:"totalAbsent",status:"ABSENT" },
    { icon: 'timer-outline', iconSet: 'Ionicons', color: '#FFB800', label: 'Late Arrivals',field:"totalLate",status:"LATE" },
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

  const handleLogout =async ()=>{
     await removeToken();
      router.replace('/')
  }

  return (
    <SafeAreaView style={styles.container}>

        {/* header */}
        <View style={styles.header}>
                <Text style={styles.headerTitle}>Welcome Admin</Text>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <MaterialIcons name="logout" size={24} color="#ffffff" />
                </TouchableOpacity>
        </View>

        <ScrollView>
        
        {/* Overview Section */}
        <View style={styles.sectionContainer}>

          {/* office selector */}
          <View style={{marginBottom:20,width:'100%',gap:10}}>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:'#2A3441',padding:10,borderRadius:8}}>
                    <Text style={{color:'#FFFFFF',fontSize:18}}>{currentOffice !== "all" ? data?.offices?.find(office => office.id === currentOffice)?.name : "All"}</Text>
                    <TouchableOpacity onPress={() => setShowOfficeList(!showOfficeList)}>
                      <AntDesign name={showOfficeList ? "up" : "down"} size={20} color="#4A9EFF" />
                    </TouchableOpacity>
                </View>

                {
                  showOfficeList && <View>
                    <TouchableOpacity 
                        onPress={() => handleOfficeSelect('all')}
                        style={{padding:10,backgroundColor: 'all' === currentOffice ? '#4A9EFF' : '#192633',borderRadius:8,marginTop:5}}
                      > 
                        <Text style={{color:'#FFFFFF',fontSize:16}}>All</Text>
                      </TouchableOpacity>
                    {data?.offices?.map((office)=>(
                      <TouchableOpacity 
                        key={office.id}
                        onPress={() => handleOfficeSelect(office.id)}
                        style={{padding:10,backgroundColor: office.id === currentOffice ? '#4A9EFF' : '#192633',borderRadius:8,marginTop:5}}
                      > 
                        <Text style={{color:'#FFFFFF',fontSize:16}}>{office.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                }
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Overview</Text>
            {currentOffice !== "all" &&
            <TouchableOpacity 
              onPress={()=>{
                if(!isAttendanceFinalized){
                  handleFinalizeAttendance()
                }else if (!isEmployeesAvailable && isAttendanceFinalized) {
                  showToast("No Employees Available","Warning")
                }
                else {
                  showToast("Attendance already finalized for today","Warning")
                }
              }} 
              disabled={loading}
              style={[styles.viewAllButton,{backgroundColor:'#4A9EFF'}]}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={[styles.viewAllText,{color:'#fff'}]}>Finalize Attendance</Text>
              )}
            </TouchableOpacity> }
          </View>
          <View style={styles.overview}>
            {stats.map((stat, index) => (
             currentOffice === "all" ? ( stat.field !== "totalLate" &&  <TouchableOpacity
               onPress={() =>{
                if(stat.field !== "totalEmployees")
                router.push({ pathname: '/AttendanceStatus', params: { id: currentOffice,status: stat.status} })
               }
              }
              key={index} style={styles.card}>

            {stat.field !== "totalEmployees" &&  
              <AntDesign name="right" size={16}  style={{position:"absolute",top:5,right:10}}  color="#4A9EFF" />}

                <View style={styles.cardContent}>
                  <View style={[styles.iconContainer, { backgroundColor: `${stat.color}20` }]}>
                    {renderIcon(stat.icon, stat.iconSet, stat.color)}
                  </View>
                  <View style={styles.cardText}>
                    <Text style={styles.cardCount}>{stat.field === "totalPresent" ? (data?.["totalLate"] + data?.["totalPresent"]) : data?.[stat.field]}</Text>
                    <Text style={styles.cardLabel}>{stat.label}</Text>
                  </View>
                </View>
                <View style={[styles.cardAccent, { backgroundColor: stat.color }]} />
              </TouchableOpacity> ) : (
                 <TouchableOpacity
                  onPress={() =>{
                    if(stat.field !== "totalEmployees")
                    router.push({ pathname: '/AttendanceStatus', params: { id: currentOffice,status: stat.status} })
                  }
                  }
                  key={index} style={styles.card}>
                    {stat.field !== "totalEmployees" &&  
              <AntDesign name="right" size={16} style={{position:"absolute",top:5,right:10}} color="#4A9EFF" />}

                <View style={styles.cardContent}>
                  <View style={[styles.iconContainer, { backgroundColor: `${stat.color}20` }]}>
                    {renderIcon(stat.icon, stat.iconSet, stat.color)}
                  </View>
                  <View style={styles.cardText}>
                    <Text style={styles.cardCount}>{stat.field === "totalPresent" ? (data?.["totalLate"] + data?.["totalPresent"]) : data?.[stat.field]}</Text>
                    <Text style={styles.cardLabel}>{stat.label}</Text>
                  </View>
                </View>
                <View style={[styles.cardAccent, { backgroundColor: stat.color }]} />
              </TouchableOpacity>
              )
            ))}
          </View>
        </View>

        {/* Absent List */}
       {data?.absentList.length > 0 && <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Absent Today</Text>
          <View style={styles.recentActivityContainer}>
            {data?.absentList.map((employee, index) => (
              <View key={index} style={styles.recentActivityItem}>
                <View style={{gap:5}}>
                  <Text style={{color:'#FFFFFF',fontSize:18}}>{employee?.name}</Text>
                  <Text style={{color:'#8A9BAE',fontSize:14}}>ID: {employee?.id}</Text>
                </View>
                <View style={{paddingHorizontal:10,paddingVertical:5,borderRadius:8,backgroundColor:'#a51212ff',alignItems:'center',justifyContent:'center'}}>
                  <Text style={{color:'#ffffff',fontSize:14,fontWeight:'600'}}>Absent</Text>
                </View>
              </View>
            ))}
          </View>
        </View>}

        {/* Leave Requests Section */}
       {currentOffice !== "all" && <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Leave Requests</Text>
            <TouchableOpacity 
              onPress={() =>router.push({ pathname: '/LeaveRequests', params: { id: currentOffice } })}
              style={styles.viewAllButton}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <AntDesign name="right" size={16} color="#4A9EFF" />
            </TouchableOpacity>
          </View>
         {data?.pendingLeaves?.length > 0 && <View style={styles.recentActivityContainer}>
            {data?.pendingLeaves.map((request, index) => (
              <View key={index} style={styles.recentActivityItem}>
                <View style={{gap:5, flex: 1}}>
                  <Text style={{color:'#FFFFFF',fontSize:18}}>{request.employee.name}</Text>
                  <Text style={{color:'#8A9BAE',fontSize:14}}>{request.type} • {formatDay(request.fromDate) }- { formatDay(request.toDate)}</Text>
                </View>
                <View style={{paddingHorizontal:10,paddingVertical:5,borderRadius:8,backgroundColor:'#FFB800',alignItems:'center',justifyContent:'center'}}>
                  <Text style={{color:'#ffffff',fontSize:14,fontWeight:'600'}}>Pending</Text>
                </View>
              </View>
            ))}
          </View>}
        </View>}

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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#2A3441',
  },
  viewAllText: {
    color: '#4A9EFF',
    fontSize: 14,
    fontWeight: '600',
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
    position:"relative"
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