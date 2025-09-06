import * as Keychain from 'react-native-keychain';
// or import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVICE_NAME = 'USER_AUTH_TOKEN';

// Using Keychain (recommended)
export const storeToken = async (token) => {
  try {
    await Keychain.setInternetCredentials(SERVICE_NAME, 'user', token);
    return true;
  } catch (error) {
    console.error('Error storing token:', error);
    return false;
  }
};

export const getToken = async () => {
  try {
    const credentials = await Keychain.getInternetCredentials(SERVICE_NAME);
    return credentials ? credentials.password : null;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await Keychain.resetInternetCredentials(SERVICE_NAME);
    return true;
  } catch (error) {
    console.error('Error removing token:', error);
    return false;
  }
};

export const hasToken = async () => {
  const token = await getToken();
  return !!token;
};