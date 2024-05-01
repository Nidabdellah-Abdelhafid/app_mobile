import { View, Text, StyleSheet, Button } from "react-native";
import { NavigationProp } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { useEffect } from "react";
interface RouterProps {
  navigation: NavigationProp<any,any>;

}


const SplashScreen = ({navigation}) => {
    useEffect(() => {
        // Navigate to the main screen after the animation finishes
        setTimeout(() => {
        navigation.replace('LoginScreen');
        }, 3000); // Adjust the timeout based on the animation duration
    }, []);
    return (
        <View style={styles.container}>
        <LottieView source={require('../../assets/splash.json')} autoPlay loop={false} style={{width:400,height:400}}/>
        </View>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:'#fb5b5a'
},
text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
},
});