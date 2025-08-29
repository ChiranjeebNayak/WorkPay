import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Feather from '@expo/vector-icons/Feather'
import { SafeAreaView } from "react-native-safe-area-context"
import { useEffect, useState } from "react"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useRouter } from "expo-router"

function Home() {
  const [dateTime, setDateTime] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const timeString = dateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const dateString = dateTime.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Welcome, User</Text>
          <Text style={styles.headerSubtitle}>Employee ID: 12345</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/EmployeeLogin')}>
          <Feather name="log-out" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40, alignItems: "center" }}>

        {/* Time + Check In */}
        <View style={styles.checkInOutContainer}>
          <View style={styles.timeDateContainer}>
            <Text style={styles.timeText}>{timeString}</Text>
            <Text style={styles.dateText}>{dateString}</Text>
          </View>

          <TouchableOpacity style={styles.checkButton}>
            <MaterialCommunityIcons name="hand-pointing-up" size={70} color="white" />
            <Text style={styles.checkButtonText}>Check In</Text>
          </TouchableOpacity>
          {/* Example for Check Out */}
          {/* <TouchableOpacity style={[styles.checkButton, { backgroundColor: "#ff4d6d" }]}>
            <MaterialCommunityIcons name="hand-pointing-down" size={70} color="white" />
            <Text style={styles.checkButtonText}>Check Out</Text>
          </TouchableOpacity> */}
        </View>

        {/* Details */}
        <View style={styles.detailsCard}>
          <View style={styles.IndividualDetails}>
            <MaterialCommunityIcons name="clock-in" size={28} color="#4da6ff" />
            <Text style={styles.detailTime}>-- | --</Text>
            <Text style={styles.detailLabel}>Check In</Text>
          </View>
          <View style={styles.IndividualDetails}>
            <MaterialCommunityIcons name="clock-out" size={28} color="#ff6666" />
            <Text style={styles.detailTime}>-- | --</Text>
            <Text style={styles.detailLabel}>Check Out</Text>
          </View>
          <View style={styles.IndividualDetails}>
            <MaterialCommunityIcons name="clock-plus-outline" size={28} color="#ffcc66" />
            <Text style={styles.detailTime}>-- | --</Text>
            <Text style={styles.detailLabel}>OverTime</Text>
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
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleContainer: {
    gap: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ccc',
  },

  checkInOutContainer: {
    width: '90%',
    backgroundColor: '#1e262f',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
    gap: 30,
  },
  timeDateContainer: {
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  dateText: {
    color: '#ccc',
    fontSize: 18,
  },
  checkButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e90ff',
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  detailsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    backgroundColor: '#2a323d',
    borderRadius: 12,
    paddingVertical: 20,
    marginTop: 20,
  },
  IndividualDetails: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  detailTime: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailLabel: {
    color: '#ccc',
    fontSize: 14,
  },
})
