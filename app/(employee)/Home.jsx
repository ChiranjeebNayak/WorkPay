import {  ScrollView, StatusBar, StyleSheet, Text, View } from "react-native"
import Feather from '@expo/vector-icons/Feather';
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";


function Home() {

    const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000); // update every second

    return () => clearInterval(timer); // cleanup
  }, []);

  // Format time → HH:MM
  const timeString = dateTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Format date → Day Month Year
  const dateString = dateTime.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <SafeAreaView style={styles.mainContainer}>
    <StatusBar barStyle="light-content" />
    <ScrollView contentContainerStyle={styles.container}>
        {/* header with user information */}
        <View style={styles.headerContainer}>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Welcome, User</Text>
                    <Text style={styles.headerSubtitle}>Employee ID: 12345</Text>
                </View>
                <Feather name="log-out" size={24} color="white" />
        </View>
        {/* check in and out card */}
        <View style={styles.checkInOutContainer}>
                {/* time and date container */}
                <View style={styles.timeDateContainer}>
                        <Text style={{color:'#fff', fontSize:28, fontWeight:'bold'}}>{timeString}</Text>
                        <Text style={{color:'#fff', fontSize:36}}>{dateString}</Text>
                </View>
                {/* check in and out buttons */}
                <View style={styles.buttonContainer}>

                </View>
        </View>
    </ScrollView>
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
    mainContainer:{
        flex: 1,
        backgroundColor: '#111a22',
    },
  container: {
    flex: 1,
    backgroundColor: '#111a22',
    justifyContent:"center",
    alignItems:"center"
  },
  headerContainer:{
    width: '100%',
    padding: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleContainer:{
    flex: 1,
    alignItems: 'start',
    gap:5,
    paddingLeft:10
  },
  headerTitle:{
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  headerSubtitle:{
    fontSize: 14,
    color: '#fff'
  },
  checkInOutContainer:{
    width: '95%',
    padding: 10,
    gap:20,
    alignItems: 'center',
  },
  timeDateContainer:{
    width: '100%',
    alignItems: 'center',
    gap:10
  },
  buttonContainer:{
    width: '60%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:"100%",
    backgroundColor: '#22876A',
  },
})
