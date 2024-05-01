import React, { useState } from 'react';
import  {  Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, Text,Modal, View, TouchableOpacity, Image } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo for icons
import MapView from 'react-native-map-clustering';

interface Props{
    listing: any;
    category:string;
    navigation: NavigationProp<any, any>;
}


const INITIAL_REGION = {
    latitude: 33.5883100,
    longitude: -7.6113800,
    latitudeDelta: 9,
    longitudeDelta: 9,
  };

const ListingMapPage = ({ navigation, listing, category}:Props) => {
    const [selectedMarker, setSelectedMarker] = useState(null);
    
    const onMarketSelected= (item)=>{
        // navigation.navigate('DetailPage', { itemId: item.properties.id })
        setSelectedMarker(item);
    }
    const onMarketSelectedModal= (item)=>{
        navigation.navigate('DetailPage', { itemId: item.properties.id });
        setSelectedMarker(null);
        
    }
    const closeModal = () => {
        setSelectedMarker(null);
    }
    const renderCluster = (cluster: any) => {
        const { id, geometry, onPress, properties } = cluster;
    
        const points = properties.point_count;
        return (
          <Marker
            key={`cluster-${id}`}
            coordinate={{
              longitude: geometry.coordinates[0],
              latitude: geometry.coordinates[1],
            }}
            onPress={onPress}>
            <View style={styles.marker}>
              <Text
                style={{
                  color: '#000',
                  textAlign: 'center',
                }}>
                {points}
              </Text>
            </View>
          </Marker>
        );
      };
    
  return (
    <View style={styles.container}>
      <MapView style={styles.map} 
      animationEnabled={false}
      onPress={closeModal}
      showsUserLocation
      showsMyLocationButton
      provider={PROVIDER_GOOGLE}
      initialRegion={INITIAL_REGION}
      clusterColor='#fff'
      clusterTextColor='#000'
      renderCluster={renderCluster}
      >
        {listing.features.map((item) => (
            <Marker
            onPress={()=> onMarketSelected(item)}
                key={item.properties.id}
                coordinate={{
                    latitude: +item.properties.latitude,
                    longitude: +item.properties.longitude
                }}
            >
                <View style={styles.marker}>
                    <Text style={styles.markerText}>€ {item.properties.price}</Text>
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
                        <Image source={{uri: selectedMarker.properties.medium_url}} style={styles.image}/>
                        </View>
                        <View style={styles.detailsContainer}>
                            <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:2}}>
                                <Text style={styles.detailTextName}>{selectedMarker.properties.name}</Text>
                                            
                                <TouchableOpacity style={styles.favorieItem}>
                                    <Ionicons name="heart-outline" size={18} color="#000" />
                                </TouchableOpacity>
                            </View>
                            
                            
                            <Text style={styles.detailText}>{selectedMarker.properties.host_location}</Text>
                            <Text style={styles.detailText}></Text>
                            <Text style={styles.detailText}>{selectedMarker.properties.room_type}</Text>
                            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                <Text style={styles.detailTextPrice}>{selectedMarker.properties.price}€ <Text style={{fontWeight:'400'}}>night</Text></Text>
                                <View style={{ flexDirection: 'row', gap: 4 }}>
                                <Ionicons name="star" size={16} />
                                <Text style={{  }}>{selectedMarker.properties.review_scores_rating / 20}</Text>
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
        fontSize: 13,
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

