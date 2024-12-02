import { View, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from "./HomePage";
import DetailPage from "../listingPage/DetailPage";
import DetailOffre from "../listingPage/DetailOffre";

const Stack = createStackNavigator();

const HomePageNav = ({ route, navigation }) => {
  const { user, searchQuery } = route.params || {};

  useEffect(() => {
    // console.log("searchQuery in the HomePageNav :", searchQuery);
    if (searchQuery === "") {
      navigation.setParams({ searchQuery: "" }); // Reset `searchQuery`
    }
  }, [searchQuery]);


  return (
    <View style={styles.container}>
      <Stack.Navigator initialRouteName="HomePage">
        <Stack.Screen
          name="HomePage"
          component={HomePage}
          initialParams={{ user, searchQuery }}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="DetailPage"
          component={DetailPage}
          options={{
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name="DetailOffre"
          component={DetailOffre}
          initialParams={{ user }}
          options={{
            headerTitle: "",
          }}
        />
      </Stack.Navigator>
    </View>
  );
};

export default HomePageNav;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
