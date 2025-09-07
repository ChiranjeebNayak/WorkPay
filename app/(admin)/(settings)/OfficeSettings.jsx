import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getToken } from '../../../services/ApiService';

function OfficeSettings() {
  const [formData, setFormData] = useState({
    startTime: null,
    endTime: null,
    breakTime: 0,
    latitude: null,
    longitude: null
  });
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchOfficeDetails = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:5000/api/offices/`, {
        headers: {
          authorization: `Bearer ${await getToken()}`
        }
      });

      // Populate form data with fetched data
      const data = response.data;
      setFormData({
        startTime: data.checkin ? new Date(data.checkin) : null,
        endTime: data.checkout ? new Date(data.checkout) : null,
        breakTime: data.breakTime || 0,
        latitude: data.latitude || null,
        longitude: data.longitude || null
      });
    } catch (error) {
      console.error('Error fetching office details:', error);
    }
  }

  const updateOfficeSettings = async () => {
    try {
      setIsLoading(true);
      
      // Format time to send only time part without timezone conversion
      const formatTimeForAPI = (date) => {
        if (!date) return null;
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `1970-01-01T${hours}:${minutes}:00.000Z`;
      };
      
      const response = await axios.put(`http://10.0.2.2:5000/api/offices/`, {
        checkin: formatTimeForAPI(formData.startTime),
        checkout: formatTimeForAPI(formData.endTime),
        breakTime: formData.breakTime,
        latitude: formData.latitude,
        longitude: formData.longitude
      }, {
        headers: {
          authorization: `Bearer ${await getToken()}`
        }
      });
      Alert.alert('Success', 'Office settings updated successfully!');
    } catch (error) {
      console.error('Error updating office settings:', error);
      Alert.alert('Error', 'Failed to update office settings');
    } finally {
      setIsLoading(false);
    }
  }

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Permission to access location was denied');
        return;
      }

      // Get current position
      let location = await Location.getCurrentPositionAsync({});
      
      setFormData(prev => ({
        ...prev,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }));
      
      Alert.alert('Success', 'Current location captured successfully!');
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get current location');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  useEffect(() => {
    fetchOfficeDetails();
  }, [])

  const handleTimeChange = (event, selectedTime, type) => {
    if (event.type === 'dismissed') {
      type === 'start' ? setShowStart(false) : setShowEnd(false);
      return;
    }
    const currentTime = selectedTime || new Date();
    if (type === 'start') {
      setShowStart(false);
      updateFormData('startTime', currentTime);
    } else {
      setShowEnd(false);
      updateFormData('endTime', currentTime);
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getBreakHours = () => Math.floor(formData.breakTime / 60);
  const getBreakMinutes = () => formData.breakTime % 60;

  const updateBreakTime = (hours, minutes) => {
    const totalMinutes = (hours * 60) + minutes;
    updateFormData('breakTime', totalMinutes);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Office Settings</Text>

      {/* general settings   */}
      <View style={styles.generalSettingsContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#8f9eb3', fontSize: 16, fontWeight: 'bold' }}>GENERAL</Text>
          <TouchableOpacity
            onPress={updateOfficeSettings}
            disabled={isLoading}
            style={{
              backgroundColor: '#1173d4',
              paddingHorizontal: 15,
              paddingVertical: 8,
              borderRadius: 8,
              opacity: isLoading ? 0.6 : 1
            }}
          >
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>
              {isLoading ? 'Updating...' : 'Update'}
            </Text>
          </TouchableOpacity>
        </View>
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
        <View style={{ gap: 15 }}>
          <View style={{ gap: 10 }}>
            <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold' }}>Coordinates</Text>
            <View style={{ 
              borderWidth: 1, 
              borderColor: '#334155', 
              borderRadius: 10, 
              padding: 15,
              backgroundColor: '#1e293b'
            }}>
              <Text style={{ color: formData.latitude && formData.longitude ? '#fff' : '#8f9eb3' }}>
                {formData.latitude && formData.longitude 
                  ? `Lat: ${formData.latitude.toFixed(6)}, Lng: ${formData.longitude.toFixed(6)}`
                  : 'No location set'
                }
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            onPress={getCurrentLocation}
            disabled={isLoading}
            style={{
              backgroundColor: '#059669',
              padding: 15,
              borderRadius: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              opacity: isLoading ? 0.6 : 1
            }}
          >
            <AntDesign name="enviromento" size={20} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
              {isLoading ? 'Getting Location...' : 'Get Current Location'}
            </Text>
          </TouchableOpacity>
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
              <Text style={{ color: formData.startTime ? '#fff' : '#8f9eb3' }}>
                {formData.startTime ? formatTime(formData.startTime) : 'Select Start Time'}
              </Text>
            </TouchableOpacity>
            {showStart && (
              <DateTimePicker
                value={formData.startTime || new Date()}
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
              <Text style={{ color: formData.endTime ? '#fff' : '#8f9eb3' }}>
                {formData.endTime ? formatTime(formData.endTime) : 'Select End Time'}
              </Text>
            </TouchableOpacity>
            {showEnd && (
              <DateTimePicker
                value={formData.endTime || new Date()}
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
              value={getBreakHours().toString()}
              onChangeText={(val) => updateBreakTime(Number(val) || 0, getBreakMinutes())}
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
              value={getBreakMinutes().toString()}
              onChangeText={(val) => updateBreakTime(getBreakHours(), Number(val) || 0)}
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
          Break in minutes: {formData.breakTime} mins
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