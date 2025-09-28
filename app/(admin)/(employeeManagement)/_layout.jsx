import { Stack } from 'expo-router'


function EmployeeLayout() {
  return (
     <Stack>
        <Stack.Screen name="EmployeeManagement" options={{ headerShown: false }} />
        <Stack.Screen name="EmployeeDetails" options={{ headerShown: false }} />
     </Stack>
  )
}

export default EmployeeLayout