import React, { useState } from 'react';
import  {  Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, Text,Modal, View, TouchableOpacity, Image } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo for icons
import MapView from 'react-native-map-clustering';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
interface Props{
    listing: any;
    category:string;
    navigation: NavigationProp<any, any>;
}


const INITIAL_REGION = {
    latitude: 33.5883100,
    longitude: -7.6113800,
    latitudeDelta: 110,
    longitudeDelta: 110,
  };

const ListingMapPage = ({ navigation, listing, category}:Props) => {
    const [selectedMarker, setSelectedMarker] = useState(null);
    
    const onMarketSelected= (item)=>{
        // navigation.navigate('DetailPage', { itemId: item.properties.id })
        setSelectedMarker(item);
    }
    const onMarketSelectedModal= (item)=>{
        navigation.navigate('DetailPage', { itemId: item.id });
        setSelectedMarker(null);
        
    }
    const closeModal = () => {
        setSelectedMarker(null);
    }

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
    <View style={styles.container}>
      <MapView style={styles.map} 
      
      onPress={closeModal}
      showsUserLocation
      showsMyLocationButton
      provider={PROVIDER_GOOGLE}
      initialRegion={INITIAL_REGION}
      clusterColor='#fff'
      clusterTextColor='#000'
      // renderCluster={renderCluster}
      >

        {listing.map((item) => (
                    <Marker
                    onPress={()=> onMarketSelected(item)}
                        key={item.id}
                        coordinate={{
                            latitude: +item.attributes.latitude,
                            longitude: +item.attributes.longitude
                        }}
                    >
                        <View style={styles.marker}>
                            <MaterialIcons name="pin-drop" size={24} color="red" />
                            <Text style={styles.markerText}>{item.attributes.label}</Text>
                        </View>
                  </Marker>
                ))}


      </MapView>
      
                {selectedMarker && (
            
            <Modal
            animationType="slide"
            transparent={true}
            visible={selectedMarker !== null}
            onRequestClose={closeModal}
        >
            

          
            <View style={styles.modalContainer}>
                <TouchableOpacity onPress={()=>onMarketSelectedModal(selectedMarker)}>
                <View style={styles.modalContent}>
                  
                    <View style={styles.imageContainer}>
                    <Image source={{uri: selectedMarker.attributes.photos.data[0].attributes.url}} style={styles.image}/>
                    </View>
                    <View style={styles.detailsContainer}>
                        <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:2}}>
                            <Text style={styles.detailTextName}>{selectedMarker.attributes.label}</Text>
                                        
                            <TouchableOpacity style={styles.favorieItem}>
                                <Ionicons name="heart-outline" size={18} color="#000" />
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection:'row'}}>
                          <Entypo name="location-pin" size={20} color="#CFCECE" />
                          <Text style={styles.detailText}>{selectedMarker.attributes.continent}</Text>
                        </View>
                        <Text style={styles.detailText}></Text>
                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                            <View style={{ flexDirection: 'row', gap: 4 ,marginBottom:10}}>
                            <StarRating reviews={selectedMarker.attributes.reviews} />
                            </View>
                        </View>
                        
                    </View>
                    
                </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                    <Ionicons name="close-outline" size={25} color="white" />
                </TouchableOpacity>
            </View>
        </Modal>
        )}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
    },
    map: {
      width: '100%',
      height: '100%',
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
      modalContainer: {
        position: 'absolute',
        bottom: 80,
        left: 10,
        right: 10,
        backgroundColor: '#fff',
        padding: 0,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    closeButton: {
        position: 'absolute',
        top: 5,
        left: 20,
        backgroundColor:'#999',
        opacity:.8,
        borderRadius: 20,
        
    },
    closeButtonText: {
        fontWeight: 'bold',
        color: '#333',
    },
    modalContent: {
        flexDirection: 'row',
    },
    imageContainer: {
        flex: 1,
        marginRight: 10,
        borderRadius: 20,

    },
    image:{
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        width:'100%',
        height:'100%'
    },
    detailsContainer: {
        flex: 2,
        paddingRight:10
    },
    detailTextName: {
        fontSize: 35,
        marginBottom: 2,
        fontWeight:'700',
        flex:2
    },
    detailText: {
        fontSize: 16,
        fontWeight:'400',
        color:'#999',
        marginBottom: 2,
    },
    detailTextPrice: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight:'700'
    },
    favorieItem:{
        
    }
  });


export default ListingMapPage;

