import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator,
  TextInput
} from 'react-native';
import { HeartPulse, DollarSign, BarChart3, Users, Settings, Home } from 'lucide-react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// API Configuration
const API_BASE = 'http://localhost:3001';
const ANALYTICS_BASE = 'http://localhost:3002';

// Dashboard Screen
function DashboardScreen({ navigation }) {
  const [revenue, setRevenue] = useState(247000);
  const [transactions, setTransactions] = useState(1847);
  const [facilities, setFacilities] = useState(24);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/revenue/analytics`);
      const data = await response.json();
      setRevenue(data.mrr || 247000);
      setTransactions(data.totalTransactions || 1847);
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <HeartPulse size={32} color="#3b82f6" />
        <Text style={styles.title}>Advancia PayLedger</Text>
        <Text style={styles.subtitle}>Healthcare Fintech Platform</Text>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <DollarSign size={24} color="#10b981" />
          <Text style={styles.metricValue}>${(revenue / 1000).toFixed(0)}K</Text>
          <Text style={styles.metricLabel}>Monthly Revenue</Text>
          <Text style={styles.metricChange}>+18.2%</Text>
        </View>

        <View style={styles.metricCard}>
          <BarChart3 size={24} color="#3b82f6" />
          <Text style={styles.metricValue}>{transactions}</Text>
          <Text style={styles.metricLabel}>Transactions</Text>
          <Text style={styles.metricChange}>+15.3%</Text>
        </View>

        <View style={styles.metricCard}>
          <Users size={24} color="#8b5cf6" />
          <Text style={styles.metricValue}>{facilities}</Text>
          <Text style={styles.metricLabel}>Facilities</Text>
          <Text style={styles.metricChange}>+8.3%</Text>
        </View>
      </View>

      <View style={styles.actionSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Payments')}
        >
          <DollarSign size={20} color="white" />
          <Text style={styles.actionButtonText}>Process Payment</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Analytics')}
        >
          <BarChart3 size={20} color="white" />
          <Text style={styles.actionButtonText}>View Analytics</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Facilities')}
        >
          <Users size={20} color="white" />
          <Text style={styles.actionButtonText}>Manage Facilities</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      )}
    </ScrollView>
  );
}

// Payment Processing Screen
function PaymentsScreen() {
  const [amount, setAmount] = useState('');
  const [blockchain, setBlockchain] = useState('solana');
  const [processing, setProcessing] = useState(false);

  const processPayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(`${API_BASE}/api/payments/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          blockchain: blockchain,
          facilityId: 'demo_facility',
          description: 'Mobile payment processing'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        Alert.alert(
          'Payment Processed',
          `Amount: $${amount}\nFees: $${data.fees.total.toFixed(2)}\nNet: $${data.netAmount.toFixed(2)}`
        );
        setAmount('');
      } else {
        Alert.alert('Error', 'Payment processing failed');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      Alert.alert('Error', 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <DollarSign size={32} color="#3b82f6" />
        <Text style={styles.title}>Payment Processing</Text>
        <Text style={styles.subtitle}>2.5% Processing Fee</Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.label}>Amount ($)</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter amount"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Blockchain Network</Text>
        <View style={styles.blockchainOptions}>
          {['solana', 'ethereum', 'polygon', 'base'].map((network) => (
            <TouchableOpacity
              key={network}
              style={[
                styles.blockchainOption,
                blockchain === network && styles.selectedBlockchain
              ]}
              onPress={() => setBlockchain(network)}
            >
              <Text style={[
                styles.blockchainText,
                blockchain === network && styles.selectedBlockchainText
              ]}>
                {network.charAt(0).toUpperCase() + network.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.processButton}
          onPress={processPayment}
          disabled={processing}
        >
          {processing ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.processButtonText}>Process Payment</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Analytics Screen
function AnalyticsScreen() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${ANALYTICS_BASE}/api/analytics/advanced`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Analytics fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading Analytics...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <BarChart3 size={32} color="#3b82f6" />
        <Text style={styles.title}>Advanced Analytics</Text>
        <Text style={styles.subtitle}>AI-Powered Insights</Text>
      </View>

      {analytics && (
        <View style={styles.analyticsSection}>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsTitle}>Revenue Performance</Text>
            <Text style={styles.analyticsValue}>
              ${analytics.metrics?.revenuePerformance?.totalRevenue?.toLocaleString() || '247,000'}
            </Text>
            <Text style={styles.analyticsChange}>
              {analytics.metrics?.revenuePerformance?.growthRate || '+18.2%'}
            </Text>
          </View>

          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsTitle}>Transaction Analytics</Text>
            <Text style={styles.analyticsValue}>
              {analytics.metrics?.transactionAnalytics?.totalTransactions || '1,847'}
            </Text>
            <Text style={styles.analyticsChange}>
              Success Rate: {analytics.metrics?.transactionAnalytics?.successRate || '98.7%'}
            </Text>
          </View>

          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsTitle}>AI Insights</Text>
            <Text style={styles.analyticsText}>
              {analytics.aiInsights?.keyInsights?.[0] || 'Revenue growth driven by blockchain adoption'}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// Facilities Management Screen
function FacilitiesScreen() {
  const [facilities, setFacilities] = useState([
    { id: 1, name: 'City General Hospital', type: 'Hospital', status: 'Active' },
    { id: 2, name: 'MedCare Clinic', type: 'Clinic', status: 'Active' },
    { id: 3, name: 'Dental Plus', type: 'Dental', status: 'Active' },
  ]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Users size={32} color="#3b82f6" />
        <Text style={styles.title}>Facilities</Text>
        <Text style={styles.subtitle}>Manage Healthcare Providers</Text>
      </View>

      <View style={styles.facilitiesSection}>
        {facilities.map((facility) => (
          <View key={facility.id} style={styles.facilityCard}>
            <View style={styles.facilityHeader}>
              <Text style={styles.facilityName}>{facility.name}</Text>
              <View style={[styles.statusBadge, styles.activeStatus]}>
                <Text style={styles.statusText}>{facility.status}</Text>
              </View>
            </View>
            <Text style={styles.facilityType}>{facility.type}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add New Facility</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Settings Screen
function SettingsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Settings size={32} color="#3b82f6" />
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Platform Configuration</Text>
      </View>

      <View style={styles.settingsSection}>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Processing Fee Rate</Text>
          <Text style={styles.settingValue}>2.5%</Text>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Default Blockchain</Text>
          <Text style={styles.settingValue}>Solana</Text>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>API Status</Text>
          <Text style={[styles.settingValue, styles.onlineStatus]}>Online</Text>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Version</Text>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}

// Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let IconComponent;
          
          if (route.name === 'Dashboard') {
            IconComponent = Home;
          } else if (route.name === 'Payments') {
            IconComponent = DollarSign;
          } else if (route.name === 'Analytics') {
            IconComponent = BarChart3;
          } else if (route.name === 'Facilities') {
            IconComponent = Users;
          } else if (route.name === 'Settings') {
            IconComponent = Settings;
          }

          return <IconComponent size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Payments" component={PaymentsScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Facilities" component={FacilitiesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 5,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 10,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 5,
  },
  metricChange: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
    marginTop: 5,
  },
  actionSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  formSection: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  blockchainOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  blockchainOption: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedBlockchain: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  blockchainText: {
    color: '#1f2937',
    fontWeight: '500',
  },
  selectedBlockchainText: {
    color: 'white',
  },
  processButton: {
    backgroundColor: '#10b981',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  processButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  analyticsSection: {
    padding: 20,
  },
  analyticsCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  analyticsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 10,
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  analyticsChange: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  analyticsText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  facilitiesSection: {
    padding: 20,
  },
  facilityCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  facilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  facilityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeStatus: {
    backgroundColor: '#10b981',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  facilityType: {
    fontSize: 14,
    color: '#6b7280',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  settingsSection: {
    padding: 20,
  },
  settingItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#1f2937',
  },
  settingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  onlineStatus: {
    color: '#10b981',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6b7280',
  },
});
