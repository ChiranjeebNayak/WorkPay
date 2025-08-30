import { Stack } from 'expo-router'
import React from 'react'

function HomeLayout() {
  return (
    <Stack>
        <Stack.Screen name="Home" options={{ headerShown: false }} />
        <Stack.Screen name="EmployeeProfile" options={{ headerShown: false }} />
    </Stack>
    
  )
}

export default HomeLayout