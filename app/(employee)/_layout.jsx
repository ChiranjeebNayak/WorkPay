import { Tabs } from 'expo-router';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 10 }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

let iconName;
switch (route.name.toLowerCase()) {
  case 'home':
    iconName = 'home-outline';
    break;
  case 'attendance':
    iconName = 'calendar-outline';
    break;
  case 'payment':
    iconName = 'card-outline';
    break;
  case 'leave':
    iconName = 'document-text-outline';
    break;
  default:
    iconName = 'ellipse-outline';
}

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            onPress={onPress}
            style={styles.tab}
          >
            <Ionicons
              name={iconName}
              size={24}
              color={isFocused ? '#1e90ff' : '#999'}
            />
            <Text style={{ color: isFocused ? '#1e90ff' : '#999', fontSize: 12 }}>
              {label.charAt(0).toUpperCase() + label.slice(1)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function EmployeeLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <CustomTabBar {...props} />}>
      <Tabs.Screen name="Home" options={{ title: 'Home' }} />
      <Tabs.Screen name="Attendance" options={{ title: 'Attendance' }} />
      <Tabs.Screen name="Payment" options={{ title: 'Payment' }} />
      <Tabs.Screen name="Leave" options={{ title: 'Leaves' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#192633',
    paddingTop: 10,
  },
  tab: {
    alignItems: 'center',
  },
});
