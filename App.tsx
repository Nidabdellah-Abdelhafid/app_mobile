import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './components/auth/LoginScreen';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig'; // Corrected import path
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from 'components/screens/ProfileScreen';
import RegisterScreen from 'components/auth/RegisterScreen';
import SettingsScreen from 'components/screens/SettingsScreen';
import Ionicons from "@expo/vector-icons/Ionicons";
import SplashScreen from 'components/splash/SplashScreen';
import { FontAwesome5, AntDesign } from '@expo/vector-icons';
import HomePageNav from 'components/screens/homePage/HomePageNav';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();



export default function App() {
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
    <GestureHandlerRootView style={{flex:1}}>
    <NavigationContainer>
      {user ? (
        <Tab.Navigator screenOptions={{
          tabBarLabelPosition: "below-icon",
          tabBarShowLabel: true,
          tabBarActiveTintColor: "#e63c4c"
        }} >
          <Tab.Screen name='Explorer' component={HomePageNav}
            options={{
              tabBarIcon: ({ color }) => (<Ionicons name='search' size={20} color={color} />),
              headerTintColor: "#e63c4c",
              headerShown: false,

            }}
          />

          <Tab.Screen name='Favoris' component={SettingsScreen}
            options={{
              tabBarIcon: ({ color }) => (<AntDesign name="hearto" size={20} color={color} />),
              headerShown: true,
              headerTintColor: "#e63c4c"
            }}
          />
          <Tab.Screen name='Profil' component={ProfileScreen}
            initialParams={{ user: user?.email }}

            options={{
              tabBarIcon: ({ color }) => (<FontAwesome5 name="user-circle" size={20} color={color} />),
              tabBarBadge: 3,
              headerTintColor: "#e63c4c",
              headerShown: true,
            }}
          />

        </Tab.Navigator>
      ) : (
        <Stack.Navigator initialRouteName='Login'>
          <Stack.Screen name='SplashScr' component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name='LoginScreen' component={LoginScreen}
            options={{
              headerShown: false,

            }} />
          <Stack.Screen name='RegisterScreen' component={RegisterScreen} options={{ headerShown: false }} />
        </Stack.Navigator>

      )}
    </NavigationContainer>
    </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
