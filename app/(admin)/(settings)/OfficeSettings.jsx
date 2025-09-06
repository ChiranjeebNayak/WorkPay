import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function OfficeSettings() {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [breakHours, setBreakHours] = useState(0);
  const [breakMinutes, setBreakMinutes] = useState(0);
  const router = useRouter();

  const handleTimeChange = (event, selectedTime, type) => {
    if (event.type === 'dismissed') {
      type === 'start' ? setShowStart(false) : setShowEnd(false);
      return;
    }
    const currentTime = selectedTime || new Date();
    if (type === 'start') {
      setShowStart(false);
      setStartTime(currentTime);
    } else {
      setShowEnd(false);
      setEndTime(currentTime);
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Office Settings</Text>

      {/* general settings   */}
      <View style={styles.generalSettingsContainer}>
        <Text style={{ color: '#8f9eb3', fontSize: 16, fontWeight: 'bold' }}>GENERAL</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => router.push('/(settings)/HolidayManagement')} style={[styles.tab]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 30 }}>
              <AntDesign name="calendar" size={24} color="#1173d4" />
              <Text style={{ color: '#fff', fontSize: 20 }}>Holidays</Text>
            </View>
            <Entypo name="chevron-right" size={24} color="#8695aa" />
          </TouchableOpacity>
        </View>
      </View>

      {/* office location */}
      <View style={{ gap: 20, padding: 10, marginTop: 10 }}>
        <Text style={{ color: '#8f9eb3', fontSize: 16, fontWeight: 'bold' }}>OFFICE LOCATION</Text>
        <View style={{ gap: 10 }}>
          <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold' }}>Office Address</Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: '#334155', borderRadius: 10, padding: 15, color: '#fff' }}
            placeholder="Enter Office Address"
            placeholderTextColor="#8f9eb3"
          />
        </View>
      </View>

      {/* office Timings */}
      <View style={{ gap: 20, padding: 10, marginTop: 10 }}>
        <Text style={{ color: '#8f9eb3', fontSize: 16, fontWeight: 'bold' }}>OFFICE TIMINGS</Text>
        <View style={{ gap: 10, width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
          {/* Start Time */}
          <View style={{ flex: 1, gap: 10 }}>
            <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold' }}>Start Time</Text>
            <TouchableOpacity
              onPress={() => setShowStart(true)}
              style={{ borderWidth: 1, borderColor: '#334155', borderRadius: 10, padding: 15 }}
            >
              <Text style={{ color: startTime ? '#fff' : '#8f9eb3' }}>
                {startTime ? formatTime(startTime) : 'Select Start Time'}
              </Text>
            </TouchableOpacity>
            {showStart && (
              <DateTimePicker
                value={startTime || new Date()}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={(e, t) => handleTimeChange(e, t, 'start')}
              />
            )}
          </View>

          {/* End Time */}
          <View style={{ flex: 1, gap: 10 }}>
            <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold' }}>End Time</Text>
            <TouchableOpacity
              onPress={() => setShowEnd(true)}
              style={{ borderWidth: 1, borderColor: '#334155', borderRadius: 10, padding: 15 }}
            >
              <Text style={{ color: endTime ? '#fff' : '#8f9eb3' }}>
                {endTime ? formatTime(endTime) : 'Select End Time'}
              </Text>
            </TouchableOpacity>
            {showEnd && (
              <DateTimePicker
                value={endTime || new Date()}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={(e, t) => handleTimeChange(e, t, 'end')}
              />
            )}
          </View>
        </View>
      </View>

      {/* Break Time */}
      <View style={{ gap: 20, padding: 10, marginTop: 10 }}>
        <Text style={{ color: '#8f9eb3', fontSize: 16, fontWeight: 'bold' }}>BREAK TIME</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {/* Hours */}
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#8f9eb3', fontSize: 14 }}>Hours</Text>
            <TextInput
              keyboardType="numeric"
              maxLength={2}
              value={breakHours.toString()}
              onChangeText={(val) => setBreakHours(Number(val) || 0)}
              style={{
                borderWidth: 1,
                borderColor: '#334155',
                borderRadius: 10,
                padding: 15,
                color: '#fff',
                textAlign: 'center'
              }}
              placeholder="0"
              placeholderTextColor="#8f9eb3"
            />
          </View>

          {/* Minutes */}
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#8f9eb3', fontSize: 14 }}>Minutes</Text>
            <TextInput
              keyboardType="numeric"
              maxLength={2}
              value={breakMinutes.toString()}
              onChangeText={(val) => setBreakMinutes(Number(val) || 0)}
              style={{
                borderWidth: 1,
                borderColor: '#334155',
                borderRadius: 10,
                padding: 15,
                color: '#fff',
                textAlign: 'center'
              }}
              placeholder="0"
              placeholderTextColor="#8f9eb3"
            />
          </View>
        </View>

        <Text style={{ color: '#8f9eb3' }}>
          Break in minutes: {breakHours * 60 + breakMinutes} mins
        </Text>
      </View>
    </SafeAreaView>
  )
}

export default OfficeSettings

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111a22',
  },
  header: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  generalSettingsContainer: {
    padding: 10,
    gap: 10,
  },
  tabContainer: {
    width: '100%',
  },
  tab: {
    width: '100%',
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }
})
