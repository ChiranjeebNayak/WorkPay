import Feather from '@expo/vector-icons/Feather'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import axios from 'axios'
import * as Location from 'expo-location'
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import uuid from 'react-native-uuid'
import { url } from '../../../constants/EnvValue'
import { useContextData } from "../../../context/EmployeeContext"
import { getToken, removeToken } from '../../../services/ApiService'
import { calculateHoursManual, formatMinutesToHHMM } from "../../../utils/TimeUtils"

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const distance = R * c; // Distance in meters
  return distance;
}

function Home() {
  const [dateTime, setDateTime] = useState(new Date());
  const [showMenu, setShowMenu] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const router = useRouter();
  const [dashboardDetails, setDashboardDetails] = useState(null);
  const {setEmployeeData, showToast} = useContextData();

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Get current user location similar to OfficeSettings
  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      
      // Request location permissions first
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showToast('Permission to access location was denied', 'Warning');
        setLocationPermission(false);
        return null;
      }

      // Get current position
      let location = await Location.getCurrentPositionAsync({});
      
      const userLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy
      };

      setCurrentLocation(userLocation);
      
      return userLocation;
    } catch (error) {
      console.error('Error getting location:', error);
      showToast('Failed to get current location','Error');
      return null;
    } finally {
      setLocationLoading(false);
    }
  };

  const fetchDashboardDetails = async () => {
    try {
      const txnId = uuid.v4().replace(/-/g, '').slice(0, 8);
      const response = await axios.get(`${url}/api/employees/dashboard`, {
        headers: {
          authorization: `Bearer ${await getToken()}`,
          'x-transaction-id': txnId
        }
      });
      const data = response.data;
      setDashboardDetails(data);
      setEmployeeData(data.employeeDetails);
      console.log('Fetched dashboard details:', data);
    } catch (error) {
      showToast(error.response.data.error,'Error');
      console.error('Error fetching dashboard details:', error);
    }
  }

  useEffect(() => {
    fetchDashboardDetails();
  }, []);

  const handleAttendanceAction = async (action) => {
    if(locationLoading){
      showToast('Location is being fetched. Please wait...','Warning');
      return;
    }

    try {
      // Get office location from dashboard details
      const officeLocation = dashboardDetails?.officeDetails;
      
      if (!officeLocation || !officeLocation.latitude || !officeLocation.longitude) {
        showToast('Office location information is not available. Please contact your administrator.', 'Error');
        return;
      }

      // Get current location
      const userLocation = await getCurrentLocation();
      if (!userLocation) {
        showToast('Unable to get current location. Please ensure location permissions are granted.', 'Error');
        return;
      }

      // Calculate distance between user and office
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        officeLocation.latitude,
        officeLocation.longitude
      );

      console.log(`Distance from office: ${distance.toFixed(2)} meters`);

      // Check if user is within allowed range
      const MAX_DISTANCE = officeLocation?.range; // meters
      const MIN_DISTANCE = 0;   // meters

      if (distance < MIN_DISTANCE || distance > MAX_DISTANCE) {
        showToast(`You must be within ${MAX_DISTANCE} meters of the office to check in. Current distance: ${Math.round(distance)} meters`, 'Warning');
        return;
      }

       const txnId = uuid.v4().replace(/-/g, '').slice(0, 8);
      // Proceed with attendance action if location is verified
      const response = await axios.post(`${url}/api/attendances/mark`, {
        type: action,
        location: userLocation // Send current location to backend
      },{
        headers: {
          authorization: `Bearer ${await getToken()}`,
          'x-transaction-id': txnId
        }
      });
      
      const data = response.data;
      if(data){
        showToast(data.message,"Success");
        await fetchDashboardDetails();
      }
    } catch (error) {
      if(error.response?.data?.message){
        showToast(error.response.data.message,"Warning")
      }
      if(error.response?.data?.error){
        showToast(error.response.data.error,"Error")
      }
      console.error('Error marking attendance:', error);
    }
  }

  const timeString = dateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const dateString = dateTime.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });

  const handleLogout = async () => {
    await removeToken();
    router.replace('/');
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Welcome back, {dashboardDetails?.employeeDetails?.name} </Text>
          <View style={styles.employeeIdBadge}>
            <Text style={styles.employeeIdText}>ID: {dashboardDetails?.employeeDetails?.id}</Text>
          </View>
        </View>
        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setShowMenu(!showMenu)}
          >
            <Feather name="more-vertical" size={22} color="#667085" />
          </TouchableOpacity>
          
          {showMenu && (
            <View style={styles.popupMenu}>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  router.push({
                    pathname: "/(employee)/(home)/EmployeeProfile",
                  });
                }}
              >
                <Feather name="user" size={18} color="#F8FAFC" />
                <Text style={styles.menuItemText}>Profile</Text>
              </TouchableOpacity>
              
              <View style={styles.menuDivider} />
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  handleLogout();
                }}
              >
                <Feather name="log-out" size={18} color="#F04438" />
                <Text style={[styles.menuItemText, { color: '#F04438' }]}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        onScrollBeginDrag={() => setShowMenu(false)}
      >

        {/* Time + Check In */}
        <View style={styles.checkInOutContainer}>
          <View style={styles.timeDateContainer}>
            <Text style={styles.timeText}>{timeString}</Text>
            <Text style={styles.dateText}>{dateString}</Text>
          </View>
          
          {dashboardDetails?.employeeDetails?.checkinTime === null &&
            <TouchableOpacity 
              onPress={() => handleAttendanceAction('checkin')}
              style={[styles.checkButton, locationLoading && styles.disabledButton]}
              disabled={locationLoading}
            >
              <View style={styles.checkButtonInner}>
                {locationLoading ? (
                  <MaterialCommunityIcons name="loading" size={48} color="white" />
                ) : (
                  <MaterialCommunityIcons name="fingerprint" size={48} color="white" />
                )}
                <Text style={styles.checkButtonText}>Check In</Text>
                <Text style={styles.checkButtonSubtext}>
                  {locationLoading ? "Getting location..." : "Tap to clock in"}
                </Text>
              </View> 
            </TouchableOpacity>
          }
         
          {dashboardDetails?.employeeDetails?.checkinTime !== null && dashboardDetails?.employeeDetails?.checkoutTime === null &&
            <TouchableOpacity 
              onPress={() => handleAttendanceAction('checkout')}
              style={[styles.checkButton, styles.checkOutButton, locationLoading && styles.disabledButton]}
              disabled={locationLoading}
            >
              <View style={styles.checkButtonInner}>
                {locationLoading ? (
                  <MaterialCommunityIcons name="loading" size={48} color="white" />
                ) : (
                  <MaterialCommunityIcons name="fingerprint" size={48} color="white" />
                )}
                <Text style={styles.checkButtonText}>Check Out</Text>
                <Text style={styles.checkButtonSubtext}>
                  {locationLoading ? "Getting location..." : "Tap to clock out"}
                </Text>
              </View>
            </TouchableOpacity>
          }
        </View>

        {/* Today's Summary */}
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>Today's Summary</Text>
        </View>

        {/* Details */}
        <View style={styles.detailsCard}>
          <View style={styles.individualDetails}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="login" size={24} color="#10B981" />
            </View>
            <Text style={styles.detailTime}>{dashboardDetails?.employeeDetails?.checkinTime === null ? "-- : --" : dashboardDetails?.employeeDetails?.checkinTime}</Text>
            <Text style={styles.detailLabel}>Check In</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.individualDetails}>
            <View style={[styles.iconContainer, { backgroundColor: '#FEF3F2' }]}>
              <MaterialCommunityIcons name="logout" size={24} color="#F04438" />
            </View>
            <Text style={styles.detailTime}>{dashboardDetails?.employeeDetails?.checkoutTime === null ? "-- : --" : dashboardDetails?.employeeDetails?.checkoutTime}</Text>
            <Text style={styles.detailLabel}>Check Out</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.individualDetails}>
            <View style={[styles.iconContainer, { backgroundColor: '#FFFBEB' }]}>
              <MaterialCommunityIcons name="clock-plus-outline" size={24} color="#F79009" />
            </View>
            <Text style={styles.detailTime}>{dashboardDetails?.employeeDetails?.overtime === null ? "-- : --" : dashboardDetails?.employeeDetails?.overtime/60}</Text>
            <Text style={styles.detailLabel}>Overtime</Text>
          </View>
        </View>

        {/* Additional Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{calculateHoursManual(dashboardDetails?.officeDetails?.checkin, dashboardDetails?.officeDetails?.checkout)}</Text>
            <Text style={styles.statLabel}>Regular Hours</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatMinutesToHHMM(dashboardDetails?.officeDetails?.breakTime)}</Text>
            <Text style={styles.statLabel}>Break Time</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#111a22',
  },
  headerContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleContainer: {
    gap: 8,
    maxWidth:"80%",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  employeeIdBadge: {
    backgroundColor: 'rgba(79, 70, 229, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.3)',
    alignSelf: 'flex-start',
  },
  employeeIdText: {
    fontSize: 12,
    color: '#A5B4FC',
    fontWeight: '600',
  },
  logoutButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuContainer: {
    position: 'relative',
    alignSelf:"flex-start"
  },
  menuButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  popupMenu: {
    position: 'absolute',
    top: 50,
    right: 0,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  menuItemText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 8,
  },
  scrollContent: {
    paddingBottom: 40,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  checkInOutContainer: {
    width: '100%',
    backgroundColor: '#192633',
    borderRadius: 24,
    padding: 32,
    marginTop: 20,
    alignItems: 'center',
    gap: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  timeDateContainer: {
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '300',
    letterSpacing: -2,
  },
  dateText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '500',
  },
  checkButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 4,
    borderColor: 'rgba(79, 70, 229, 0.3)',
  },
  checkOutButton: {
    backgroundColor: '#EF4444',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    shadowColor: "#EF4444",
  },
  disabledButton: {
    opacity: 0.6,
  },
  checkButtonInner: {
    alignItems: 'center',
    gap: 8,
  },
  checkButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  checkButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  summaryHeader: {
    width: '100%',
    marginTop: 32,
    marginBottom: 16,
  },
  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  detailsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#192633',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  individualDetails: {
    flex: 1,
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailTime: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  detailLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 8,
  },
  statsCard: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#192633',
    borderRadius: 20,
    paddingVertical: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 16,
  },
})