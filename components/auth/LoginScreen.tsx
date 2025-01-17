import { StyleSheet, View, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, ScrollView, Image, Platform, Alert, ToastAndroid, Button, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { NavigationProp } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import { SvgUri } from 'react-native-svg';
import { FontAwesome6 } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay'
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { URL_BACKEND } from 'api';
import Config from 'react-native-config';

const apiUrl = Config.API_URL;
interface RouterProps {
  navigation: NavigationProp<any, any>;

}

const LoginScreen = ({ navigation }: RouterProps) => {
  
  const storeToken = async (token) => {
    console.log("stor :", token);
    try {
      await SecureStore.setItemAsync('jwtToken', token);
      console.log("Token stored successfully.");
    } catch (error) {
      console.log("Error storing token:", error);
    }
  };

  const removeToken=async ()=>{
    try{
      await SecureStore.deleteItemAsync('jwtToken');
      console.log("Token removed successfully.");
    }catch(err){
      console.log("remove error:",err)
    }
  }
  
  const getToken = async () => {
    try {
      const token = await SecureStore.getItemAsync('jwtToken');
      console.log("Fetched token:", token);
      return token;
    } catch (error) {
      console.log("Error fetching token:", error);
    }
  };

  const logn = async (data :{ email: string,password:string}) => {
    try {
      const response = await axios.post('https://app-spg.onrender.com/login', 
      JSON.stringify(data), 
      {
        headers: {
          'Content-Type': 'application/json' 
        }
      }
      );
      const token = response.data.access_token;
      // Store the token securely (use AsyncStorage or SecureStorage)
      storeToken(token);
      console.log('Login successful', token);
    } catch (error) {
      console.error('Login failed', error);
    }
  }
  
  const pays = async () => {
    try { 
      const token = await getToken();  // Ensure the token is fetched properly before using it
      console.log("Fetched Token: ", token);
  
      if (token) {
        const response = await axios.get('https://app-spg.onrender.com/api/pays', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log('Data:', response.data);
      } else {
        console.error("No token found.");
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };
  

  

  const [dataUser,setDataUser] = useState({email:"hafidnid909@gmail.com",password: "yxcvbnm123"})
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(true);
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const [hasPasswordInputStarted, setHasPasswordInputStarted] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const auth = FIREBASE_AUTH;
  const [exitingEmail, setExitingEmail] = useState(false);
  const [exitingPassword, setExitingPassword] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);


  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [isButtonPressedApple, setIsButtonPressedApple] = useState(false);
  const [isButtonPressedGoogle, setIsButtonPressedGoogle] = useState(false);
  const [isButtonPressedFacebook, setIsButtonPressedFacebook] = useState(false);

  const handleInputFocus = () => {
    setIsInputFocused(true);
    setIsButtonPressed(false);
    setIsButtonPressedApple(false)
    setIsButtonPressedGoogle(false)
    setIsButtonPressedFacebook(false)
  };


  const handleButtonPress = () => {
    setIsButtonPressed(true);
    setIsInputFocused(false);
    setIsButtonPressedApple(false)
    setIsButtonPressedGoogle(false)
    setIsButtonPressedFacebook(false)
  };

  //


  const fetchAllUsers = async () => {
    try {
      const usersCollection = collection(FIREBASE_DB, 'users');
      const querySnapshot = await getDocs(usersCollection);


      querySnapshot.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() });
      });

      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  // Usage


  useEffect(() => {
    fetchAllUsers()
    // logn(dataUser);
    // setTimeout(()=>{
    //   pays();
    //   setTimeout(()=>{
    //     removeToken();
    //     pays();
    //   },5000) 
    // },3000)
  }, []);

  const handleInputEmailChange = (text) => {
    setEmail(text);
    if (users.some(user => user.email === text)) {
      setExitingEmail(true);
    } else {
      setExitingEmail(false);
    }
  };

  const handleInputPasswordChange = (text) => {
    setPassword(text);
    if (text === "") {
      setExitingPassword(false);
    } else {
      setExitingPassword(true);
    }
  };

  const handlePasswordChange = (text) => {
    setHasPasswordInputStarted(true);
    handleInputPasswordChange(text);
  };

  const handleShowPasswordInput = () => {
    if (exitingEmail) {
      setShowEmailInput(false);
      setShowPasswordInput(true);
      handleButtonPress();
    }
  };

  const resetPasswordInput = () => {
    setPassword("");
    setHasPasswordInputStarted(false);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };


  const handleLogin = async () => {
    handleButtonPress();

    // Validation
    let isValid = true;
    if (!email.trim()) {
      isValid = false;
      if (Platform.OS === 'android') {
        return (ToastAndroid.show('The email is required!', ToastAndroid.SHORT))
      } else {
        return (Alert.alert('Sign-in failed', 'The email is required!'))
      }

    } else if (!/\S+@\S+\.\S+/.test(email)) {

      isValid = false;
      if (Platform.OS === 'android') {
        return (ToastAndroid.show('Invalid email format!', ToastAndroid.SHORT))
      } else {
        return (Alert.alert('Sign-in failed', 'Invalid email format!'))
      }
    }
    if (!password.trim()) {

      isValid = false;
      if (Platform.OS === 'android') {
        return (ToastAndroid.show('The password is required!', ToastAndroid.SHORT))
      } else {
        return (Alert.alert('Sign-in failed', 'The password is required!'))
      }
    }

    if (isValid) {
      try {
        setLoading(true);
        const response = await signInWithEmailAndPassword(auth, email, password);


      } catch (error) {
        if (Platform.OS === 'android') {
          ToastAndroid.show('Sign-in failed, the email or password is incorrect!', ToastAndroid.LONG);
          setShowEmailInput(true);
          setShowPasswordInput(false);
          setExitingEmail(false);
          setExitingPassword(false);
          resetPasswordInput();
        } else {
          Alert.alert('Sign-in failed', 'The email or password is incorrect!');
        }
      } finally {
        setLoading(false);

      }
    } else {

    }
  };

  const handleRegister = () => {
    navigation.navigate('RegisterScreen');
  };
  const handleLoginApple = () => {
    setIsButtonPressedApple(true)
    setIsButtonPressedGoogle(false)
    setIsButtonPressedFacebook(false)
  };
  const handleLoginGoogle = () => {
    setIsButtonPressedGoogle(true)
    setIsButtonPressedApple(false)
    setIsButtonPressedFacebook(false)
  };
  const handleLoginFaceBook = () => {
    setIsButtonPressedFacebook(true)
    setIsButtonPressedApple(false)
    setIsButtonPressedGoogle(false)
  };
  const [searchWord, setSearchWord] = useState('');

  const fetchData = async () => {
    try {
      const response = await fetch(`http://192.168.11.106:1337/api/${searchWord}?populate=*`);
      const data = await response.json();
      console.log('Result:', data.data[0]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <Animatable.View animation="fadeInUp" style={styles.container}>
      <Spinner visible={loading} />
      <ImageBackground source={{ uri: 'https://s3.eu-west-1.amazonaws.com/fractalitetest/2024-06-10T10:37:53.426190693_login%20g@2x.png' }} style={styles.containerBg}>

        <KeyboardAvoidingView behavior='padding' style={styles.kybcontainer}>
          {/* <ScrollView contentContainerStyle={styles.scrollContainer}> */}
          <SvgUri
            width="140"
            height="140"
            uri="https://atlasvoyages.com/assets/images/Logo.svg"
            style={styles.imageLogo}
          />
          {showEmailInput && (
            <View style={styles.inputViewO}>
              {exitingEmail ?
                <Text style={{ color: 'green', marginBottom: 10, marginLeft: 35, fontWeight: '600', fontSize: 17 }}>Correct </Text>
                :

                <Text></Text>
              }
              <View style={styles.parentView}>
                <View style={styles.inputView}>
                  <TextInput
                    style={[styles.inputText, isInputFocused && styles.inputFocused]}
                    onFocus={handleInputFocus}
                    placeholder="Email..."
                    placeholderTextColor="#444"
                    onChangeText={handleInputEmailChange}
                  />

                </View>
                {exitingEmail ?
                  <AntDesign name="check" size={20} color="green" style={styles.iconv} />
                  :
                  <></>
                }


              </View>
            </View>
          )}

          {showPasswordInput && (

            <View style={styles.inputViewO}>
              {exitingPassword && hasPasswordInputStarted ?
                <Text style={{ color: 'green', marginBottom: 10, marginLeft: 35, fontWeight: '600', fontSize: 16 }}> </Text>
                : hasPasswordInputStarted ?
                  <Text style={{ color: 'red', marginBottom: 10, marginLeft: 35, fontWeight: '500', fontSize: 16 }}> Veuillez insérer votre mot de passe </Text>
                  : null
              }
              <View style={styles.parentView}>
                <View style={styles.inputView}>
                  <TextInput
                    secureTextEntry={!isPasswordVisible}
                    onFocus={handleInputFocus}
                    style={[styles.inputText, isInputFocused && styles.inputFocused]}
                    placeholder="Mot de passe"
                    placeholderTextColor="#444"
                    onChangeText={handlePasswordChange}
                  />
                  <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconView}>
                    {isPasswordVisible ? (
                      <FontAwesome6 name="eye-slash" size={20} color="black" />
                    ) : (
                      <FontAwesome6 name="eye" size={20} color="black" />
                    )}
                  </TouchableOpacity>
                </View>
                {exitingPassword && hasPasswordInputStarted ?
                  <AntDesign />
                  : hasPasswordInputStarted ?
                    <FontAwesome6 name="xmark" size={20} color="red" style={styles.iconv} />
                    : null
                }
              </View>
            </View>
          )}

          <TouchableOpacity
            onPress={showPasswordInput ? handleLogin : handleShowPasswordInput}
            style={[styles.button2, isButtonPressed ? styles.buttonPressed : null]}
          >
            <Text style={[styles.loginText, isButtonPressed ? { color: 'black', fontSize: 20, fontWeight: '900' } : null]}>{showPasswordInput ? 'YALLA!' : 'YALLA!'}</Text>
          </TouchableOpacity>

          <View style={styles.registerv}>
            <Text style={{ color: 'white' }}>Don't have an account?</Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerText}>Sign up</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontWeight: '700', marginTop: 20, marginBottom: 20, color: 'white' }}>Or</Text>
          {/* <TextInput
        style={styles.input}
        placeholder="Enter a word"
        value={searchWord}
        onChangeText={text => setSearchWord(text)}
      />
        <Button
          title="Search"
          onPress={fetchData}
        /> */}

          <TouchableOpacity style={isButtonPressedApple ? styles.loginBtnOption2 : styles.loginBtnOption} onPress={handleLoginApple}>
            <AntDesign name="apple1" size={24} color={isButtonPressedApple ? "black" : "white"} style={styles.icon} />
            <Text style={isButtonPressedApple ? styles.loginTextOption2 : styles.loginTextOption}>Continue with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity style={isButtonPressedGoogle ? styles.loginBtnOption2 : styles.loginBtnOption} onPress={handleLoginGoogle}>
            <AntDesign name="google" size={24} color={isButtonPressedGoogle ? "black" : "white"} style={styles.icon} />
            <Text style={isButtonPressedGoogle ? styles.loginTextOption2 : styles.loginTextOption}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={isButtonPressedFacebook ? styles.loginBtnOption2 : styles.loginBtnOption} onPress={handleLoginFaceBook}>
            <Entypo name="facebook-with-circle" size={24} color={isButtonPressedFacebook ? "black" : "white"} style={styles.icon} />
            <Text style={isButtonPressedFacebook ? styles.loginTextOption2 : styles.loginTextOption}>Continue with Facebook</Text>
          </TouchableOpacity>
          {/* </ScrollView> */}
        </KeyboardAvoidingView>

      </ImageBackground>



    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  // keyboardAvoidingView: {
  //   flex: 1,
  // },
  // scrollContainer: {
  //   flexGrow: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },

  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  containerBg: {
    flex: 1,
    opacity: 0.9,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  kybcontainer: {
    alignItems: "center",

  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#fb5b5a',
    marginBottom: 40,
  },
  parentView: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  inputView: {
    width: '90%',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',

  },
  iconv: {
    marginRight: 15,
  },
  inputViewO: {
    width: '90%',
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    flex: 1,
    height: 50,
    color: 'white',
  },
  iconView: {
    marginBottom: 1,
  },
  loginBtnOption: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    borderColor: '#fff',
    borderWidth: 2,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 2,
    flexDirection: 'row'
  },
  loginBtnOption2: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#fff',
    borderWidth: 2,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 2,
    flexDirection: 'row'
  },
  icon: {
    marginLeft: 30,
    flex: 1
  },
  loginText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 20
  },

  loginTextOption: {
    color: 'white',
    flex: 3,
    fontWeight: '500',
  },
  loginTextOption2: {
    color: 'black',
    flex: 3,
    fontWeight: '500',
  },
  registerText: {
    color: '#fb5b5a',
    alignContent: 'flex-end',
    textAlign: 'center',
    justifyContent: 'flex-end',
    marginLeft: 5,

  },
  errorText: {
    color: 'red',
    height: 20,
    alignSelf: 'flex-start',

  },
  vErrors: {
    alignSelf: 'flex-start',
    width: '80%',
    marginLeft: 45,
    marginBottom: 20,
    marginTop: 0
  },
  imageLogo: {
    height: "30%",
    width: "80%",
    marginBottom: 60,
  },
  registerv: {
    marginTop: 10,
    flexDirection: "row"
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.4, // Set the opacity here (0.0 to 1.0)
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    // Other styles for your background image
  },
  inputFocused: {
    borderBottomColor: 'blue',
  },
  button2: {
    width: '62%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Default background color
    padding: 10,
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 15,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonPressed: {
    backgroundColor: 'white', // Change background color when pressed
  },
});

export default LoginScreen;