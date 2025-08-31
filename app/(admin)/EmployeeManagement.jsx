import React from 'react'
import { View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

function EmployeeManagement() {
  return (
    <SafeAreaProvider>
        <View>
            <Text>Employee Management</Text>
        </View>
    </SafeAreaProvider>
  )
}

export default EmployeeManagement