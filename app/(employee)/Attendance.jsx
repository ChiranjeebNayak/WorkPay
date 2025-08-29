import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import DataCard from "../../components/Attendance/DataCard";

const months = [
  { number: 1, name: "January" },
  { number: 2, name: "February" },
  { number: 3, name: "March" },
  { number: 4, name: "April" },
  { number: 5, name: "May" },
  { number: 6, name: "June" },
  { number: 7, name: "July" },
  { number: 8, name: "August" },
  { number: 9, name: "September" },
  { number: 10, name: "October" },
  { number: 11, name: "November" },
  { number: 12, name: "December" },
];

// Dummy attendance data
const dummyAttendance = [
  {
    day: "1 August",
    checkIn: "09:02 AM",
    checkOut: "06:15 PM",
    status: "Present",
    totalHours: "9h 13m",
    overtime: "1.0h",
  },
  {
    day: "2 August",
    checkIn: "08:56 AM",
    checkOut: "06:05 PM",
    status: "Present",
    totalHours: "9h 09m",
    overtime: "0.5h",
  },
  {
    day: "3 August",
    checkIn: "—",
    checkOut: "—",
    status: "Absent",
    totalHours: "0h",
    overtime: "0h",
  },
  {
    day: "4 August",
    checkIn: "09:10 AM",
    checkOut: "06:45 PM",
    status: "Present",
    totalHours: "9h 35m",
    overtime: "1.5h",
  },
  {
    day: "5 August",
    checkIn: "08:50 AM",
    checkOut: "05:58 PM",
    status: "Present",
    totalHours: "9h 08m",
    overtime: "0.3h",
  },
];

function Attendance() {
  // Get today's month/year
  const today = new Date();
  const thisMonth = today.getMonth() + 1; // 1-12
  const thisYear = today.getFullYear();

  // States
  const [currentMonth, setCurrentMonth] = useState(thisMonth);
  const [currentYear, setCurrentYear] = useState(thisYear);

  // Handle left arrow (previous month)
  const handlePrev = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Handle right arrow (next month)
  const handleNext = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Disable right arrow if at today's month/year
  const isNextDisabled =
    currentMonth === thisMonth && currentYear === thisYear;

  return (
    <SafeAreaView style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <Text style={styles.title}>Attendance History</Text>
      </View>

      {/* month container */}
      <View style={styles.monthContainer}>
        <TouchableOpacity onPress={handlePrev}>
          <Feather name="chevron-left" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.monthText}>
          {months.find((m) => m.number === currentMonth)?.name} {currentYear}
        </Text>

        <TouchableOpacity
          onPress={handleNext}
          disabled={isNextDisabled}
          style={isNextDisabled && { opacity: 0.4 }}
        >
          <Feather name="chevron-right" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* overview container */}
        <View style={styles.overViewContainer}>
          <View style={styles.overViewCard}>
            <View style={styles.row}>
              <Text style={styles.label}>Total Working Days</Text>
              <Text style={styles.value}>22</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Total Present Days</Text>
              <Text style={styles.value}>20</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Total Absent Days</Text>
              <Text style={styles.value}>2</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Total Overtime Hours</Text>
              <Text style={styles.value}>8.5h</Text>
            </View>
          </View>
        </View>

        {/* cards container */}
        <View style={styles.cardContainer}>
          {dummyAttendance.map((item, index) => (
            <DataCard key={index} data={item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Attendance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111a22",
  },
  header: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    position: "relative",
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  monthContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },
  monthText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cardContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 20,
  },
  overViewContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  overViewCard: {
    width: "92%",
    backgroundColor: "#233648",
    borderRadius: 10,
    padding: 15,
    gap: 15,
    marginVertical: 10,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    color: "#fff",
    fontSize: 16,
  },
});
