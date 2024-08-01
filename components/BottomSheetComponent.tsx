// BottomSheetComponent.js
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Modal,Image, ScrollView, PanResponder ,TouchableOpacity, ImageBackground, Button} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import HomePageNav from './screens/homePage/HomePageNav';
import SettingsScreen from './screens/SettingsScreen';
import ProfileScreen from './screens/ProfileScreen';
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontAwesome5, AntDesign,MaterialCommunityIcons } from '@expo/vector-icons';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { SvgUri } from 'react-native-svg';
import { MaterialIcons,FontAwesome6 } from '@expo/vector-icons';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FIREBASE_DB } from 'FirebaseConfig';
import MessageScreen from './screens/MessageScreen';
import Invoice from './screens/Invoice';
import * as Animatable from 'react-native-animatable';
const Tab = createBottomTabNavigator();

const CustonTabbarButton = ({children, onPress}) => (
    <TouchableOpacity
    style={{
    top: -12,
    justifyContent: 'center',
    alignItems: 'center',
    }}
    onPress={onPress}>
    <View style={{
        width: 65,
        height: 65,
        borderRadius: 35,
        backgroundColor: '#222',
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5,
        }}>
        {children}
    </View>
    </TouchableOpacity>
    );

const BottomSheetComponent = ({user}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const bottomSheetModalRef = useRef(null);
  const scrollViewRef = useRef(null);
  const snapPoints = ['100%', '100%'];
  const [userData, setUserData] = useState(null);
  const [modalVisible0, setModalVisible0] = useState(false);

  const openModal0 = () => {
      setModalVisible0(true);
    };

  const closeModal0 = () => {
      setModalVisible0(false);
  };
  const handleDateSelect0 = () => {
      // Close the modal
      closeModal0();
  };

  const fetchUserData = async () => {
    try {
      const userQuery = query(collection(FIREBASE_DB, 'users'), where('email', '==', user));
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

  const openModal = () => {
     setModalVisible(true);
    };

  const closeModal = () => {
     setModalVisible(false);
    };

  const openBottomSheet = () => {
    bottomSheetModalRef.current.present();
  };

  const closeBottomSheet = () => {
    bottomSheetModalRef.current.dismiss();
  };

// btn search
//
// ---------------------------------------------------------------------------- 
const panResponder = useRef(
    PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderRelease: (e, gestureState) => {
            if (gestureState.dy > 0 && gestureState.vy > 1) {
                // If swipe down velocity is high enough
                closeModal();
            }
        },
    })
).current;


const options = [
    { id: 1, label: 'Tous les types' , style:"op1"},
    { id: 2, label: 'Option 2' , style:"op2"},
    { id: 3, label: 'Option 3' , style:"op3"},
];

const [selectedOption, setSelectedOption] = useState(options[0]);

const handleOptionSelect = (option) => {
    setSelectedOption(option);
    console.log(option.label)
};

const optionsNbr = [
    { id: 1, label: 'Tout' },
    { id: 2, label: '1' },
    { id: 3, label: '2' },
    { id: 4, label: '3' },
    { id: 5, label: '4' },
    { id: 6, label: '5' },
    { id: 7, label: '6' },
    { id: 8, label: '7' },
    { id: 9, label: '+8' },
];

const [selectedOptionNbrc, setSelectedOptionNbrc] = useState(optionsNbr[0]);

const handleOptionSelectNbrc = (option) => {
    setSelectedOptionNbrc(option);
    console.log(option.label)
};

const [selectedOptionTprM, setSelectedOptionTprM] = useState('');
const [activeTprM,setActiveTprM]=useState(false);    
const handleOptionSelectTprM = (option) => {
    setSelectedOptionTprM(option);
    console.log(option)
    
};
const [selectedOptionTprAp, setSelectedOptionTprAp] = useState('');
const [activeTprAp,setActiveTprAp]=useState(false);
const handleOptionSelectTprAp = (option) => {
    setSelectedOptionTprAp(option);
    console.log(option)
    
};
const [selectedOptionTprMh, setSelectedOptionTprMh] = useState('');
const [activeTprMh,setActiveTprMh]=useState(false);
const handleOptionSelectTprMh = (option) => {
    setSelectedOptionTprMh(option);
    console.log(option)
    
};
const [selectedOptionTprH, setSelectedOptionTprH] = useState('');
const [activeTprH,setActiveTprH]=useState(false);
const handleOptionSelectTprH = (option) => {
    setSelectedOptionTprH(option);
    console.log(option)
    
};

const [showAll, setShowAll] = useState(false);
const [checkboxes, setCheckboxes] = useState(Array(10).fill(false));

// Function to toggle checkbox
const toggleCheckbox = (index) => {
    setCheckboxes(prevState => {
    const newCheckboxes = [...prevState];
    newCheckboxes[index] = !newCheckboxes[index];
    return newCheckboxes;
    });
};

// Function to toggle showing all checkboxes
const toggleShowAll = () => {
    setShowAll(prevState => !prevState);
};
const slideInDownCustom = {
  from: {
      translateY: -18, // Adjust this value to control the start position
  },
  to: {
      translateY: 14,
  },
};

  return (
    <BottomSheetModalProvider>
      <ImageBackground source={{uri:'https://s3.eu-west-1.amazonaws.com/fractalitetest/2024-06-10T10:44:57.261240285_home%20bg@2x.png'}}  style={styles.container}>
      
      <TouchableOpacity style={{ position: 'absolute', right: 20, top: 45 }} onPress={openModal}>
            <Image source={{ uri: userData?.image }} style={styles.profileImage} />
      </TouchableOpacity>
      <View style={{alignItems:'center'}}>
      <SvgUri
        width="115"
        height="115"
        uri="https://atlasvoyages.com/assets/images/Logo.svg"
        style={styles.imageLogo}
      />
      </View>
      
      <Text style={{color:'white',fontSize:40,fontWeight:'600'}}>Des voyeges</Text>
      <Text style={{color:'white',fontSize:40,fontWeight:'600'}}>signature</Text>
      <Text style={{color:'white',fontSize:18,fontWeight:'400',marginTop:15}}>Concevez votre</Text>
      <Text style={{color:'white',fontSize:18,fontWeight:'400',marginBottom:20}}>voyage 100% sur mesure</Text>
      <TouchableOpacity onPress={openModal}>
                <View style={styles.searchBar}>
                    <View>
                        <Text style={{ marginLeft: 17 ,fontSize: 17, color: '#666', fontWeight: '700' ,fontFamily: 'Roboto'}}>Distination</Text>
                        
                    </View>
                    <Ionicons name="search" color="#666" size={25} style={{ marginLeft: 17 }} />
                </View>
        </TouchableOpacity>


      <View style={styles.btnsheet}>
        <TouchableOpacity onPress={openBottomSheet} style={styles.upBtn}>
          
            <Animatable.View animation={slideInDownCustom} iterationCount="infinite" direction="alternate">
            <FontAwesome5 name="angle-double-up" size={24} color="white" /> 
            </Animatable.View>
        </TouchableOpacity>

        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          index={0}
          backgroundComponent={({ style }) => <View style={[style, { backgroundColor: '#555' }]} />}
          handleIndicatorStyle={{backgroundColor:'#555'}}
          
        >
          <Tab.Navigator 
          screenOptions={{
            tabBarLabelPosition: "below-icon",
            tabBarShowLabel: false,
            tabBarActiveTintColor: "#fff",
            tabBarActiveBackgroundColor:'#222',
            tabBarInactiveBackgroundColor:'#222',
            tabBarStyle: { height:58 ,backgroundColor:'#222'},
        }} 
        >
          <Tab.Screen name='Explorer' component={HomePageNav}
          initialParams={{ user: user }}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="filter" size={28} color={color} />
            ),
              headerTintColor: "#000",
              headerShown: false,

            }}
          />
        <Tab.Screen name='Invoice' component={Invoice}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="diamond-outline" size={28} color={color} />
            ),
              headerShown: true,
              headerTintColor: "#000"
            }}
          />
          <Tab.Screen name='Favoris' component={SettingsScreen}
            options={{

              tabBarIcon: ({ color }) => (
                <SvgUri
                width="35"
                height="35"
                uri="https://atlasvoyages.com/assets/images/Logo.svg"
              />
                    ),
                tabBarButton: (props) =>(
                        <CustonTabbarButton {...props} />
                    ),
                headerShown: true,
                headerTintColor: "#000"
            }}
          />
          <Tab.Screen name='message' component={MessageScreen}
            initialParams={{ user: user }}

            options={{
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="email-outline" size={28} color={color} />
            ),
            //   tabBarBadge: 3,
            headerTitleStyle: {
              marginBottom: 20,
            },
              headerTintColor: "#000",
              headerShown: true,
              headerTitle: 'Atlas Voyages',
              
              headerLeft: () => (
                <View style={{marginLeft:30,marginBottom:20}}> 
                  <View>
                  <Image source={{ uri: 'https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/75/cc/7c/75cc7cf2-516f-b0f4-a8ed-3baccc1abcbf/source/512x512bb.jpg' }} style={styles.msgImageNav} />
                    {/* <View style={{position:'absolute',backgroundColor:'orange',width:7,height:7,borderRadius:7,left:21}}></View> */}
                  </View>
                </View>
              ),
            }}
          />
          <Tab.Screen name='Profil' component={ProfileScreen}
            initialParams={{ user: user }}

            options={{
              tabBarIcon: ({ color }) => (
                <View>
                    <Image source={{ uri: userData?.image }} style={styles.profileImageNav} />
                    <View style={{position:'absolute',backgroundColor:'orange',width:7,height:7,borderRadius:7,left:21}}></View>
                </View>
            
            ),
            //   tabBarBadge: 3,
              headerTintColor: "#fff",
              headerShown: true, 
              headerTransparent: true,
              headerTitle: 'Votre profil',
              headerTitleAlign: 'center',
              
              headerTitleStyle: {
                
                marginBottom: 20, 
                 
                // Add a bottom margin of 10
              },
              headerRight: () => (
                <TouchableOpacity style={{marginRight:35,marginBottom:20}} onPress={openModal0}>
                    <FontAwesome6 name="ellipsis-vertical" size={35} color="white" />
                </TouchableOpacity>
              ),
              headerLeft: () => (
                <TouchableOpacity style={{marginLeft:20,marginBottom:20}} onPress={()=>console.log("back..")}>
                    {/* <Ionicons name="arrow-back" size={25} color="white" /> */}
                </TouchableOpacity>
              ),
              
            }}
          />
          
        </Tab.Navigator>
        </BottomSheetModal>
      </View>
      <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer} {...panResponder.panHandlers}>
                {/* Header */}
                <View style={styles.header}>
                <TouchableOpacity onPress={closeModal} style={{flexDirection:'row',alignItems:'center'}}>
                    <AntDesign name="close" size={20} color="black" />
                    <Text style={{fontSize:18,fontWeight:'600',marginLeft:12}}>Filters</Text>
                </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.content} >
                    <ScrollView 
                    ref={scrollViewRef}
                    style={{flex:1}}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    >
                    <Text style={styles.textFilter}>Type de logement</Text>
                    <View style={styles.viewFilter}>
                     {options.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                 style= {option.style==="op1" ? [styles.option,styles.op1,selectedOption?.id === option.id && styles.selectedOption ] : (option.style==="op3" ? [styles.option,styles.op3,selectedOption?.id === option.id && styles.selectedOption ]:[styles.option,selectedOption?.id === option.id && styles.selectedOption ])}
                                onPress={() => handleOptionSelect(option)}
                            >
                                <Text
                                style={[ selectedOption?.id === option.id && styles.textdOption]} 
                                >{option.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={styles.textFilter}>Chambres et lits</Text>
                    <Text style={{}}>Chambres</Text>

                    <View style={styles.viewFilter}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                     {optionsNbr.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                 style= {[styles.optionNbrc,selectedOptionNbrc?.id === option.id && styles.selectedOptionNbrc ]}
                                onPress={() => handleOptionSelectNbrc(option)}
                            >
                                <Text
                                style={[ selectedOptionNbrc?.id === option.id && styles.textdOption]} 
                                >{option.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    </View>
                    <Text style={styles.textFilter}>Type de propriete</Text>
                    <View style={styles.viewFilter}>
                        <View style={{width:"46%"}}>
                        <TouchableOpacity
                                 style={activeTprM ? [styles.optionTpr, styles.selectedOptionTpr] :[styles.optionTpr]}
                            onPress={() => {
                                setActiveTprM(!activeTprM)
                                if(activeTprM===false){
                                handleOptionSelectTprM('Maison')
                                   
                            }else if(activeTprM===true){
                                 handleOptionSelectTprM('')
                            }
                            }}
                        >
                            <AntDesign name="home" size={28} color="black" />
                            <Text
                                style={{fontWeight:'500',marginTop:32}}
                            >Maison</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                                 style={activeTprMh ? [styles.optionTpr, styles.selectedOptionTpr] :[styles.optionTpr]}
                            onPress={() => 
                                {
                                    setActiveTprMh(!activeTprMh) 
                                    if(activeTprMh===false){
                                    handleOptionSelectTprMh(`Maison d'hôtes`)
                                      
                                }else if(activeTprMh===true){
                                    handleOptionSelectTprMh('')
                            }
                            }
                            }
                        >
                            <Ionicons name="bed" color="#000" size={28} />
                            <Text
                                style={{fontWeight:'500',marginTop:32}}
                            >Maison d'hôtes</Text>
                        </TouchableOpacity>
                        </View>
                            
                        <View style={{marginLeft:20,width:"46%"}}>
                            <TouchableOpacity
                                style={activeTprAp ? [styles.optionTpr, styles.selectedOptionTpr] :[styles.optionTpr]}
                            onPress={() =>{
                                setActiveTprAp(!activeTprAp)
                                if(activeTprAp===false){
                                    handleOptionSelectTprAp('Appatement')
                                    
                                }else if(activeTprAp===true){
                                    handleOptionSelectTprAp('')
                            }
                            } 
                        }
                        >
                            <MaterialIcons name="apartment" size={28} color="black" />
                            <Text
                                style={{fontWeight:'500',marginTop:32}}
                            >Appatement</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                                style={activeTprH ? [styles.optionTpr, styles.selectedOptionTpr] : [styles.optionTpr]}
                            onPress={() => {
                                setActiveTprH(!activeTprH)
                                if(activeTprH===false){
                                handleOptionSelectTprH('Hôtel')
                                    
                            }else if(activeTprH===true){
                                handleOptionSelectTprH('')
                            }
                        }}
                        >
                            <FontAwesome6 name="hotel" size={28} color="black" />
                            <Text
                                style={{fontWeight:'500',marginTop:32}}
                            >Hôtel</Text>
                        </TouchableOpacity>
                        </View>
                        
                        
                    
                    </View>
                    <Text style={styles.textFilter}>Type de propriete 2</Text>
                    <View style={styles.viewFilterCk}>
                        {/* Render first three checkboxes */}
                        {checkboxes.slice(0, showAll ? checkboxes.length : 3).map((isChecked, index) => (
                            <TouchableOpacity
                            key={index}
                            style={{ flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center',  marginBottom: 10 }}
                            onPress={() => toggleCheckbox(index)}
                            >
                            
                            <Text  style={isChecked ? ({alignSelf:'center',fontSize:15,color:'black'}):({alignSelf:'center',fontSize:15,color:'#555'})}>Checkbox {index + 1}</Text>
                            <View >
                                
                                <Ionicons
                                name={isChecked ? 'checkbox' : 'square-outline'}
                                size={28}
                                color={isChecked ? 'black' : '#999'}
                                style={{marginLeft:10,alignSelf:'flex-end'}}
                                
                            />
                            </View>
                            </TouchableOpacity>
                        ))}

                        {/* Render "Show More" button */}
                        {checkboxes.length > 3 && (
                            <TouchableOpacity onPress={toggleShowAll} style={{flexDirection:'row',alignItems:'center',alignContent:'center'}}>
                            <Text style={{ color: 'black' ,fontWeight:'700',textDecorationLine: 'underline'}}>
                                {showAll ? 'Show Less' : 'Show More'}
                                
                            </Text>
                            {showAll ? <MaterialIcons name="expand-less" size={24} color="black" /> : <MaterialIcons name="expand-more" size={24} color="black" />}
                            </TouchableOpacity>
                        )}
                    </View>
                    </ScrollView>
                    
                </View>

                {/* Footer */}
                <View style={[styles.footer,]}>
                    <TouchableOpacity onPress={closeModal} >
                        <Text style={{fontWeight:'700'}}>Tout effacer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={closeModal} style={[styles.button,{alignContent: 'flex-end',}]}>
                        <Text style={styles.buttonText}>Afficher les logements</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible0}
                onRequestClose={closeModal0}
            >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>            
                <TouchableOpacity style={{flexDirection:'row',marginBottom:10}}  onPress={()=> FIREBASE_AUTH.signOut()}>
                  <MaterialIcons name="logout" size={24} color="#fff" />
                  <Text style={{color:'#fff',marginLeft:3}}>Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row',marginBottom:10,alignItems:'center'}} onPress={() => handleDateSelect0()}>
                <AntDesign name="close" size={20} color="#fff" />

                    <Text style={{color:'#fff',marginLeft:3}}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
            </Modal>
      </ImageBackground>
    </BottomSheetModalProvider>
  );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft:40,
        paddingTop:20,
        paddingRight:40,
        opacity:0.9,
        backgroundColor:'#000'
        
    },
    imageContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        opacity: 0.7, // Set the opacity here (0.0 to 1.0)
      },
      backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        // Other styles for your background image
      },
      profileImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
      },
      profileImageNav: {
        width: 30,
        height: 30,
        borderRadius: 30,
      },
      msgImageNav: {
        width: 50,
        height: 50,
        borderRadius: 50,
        // marginBottom:10
      },
      btnsheet:{
        flex:1,
        alignItems:'center',
        justifyContent:'flex-end'
      },
      upBtn:{
        width:100,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderTopEndRadius:100,
        borderTopStartRadius:100,
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
      },
      imageLogo: {
        height: "30%",
        width: "80%",
        marginBottom: 50,
        marginTop:80
      },

      searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        backgroundColor: 'white',
        borderRadius: 50,
        padding: 15,
        marginBottom: 10,
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
      header: {
        backgroundColor: '#fff',
        padding: 20,
        width: '100%',
        borderBottomColor:'gray',
        borderBottomWidth:0.5,
        borderTopRightRadius:18,
        borderTopLeftRadius:18,
        
      },
      headerText: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      content: {
        backgroundColor: '#fff',
        padding: 20,
        flex:1
      },
      footer: {
        backgroundColor: '#fff',
        padding: 20,
        width: '100%',
        alignItems: 'center',
        borderTopColor:'gray',
        borderTopWidth:0.9,
        flexDirection:'row',
        justifyContent:'space-between'
      },
      option: {
        borderWidth: 0.8,
        borderColor: '#ccc',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
        paddingBottom: 20,
        marginBottom: 10,
        width:'33.3%'
    },
    selectedOption: {
        backgroundColor: '#000',
        color:'white',
    },
    op1:{
        borderTopLeftRadius:10,
        borderBottomLeftRadius:10,

    },
    op3:{
        borderTopRightRadius:10,
        borderBottomRightRadius:10,
    },
    textdOption: {
        color:'white',
    },
    viewFilter:{
        flexDirection:'row',
        alignContent:'space-around',
        borderBottomColor:'#999',
        borderBottomWidth:0.8,
        marginBottom:25,
        paddingBottom:20
    },
    viewFilterCk:{
        alignContent:'space-around',
        borderBottomColor:'#999',
        borderBottomWidth:0.8,
        marginBottom:25,
        paddingBottom:20,
        width:'100%'
    },
    textFilter:{
        fontSize:18,
        fontWeight:'500',
        paddingBottom:15
    },
   optionNbrc:{
        borderWidth: 0.8,
        borderColor: '#ccc',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop:10,
        paddingBottom:10,
        marginTop:12,
        marginLeft: 10,
        borderRadius:20
        
   },
   selectedOptionNbrc:{
        backgroundColor: '#000',
        color:'white',
   },
   optionTpr:{
        borderWidth: 0.8,
        borderColor: '#ccc',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop:10,
        paddingBottom:10,
        marginTop:12,
        marginLeft: 2,
        borderRadius:10,
        width:"100%",
   },
   selectedOptionTpr:{
        borderWidth: 2,
        borderColor: '#000',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
   },
   button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},
modalView: {
    position: 'absolute',
    bottom: 710,
    left: 250,
    right: 10,
    backgroundColor: '#222',
    borderRadius: 15,
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
    opacity:0.8
},

});
export default BottomSheetComponent;
