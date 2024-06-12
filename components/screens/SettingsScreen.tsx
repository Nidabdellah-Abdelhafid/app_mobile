import { View, Text, StyleSheet, Button } from "react-native";
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { URL_BACKEND } from "api";

interface RouterProps {
  navigation: NavigationProp<any,any>;

}

const SettingsScreen = ({navigation}: RouterProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>SettingsScreen</Text>
      <Button onPress={()=> FIREBASE_AUTH.signOut()} title="Logout"/>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});