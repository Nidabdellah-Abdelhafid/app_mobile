import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; // Using Stack from '@react-navigation/stack'
import LoginScreen from './components/auth/LoginScreen';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig'; 
import RegisterScreen from 'components/auth/RegisterScreen';
import SplashScreen from 'components/splash/SplashScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainComponent from 'components/MainComponent';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { StatusBar } from "expo-status-bar";

const Stack = createStackNavigator();  // Use createStackNavigator instead

export default function App() {
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
  });

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    }, (error) => {
      console.error('Error subscribing to auth state changes:', error);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          {user ? (
            <Stack.Navigator initialRouteName="MainComponent">
              <Stack.Screen
                name="MainComponent"
                component={MainComponent}
                options={{ headerShown: false }}
                initialParams={{ user: user?.email || '' }}
              />
            </Stack.Navigator>
          ) : (
            <Stack.Navigator initialRouteName="SplashScr">
              <Stack.Screen
                name="SplashScr"
                component={SplashScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="RegisterScreen"
                component={RegisterScreen}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          )}
        </NavigationContainer>
        <StatusBar style="light" />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
