import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

function Payment() {
  const today = new Date();
  const currentMonth = months[today.getMonth()];
  const currentYear = today.getFullYear();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [open, setOpen] = useState(false);

  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const salaryHistory = [
    {
      id: "1",
      month: "January",
      year: currentYear,
      status: "Paid",
      baseSalary: 5000,
      overtime: 300,
      deduction: 200,
      advance: 100,
      total: 5000 + 300 - 200 - 100,
    },
    {
      id: "2",
      month: "February",
      year: currentYear,
      status: "Pending",
      baseSalary: 5000,
      overtime: 500,
      deduction: 150,
      advance: 0,
      total: 5000 + 500 - 150,
    },
    {
      id: "3",
      month: "March",
      year: currentYear,
      status: "Paid",
      baseSalary: 5000,
      overtime: 400,
      deduction: 100,
      advance: 200,
      total: 5000 + 400 - 100 - 200,
    },
  ]

  const [expanded, setExpanded] = useState(null)

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        
        {/* salary overview */}
        <View style={styles.salaryOverviewContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
              {currentMonth} {currentYear} Salary Overview
            </Text>
            <Text style={styles.headerSubText}>
              This is a summary of your salary for the month of {currentMonth} {currentYear}.
            </Text>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailText}>Base Salary :</Text>
              <Text style={styles.detailAmount}>$5000</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailText}>OverTime :</Text>
              <Text style={styles.detailAmount}>+ $500</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailText}>Deduction :</Text>
              <Text style={styles.detailAmount}>- $200</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailText}>Advance Payment :</Text>
              <Text style={styles.detailAmount}>- $200</Text>
            </View>
            <View style={[styles.detailItem,{borderTopWidth: 1, borderTopColor: '#ccc',paddingTop:10, marginTop:10}]}>
              <Text style={styles.detailText}>Total :</Text>
              <Text style={styles.detailAmount}>$5300</Text>
            </View>

            <View style={styles.alert}>
              <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#cce6ff" />
              <Text style={styles.alertText}>Salary will be created on the last day of the month.</Text>
            </View>
          </View>
        </View>

        {/* history */}
        <View style={styles.historyContainer}>
          <Text style={styles.historyText}>Payment history</Text>

          <View>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setOpen(!open)}
            >
              <Text style={styles.dropdownButtonText}>{selectedYear}</Text>
              <MaterialCommunityIcons 
                name={open ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#fff" 
              />
            </TouchableOpacity>

            {open && (
              <View style={styles.dropdownList}>
              {years.map(item => (
                    <TouchableOpacity
                      key={item}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedYear(item)
                        setOpen(false)
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{item}</Text>
                    </TouchableOpacity>
            ))}
              </View>
            )}
          </View>

          <Text style={styles.historySubText}>
            Showing payments of {selectedYear}
          </Text>

          {salaryHistory.filter(h => h.year === selectedYear).map(item => {
            const isOpen = expanded === item.id;
            return (
              <View style={styles.historyCard} key={item.id}>
                <TouchableOpacity 
                  style={styles.historyCardHeader}
                  onPress={() => setExpanded(isOpen ? null : item.id)}
                >
                  <Text style={styles.historyCardTitle}>{item.month} {item.year}</Text>
                  <Text style={[styles.status, {color: item.status === "Paid" ? "#4dff91" : "#ffcc00"}]}>
                    {item.status}
                  </Text>
                  <Text style={styles.historyCardAmount}>${item.total}</Text>
                  <MaterialCommunityIcons 
                    name={isOpen ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#fff" 
                  />
                </TouchableOpacity>

                {isOpen && (
                  <View style={styles.historyCardDetails}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailText}>Base Salary :</Text>
                      <Text style={styles.detailAmount}>${item.baseSalary}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailText}>OverTime :</Text>
                      <Text style={styles.detailAmount}>+ ${item.overtime}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailText}>Deduction :</Text>
                      <Text style={styles.detailAmount}>- ${item.deduction}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailText}>Advance Payment :</Text>
                      <Text style={styles.detailAmount}>- ${item.advance}</Text>
                    </View>
                    <View style={[styles.detailItem,{borderTopWidth: 1, borderTopColor: '#ccc',paddingTop:10, marginTop:10}]}>
                      <Text style={styles.detailText}>Total :</Text>
                      <Text style={styles.detailAmount}>${item.total}</Text>
                    </View>
                  </View>
                )}
              </View>
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Payment

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#111a22',
  },
  salaryOverviewContainer: {
    backgroundColor: '#1e262f',
    borderRadius: 8,
    padding: 16,
    marginVertical: 12,
    width: '90%',
    alignSelf: "center",
    gap: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubText: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
  detailsContainer:{
    width:"100%",
    gap:10
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 16,
    color: '#fff',
  },
  detailAmount: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  alert: {
    width: "100%",
    flexDirection: "row",
    alignItems: "start",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(77, 166, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(77, 166, 255, 0.3)",
    marginTop: 12,
    gap: 10,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    color: "#cce6ff",
  },
  historyContainer: {
    backgroundColor: '#1e262f',
    borderRadius: 8,
    padding: 16,
    width: '90%',
    alignSelf: "center",
    gap:15
  },
  historyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  historySubText: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 10,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2a323d",
    padding: 12,
    borderRadius: 6,
  },
  dropdownButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  dropdownList: {
    backgroundColor: "#2a323d",
    marginTop: 6,
    borderRadius: 6,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  dropdownItemText: {
    color: "#fff",
    fontSize: 16,
  },
  historyCard: {
    backgroundColor: "#2a323d",
    borderRadius: 8,
    overflow: "hidden",
  },
  historyCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
  },
  historyCardTitle: {
    fontSize: 16,
    color: "#fff",
    flex: 1,
  },
  historyCardAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
  },
  status: {
    fontSize: 14,
    marginHorizontal: 10,
  },
  historyCardDetails: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 10,
  }
})
