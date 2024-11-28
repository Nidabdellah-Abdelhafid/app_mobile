import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './components/auth/LoginScreen';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig'; 
import RegisterScreen from 'components/auth/RegisterScreen';
import SplashScreen from 'components/splash/SplashScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainComponent from 'components/MainComponent';
// import registerNNPushToken from 'native-notify';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

const Stack = createNativeStackNavigator();

export default function App() {
  // registerNNPushToken(21747, 'spLw6CdkKa0b9OuXBZH7ba');
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // Reanimated runs in strict mode by default
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
            <Stack.Navigator
              initialRouteName="MainComponent"
              id="MainComponent" // Added the id prop here
            >
              <Stack.Screen 
                name="MainComponent" 
                component={MainComponent} 
                options={{ headerShown: false }} 
                initialParams={{ user: user?.email }} 
              />
            </Stack.Navigator>
          ) : (
            <Stack.Navigator
              initialRouteName="SplashScr"
              id="authNavigator" // Added the id prop here as well
            >
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
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
