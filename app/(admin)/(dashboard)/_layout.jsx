import { Stack } from 'expo-router'
import React from 'react'

function DashboardLayout() {
  return (
    <Stack>
        <Stack.Screen name="Dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="LeaveRequests" options={{ headerShown: false }} />
    </Stack>
  )
}

export default DashboardLayout