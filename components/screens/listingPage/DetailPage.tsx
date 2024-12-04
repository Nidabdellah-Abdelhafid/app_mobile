import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Share, Modal, Button } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import fileData from '../../../assets/data/file.json';
import { URL_BACKEND } from "api";
import * as Animatable from 'react-native-animatable';

interface RouterProps {
  navigation: NavigationProp<any, any>;
  route
}
const { width } = Dimensions.get('window');
const IMG_HEIGHT = 300;

const DetailPage = ({ route, navigation }: RouterProps) => {
  const { itemId } = route.params;
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const [modalVisible1, setModalVisible1] = useState(false);
  const items = fileData;
  const [modalVisible, setModalVisible] = useState(false);
  const [datafetch, setDatafetch] = useState(null);
  const [datafetchOffre, setDatafetchOffre] = useState(null);



  const fetchData = async () => {
    try {
      const response = await fetch(`${URL_BACKEND}/api/pays/${itemId}?populate=*&pagination[limit]=-1`);
      const data = await response.json();
      // console.log('Result5:', data);
      setDatafetch(data.data);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (itemId) {
      fetchData();
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
  const shareListing = async () => {
    // try {
    //   await Share.share({
    //     title: listing.name,
    //     url: listing.xl_picture_url,
    //   });
    // } catch (err) {
    //   console.log(err);
    // }
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
  const data = datafetch?.attributes.photos?.data;
  const dataOffres = datafetch?.attributes.offres?.data;


  // console.log("hona : ",dataOffres)
  const renderItemImage = () => {
    let skipNext = false; // Flag to skip the next item

    return (
      <ScrollView>
        {/* Render the images dynamically */}
        {data?.map((item, index) => {
          // If skipNext is true, skip this iteration and reset the flag
          if (skipNext) {
            skipNext = false;
            return null;
          }

          if (index % 3 === 0) {
            // Large image for indices divisible by 3 (0, 3, 6...)
            return (
              <Image
                key={`large-${index}`}
                source={{ uri: item?.attributes?.url }}
                style={styles.largeImage}
              />
            );
          } else if (index % 3 !== 0) {
            // Small images for indices 1, 2, 4, 5, 7, 8, etc.
            return (
              <View key={`row-${index}`} style={styles.smallImagesRow}>
                {/* First small image in the pair */}
                <View style={styles.smallImageWrapper}>
                  <Image
                    source={{ uri: item?.attributes?.url }}
                    style={styles.smallImage}
                  />
                </View>
                {/* Second small image in the pair (if exists) */}
                {data[index + 1] && (
                  <View style={styles.smallImageWrapper}>
                    <Image
                      source={{ uri: data[index + 1]?.attributes?.url }}
                      style={styles.smallImage}
                    />
                  </View>
                )}
                {/* Set the skipNext flag to true, to skip the next item */}
                {skipNext = true}
              </View>
            );
          }

          return null; // Return null for unhandled cases
        })}
      </ScrollView>
    );
  };


  const lightSpeedOut = {
    from: {
      translateX: -18,
      skewX: '0deg',
      opacity: 1,
    },
    to: {
      translateX: 5,
      skewX: '300deg',
      opacity: .7,
    },
  };

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
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        ref={scrollRef}
        scrollEventThrottle={16}
      >
        <Animated.Image
          source={{ uri: datafetch?.attributes.photos?.data[0]?.attributes.url }}
          style={[styles.image, imageAnimatedStyle]}
          resizeMode="cover"
        />
        <View style={styles.shadowOverlay}></View>
        <View style={{ flexDirection: 'row', position: 'absolute', top: 240, left: "30%" }}>
          <Image source={{ uri: datafetch?.attributes.photos?.data[0]?.attributes.url }} style={styles.stImage} />
          <Image source={{ uri: datafetch?.attributes.photos?.data[1]?.attributes.url }} style={styles.stImage} />
          <TouchableOpacity style={[styles.stImage, { backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', opacity: 0.8 }]} onPress={openModal1}>
            <MaterialCommunityIcons name="image-area" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.infoContainer}>
          <TouchableOpacity style={{ flexDirection: 'row' }}>
            <Entypo name="location-pin" size={20} color="#CFCECE" />
            <Text style={{ color: '#CFCECE', marginBottom: 16 }}>{datafetch?.attributes.continent}</Text>
          </TouchableOpacity>
          <Text style={styles.name}>{datafetch?.attributes.label}</Text>


          <View style={{ flexDirection: 'row', gap: 4, marginBottom: 10 }}>
            <StarRating reviews={datafetch?.attributes.reviews} />
          </View>

          <Text style={styles.location}>
            Bienvenue Aux {datafetch?.attributes.label} !
          </Text>
          <Text style={styles.description}>{datafetch?.attributes.description}</Text>

          {dataOffres?.map((item, index) => (
            <Animated.View key={index} style={styles.listViewOffre} entering={FadeInRight} exiting={FadeOutLeft}>
              <Image source={{ uri: item?.attributes.image }} style={styles.imageOffre} />
              <View style={styles.shadowOverlay}></View>
              <View style={{ position: 'absolute', left: 10, top: 110, flexDirection: 'row' }}>
                <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
                  <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 10, padding: 5, width: 115, alignItems: 'center', marginRight: 20, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 10, fontWeight: '900', color: '#fff', textAlign: 'center' }}>{item?.attributes.label}</Text>
                  </View>

                  <Animatable.View >
                    <TouchableOpacity style={{ borderColor: '#fff', borderWidth: 1.5, borderRadius: 10, padding: 4, width: 110, alignItems: 'center', marginRight: 20, justifyContent: 'center', flexDirection: 'row' }} onPress={() => { navigation.navigate('DetailOffre', { itemId: item.id }) }}>
                      <Text style={{ color: '#fff', fontWeight: '600' }}>Voir l'Offre
                      </Text>
                      <Ionicons name="chevron-forward" size={12} color="white" />
                    </TouchableOpacity>
                  </Animatable.View>
                </View>


              </View>

            </Animated.View>
          ))}
          <View style={{ height: 100, backgroundColor: '#222' }}>
            <Text></Text>

          </View>

        </View>

      </ScrollView>

      <View style={{ flex: 1, pointerEvents: 'box-none' }}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible1}
          onRequestClose={closeModal1}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity style={{
                position: 'absolute',
                bottom: height * 0.85,
                left: width * 0.9,
                backgroundColor: '#000',
                borderRadius: width * 0.065,
                opacity: 0.5
              }}
                onPress={() => handleDateSelect1()}
              >
                <Ionicons name="close" size={width * 0.068} color="white" />
              </TouchableOpacity>
              <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 18 }}>Galerie</Text>
              </View>


              {renderItemImage()}
            </View>
          </View>
        </Modal>
      </View>

    </View>
  );
};


