import {  StyleSheet } from 'react-native'
import React, {  useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePageNav from './screens/homePage/HomePageNav';
import SettingsScreen from './screens/SettingsScreen';
import ProfileScreen from './screens/ProfileScreen';
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontAwesome5, AntDesign } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const FirstPage = ({ route }: { route: any }) => {
    
    const { user } = route.params;
    
    const [modalVisible1, setModalVisible1] = useState(false);
    const openModal1 = () => {
        setModalVisible1(true);

    };
    const closeModal1 = () => {
        setModalVisible1(false);
    };
    const handleDateSelect1 = (selectedDate) => {
        // Handle the selected date here
        console.log(selectedDate);
        // Close the modal
        closeModal1();
    };
    
  return (
   
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
            initialParams={{ user: user }}

            options={{
              tabBarIcon: ({ color }) => (<FontAwesome5 name="user-circle" size={20} color={color} />),
              tabBarBadge: 3,
              headerTintColor: "#e63c4c",
              headerShown: true,
            }}
          />

        </Tab.Navigator>
     
  )
}

export default FirstPage

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        padding: 0,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        marginTop: 22,
    },
    modalView: {
        flex:1,
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalContainer: {
        flex: 1,
        paddingTop:10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },

})