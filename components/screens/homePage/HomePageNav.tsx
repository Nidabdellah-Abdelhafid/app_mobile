import { View, StyleSheet, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './HomePage';
import DetailPage from '../listingPage/DetailPage';
import DetailOffre from '../listingPage/DetailOffre';
import { NavigationProp } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

interface RouterProps {
  navigation: NavigationProp<any,any>;
  route
}

const HomePageNav = ({ route ,navigation }:RouterProps) => {
  const { user } = route.params || {}; 
  return (
    <View style={styles.container}>
      <Stack.Navigator>
        <Stack.Screen name='HomePage' component={HomePage}
        initialParams={{ user }}  
          options={{
            headerShown: false,

          }} />
        <Stack.Screen name='DetailPage' component={DetailPage}
          options={{
            headerTitle: ''
          }} />
          <Stack.Screen name='DetailOffre' component={DetailOffre}
          initialParams={{ user }}  
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