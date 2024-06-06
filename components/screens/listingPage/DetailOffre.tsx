import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Share, Modal, ImageBackground, Button } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import lisingData from '../../../assets/data/airbnb-listings.json';
import { Ionicons } from '@expo/vector-icons';
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
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons, AntDesign, FontAwesome } from '@expo/vector-icons';
import fileData from '../../../assets/data/file.json';
import Carousel from 'pinar';
import  {  Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapView from 'react-native-map-clustering';
import { MaterialIcons } from '@expo/vector-icons';

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
  const items = fileData;

  const [datafetch, setDatafetch] = useState(null);
  const [datafetchPlanning, setDatafetchPlanning] = useState(null);
  const [datafetchProgramme, setDatafetchProgramme] = useState(null);



  const fetchData = async () => {
    try {
      const response = await fetch(`http://192.168.11.107:1337/api/offres/${itemId}?populate=*&pagination[limit]=-1`);
      const data = await response.json();
        // console.log('Result5:', data.data.attributes);
      setDatafetch(data.data);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchDataPlanning = async () => {
    try {
      const response = await fetch(`http://192.168.11.107:1337/api/planings?populate=*&pagination[limit]=-1`);
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
      fetchData();
      fetchDataPlanning();
    }
  }, [itemId]);

  useEffect(() => {
    // console.log('Data fetched5:', datafetch);
  }, [datafetch]);


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
        console.log('id :', id);

        const response = await fetch(`http://192.168.11.107:1337/api/programmes?populate=*&pagination[limit]=-1`);
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
                8 jour
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
          <TouchableOpacity style={[styles.stImage, { justifyContent: 'center', alignItems: 'center', marginTop: 50 }]} onPress={openModal1}>
            <Text style={{color:'#fff',fontSize:12}}>Voir le planning</Text>
            <FontAwesome name="chevron-down" size={24} color="white" />
          </TouchableOpacity>
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
          <TouchableOpacity style={{ borderColor: '#fff', backgroundColor: '#fff', borderWidth: 1.5, borderRadius: 10, padding: 10, width: "55%", alignItems: 'center', justifyContent: 'center', marginBottom: 50 }} onPress={() => { animateToRegion() }}>
                <Text style={{ color: '#000', fontWeight: '700', fontSize: 18 }}>Afficher sur la carte
                </Text>
              </TouchableOpacity>
{/* 
          
          <View style={{ height: 300, backgroundColor: '#222' }}>
            <Text></Text>
          </View> */}
        </View>

      </ScrollView>


      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible1}
        onRequestClose={closeModal1}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 40 }} onPress={() => handleDateSelect1()}>
              <FontAwesome name="chevron-up" size={20} color="white" />
            </TouchableOpacity>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ color: '#fff', fontWeight: '500', fontSize: 13 }}>Votre voyage, jour apres jour</Text>
            </View>
            <View style={{ height: "75%" }}>


              <Carousel style={{ width: "100%", height: "100%" }}
                controlsContainerStyle={styles.controlsContainerStyle}
                controlsButtonStyle={styles.controlsButtonStyle}
                dotStyle={styles.doStyle}
                activeDotStyle={[styles.doStyle,{backgroundColor:'#fff'}]}
              >
                {datafetchPlanning?.map((item, index) => (
                  <View key={index} style={{ width: '100%', height: "100%" }}>


                    <ImageBackground source={{ uri: item.attributes.photos?.data[0].attributes.url }} style={styles.imageOffre} imageStyle={{ borderRadius: 20, height: "100%" }}>
                      <View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
                        
                        <View style={{ flex: 1, justifyContent: 'space-between', }}>
                        <View style={{  marginLeft: 15,backgroundColor: '#74D0F8', borderRadius: 8, padding: 5, width: "25%", alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
                        <Text style={{ color: '#fff', fontWeight: '600' }}>Jour {item.attributes.jourNumero}</Text>
                      </View>
                          <View style={{ width: "50%", marginLeft: 15 }}>
                            <Text style={{ fontSize: 16, fontWeight: '900', color: '#fff', }}>{item.attributes.titre}</Text>
                          </View>
                          <View style={{ width: "90%", marginLeft: 15, marginTop: 10 }}>
                            <Text style={{ fontSize: 13, fontWeight: '500', color: '#fff', }}>{item.attributes.description}</Text>
                          </View>
                          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity style={{ borderColor: '#fff', borderWidth: 1.5, borderRadius: 10, padding: 10, width: "55%", alignItems: 'center', justifyContent: 'center', marginBottom: 50 }} onPress={() => { handleDateSelectProgramme(item.id)}}>
                              <Text style={{ color: '#fff', fontWeight: '600' }}>Voir programme
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>

                      </View>

                    </ImageBackground></View>
                ))}
              </Carousel>

            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 18 }}>
              <TouchableOpacity style={{ borderColor: '#fff', backgroundColor: '#fff', borderWidth: 1.5, borderRadius: 10, padding: 10, width: "75%", alignItems: 'center', justifyContent: 'center', marginBottom: 50 }} onPress={() => { console.log('pre') }}>
                <Text style={{ color: '#000', fontWeight: '700', fontSize: 18 }}>Préparez votre départ !
                </Text>
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
                    <Image source={{uri: item.attributes.photos?.data[0]?.attributes.url}} style={{height:140,width:"100%",borderRadius:20,marginBottom:10}}/>
                    <Text style={{color:'#fff',alignItems:'center',textAlign:'center',marginBottom:8}}>{item.attributes.heure}</Text>
                    <Text style={{color:'#fff',alignItems:'center',textAlign:'center'}}>{item.attributes.description}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
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
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    controlsButtonStyle: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 15
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
});

export default DetailOffre