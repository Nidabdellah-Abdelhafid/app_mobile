import { View, Text, StyleSheet, ListRenderItem, TouchableOpacity, Modal, Image, Dimensions, RefreshControl, Platform, TouchableHighlight } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Ionicons, Fontisto } from '@expo/vector-icons';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { NavigationProp } from '@react-navigation/native';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FIREBASE_DB } from "FirebaseConfig";
import axios from 'axios';
import { URL_BACKEND } from "api";
import LottieView from 'lottie-react-native';


interface Props {
  listings: any[];
  category: string;
  navigation: NavigationProp<any, any>;
  refresh: number;
  user: any;
}

const ListingPage = ({ navigation, listings: items, refresh, category, user }: Props) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const listRef = useRef<FlatList>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userDC, setUserDC] = useState(null);
  const [favorie, setFavorie] = useState(null);
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [title, setTitle] = useState('');
  const [enregetrer, setEnregetrer] = useState(null);
  const [idPays, setIdPays] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchUser();
    }
  }, [userData]);

  useEffect(() => {
    if (userDC) {
      fetchFavories();
    }
  }, [userDC]);

  useEffect(() => {
    if (userDC) {
      fetchenregetrers();
    }
  }, [userDC]);

  useEffect(() => {
    if (refresh) {
      scrollListTop();
    }
  }, [refresh]);

  useEffect(() => {
    // console.log("ctg: ",category)
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, [category]);

  const fetchUserData = async () => {
    try {
      const userQuery = query(collection(FIREBASE_DB, 'users'), where('email', '==', user));
      const querySnapshot = await getDocs(userQuery);
      const userData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (userData.length > 0) {
        setUserData(userData[0]);
        // console.log('User data fetched:', userData[0]);
      } else {
        setUserData(null);
        // console.log('No user data found');
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

  const handleSubmit = async (item_Id) => {
    const favorieData = {
      pay: item_Id,
      user: userDC.id
    };

    try {
      const response = await axios.post(`${URL_BACKEND}/api/favories`, {
        data: favorieData,
      });
      // console.log('Favorite added:', response.data);
      fetchFavories();
    } catch (error) {
      console.log('Error adding favorite:', error.response?.data || error.message);
    }
  };

  const deleteItem = async (id) => {
    const fvid = favorie?.find(i => i.attributes?.pay?.data.id == id);

    if (!fvid) return;

    const url = `${URL_BACKEND}/api/favories/${fvid.id}`;

    try {
      const response = await axios.delete(url);
      // console.log('Favorite deleted:', response.data);
      fetchFavories();
    } catch (error) {
      console.error('Error deleting favorite:', error.response ? error.response.data : error.message);
    }
  };

  const scrollListTop = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const openModal = (item) => {
    setIdPays(item)
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const favorieItem = (item) => {
    const isFavorited = () => {
      if (!favorie || !userDC) return false;
      return favorie.some(fav =>
        fav.attributes.user?.data.id === userDC.id &&
        fav.attributes.pay?.data.id === item.id
      );
    };

    return (
      <TouchableOpacity
        style={{ position: 'absolute', right: 5, top: 0 }}
        onPress={() => {
          if (isFavorited()) {
            deleteItem(item?.id);
          } else {
            handleSubmit(item?.id);
          }
        }}
      >
        <LottieView
          ref={(animation) => {
            if (animation) {
              if (isFirstRun) {
                if (isFavorited()) {
                  animation.play(66, 66);
                } else {
                  animation.play(19, 19);
                }
                setIsFirstRun(false);
              } else if (isFavorited()) {
                animation.play(19, 50);
              } else {
                animation.play(0, 19);
              }
            }
          }}
          style={styles.heartLottie}
          source={require("../../../assets/data/likeHeart.json")}
          autoPlay={false}
          loop={false}
        />
      </TouchableOpacity>
    );
  };

  const fetchenregetrers = async () => {
    try {
      const response = await axios.get(`${URL_BACKEND}/api/enregetrers?populate=*&pagination[limit]=-1`);
      const enregetrers = response.data.data;
      setEnregetrer(enregetrers);
      // console.log('enregetrers fetched:', enregetrers);
    } catch (error) {
      console.error('Error fetching enregetrers:', error);
    }
  };

  const handleSubmitenregetrer = async () => {
    const enregetrerData = {
      titre: title,
      pay: idPays,
      user: userDC.id
    };

    try {
      const response = await axios.post(`${URL_BACKEND}/api/enregetrers`, {
        data: enregetrerData,
      });
      // console.log('Favorite added:', response.data);
      closeModal();
      setTitle('');
      fetchenregetrers();
      setIdPays(null);
      
    } catch (error) {
      console.log('Error adding favorite:', error.response?.data || error.message);
    }
  };

  const deleteItemenregetrer = async (id) => {
    const fvid = enregetrer?.find(i => i.attributes?.pay?.data.id == id);

    if (!fvid) return;

    const url = `${URL_BACKEND}/api/enregetrers/${fvid.id}`;

    try {
      const response = await axios.delete(url);
      // console.log('Favorite deleted:', response.data);
      fetchenregetrers();
    } catch (error) {
      console.error('Error deleting favorite:', error.response ? error.response.data : error.message);
    }
  };

  const enregetrerItem = (item) => {
    const isEnregetrer = () => {
      if (!enregetrer || !userDC) return false;
      return enregetrer.some(fav =>
        fav.attributes.user?.data.id === userDC.id &&
        fav.attributes.pay?.data.id === item.id
      );
    };

    return (
      <TouchableOpacity
        style={{ position: 'absolute', right: 35, top: 180 }}
        onPress={() => {
          if (!isEnregetrer()) {
            openModal(item?.id);
          } else {
            deleteItemenregetrer(item?.id);
          }
        }}
      >
      
      <Fontisto name={isEnregetrer() ? "bookmark-alt": "bookmark"} size={24} color="#fff" />

      </TouchableOpacity>
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Add any code here to fetch or reload the data
      await fetchUserData(); // This is an example, adjust as per your data needs.
      setRefreshing(false);
    } catch (error) {
      console.error('Error refreshing data:', error);
      setRefreshing(false); // Stop the loading state in case of error
    }
  };

  const renderRow: ListRenderItem<any> = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('DetailPage', { itemId: item?.id })}>
      <Animated.View style={styles.listView} entering={FadeInRight} exiting={FadeOutLeft}>
        <Image source={{ uri: item?.attributes.photos?.data[0]?.attributes.url }} style={styles.image} />
        {favorieItem(item)}
        <View style={{ position: 'absolute', left: 35, top: 160, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 17, fontWeight: '900', color: '#fff' }}>{item?.attributes.label}</Text>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              <StarRating reviews={item?.attributes.reviews} />
            </View>
          </View>
        </View>
        {enregetrerItem(item)}
      </Animated.View>
      
        <Modal
          key={item?.id}
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
          
            <View style={styles.modalView}>
              <Text style={styles.inputText}>Title</Text>
                
                <TextInput
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                style={styles.inputView}
              />
              <View style={{flexDirection:'row',
                alignItems: 'center',
                justifyContent: 'space-between',}}>
                 <TouchableOpacity onPress={closeModal}>
                <Text style={{ color: 'gray', fontSize: 17, textDecorationLine: 'underline' }}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>handleSubmitenregetrer()} style={[styles.button, { alignContent: 'flex-end', }]}>
                <Text style={styles.buttonText}>Create</Text>
              </TouchableOpacity>
              </View>
             
            </View>
          </View>
        </Modal>
    </TouchableOpacity>
  );


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
      <FlatList
        renderItem={renderRow}
        data={loading ? [] : items}
        ref={listRef}
        contentContainerStyle={{ paddingBottom: 50 }}
        ListFooterComponent={<View style={{ height: 50 }} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
};

export default ListingPage;


const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  heartLottie: {
    width: width * 0.21,  // 20% of screen width
    height: width * 0.21, // Maintain square aspect ratio
  },
  container: {
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#222',
    marginVertical: height * 0.01, // 1% of screen height
  },
  listView: {
    paddingBottom: 25,          // 1.25% of screen height
  },
  image: {
    width: width * 0.93,    // 85% of screen width
    height: height * 0.28,   // 30% of screen height
    borderRadius: 10,
    backgroundColor: '#000',
    opacity: 0.85,
  },
  info: {
    textAlign: 'center',
    fontSize: width * 0.04, // 4% of screen width
    fontWeight: '500',
  },
  modalContainer: {
    position: 'absolute',
    bottom: height * 0.1,   // 10% of screen height
    left: width * 0.025,    // 2.5% of screen width
    right: width * 0.025,   // 2.5% of screen width
    backgroundColor: '#fff',
    padding: 0,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: width * 0.09,   // 9% of screen width
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  inputView: {
    width: '80%',           // Stays the same as it uses percentage
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 25,
    height: height * 0.07,  // 7% of screen height
    marginBottom: height * 0.025, // 2.5% of screen height
    justifyContent: 'center',
    padding: width * 0.05,  // 5% of screen width
  },
  inputText: {
    height: height * 0.07,  // 7% of screen height
    color: 'black',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: height * 0.02, // 2% of screen height
    paddingHorizontal: width * 0.05, // 5% of screen width
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.04,  // 4% of screen width
    fontWeight: 'bold',
  },
});