import { Stack } from 'expo-router';
import React from 'react'

function SettingsLayout() {
  return (
    <Stack>
           <Stack.Screen name="OfficeSettings" options={{ headerShown: false }} />
           <Stack.Screen name="HolidayManagement" options={{ headerShown: false }} />
    </Stack>
  )
}

export default SettingsLayout;