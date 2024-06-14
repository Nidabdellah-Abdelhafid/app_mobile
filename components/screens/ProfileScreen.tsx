import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Modal, ListRenderItem, ImageBackground } from "react-native";
import { collection, getDocs, query, where} from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from "FirebaseConfig";
import { NavigationProp, useIsFocused } from '@react-navigation/native';
import { Ionicons ,Fontisto,MaterialCommunityIcons,MaterialIcons,FontAwesome6} from '@expo/vector-icons';
import fileData from '../../assets/data/file.json';
import { FlatList, TextInput } from "react-native-gesture-handler";
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { URL_BACKEND } from "api";
import axios from "axios";
interface RouterProps {
  navigation: NavigationProp<any,any>;
  route
}

const ProfileScreen = ({ route ,navigation }:RouterProps) => {
  const { user: currentUser } = route.params;
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [modalVisible4, setModalVisible4] = useState(false);
  const [modalVisible5, setModalVisible5] = useState(false);
  const [modalVisible6, setModalVisible6] = useState(false);
  const [modalVisible7, setModalVisible7] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [userDC, setUserDC] = useState(null);
  const [favorie, setFavorie] = useState(null);
  const [enregetrer, setEnregetrer] = useState(null);
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [datafetch,setDatafetch]=useState([]);
  const [paysfavorieUser, setPaysfavorieUser] = useState([]);
  const [paysenregetrerUser, setPaysenregetrerUser] = useState([]);

  useEffect(() => {
      fetchUserData(); 
    }, []);

  useEffect(() => {
    if (userData) {
      fetchUser();
    }
  }, [userData]);
  useEffect(() => {
    fetchData();
   
  }, []);

  useEffect(() => {
    if (userDC) {
      fetchFavories();
    }
  }, [userDC]);

  useEffect(() => {
    if (userDC) {
      fetchEnregetrers();
    }
  }, [userDC]);

 useEffect(() => {
      if(favorie && datafetch && userDC){
        filterPaysFavorieUser();
      }
      
    }, [favorie,datafetch,userDC]);

  useEffect(() => {
    if(enregetrer && datafetch && userDC){
      filterPaysEnregetrerUser();
    }
    
  }, [enregetrer,datafetch,userDC]);

  const items = fileData;
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

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${URL_BACKEND}/api/users?populate=*&pagination[limit]=-1`);
      const users = response.data;
      const email = userData?.email;
      const currentUserData = users.find(user => user.email === email);
      setUserDC(currentUserData);
      // console.log('Current user data fetched:', currentUserData);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${URL_BACKEND}/api/pays?populate=*&pagination[limit]=-1`);
      const data = await response.json();
      // console.log('Result:', data.data[0].attributes);
      setDatafetch(data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchFavories = async () => {
    try {
      const response = await axios.get(`${URL_BACKEND}/api/favories?populate=*&pagination[limit]=-1`);
      const favories = response.data.data;
      setFavorie(favories);
      // console.log('Favories fetched:', favories);
    } catch (error) {
      console.error('Error fetching favories:', error);
    }
  };

  const fetchEnregetrers = async () => {
    try {
      const response = await axios.get(`${URL_BACKEND}/api/enregetrers?populate=*&pagination[limit]=-1`);
      const enregetrers = response.data.data;
      setEnregetrer(enregetrers);
      console.log('Favories fetched:', enregetrers);
    } catch (error) {
      console.error('Error fetching favories:', error);
    }
  };
 
  const filterPaysFavorieUser = () => {

    const filteredPays = datafetch.filter(pays => {
      if (pays.attributes.favories?.data && Array.isArray(pays.attributes.favories.data)) {
        const isFavorite = pays.attributes.favories.data.some(fav => {
          const favMatch = favorie.some(f => 
            f.attributes.user?.data?.id === userDC.id &&
            f.id === fav.id
          );
          if (favMatch) {
            // console.log('Match found for pays:', pays);
          }
          return favMatch;
        });
        return isFavorite;
      } else {
        // console.log('favories is not an array for pays:', pays);
      }
      return false;
    });
    // console.log('Filtered pays:', filteredPays);
    setPaysfavorieUser(filteredPays);
  };

  const filterPaysEnregetrerUser = () => {

    const filteredPays = datafetch.filter(pays => {
      if (pays.attributes.enregetrers?.data && Array.isArray(pays.attributes.enregetrers?.data)) {
        const isEnregetrer = pays.attributes.enregetrers?.data.some(fav => {
          const favMatch = enregetrer.some(f => 
            f.attributes.user?.data?.id === userDC.id &&
            f.id === fav.id
          );
          if (favMatch) {
            console.log('Match found for pays:', pays);
          }
          return favMatch;
        });
        return isEnregetrer;
      } else {
        console.log('favories is not an array for pays:', pays);
      }
      return false;
    });
    console.log('Filtered pays:', filteredPays);
    setPaysenregetrerUser(filteredPays);
  };

  const handleButtonPress = () => {
    setIsButtonPressed(true);
  };
  

   
  const openModal1 = () => {
    fetchUserData()
    fetchData()
    fetchFavories()
    filterPaysFavorieUser();
    setTimeout(() => {
      setModalVisible1(true);
    }, 500);
    
  };

  const closeModal1 = () => {
      setModalVisible1(false);
  };
  const handleDateSelect1 = () => {
      // Close the modal
      closeModal1();
  };
  const openModal2 = () => {
    fetchUserData()
    fetchData()
    fetchEnregetrers()
    filterPaysEnregetrerUser();
    setTimeout(() => {
      setModalVisible2(true);
    }, 500);
    
  };

  const closeModal2 = () => {
      setModalVisible2(false);
  };
  const handleDateSelect2 = () => {
      // Close the modal
      closeModal2();
  };

  const openModal3 = () => {
    setModalVisible3(true);
  };

  const closeModal3 = () => {
      setModalVisible3(false);
      setIsButtonPressed(false);
  };
  const handleDateSelect3 = () => {
      // Close the modal
      closeModal3();
  };

  const openModal4 = () => {
    setModalVisible4(true);
  };

  const closeModal4 = () => {
      setModalVisible4(false);
  };
  const handleDateSelect4 = () => {
      // Close the modal
      closeModal4();
  };

  const openModal5 = () => {
    setModalVisible5(true);
  };

  const closeModal5 = () => {
      setModalVisible5(false);
  };
  const handleDateSelect5 = () => {
      // Close the modal
      closeModal5();
  };

  const openModal6 = () => {
    setModalVisible6(true);
  };

  const closeModal6 = () => {
      setModalVisible6(false);
  };
  const handleDateSelect6 = () => {
      // Close the modal
      closeModal6();
  };

  const openModal7 = () => {
    setModalVisible7(true);
  };

  const closeModal7 = () => {
      setModalVisible7(false);
  };
  const handleDateSelect7 = () => {
      // Close the modal
      closeModal7();
  };

  const handleRefresh=()=>{
      
    setRefreshing(true);
    filterPaysFavorieUser();
    setRefreshing(false);

  }
  const renderRow: ListRenderItem<any> = ({item}) => (
  
  <Animated.View style={styles.listViewlike} entering={FadeInRight} exiting={FadeOutLeft}>
      <Image source={{ uri: item.attributes?.photos.data[0].attributes?.url }} style={styles.imagelike} />
      <TouchableOpacity style={{ position: 'absolute', right: 18, top: 10 }}>
          <Ionicons name='heart' size={25} color='white' />
      </TouchableOpacity>
      
      <View style={{ position: 'absolute',left: 10, top: 105,flexDirection:'row' }}>
          <View style={{ flex:1,justifyContent:'space-between',flexDirection:'row'}}>
            <View>
              <Text style={{ fontSize: 17, fontWeight: '900' ,color:'#fff'}}>{item.attributes?.label}</Text>
            </View>
          
          <TouchableOpacity style={{borderColor:'#fff',borderWidth:2,borderRadius:10,padding:3,width:110,alignItems:'center',marginRight:20,justifyContent:'center',flexDirection:'row'}} onPress={() => {navigation.navigate('DetailPage', { itemId: item.id });handleDateSelect1() }}>
              <Text  style={{color:'#fff',fontWeight:'700'}}>Voir l'Offre 
              </Text>
              <Ionicons name="chevron-forward" size={12} color="white" />
          </TouchableOpacity>
          </View>
          
          
      </View>
      
  </Animated.View>
)
const renderRowErg: ListRenderItem<any> = ({item}) => (
  
  <Animated.View style={styles.listViewlike} entering={FadeInRight} exiting={FadeOutLeft}>
      <Image source={{ uri: item.attributes?.photos.data[0].attributes?.url }} style={styles.imageSave} />
      
      <TouchableOpacity style={{position: 'absolute', right: 15, top: 10,borderColor:'#fff',borderWidth:2,borderRadius:10,padding:3,width:110,alignItems:'center',justifyContent:'center',flexDirection:'row'}} onPress={() => {navigation.navigate('DetailPage', { itemId: item.id });handleDateSelect2() }}>
            <Text  style={{color:'#fff',fontWeight:'700'}}>Voir l'Offre  </Text>
          <Ionicons name="chevron-forward" size={12} color="white" />
      </TouchableOpacity>
      
      <View style={{ position: 'absolute',left: 10, top: 130,flexDirection:'row' }}>
          <View style={{ flex:1,justifyContent:'space-between',flexDirection:'row'}}>
            <View>
              <Text style={{ fontSize: 17, fontWeight: '900' ,color:'#fff'}}>{item.attributes?.label}</Text>
              <View style={{ flexDirection: 'row', gap: 4 }}>
              <StarRating reviews={item?.attributes.reviews} />
            </View>
            </View>
            <Fontisto name='favorite' size={25} color='white' style={{marginRight:30}}/>
          </View>
          
          
      </View>
      
  </Animated.View>
)


const StarRating = ({ reviews }) => {
  const stars = [];

  for (let i = 0; i < reviews; i++) {
    stars.push(
      <Ionicons key={i} name="star" size={16} color="orange" />
    );
  }

  return (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      {stars}
    </View>
  );
};
  return (
    <ImageBackground source={{uri:'https://s3.eu-west-1.amazonaws.com/fractalitetest/2024-06-10T10:47:18.607875882_profile%20bg@2x.png'}} style={styles.container}>
      
        {userData ? (
        <View style={{marginTop:75}}>
            <View style={styles.imageFloat}>
            <Image source={{ uri: userData?.image }} style={styles.profileImage} />
            </View>
          <View  style={styles.card}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userData?.fullName}</Text>
              
            </View>
            <View style={{flexDirection:'row',justifyContent:'center',marginBottom:15}}>
              <Text style={{color:'#fff',fontWeight:'700'}}>1,239    </Text>
              <Text style={{color:'#A4A3A3'}}>Total des leux visites</Text>
              
            </View>

            <View style={{flexDirection:'row',justifyContent:'center'}}>
              
              <View style={{justifyContent:'space-between',alignItems:'center',padding:13}}>
                 <Ionicons name="heart" size={25} color="white"/>
                 <Text style={{color:'#C4C2C2',fontWeight:'700',}}>{paysfavorieUser?.length} Places Like</Text>
                 <TouchableOpacity style={{borderColor:'#fff',borderWidth:2,borderRadius:15,padding:10,width:110,alignItems:'center'}} onPress={openModal1}>
                  <Text  style={{color:'#fff',fontWeight:'800'}}>Voir</Text>
                  
                 </TouchableOpacity>

              </View>
              
              <View style={{justifyContent:'center',alignItems:'center',padding:1,height:155,backgroundColor:'#fff',marginLeft:5}}></View>
              
              <View style={{justifyContent:'space-between',alignItems:'center',padding:13}}>
                <Fontisto name='favorite' size={25} color='white' />
                <View style={{justifyContent:'center',alignItems:'center',padding:10}}>
                <Text style={{color:'#C4C2C2',fontWeight:'700',}}>Enregistre</Text>
                <Text style={{color:'#C4C2C2',fontWeight:'700'}}>dans les favoris</Text>
                </View>
                <TouchableOpacity style={{borderColor:'#fff',borderWidth:2,borderRadius:15,padding:10,width:110,alignItems:'center'}} onPress={openModal2}>
                  <Text  style={{color:'#fff',fontWeight:'800'}}>Voir</Text>
                 </TouchableOpacity>
              </View>
            </View>
            <View style={{justifyContent:'center',marginTop:10}}>
              <TouchableOpacity style={styles.loginBtnOption} onPress={openModal3}>
                <FontAwesome6 name="user-large" size={19} color="white" style={styles.icon}/>
                <View style={{flex:5,flexDirection:'row'}}>
                    <Text style={styles.loginTextOption}>Modifier le profil</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="white" style={{marginRight:10}}/>
              </TouchableOpacity>

              <TouchableOpacity style={styles.loginBtnOption} onPress={openModal4}>
                <MaterialIcons name="shopping-cart" size={25} color="white" style={styles.icon}/>
                <View style={{flex:5,flexDirection:'row'}}>
                    <Text style={styles.loginTextOption}>Panier</Text>
                    <View style={styles.notifView}>
                      <Text style={{color:'#000',fontWeight:'700'}}>2</Text>
                    </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="white" style={{marginRight:10}}/>
              </TouchableOpacity>

              <TouchableOpacity style={styles.loginBtnOption} onPress={openModal5}>
                <MaterialCommunityIcons name="clipboard-text" size={25} color="white" style={styles.icon}/>
                <View style={{flex:5,flexDirection:'row'}}>
                    <Text style={styles.loginTextOption}>Historique des achats</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="white" style={{marginRight:10}}/>
              </TouchableOpacity>

              <TouchableOpacity style={styles.loginBtnOption} onPress={openModal6}>
              <Ionicons name="notifications" size={25} color="white" style={styles.icon}/>
                <View style={{flex:5,flexDirection:'row'}}>
                    <Text style={styles.loginTextOption}>Notification</Text>
                    <View style={styles.notifView}>
                      <Text style={{color:'#000',fontWeight:'700'}}>4</Text>
                    </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="white" style={{marginRight:10}}/>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.loginBtnOption} onPress={openModal7}>
                <MaterialIcons name="credit-card" size={25} color="white" style={styles.icon}/>
                <View style={{flex:5,flexDirection:'row'}}>
                    <Text style={styles.loginTextOption}>Cartes</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="white" style={{marginRight:10}}/>
              </TouchableOpacity>
            </View>
            
          </View>
          
          </View>
          
          ):(
            <View style={[styles.loadingContainer,{marginTop:100}]}>
            <ActivityIndicator size="large" color="blue" />
            <Text style={{color:"white",fontSize:15,fontWeight:'800'}}>Loading...</Text>
          </View>
          )}
          
          <View style={{margin:30,justifyContent:'flex-end',alignContent:'flex-end',alignSelf:'center',alignItems:'center'}}>
              
          </View>
      {/* <View style={{backgroundColor:"white",margin:30,justifyContent:'center',alignContent:'flex-end',alignSelf:'center',alignItems:'center'}}>
          <TouchableOpacity onPress={()=> FIREBASE_AUTH.signOut()} style={styles.button}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
          </View> */}

      <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible1}
                onRequestClose={closeModal1}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                    <View style={styles.imageFloatM}>
                        <Image source={{ uri: userData?.image }} style={styles.profileImage} />
                    </View>
                    <View style={[styles.userInfo,{marginBottom:20}]}>
                      <Text style={styles.userName}>{userData?.fullName}</Text>
                    </View>
                    <Ionicons name="heart" size={25} color="white"/>
                    <Text style={{color:'#C4C2C2',fontWeight:'700',marginTop:10}}>{paysfavorieUser?.length} Places Like</Text>
                    <TouchableOpacity style={{position:'absolute',bottom:595,left:330,backgroundColor:'#000',borderRadius:26,opacity:0.5}} onPress={() => handleDateSelect1()}>
                        <Ionicons name="close" size={26} color="white" />
                    </TouchableOpacity>
                    <FlatList
                      renderItem={renderRow}
                      data={paysfavorieUser}
                      refreshing={refreshing}
                      onRefresh={handleRefresh}
                    />
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible2}
                onRequestClose={closeModal2}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                    <View style={styles.imageFloatM}>
                        <Image source={{ uri: userData?.image }} style={styles.profileImage} />
                    </View>
                    <View style={[styles.userInfo,{marginBottom:20}]}>
                      <Text style={styles.userName}>{userData?.fullName}</Text>
                    </View>
                    <Fontisto name='favorite' size={25} color='white' />
                    <Text style={{color:'#C4C2C2',fontWeight:'700',marginTop:10}}>Enregistre dans les favoris</Text>
                    <TouchableOpacity style={{position:'absolute',bottom:595,left:330,backgroundColor:'#000',borderRadius:26,opacity:0.5}} onPress={() => handleDateSelect2()}>
                        <Ionicons name="close" size={26} color="white" />
                    </TouchableOpacity>
                    <FlatList
                      renderItem={renderRowErg}
                      data={paysenregetrerUser}
                    />
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible3}
                onRequestClose={closeModal3}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                    <View style={styles.imageFloatM}>
                        <Image source={{ uri: userData?.image }} style={styles.profileImage} />
                    </View>
                    <View style={[styles.userInfo,{marginBottom:20}]}>
                      <Text style={styles.userName}>{userData?.fullName}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                    <FontAwesome6 name="user-large" size={19} color="white" />
                    <Text style={{color:'#C4C2C2',fontWeight:'700',marginLeft:10}}>Modifier le profil</Text>
                    </View>
                    <TouchableOpacity style={{position:'absolute',bottom:595,left:330,backgroundColor:'#000',borderRadius:26,opacity:0.5}} onPress={() => handleDateSelect3()}>
                        <Ionicons name="close" size={26} color="white" />
                    </TouchableOpacity>
                    <View style={{width:'100%',marginTop:20,padding:10}}>
                    <Text style={styles.inputText}>Le nom complet</Text>
                    <TextInput
                      placeholder=""
                      value={null}
                      onChangeText={null}
                      style={styles.inputView}
                    />
                    </View>
                    <View style={{width:'100%',padding:10}}>
                    <Text style={styles.inputText}>Email</Text>
                    <TextInput
                      placeholder=""
                      value={null}
                      onChangeText={null}
                      style={styles.inputView}
                    />
                    </View>
                    <View style={{width:'100%',padding:10}}>
                    <Text style={styles.inputText}>Numero de telephone</Text>
                    <TextInput
                      placeholder=""
                      value={null}
                      onChangeText={null}
                      style={styles.inputView}
                    />
                    </View>
                    <View style={{width:'100%',padding:10,justifyContent:'center',alignItems:'center'}}>
                    <TouchableOpacity
                      onPress={ handleButtonPress}
                      style={[styles.button2, isButtonPressed ? styles.buttonPressed : null]}
                    >
                      <Text style={[styles.loginText, isButtonPressed ? {color:'black',fontSize:15,fontWeight:'700'} : null]}>Approve</Text>
                    </TouchableOpacity>
                    </View>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible4}
                onRequestClose={closeModal4}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                    <View style={styles.imageFloatM}>
                        <Image source={{ uri: userData?.image }} style={styles.profileImage} />
                    </View>
                    <View style={[styles.userInfo,{marginBottom:20}]}>
                      <Text style={styles.userName}>{userData?.fullName}</Text>
                    </View>
                    <Ionicons name="heart" size={25} color="white"/>
                    <Text style={{color:'#C4C2C2',fontWeight:'700',marginTop:10}}>{items.length} Places Like</Text>
                    <TouchableOpacity style={{position:'absolute',bottom:595,left:330,backgroundColor:'#000',borderRadius:26,opacity:0.5}} onPress={() => handleDateSelect4()}>
                        <Ionicons name="close" size={26} color="white" />
                    </TouchableOpacity>
                   <Text style={{color:'#fff'}}>4</Text>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible5}
                onRequestClose={closeModal5}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                    <View style={styles.imageFloatM}>
                        <Image source={{ uri: userData?.image }} style={styles.profileImage} />
                    </View>
                    <View style={[styles.userInfo,{marginBottom:20}]}>
                      <Text style={styles.userName}>{userData?.fullName}</Text>
                    </View>
                    <Ionicons name="heart" size={25} color="white"/>
                    <Text style={{color:'#C4C2C2',fontWeight:'700',marginTop:10}}>{items.length} Places Like</Text>
                    <TouchableOpacity style={{position:'absolute',bottom:595,left:330,backgroundColor:'#000',borderRadius:26,opacity:0.5}} onPress={() => handleDateSelect5()}>
                        <Ionicons name="close" size={26} color="white" />
                    </TouchableOpacity>
                    <Text style={{color:'#fff'}}>5</Text>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible6}
                onRequestClose={closeModal6}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                    <View style={styles.imageFloatM}>
                        <Image source={{ uri: userData?.image }} style={styles.profileImage} />
                    </View>
                    <View style={[styles.userInfo,{marginBottom:20}]}>
                      <Text style={styles.userName}>{userData?.fullName}</Text>
                    </View>
                    <Ionicons name="heart" size={25} color="white"/>
                    <Text style={{color:'#C4C2C2',fontWeight:'700',marginTop:10}}>{items.length} Places Like</Text>
                    <TouchableOpacity style={{position:'absolute',bottom:595,left:330,backgroundColor:'#000',borderRadius:26,opacity:0.5}} onPress={() => handleDateSelect6()}>
                        <Ionicons name="close" size={26} color="white" />
                    </TouchableOpacity>
                    <Text style={{color:'#fff'}}>6</Text>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible7}
                onRequestClose={closeModal7}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                    <View style={styles.imageFloatM}>
                        <Image source={{ uri: userData?.image }} style={styles.profileImage} />
                    </View>
                    <View style={[styles.userInfo,{marginBottom:20}]}>
                      <Text style={styles.userName}>{userData?.fullName}</Text>
                    </View>
                    <Ionicons name="heart" size={25} color="white"/>
                    <Text style={{color:'#C4C2C2',fontWeight:'700',marginTop:10}}>{items.length} Places Like</Text>
                    <TouchableOpacity style={{position:'absolute',bottom:595,left:330,backgroundColor:'#000',borderRadius:26,opacity:0.5}} onPress={() => handleDateSelect7()}>
                        <Ionicons name="close" size={26} color="white" />
                    </TouchableOpacity>
                    <Text style={{color:'#fff'}}>7</Text>
                    </View>
                </View>
            </Modal>


    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.7, 
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    // opacity:0.8
    
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#111',
    opacity:0.9,
    borderRadius: 20,
    height:"92%",
    margin:20,
    elevation: 5,
    padding: 10,
    top:25,
  },
  profileImage: {
    width: 75,
    height: 75,
    borderRadius: 75,
  },
  imageFloat:{
    position:'absolute',
    alignItems: 'center',
    zIndex:1,
    left:'42%',
  },
  imageFloatM:{
    position:'absolute',
    alignItems: 'center',
    zIndex:1,
    left:'43.42%',
    bottom:583
  },
  userInfo: {

  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 5,
    marginTop:30,
    color:'#fff',
    textAlign:'center'
  },
  loginBtnOption: {
    width: '100%',
    borderRadius: 15,
    borderColor:'#C4C2C2',
    borderWidth:2,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 9,
    flexDirection:'row'
  },
  icon: {
    marginLeft:15,
    flex:1
  },
  loginTextOption: {
    color: '#A4A3A3',
    fontWeight:'700',
    marginRight:10
  },
  notifView:{
    backgroundColor:'#fff',
    borderRadius:22,
    justifyContent:'center',
    alignItems:'center',
    height:22,
    width:22,
    alignSelf:'center'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
},
modalView: {
    position: 'absolute',
    top: 93,
    left: 20,
    right: 20,
    height:"78%",
    backgroundColor: '#000',
    opacity:1,
    borderRadius: 20,
    padding: 10,
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
listViewlike:{
  gap: 10,
  marginTop:10
},
imagelike:{
  width: 315,
  height: 150,
  borderRadius:20,
  backgroundColor:'#000',
  opacity:0.8
  },
  inputView: {
    width: '100%',
    borderRadius: 10,
    height: 50,
    padding: 10,
    color: '#EDECEC',
    backgroundColor:'#444',
    marginBottom:11,
    marginTop:10,
    justifyContent: 'center'
    
  },
  imageSave:{
    width: 315,
    height: 180,
    borderRadius:20,
    backgroundColor:'#000',
    opacity:0.8
    },
  inputText: {
    fontSize:16,
    color: '#E1E1E1',
  },
  button2: {
    width: '62%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Default background color
    padding: 0, 
    borderColor:'#fff',
    borderWidth:2,
    borderRadius: 15,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonPressed: {
    backgroundColor: 'white', // Change background color when pressed
  },
  loginText: {
    color: 'white',
    fontWeight:'700',
    fontSize:15
  },
});

export default ProfileScreen;