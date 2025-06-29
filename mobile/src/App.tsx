/**
 * ZippyCoin Mobile Wallet - Main App Component
 */

import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  Alert,
  AppState,
  AppStateStatus,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NetInfo from '@react-native-community/netinfo';
import { Camera } from 'react-native-vision-camera';

// Redux store
import { store, persistor } from './store';

// Screens
import WelcomeScreen from './screens/WelcomeScreen';
import CreateWalletScreen from './screens/CreateWalletScreen';
import ImportWalletScreen from './screens/ImportWalletScreen';
import UnlockScreen from './screens/UnlockScreen';
import DashboardScreen from './screens/DashboardScreen';
import SendScreen from './screens/SendScreen';
import ReceiveScreen from './screens/ReceiveScreen';
import TransactionHistoryScreen from './screens/TransactionHistoryScreen';
import TrustDashboardScreen from './screens/TrustDashboardScreen';
import DeFiScreen from './screens/DeFiScreen';
import SettingsScreen from './screens/SettingsScreen';

// Components
import LoadingScreen from './components/LoadingScreen';
import BiometricAuthModal from './components/BiometricAuthModal';

// Services
import { WalletService } from './services/WalletService';
import { BiometricService } from './services/BiometricService';
import { StorageService } from './services/StorageService';

// Types
import { RootStackParamList, TabParamList } from './types/navigation';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  const isDarkMode = useColorScheme() === 'dark';
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'Send':
              iconName = 'send';
              break;
            case 'Receive':
              iconName = 'qr-code-scanner';
              break;
            case 'Trust':
              iconName = 'verified-user';
              break;
            case 'DeFi':
              iconName = 'trending-up';
              break;
            default:
              iconName = 'dashboard';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1c1c1e' : '#ffffff',
          borderTopColor: isDarkMode ? '#38383a' : '#e5e5e7',
        },
        headerStyle: {
          backgroundColor: isDarkMode ? '#1c1c1e' : '#ffffff',
        },
        headerTintColor: isDarkMode ? '#ffffff' : '#000000',
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Send" component={SendScreen} />
      <Tab.Screen name="Receive" component={ReceiveScreen} />
      <Tab.Screen name="Trust" component={TrustDashboardScreen} />
      <Tab.Screen name="DeFi" component={DeFiScreen} />
    </Tab.Navigator>
  );
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isWalletCreated, setIsWalletCreated] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    initializeApp();
    setupAppStateHandler();
    setupNetworkListener();
  }, []);

  const initializeApp = async () => {
    try {
      // Check if wallet exists
      const walletExists = await StorageService.hasWallet();
      setIsWalletCreated(walletExists);

      // Initialize services
      await WalletService.initialize();
      
      if (walletExists) {
        // Check if biometric is available and enabled
        const biometricAvailable = await BiometricService.isAvailable();
        const biometricEnabled = await StorageService.getBiometricEnabled();
        
        if (biometricAvailable && biometricEnabled) {
          setShowBiometricModal(true);
        }
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
      Alert.alert(
        'Initialization Error',
        'Failed to initialize the wallet. Please restart the app.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const setupAppStateHandler = () => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // Lock wallet when app goes to background
        setIsUnlocked(false);
      } else if (nextAppState === 'active' && isWalletCreated && !isUnlocked) {
        // Show unlock screen when app becomes active
        checkBiometricUnlock();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  };

  const setupNetworkListener = () => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
      
      if (!state.isConnected) {
        Alert.alert(
          'No Internet Connection',
          'Some features may not work properly without an internet connection.',
          [{ text: 'OK' }]
        );
      }
    });

    return unsubscribe;
  };

  const checkBiometricUnlock = async () => {
    try {
      const biometricAvailable = await BiometricService.isAvailable();
      const biometricEnabled = await StorageService.getBiometricEnabled();
      
      if (biometricAvailable && biometricEnabled) {
        setShowBiometricModal(true);
      }
    } catch (error) {
      console.error('Biometric check failed:', error);
    }
  };

  const handleBiometricSuccess = () => {
    setShowBiometricModal(false);
    setIsUnlocked(true);
  };

  const handleBiometricCancel = () => {
    setShowBiometricModal(false);
    // Could show PIN unlock as fallback
  };

  const handleWalletCreated = () => {
    setIsWalletCreated(true);
    setIsUnlocked(true);
  };

  const handleWalletUnlocked = () => {
    setIsUnlocked(true);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={isDarkMode ? '#000000' : '#ffffff'}
        />
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animationEnabled: true,
            }}
          >
            {!isWalletCreated ? (
              <>
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen 
                  name="CreateWallet" 
                  component={CreateWalletScreen}
                  initialParams={{ onWalletCreated: handleWalletCreated }}
                />
                <Stack.Screen 
                  name="ImportWallet" 
                  component={ImportWalletScreen}
                  initialParams={{ onWalletCreated: handleWalletCreated }}
                />
              </>
            ) : !isUnlocked ? (
              <Stack.Screen 
                name="Unlock" 
                component={UnlockScreen}
                initialParams={{ onUnlock: handleWalletUnlocked }}
              />
            ) : (
              <>
                <Stack.Screen name="Main" component={TabNavigator} />
                <Stack.Screen 
                  name="TransactionHistory" 
                  component={TransactionHistoryScreen}
                  options={{ 
                    headerShown: true,
                    title: 'Transaction History',
                    headerStyle: {
                      backgroundColor: isDarkMode ? '#1c1c1e' : '#ffffff',
                    },
                    headerTintColor: isDarkMode ? '#ffffff' : '#000000',
                  }}
                />
                <Stack.Screen 
                  name="Settings" 
                  component={SettingsScreen}
                  options={{ 
                    headerShown: true,
                    title: 'Settings',
                    headerStyle: {
                      backgroundColor: isDarkMode ? '#1c1c1e' : '#ffffff',
                    },
                    headerTintColor: isDarkMode ? '#ffffff' : '#000000',
                  }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>

        {/* Biometric Authentication Modal */}
        <BiometricAuthModal
          visible={showBiometricModal}
          onSuccess={handleBiometricSuccess}
          onCancel={handleBiometricCancel}
        />

        {/* Network Status Indicator */}
        {!isOnline && (
          <StatusIndicator 
            message="Offline Mode" 
            color="#ff9500" 
            isDark={isDarkMode}
          />
        )}
      </PersistGate>
    </Provider>
  );
};

// Simple status indicator component
const StatusIndicator: React.FC<{
  message: string;
  color: string;
  isDark: boolean;
}> = ({ message, color, isDark }) => (
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: color,
    color: 'white',
    textAlign: 'center',
    padding: 4,
    fontSize: 12,
    fontWeight: 'bold',
    zIndex: 9999,
  }}>
    {message}
  </div>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App; 