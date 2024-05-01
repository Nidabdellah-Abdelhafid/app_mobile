import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Animated, ActivityIndicator } from "react-native";
import { collection, getDocs, query, where} from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from "FirebaseConfig";
import { NavigationProp } from '@react-navigation/native';

interface RouterProps {
  navigation: NavigationProp<any,any>;
  route
}

const ProfileScreen = ({ route ,navigation }:RouterProps) => {
  const { user: currentUser } = route.params;
  const scrollY = new Animated.Value(0);
  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    try {
      const userQuery = query(collection(FIREBASE_DB, 'users'), where('email', '==', currentUser));
      const querySnapshot = await getDocs(userQuery);
      const userData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (userData.length > 0) {
        setUserData(userData[0]); 
      } else {
        setUserData(null); 
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData(); 
  }, []);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
       
      </Animated.View>
      <ScrollView
        style={styles.scrollContainer}
      >
        {userData ? (
        <View >
            <View style={styles.imageFloat}>
            <Image source={{ uri: userData.image }} style={styles.profileImage} />
            </View>
          <View  style={styles.card}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userData.fullName}</Text>
              <View style={styles.vinfo}>
                <View >
                  <Text style={styles.label}>Age</Text>
                  <Text style={styles.text}>{userData.age}</Text>
                </View>
                <View >
                  <Text style={styles.label}>Country</Text>
                  <Text style={styles.text}>{userData.country}</Text>
                </View>
                <View >
                  <Text style={styles.label}>Phone Number</Text>
                  <Text style={styles.text}>{userData.phone_Number}</Text>
                </View>
              
              </View>
              <Text style={styles.labelE}>Email</Text>
              <Text style={styles.text}>{userData.email}</Text>
            </View>

          </View>
          
          </View>
          
          ):(
            <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="blue" />
            <Text style={{color:"white",fontSize:15,fontWeight:'800'}}>Loading...</Text>
          </View>
          )}
          
          <View style={{margin:30,justifyContent:'flex-end',alignContent:'flex-end',alignSelf:'center',alignItems:'center'}}>
              
          </View>
      </ScrollView>
      <View style={{backgroundColor:"white",margin:30,justifyContent:'center',alignContent:'flex-end',alignSelf:'center',alignItems:'center'}}>
          <TouchableOpacity onPress={()=> FIREBASE_AUTH.signOut()} style={styles.button}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
          </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fb5b5a',
    zIndex: -1,
    height:400
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingTop: 100,
    paddingHorizontal: 20,
    flex:1
    
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    marginBottom: 20,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 15,
    top:70,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 150,
    marginRight: 20,
  },
  imageFloat:{
    position:'absolute',
    alignItems: 'center',
    zIndex:1,
    left:'30%',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop:90,
    color:'#fb5b5a',
    textAlign:'center'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fb5b5a',
    marginBottom: 5,
    textAlign:'center'
  },
  labelE:{
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fb5b5a',
    marginBottom: 5,
    alignSelf:'center'
  },

  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign:'center'
  },
  vinfo:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    alignContent:'space-between',
    textAlign:'center',
    height:100
  }, 
  button: {
    backgroundColor: '#fb5b5a',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
  },
});

export default ProfileScreen;