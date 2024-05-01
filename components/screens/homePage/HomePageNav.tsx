import { View, StyleSheet, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './HomePage';
import DetailPage from '../listingPage/DetailPage';

const Stack = createNativeStackNavigator();


const HomePageNav = () => {
  
  return (
    <View style={styles.container}>
      <Stack.Navigator>
        <Stack.Screen name='HomePage' component={HomePage}
          options={{
            headerShown: false,

          }} />
        <Stack.Screen name='DetailPage' component={DetailPage}
          options={{
            headerTitle: ''
          }} />
      </Stack.Navigator>
    </View>
  )
}

export default HomePageNav;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})