const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  largeImage: {
    width: '100%',
    height: 400, // Full-width image height
    marginBottom: 1,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  smallImagesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  smallImageWrapper: {
    flex: 1,
    marginHorizontal: 5, // Small margin between images
  },
  smallImage: {
    width: '100%',
    height: 180, // Smaller images height
    borderRadius: 10,
    resizeMode: 'contain',
  },

  shadowOverlay: {
    ...StyleSheet.absoluteFillObject, // Cover the entire container
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Adjust the opacity as needed
    borderRadius: 0,
  },

  image: {
    height: IMG_HEIGHT,
    width: width,
    backgroundColor: '#000',
    opacity: 1

  },
  infoContainer: {
    padding: 24,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: -21,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',


  },
  location: {
    fontSize: 18,
    marginTop: 20,
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
    width: 30,
    height: 30,
    marginLeft: 10,
    borderRadius: 7,
    backgroundColor: '#000',
    opacity: 0.9
  },
  stImageModal: {
    width: width * 0.43, 
    height: height * 0.3, 
    borderRadius: width * 0.02, 
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    width: width
  },
  modalView: {
    position: 'absolute',
    top: height * 0.01, 
    left: width * 0.01, 
    right: width * 0.01, 
    height: height * 0.87, 
    backgroundColor: '#000',
    opacity: 0.85,
    borderRadius: width * 0.05, 
    padding: width * 0.02, 
    shadowColor: '#14141473',
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
    marginTop: 30
  },
  imageOffre: {
    width: width - 50,
    height: 160,
    borderRadius: 20,
    backgroundColor: '#000',
    opacity: 0.9
  },
});

export default DetailPage