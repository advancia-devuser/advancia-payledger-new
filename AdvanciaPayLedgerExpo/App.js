import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider } from './contexts/AuthContext';
import { DashboardProvider } from './contexts/DashboardContext';
import DashboardScreen from './screens/DashboardScreen';
import FacilitiesScreen from './screens/FacilitiesScreen';
import PaymentsScreen from './screens/PaymentsScreen';
import AppointmentsScreen from './screens/AppointmentsScreen';
import BedsScreen from './screens/BedsScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'trending-up' : 'trending-up-outline';
          } else if (route.name === 'Facilities') {
            iconName = focused ? 'business' : 'business-outline';
          } else if (route.name === 'Payments') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Appointments') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Beds') {
            iconName = focused ? 'bed' : 'bed-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
        },
        headerTintColor: '#1f2937',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Advancia PayLedger' }}
      />
      <Tab.Screen 
        name="Facilities" 
        component={FacilitiesScreen}
        options={{ title: 'Facilities' }}
      />
      <Tab.Screen 
        name="Payments" 
        component={PaymentsScreen}
        options={{ title: 'Payments' }}
      />
      <Tab.Screen 
        name="Appointments" 
        component={AppointmentsScreen}
        options={{ title: 'Appointments' }}
      />
      <Tab.Screen 
        name="Beds" 
        component={BedsScreen}
        options={{ title: 'Bed Management' }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <DashboardProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </DashboardProvider>
    </AuthProvider>
  );
};

export default App;
