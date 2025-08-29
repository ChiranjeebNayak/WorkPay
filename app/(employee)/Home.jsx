import {  ScrollView, StatusBar, StyleSheet, Text, View } from "react-native"
import Feather from '@expo/vector-icons/Feather';
import { SafeAreaView } from "react-native-safe-area-context";


function Home() {
  return (
    <SafeAreaView style={styles.mainContainer}>
    <StatusBar barStyle="light-content" />
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Welcome, User</Text>
                    <Text style={styles.headerSubtitle}>Employee ID: 12345</Text>
                </View>
                <Feather name="log-out" size={24} color="white" />
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
  }
})
