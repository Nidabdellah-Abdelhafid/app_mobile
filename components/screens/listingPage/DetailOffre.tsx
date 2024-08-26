import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Share, Modal, ImageBackground, Button, Alert } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import lisingData from '../../../assets/data/airbnb-listings.json';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FIREBASE_DB } from "FirebaseConfig";
import Animated, {
  SlideInDown,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  FadeInRight,
  FadeOutLeft
} from 'react-native-reanimated';
import Colors from '../../../constants/Colors';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { FlatList, ScrollView, Switch, TextInput } from 'react-native-gesture-handler';
import { MaterialCommunityIcons, AntDesign, FontAwesome } from '@expo/vector-icons';
import fileData from '../../../assets/data/file.json';
import Carousel from 'pinar';
import  {  Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapView from 'react-native-map-clustering';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import DateTimePicker from '@react-native-community/datetimepicker';
import { URL_BACKEND } from "api";

import Icon from 'react-native-vector-icons/MaterialIcons';

import { LinearGradient } from 'react-native-linear-gradient';

import * as Animatable from 'react-native-animatable';

const INITIAL_REGION = {
  latitude: 33.5883100,
  longitude: -7.6113800,
  latitudeDelta: 20,
  longitudeDelta: 20,
};
interface RouterProps {
  navigation: NavigationProp<any, any>;
  route
}
const { width } = Dimensions.get('window');
const IMG_HEIGHT = 300;

const DetailOffre = ({ route, navigation }: RouterProps) => {
  const { itemId } = route.params;
  const listing = (lisingData as any[]).find((item) => item.id === "1563562");
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const items = fileData;

  const [datafetch, setDatafetch] = useState(null);
  const [datafetchPlanning, setDatafetchPlanning] = useState(null);
  const [datafetchProgramme, setDatafetchProgramme] = useState(null);
  // const [currentUser,setcurrentUser]=useState('hafidnid909@gmail.com')
  const { user: currentUser } = route.params;
  const [userData, setUserData] = useState(null);
  const [userDC, setUserDC] = useState(null);
  

  const outerCarouselRef = useRef(null);
 


    const fetchUserData = async () => {
      // console.log(currentUser)
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
        // console.log(currentUserData.id)
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
  
    


  const fetchData = async () => {
    try {
      const response = await fetch(`${URL_BACKEND}/api/offres/${itemId}?populate=*&pagination[limit]=-1`);
      const data = await response.json();
        // console.log('Result5:', data.data.attributes);
      setDatafetch(data.data);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(()=>{
    fetchUserData();
  },[]);

 useEffect(()=>{
    fetchData();

  },[]);
  
  useEffect(() => {
    if (userData) {
      fetchUser();
    }
  }, [userData]);
  

  const fetchDataPlanning = async () => {
    try {
      const response = await fetch(`${URL_BACKEND}/api/planings?populate=*&pagination[limit]=-1`);
      const data = await response.json();
      // console.log('Result5:', data.data[0].attributes.offre?.data);
      const filteredData = data.data.filter(item => item.attributes.offre?.data.id === itemId);
      // console.log("jjj: ",filteredData)
      setDatafetchPlanning(filteredData);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    
    if (itemId) {
     
      fetchDataPlanning();
    }
  }, []);

  const openModal1 = () => {
    setModalVisible1(true);
  };

  const closeModal1 = () => {
    setModalVisible1(false);
  };
  const handleDateSelect1 = () => {
    // Close the modal
    closeModal1();
  };
  //------
  const openModal2 = () => {
    setModalVisible2(true);
  };

  const closeModal2 = () => {
    setModalVisible2(false);
  };
  const handleDateSelect2 = () => {
    // Close the modal
    closeModal2();
  };
  //----
  const openModal3 = () => {
    setModalVisible3(true);
  };

  const closeModal3 = () => {
    setModalVisible3(false);
  };
  const handleDateSelect3 = () => {
    // Close the modal
    videForm();
    closeModal3();
  };



  const shareListing = async () => {
    try {
      await Share.share({
        title: listing.name,
        url: listing.xl_picture_url,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerTransparent: true,

      headerBackground: () => (
        <Animated.View style={[headerAnimatedStyle, styles.header]}></Animated.View>
      ),
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
            <Text style={{ color: 'white', marginRight: 5, fontWeight: '600' }}>Partager</Text>
            <Entypo name="share" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={25} color="white" />
        </TouchableOpacity>
      ),
    });
  }, []);

  const scrollOffset = useScrollViewOffset(scrollRef);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  }, []);


  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
    };
  }, []);

  const [columns, setColumns] = useState(1); // Initial number of columns

  const toggleColumns = () => {
    const newColumns = columns === 1 ? 2 : 1; // Toggle between 1 and 2 columns
    setColumns(newColumns);
  };
  const data = datafetch?.attributes.planings?.data;
  // const sd = datafetchPlanning[0]?.attributes.programmes?.data;

  // console.log("hona : ",datafetchPlanning)
  const handleDateSelectProgramme = async (id)=>{
      try {
        // console.log('id :', id);

        const response = await fetch(`${URL_BACKEND}/api/programmes?populate=*&pagination[limit]=-1`);
        const data = await response.json();
        // console.log('Result5--:', data.data);
        const filteredData = data.data.filter(item => item.attributes.planing?.data.id === id);
        // console.log('Result5:', filteredData);
        setDatafetchProgramme(filteredData);
        openModal2();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
  
  }
const mapRef = useRef();

const animateToRegion = () => {
  let region = {
    latitude: +datafetch?.attributes.latitude,
    longitude: +datafetch?.attributes.longitude,
    latitudeDelta: 7.5,
    longitudeDelta: 7.5,
  };

  mapRef.current.animateToRegion(region, 2000);
};
const [reference, setReference] = useState('');
const [destination, setDestination] = useState('');
const [nbr_voyageurs_adultes, setNbr_voyageurs_adultes] = useState(0);
const [nbr_voyageurs_enfants, setNbr_voyageurs_enfants] = useState(0);
const [pourquoi_voyagez_vous, setPourquoi_voyagez_vous] = useState('');
const [date_partir, setDate_partir] = useState(new Date());
const [showDatePicker, setShowDatePicker] = useState(false);
const [date_fixe, setDate_fixe] = useState(false);
const [duree, setDuree] = useState(0);
const [duree_modifiable, setDuree_modifiable] = useState(false);
const [categorie_hebergement, setCategorie_hebergement] = useState('');
const [cabine, setCabine] = useState('');
const [experience_souhaitez, setExperience_souhaitez] = useState('');
// const [offre, setOffre] = useState(null);
const handleAdultChange = (text) => {
  const num = parseInt(text, 10);
  if (!isNaN(num) && num >= 0) {
    setNbr_voyageurs_adultes(num);
  } else {
    setNbr_voyageurs_adultes(0);
  }
};

const handleChildrenChange = (text) => {
  const num = parseInt(text, 10);
  if (!isNaN(num) && num >= 0) {
    setNbr_voyageurs_enfants(num);
  } else {
    setNbr_voyageurs_enfants(0);
  }
};
const handleDureeChange = (text) => {
  const num = parseInt(text, 10);
  if (!isNaN(num) && num >= 0) {
    setDuree(num);
  } else {
    setDuree(0);
  }
};


useEffect(() => {
  if (datafetch?.attributes?.pay?.data?.attributes?.label) {
    setDestination(datafetch.attributes.pay.data.attributes.label);
  }
}, [datafetch]);



const onChangeDate = (event, selectedDate) => {
  const currentDate = selectedDate || date_partir;
  setShowDatePicker(false);
  setDate_partir(currentDate);
};

const formatDate = (date) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

const handleSubmit = async () => {
  const refRS= new Date();
  const refRSInSeconds = Math.floor(refRS.getTime() / 1000);
  const reservationData = {
    reference : 'REFRS'+refRSInSeconds+'MN4',
    destination : destination,
    nbr_voyageurs_enfants : nbr_voyageurs_enfants,
    nbr_voyageurs_adultes: nbr_voyageurs_adultes,
    pourquoi_voyagez_vous : pourquoi_voyagez_vous,
    date_partir : date_partir,      
    date_fixe : date_fixe,
    duree : duree,
    duree_modifiable : duree_modifiable,
    categorie_hebergement : categorie_hebergement,
    cabine : cabine,
    experience_souhaitez : experience_souhaitez,
    offre: itemId,
    user: userDC.id,
    status:false,
    etat: "enAttente"

};

 
  
  try {
    const response = await axios.post(`${URL_BACKEND}/api/reservations`, {
      data: reservationData,
    });
    // console.log('Success', 'Reservation created successfully!', response.data);
    Alert.alert('🎉 Success! 🎉',
    '✅ Reservation created successfully!',
    [{ text: 'OK', onPress: () => {handleDateSelect3()} }],
    { cancelable: false });

    setTimeout( async () => {
      try {
      if(response){
      const resID= response?.data.data.id;
      const responseRs = await axios.get(`${URL_BACKEND}/api/reservations/${resID}?populate=*&pagination[limit]=-1`);
      const rf=responseRs.data;
      const ref= new Date();
      const refInSeconds = Math.floor(ref.getTime() / 1000);
      const  factureData = {
        reference: 'REF'+refInSeconds+'LP9',
        prixTotal: Number(rf?.data.attributes.offre?.data?.attributes.prix*(rf?.data.attributes.nbr_voyageurs_enfants+rf?.data.attributes.nbr_voyageurs_adultes+rf?.data.attributes.duree)),
        reservation: resID,
        status: false
      };
      
      const responsefacture = await axios.post(`${URL_BACKEND}/api/factures`, {
        data: factureData,
      });
      // console,log(rf);
      // console.log('Success', ' rf : ',rf?.data.attributes.duree);
      // Alert.alert('🎉 Success! 🎉',
      // '✅ Reservation created successfully!',
      // [{ text: 'OK', onPress: () => {handleDateSelect3()} }],
      // { cancelable: false });
      // closeModal3();
    }
  } catch (error) {
      console.log('Error', error.response?.data || error.message);
    }
    }, 500);
    


  } catch (error) {
    console.log('Error', error.response?.data || error.message);
  }
  
};
const handleSubmit1 = () => {
  // Handle form submission
  console.log('Form Data Submitted ---:');
  // Here you can send formData to your server
};
const [options, setOptions] = useState([
  { label: 'Hôtel 4 etoils', value: false ,star:4},
  { label: 'Hôtel 5 etoils', value: false ,star:5},
  { label: 'Hôtel de luxe', value: false },
  { label: 'Un Resort', value: false },
  { label: 'Un ecolodge', value: false },
  // Add more options as needed
]);
const [options1, setOptions1] = useState([
  { label: 'Économique', value: false },
  { label: 'Business', value: false },
  // Add more options as needed
]);
const [options2, setOptions2] = useState([
  { label: 'Culturelle', value: false },
  { label: 'Nature', value: false },
  { label: 'Foodie', value: false },
  { label: 'Shopping', value: false },
  { label: 'Romantique', value: false },
  { label: 'Spa', value: false },
  
  { label: 'Soleil', value: false },
  { label: 'Fête', value: false },
  { label: 'Famille', value: false },
  { label: 'Luxe', value: false },
  { label: 'Casino', value: false },
  { label: 'Plage', value: false },

  // Add more options as needed
]);


// useEffect(() => {
//   console.log(categorie_hebergement);
// }, [categorie_hebergement]);
// useEffect(() => {
//   console.log(cabine);
// }, [cabine]);

const toggleOption = (index) => {
  const updatedOptions = options.map((option, i) => {
    if (i === index) {
      setCategorie_hebergement(option.label);
      return { ...option, value: !option.value };
    } else {
      return { ...option, value: false };
    }
  });
  setOptions(updatedOptions);
};
const toggleOption1 = (index) => {
  const updatedOptions = options1.map((option, i) => {
    if (i === index) {
      setCabine(option.label);
      return { ...option, value: !option.value };
    } else {
      return { ...option, value: false };
    }
  });
  setOptions1(updatedOptions);
};
const renderStars = (star) => {
  const stars = [];
  for (let i = 0; i < star; i++) {
    stars.push(<Text key={i}>⭐</Text>);
  }
  return stars;
};
const toggleOption2 = (index) => {
  const updatedOptions = options2.map((option, i) => {
    if (i === index) {
      return { ...option, value: !option.value };
    }
    return option;
  });
  setOptions2(updatedOptions);

  const selectedLabels = updatedOptions
    .filter(option => option.value)
    .map(option => option.label)
    .join(', ');

  setExperience_souhaitez(selectedLabels);
};
// useEffect(() => {
//   console.log(experience_souhaitez);
// }, [experience_souhaitez]);

const videForm =()=>{
    setReference('')
    setNbr_voyageurs_adultes(0)
    setNbr_voyageurs_enfants(0)
    setPourquoi_voyagez_vous('')
    setDate_partir(new Date())
    setDuree_modifiable(false)
    setDuree(0)
    setDate_fixe(false)
    setCabine('')
    setCategorie_hebergement('')
    setExperience_souhaitez('')
    options.map((i)=>{
      i.value=false
    })
    options1.map((i)=>{
      i.value=false
    })
    options2.map((i)=>{
      i.value=false
    })

};

// const [currentIndex, setCurrentIndex] = useState(0);
// const carouselRef = useRef(null);

// const handleIndexChange = (index) => {
//   setCurrentIndex(index);
// };

// const handlePrev = () => {
//   if (carouselRef.current && currentIndex > 0) {
//     carouselRef.current.scrollTo({ index: currentIndex - 1 });
//   }
// };

// const handleNext = () => {
//   if (carouselRef.current) {
//     carouselRef.current.scrollTo({ index: currentIndex + 1 });
//   }
// };

const slideInDownCustom = {
  0: {
    translateY: 0,
  },
  0.25: {
      translateY: -20,
  },
  0.5: {
      translateY: 0,
  },
  0.75: {
      translateY: -10,
  },
  1: {
      translateY: 0,
  },
};
const fadeInSlideUp = {
  from: {
      opacity: 0,
      translateY: 20,
  },
  to: {
      opacity: 1,
      translateY: 0,
  },
};


  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        ref={scrollRef}
        scrollEventThrottle={16}
      >
        <Animated.Image
          source={{ uri: datafetch?.attributes.image }}
          style={[styles.image, imageAnimatedStyle]}
          resizeMode="cover"
        />
        <View style={styles.shadowOverlay}></View>
        <View style={{ position: 'absolute', top: 180, left: "25%", justifyContent: 'center', alignItems: 'center' }}>
          {/* <Image source={{uri: datafetch?.attributes.photos?.data[0]?.attributes.url}} style={styles.stImage}/> */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', backgroundColor: '#000', opacity: 0.5, width: 120, borderRadius: 10, padding: 2 }}>
            <Text style={{ color: 'white' }}>Top Seller</Text>
            <AntDesign name="Trophy" size={24} color="white" />
          </View>
          <View style={{ width: 200 }}>
            <Text style={styles.name}>{datafetch?.attributes.label}</Text>
          </View>

          {/* <TouchableOpacity style={[styles.stImage,{backgroundColor:'#000',justifyContent:'center',alignItems:'center',opacity:0.8}]} onPress={openModal1}>
              <MaterialCommunityIcons name="image-area" size={20} color="white" />
          </TouchableOpacity> */}
        </View>
        <View style={styles.infoContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

            <View style={{ justifyContent: 'space-between', alignSelf: 'center', paddingBottom: 5 }}>
              <Text style={[styles.location]}>
                {datafetch?.attributes.planings?.data.length} jour
              </Text>

            </View>

            <View style={{ justifyContent: 'center', alignItems: 'center', padding: 1, height: 40, backgroundColor: '#fff', marginLeft: 20 }}></View>

            <View style={{ justifyContent: 'space-between', alignItems: 'center', paddingTop: 0, marginLeft: 10 }}>

              <View style={{ justifyContent: 'center', padding: 2 }}>
                <Text style={{ color: '#C4C2C2', fontWeight: '700' }}>Tarif a partir de:</Text>
                <Text style={styles.location}>
                  {datafetch?.attributes.prix} DHs/per
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.description}>{datafetch?.attributes.description}</Text>
          <Animatable.View animation={slideInDownCustom} iterationCount="infinite" direction="alternate">
            <TouchableOpacity style={[styles.stImage, { justifyContent: 'center', alignItems: 'center', marginTop: 50 }]} onPress={openModal1}>
              <Text style={{color:'#fff',fontSize:12}}>Voir le planning</Text>
              <FontAwesome name="chevron-down" size={24} color="white" />
              {/* <AntDesign name="down" size={24} color="white" /> */}
            </TouchableOpacity>
          </Animatable.View>
          <View style={{width:"100%",height:400,marginTop:40,borderRadius:20,overflow: 'hidden',marginBottom:18}}>
            <MapView style={styles.map} 
            ref={mapRef}
            showsUserLocation
            showsMyLocationButton
            provider={PROVIDER_GOOGLE}
            initialRegion={INITIAL_REGION}
            clusterColor='#fff'
            clusterTextColor='#000'
      >
            <Marker
            
                key={datafetch?.id}
                coordinate={{
                    latitude: +datafetch?.attributes.latitude,
                    longitude: +datafetch?.attributes.longitude
                }}
            >
                <View style={styles.marker}>
                    <MaterialIcons name="pin-drop" size={24} color="red" />
                    <Text style={styles.markerText}>{datafetch?.attributes.pay?.data?.attributes.label}</Text>
                </View>
          </Marker>

      </MapView>
      
          </View>
          <TouchableOpacity style={{ borderColor: '#fff', backgroundColor: '#fff', borderWidth: 1.5, borderRadius: 10, padding: 10, width: "65%", alignItems: 'center', justifyContent: 'center', marginBottom: 50 }} onPress={() => { animateToRegion() }}>
            <Text style={{ color: '#000', fontWeight: '700', fontSize: 18 }}>Afficher sur la carte
            </Text>
          </TouchableOpacity>

{/* 
          
          <View style={{ height: 300, backgroundColor: '#222' }}>
            <Text></Text>
          </View> */}
        </View>
{/* <Button title='press' onPress={handleSubmit}/> */}
      </ScrollView>


      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible1}
        onRequestClose={closeModal1}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Animatable.View animation={fadeInSlideUp} iterationCount="infinite" direction="alternate">
              <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 40 }} onPress={() => handleDateSelect1()}>
                <FontAwesome name="chevron-up" size={20} color="white" />
              </TouchableOpacity>
            </Animatable.View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ color: '#fff', fontWeight: '500', fontSize: 13 }}>Votre voyage, jour apres jour</Text>
            </View>
            <View style={{ height: "75%" }}>


              <Carousel 
                  style={{ width: "100%", height: "100%" }}
                  ref={outerCarouselRef}
                  // onIndexChanged={handleIndexChange}

                  controlsContainerStyle={styles.controlsContainerStyle}
                  controlsButtonStyle={styles.controlsButtonStyle}

                  renderPrev={() => (
                    <TouchableOpacity onPress={() => outerCarouselRef.current.scrollToPrev()}>
                      <Icon name="chevron-left" size={30} color="black" style={styles.controlsButtonStyle} />
                    </TouchableOpacity>
                  )}
                  renderNext={() => (
                    <TouchableOpacity onPress={() => outerCarouselRef.current.scrollToNext()}>
                      <Icon name="chevron-right" size={30} color="black" style={styles.controlsButtonStyle} />
                    </TouchableOpacity>
                  )}

                  dotStyle={styles.hidden}
                  activeDotStyle={styles.hidden}
                  scrollEnabled={false}

                  // activeDotStyle={[styles.controlsButtonStyle1,{backgroundColor:'#fff'}]}
                >
                  {datafetchPlanning?.map((item, index) => (
                    <View key={index} style={{ width: '100%', height: "100%" }}>

                  <Carousel 
                    style={{ width: '100%', height: '100%' }}
                    controlsButtonStyle={styles.hidden}
                    dotStyle={[styles.controlsButtonStyle2]}
                    activeDotStyle={[styles.controlsButtonStyle2, {backgroundColor:'#fff'}]}
                    scrollEnabled={true}
                  >
                    {item.attributes.photos?.data.map((photo, photoIndex) => (
                      <ImageBackground 
                        key={photoIndex}
                        source={{ uri: photo.attributes.url }} 
                        style={styles.imageOffre} 
                        imageStyle={{ borderRadius: 20, height: "100%" }}
                      >

                      {/* {item.attributes.photos?.data.map((i)=>(
                        <Image source={{uri: i.attributes.url}} style={{width:100,height:100}}/>
                      ))}
                      <ImageBackground 
                        source={{ uri: item.attributes.photos?.data[0]?.attributes.url }} 
                        style={styles.imageOffre} 
                        imageStyle={{ borderRadius: 20, height: "100%" }}> */}

                        <View style={styles.shadowOverlay}>
                          <View style={{ marginLeft: 15, backgroundColor: '#74D0F8', borderRadius: 8, padding: 5, width: "25%", alignItems: 'center', justifyContent: 'center', marginTop: 15}}>
                              <Text style={{ color: '#fff', fontWeight: '600' }}> Jour {item?.attributes.jourNumero}</Text>
                          </View>
                        </View>
                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
                            
                          <View style={{ flex: 1, justifyContent: 'space-between', }}>
                            
                            <View style={{ width: "50%", marginLeft: 15 }}>
                              <Text style={{ fontSize: 16, fontWeight: '900', color: '#fff', }}>{item?.attributes.titre}</Text>
                            </View>
                            <View style={{ width: "90%", marginLeft: 15, marginTop: 10 }}>
                              <Text style={{ fontSize: 13, fontWeight: '500', color: '#fff', }}>{item?.attributes.description}</Text>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                              <TouchableOpacity style={{ borderColor: '#fff', borderWidth: 1.5, borderRadius: 10, padding: 10, width: "55%", alignItems: 'center', justifyContent: 'center', marginBottom: 50 }} onPress={() => { handleDateSelectProgramme(item?.id)}}>
                                <Animatable.Text animation="zoomIn" iterationCount="infinite" direction="alternate" style={{ color: '#fff', fontWeight: '600' }}>Voir programme
                                </Animatable.Text>
                              </TouchableOpacity>
                            </View>
                          </View>

                        </View>

                      </ImageBackground>
                      ))}
                    </Carousel>
                    </View>
                  ))}
                  
              </Carousel>


            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 18 }}>
            <TouchableOpacity style={{ borderColor: '#fff', backgroundColor: '#fff', borderWidth: 1.5, borderRadius: 10, padding: 5, width: "75%", alignItems: 'center', justifyContent: 'center', marginBottom: 20 }} onPress={() => { openModal3() }}>
              <Animatable.Text animation="flash" iterationCount="infinite" direction="alternate" style={{ color: '#000', fontWeight: '700', fontSize: 18 }}>Préparez votre départ !
              </Animatable.Text>
            </TouchableOpacity>
            </View>
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
            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 40 }} onPress={() => handleDateSelect2()}>
              <AntDesign name="close" size={24} color="white" />
            </TouchableOpacity>
            <ScrollView
            contentContainerStyle={styles.contentContainer}
            >
              {datafetchProgramme?.map((item, index) => {
                const isLastItem = index === datafetchProgramme.length - 1;
                return (
                  <View key={index} style={{padding:20,justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                    <Image source={{uri: item?.attributes.photos?.data[0]?.attributes.url}} style={{height:140,width:"100%",borderRadius:20,marginBottom:10}}/>
                    <Text style={{color:'#fff',alignItems:'center',textAlign:'center',marginBottom:8}}>{item?.attributes.heure}</Text>
                    <Text style={{color:'#fff',alignItems:'center',textAlign:'center'}}>{item?.attributes.description}</Text>
                    {!isLastItem && (
                      <View style={{justifyContent:'center',alignItems:'center',padding:1,height:50,backgroundColor:'#fff'}}></View>
                    )}
                  </View>
                );
              })}
              <View style={{justifyContent: 'center',alignItems: 'center'}}>
                
              <TouchableOpacity style={{ borderColor: '#fff', borderWidth: 1.5, borderRadius: 10, padding: 10, width: "50%", alignItems: 'center', justifyContent: 'center', marginBottom: 50 }} onPress={() => { handleDateSelect2() }}>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Super, Merci!
                </Text>
              </TouchableOpacity>
              </View>
            </ScrollView>
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
          <View style={styles.modalViewRs}>
          <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 40 }} onPress={() => handleDateSelect3()}>
              <FontAwesome name="chevron-up" size={20} color="white" />
            </TouchableOpacity>
            <ProgressSteps>
              <ProgressStep label='Step 1'>
                <Text style={styles.inputText}>Destination</Text>
                
                  <TextInput
                  placeholder="Destination"
                  value={destination}
                  onChangeText={setDestination}
                  style={styles.inputView}
                  readOnly={true}
                />
                
                <Text style={styles.inputText}>Nombre de voyageurs adultes</Text>
                <TextInput
                  value={nbr_voyageurs_adultes.toString()}
                  onChangeText={handleAdultChange}
                  style={styles.inputView}
                  keyboardType="numeric"
                />
                <Text style={styles.inputText}>Nombre d’enfants</Text>
                <TextInput
                  value={nbr_voyageurs_enfants.toString()}
                  onChangeText={handleChildrenChange}
                  style={styles.inputView}
                  keyboardType="numeric"
                />
              </ProgressStep>
              <ProgressStep label='Step 2'>
              <Text style={styles.inputText}>Pourquoi voyagez-vous ?</Text>
                
                <TextInput
                placeholder="Aventure, Culture, détente …"
                value={pourquoi_voyagez_vous}
                onChangeText={setPourquoi_voyagez_vous}
                style={styles.inputView}
              />
              
              <Text style={styles.inputText}>Quand souhaitez-vous partir ?</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputView}>
                <Text>{formatDate(date_partir)}</Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={date_partir}
                      mode="date"
                      display="default"
                      onChange={onChangeDate}
                    />
                  )}
              <View style={{flexDirection:'row',alignItems:'center'}}>  
              <Switch
                value={date_fixe}
                onValueChange={setDate_fixe}
              />
              <Text style={styles.inputTextSwitch}>Mes dates sont fixes</Text>
              </View>  
              <Text style={styles.inputText}>Quelle est la durée de votre séjour ?</Text>
                <TextInput
                  value={duree.toString()}
                  onChangeText={handleDureeChange}
                  style={styles.inputView}
                  keyboardType="numeric"
                />
              <View style={{flexDirection:'row',alignItems:'center'}}>  
              <Switch
                value={duree_modifiable}
                onValueChange={setDuree_modifiable}
              />
              <Text style={styles.inputTextSwitch}> durée de mon voyage est non modifiable</Text>
              </View> 
              </ProgressStep>
              <ProgressStep label='Step 3'>
              <Text style={styles.inputText}>Vous êtes intéressés par quelle catégorie d’hébergement ?</Text>
              
              {options.map((option, index) => (
                <View key={index} style={{flexDirection:'row',alignItems:'center'}}>
                  
                  <Switch
                    value={option.value}
                    onValueChange={() => toggleOption(index)}
                  />
                  <Text style={styles.inputTextSwitch}>{option.label}</Text>
                  <View style={styles.starContainer}>
                    {renderStars(option?.star)}
                  </View>
                </View>
              ))}
              <Text style={styles.inputText}>Choix de cabine</Text>
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:10,margin:5}}>
                {options1.map((option, index) => (
                  <View key={index} style={{flexDirection:'row',alignItems:'center'}}>
                    
                    <Switch
                      value={option.value}
                      onValueChange={() => toggleOption1(index)}
                    />
                    <Text style={styles.inputTextSwitch}>{option.label}</Text>
                  </View>
                ))}
              </View>
              
              </ProgressStep>
              <ProgressStep label='Step 4' onSubmit={handleSubmit}>
              <Text style={styles.inputText}>Quelle expérience vous souhaitez vivre ?</Text>
              <View style={{flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            padding: 4,
                            alignContent:'center',
                            }}>
                {options2.map((option, index) => (
                  <View key={index} style={{flexDirection: 'row',
                  alignItems: 'center',
                  width: '45%', // Ensure two items per row
                  marginBottom: 2.5}}>
                    
                    <Switch
                      value={option.value}
                      onValueChange={() => toggleOption2(index)}
                    />
                    <Text style={styles.inputTextSwitch}>{option.label}</Text>
                  </View>
                ))}
              <Text style={[styles.inputText,{textAlign:'center'}]}>« cliquez pour sélectionner des expériences » Vous pouvez choisir plusieurs expériences</Text>

              </View>
              </ProgressStep>
              {/* <ProgressStep label='Step 5' onSubmit={handleSubmit1}>
                <Text style={{color:'#fff'}}>Step final</Text>
              </ProgressStep> */}
            </ProgressSteps>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({

  controlsContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 10,
    marginLeft: 5,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  controlButtonText: {
    color: 'black',
    fontSize: 14,
  },
  controlsButtonStyle: {
    width: 30,
    height: 30,
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
  },

  controlsButtonStyle1: {
    width: 10,
    height: 10,
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
  },

  controlsButtonStyle2: {
    bottom: 245,
    left: -125,
    transform: [{translateX: -5}, {translateY: -5 }],
    width: 8,
    height: 8,
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
  },

  hidden: {
    display: 'none',
  },

  arrowButton: {
    position: 'absolute',
    top: '50%',
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 10,
  },

  map: {
    width: '100%',
    height: '100%',
    borderRadius:20
  },
  marker: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
  markerText: {
    fontSize: 14,
  },
  contentContainer: {
    justifyContent: 'center',
  },
  controlsContainerStyle: {
    position: 'absolute',
    top: "0%",
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  doStyle:{ 
    width: 20,
    height: 2,
    backgroundColor: 'silver', 
    marginHorizontal: 3, 
    borderRadius: 3 
  },
  container: {
    flex: 1,
    backgroundColor: '#222',
  },

  gradient: {
    flex: 1,
  },


  image: {
    height: IMG_HEIGHT,
    width: width,
    backgroundColor: '#000',
    opacity: 1

  },
  infoContainer: {
    width:"100%",
    padding: 24,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: -21,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center'


  },
  location: {
    fontSize: 16,
    marginBottom: 15,
    color: '#CFCECE',
    fontWeight: '600'
  },
  rooms: {
    fontSize: 16,
    color: Colors.grey,
    marginVertical: 4,
  },
  ratings: {
    fontSize: 16,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.grey,
    marginVertical: 16,
  },
  host: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: Colors.grey,
  },
  hostView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerText: {
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerPrice: {
    fontSize: 18,
    color: 'white'
  },
  roundButton: {
    width: 110,
    height: 40,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#fff'
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  header: {
    backgroundColor: '#222',
    height: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
  },

  description: {
    fontSize: 16,
    marginTop: 10,
    color: '#CFCECE'
  },
  stImage: {
    width: "100%",
    height: 30,
    marginLeft: 10,
    borderRadius: 7,
  },
  stImageModal: {
    width: 160,
    height: 220,
    borderRadius: 15,

  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    position: 'absolute',
    top: 58,
    left: 20,
    right: 20,
    height: "84%",
    backgroundColor: '#000',
    opacity: 1,
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

  },

  modalView1: {
    position: 'absolute',
    top: 58,
    left: 20,
    right: 20,
    height: "84%",
    backgroundColor: '#000',
    opacity: 1,
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

  },


  modalViewRs: {
    position: 'absolute',
    top: 58,
    left: 20,
    right: 20,
    height: "84%",
    backgroundColor: '#333333',
    opacity: 1,
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

  },
  listViewOffre: {
    gap: 10,
    marginRight: 20,
  },
  imageOffre: {
    height: "100%",
    width: "100%",
    borderRadius: 20,
    justifyContent: 'flex-end'
  },
  inputView: {
    width: '100%',
    borderRadius: 10,
    height: 50,
    padding: 10,
    color: '#000',
    backgroundColor:'#e8f5e9',
    marginBottom:11,
    marginTop:10,
    justifyContent: 'center'
    
  },
  inputText: {
    fontSize:16,
    color: 'white',
  },
  inputTextSwitch:{
    fontSize:14,
    color: 'white',
  },
  starContainer: {
    flexDirection: 'row',
    marginLeft:5
  },

  shadowContainer: {
    position: 'relative', // Ensure the overlay positions correctly within the container
    height: '100%',
    width: '100%',
    borderRadius: 20,
  },
  shadowOverlay: {
    ...StyleSheet.absoluteFillObject, // Cover the entire container
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Adjust the opacity as needed
  },
});

export default DetailOffre