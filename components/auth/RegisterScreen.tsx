import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Image,
  ScrollView,
  Platform,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { NavigationProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import * as Animatable from 'react-native-animatable';
import { Entypo } from '@expo/vector-icons';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const RegisterScreen = ({ navigation }: RouterProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number | string>('');
  const [country, setCountry] = useState('');
  const [countryCode, setCountryCode] = useState('US');
  const [callingCode, setCallingCode] = useState('1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const auth = FIREBASE_AUTH;
  const storage = getStorage();

  useEffect(() => {
    const num = `+${callingCode}${phoneNumber}`;
    setPhone_number(num);
  }, [callingCode, phoneNumber]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    if (!validateInput()) return;

    try {
      const resp = await fetch(image!);
      const blob = await resp.blob();
      const storageRef = ref(storage, 'profileImage/' + Date.now() + '.jpg');
      await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(auth.currentUser!, {
        handleCodeInApp: true,
        url: 'https://base-stage.firebaseapp.com',
      });

      alert('Check your email for verification!');

      const uploadTask = uploadBytes(storageRef, blob);
      const snapshot = await getDownloadURL((await uploadTask).ref);

      const userData = {
        image: snapshot,
        fullName: fullName,
        email: email,
        phone_Number: phone_number,
        age: age,
        country: country,
      };

      const docRef = await addDoc(collection(FIREBASE_DB, 'users'), userData);

      if (docRef.id) {
        navigation.navigate('RegisterScreen');
        alert('User added successfully!');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const validateInput = () => {
    let isValid = true;

    if (!fullName.trim()) {
      showError('The full name is required!');
      isValid = false;
    } else if (!email.trim()) {
      showError('The email is required!');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      showError('Invalid email format!');
      isValid = false;
    } else if (!password.trim()) {
      showError('The password is required!');
      isValid = false;
    } else if (!phone_number) {
      showError('The phone number is required!');
      isValid = false;
    } else if (!age) {
      showError('The age is required!');
      isValid = false;
    } else if (!country.trim()) {
      showError('The country is required!');
      isValid = false;
    }

    return isValid;
  };

  const showError = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Sign-in failed', message);
    }
  };

  const onSelectCountry = (country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Animatable.Text animation="fadeInLeftBig" style={styles.text}>
          Create a new account!
        </Animatable.Text>
      </View>
      <Animatable.View animation="fadeInUp" style={styles.viewAnimated}>
        <ScrollView>
          <KeyboardAvoidingView behavior="padding" style={styles.kybcontainer}>
            <View style={styles.image}>
              <TouchableOpacity onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.imageUp} />
                ) : (
                  <Image source={require('./../../assets/imgp.jpeg')} style={styles.imageUpint} />
                )}
                <View style={{ alignItems: 'center' }}>
                  <Entypo name="upload" size={25} color="#555" />
                  <Text style={{ color: '#555', fontSize: 14, fontWeight: '700' }}>Upload Photo</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholder="Le nom complet"
                placeholderTextColor="#003f5c"
                onChangeText={(text) => setFullName(text)}
              />
            </View>

            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholder="Email"
                placeholderTextColor="#003f5c"
                onChangeText={(text) => setEmail(text)}
              />
            </View>

            <View style={styles.inputView}>
              <TextInput
                secureTextEntry
                style={styles.inputText}
                placeholder="mode de passe"
                placeholderTextColor="#003f5c"
                onChangeText={(text) => setPassword(text)}
              />
            </View>

            <View style={styles.adds}>
              
              <Text style={{ color: 'black', marginTop: 5 }}>+{callingCode}</Text>
              <TextInput
                style={{ color: 'black', height: 30, marginLeft: 10, width: '70%', backgroundColor: 'white' }}
                placeholder="Numero de telephone"
                keyboardType="phone-pad"
                onChangeText={(text) => setPhoneNumber(text)}
              />
            </View>

            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholder="Age"
                placeholderTextColor="#003f5c"
                onChangeText={(text) => setAge(text)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholder="Pays"
                placeholderTextColor="#003f5c"
                onChangeText={(text) => setCountry(text)}
              />
            </View>

            <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
              <Text style={styles.registerText}>SIGN UP</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ScrollView>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  kybcontainer:{
    alignItems:"center",
     
  },
  viewAnimated:{
    flex:1,
    padding: 10,
    backgroundColor: 'white',
    marginTop: -10, 
    borderTopLeftRadius: 35, 
    borderTopRightRadius: 35, 
    shadowColor: 'black',
    shadowOffset: { 
        width: 0,
        height: 4 
      },
    shadowOpacity: 0.1,
    shadowRadius: 6,
        elevation: 6,
    },
  logo: {
    fontWeight: 'bold',
    fontSize: 40,
    color: '#fb5b5a',
    marginBottom: 20,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#fff',
    borderWidth:1,
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'black',
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#fb5b5a',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  loginText: {
    color: 'white',
  },
  registerBtn: {
    width: '80%',
    backgroundColor: '#000',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:10
  },
  registerText: {
    color: 'white',
  },
  errorText: {
    color: 'red',
    height:20,
    alignSelf: 'flex-start',
   
  },
  image:{
    
    alignSelf: 'center',
    marginBottom:20
  },
  text:{
    marginBottom:20,
    fontSize:20,
    color:'#fff',
    fontWeight:'400'
  },
  adds:{
    flexDirection: 'row', 
    marginBottom:20,
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 25,
    color:"white",
    padding:10,
    height:50,
    borderWidth:1
    
  },
  imageLogo:{
    marginTop:30,
    padding:50,
    height:230,
    width:230,
  },
  header:{
    alignItems:'flex-start',
    textAlign:'left',
    marginBottom:2,
    marginLeft:20,
    justifyContent:'flex-end',
    height:180
  },
  imageUp:{
    width:130,
    height:130,
    borderRadius:130,
    marginTop:8,
    marginBottom:5
  },
  imageUpint:{
    width:100,
    height:100,
    borderRadius:100,
    marginTop:8
  }
});
export default RegisterScreen;