import {  ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Feather from '@expo/vector-icons/Feather';
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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

      {/* header with user information */}
        <View style={styles.headerContainer}>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Welcome, User</Text>
                    <Text style={styles.headerSubtitle}>Employee ID: 12345</Text>
                </View>
                <Feather name="log-out" size={24} color="white" />
        </View>

        <ScrollView contentContainerStyle={styles.container}>

        {/* check in and out card */}
        <View style={styles.checkInOutContainer}>
                {/* time and date container */}
                <View style={styles.timeDateContainer}>
                        <Text style={{color:'#fff', fontSize:28, fontWeight:'bold'}}>{timeString}</Text>
                        <Text style={{color:'#fff', fontSize:36}}>{dateString}</Text>
                </View>
                {/* check in  buttons */}
                <TouchableOpacity style={styles.buttonContainer}>
                    <MaterialCommunityIcons name="hand-pointing-up" size={75} color="white" />
                    <Text style={{color:'#fff', fontSize:24, fontWeight:'bold'}}>Check In</Text>
                </TouchableOpacity>
                 {/* check in  buttons */}
                {/* <TouchableOpacity style={[styles.buttonContainer,{backgroundColor:'#ff4d4d'}]}>
                    <MaterialCommunityIcons name="hand-pointing-down" size={75} color="white" />
                    <Text style={{color:'#fff', fontSize:24, fontWeight:'bold'}}>Check Out</Text>
                </TouchableOpacity> */}

            {/* details container */}
            <View style={styles.detailsContainer}>
                    <View style={styles.IndividualDetails}>
                                <MaterialCommunityIcons name="clock-in" size={30} color="white" />
                                <Text style={{color:'#fff', fontSize:16, fontWeight:'bold'}}>-- | --</Text>
                                <Text style={{color:'#fff', fontSize:16, fontWeight:'bold'}}>Check In</Text>
                    </View>
                    <View style={styles.IndividualDetails}>
                                <MaterialCommunityIcons name="clock-out" size={30} color="white" />
                                <Text style={{color:'#fff', fontSize:16, fontWeight:'bold'}}>-- | --</Text>
                                <Text style={{color:'#fff', fontSize:16, fontWeight:'bold'}}>Check Out</Text>
                    </View>
                    <View style={styles.IndividualDetails}>
                               <MaterialCommunityIcons name="clock-plus-outline" size={26} color="white" />
                                <Text style={{color:'#fff', fontSize:16, fontWeight:'bold'}}>-- | --</Text>
                                <Text style={{color:'#fff', fontSize:16, fontWeight:'bold'}}>OverTime</Text>
                    </View>
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
    backgroundColor: '#111a22',
    justifyContent:"center",
    alignItems:"center"
  },
  headerContainer:{
    width: '100%',
    padding: 10,
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
    gap:40,
    alignItems: 'center',
    marginTop: 20
  },
  timeDateContainer:{
    width: '100%',
    alignItems: 'center',
    gap:10
  },
  buttonContainer:{
    width: '60%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:"100%",
    backgroundColor: '#16bd44',
    gap:10
  },
  detailsContainer:{
    width: '95%',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  IndividualDetails:{
    flex: 1,
    alignItems: 'center',
    gap: 10,
    marginVertical: 10
  }
})
