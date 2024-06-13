import { View, Text, StyleSheet, ListRenderItem, TouchableOpacity, Modal, Image } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Ionicons, Fontisto } from '@expo/vector-icons';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { NavigationProp } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
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
  const listRef = useRef<FlatList>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userDC, setUserDC] = useState(null);
  const [favorie, setFavorie] = useState(null);
  const [isFirstRun, setIsFirstRun] = useState(true);

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
    if (refresh) {
      scrollListTop();
    }
  }, [refresh]);

  useEffect(() => {
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

  const openModal = () => {
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

  const renderRow: ListRenderItem<any> = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('DetailPage', { itemId: item?.id })}>
      <Animated.View style={styles.listView} entering={FadeInRight} exiting={FadeOutLeft}>
        <Image source={{ uri: item?.attributes.photos?.data[0]?.attributes.url }} style={styles.image} />
        {favorieItem(item)}
        <View style={{ position: 'absolute', left: 35, top: 160, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 17, fontWeight: '900', color: '#fff' }}>{item?.attributes.label}</Text>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              <Ionicons name="star" size={16} color='orange' />
              <Ionicons name="star" size={16} color='orange' />
              <Ionicons name="star" size={16} color='orange' />
              <Ionicons name="star" size={16} color='orange' />
              <Ionicons name="star" size={16} color='orange' />
            </View>
          </View>
        </View>
        <TouchableOpacity style={{ position: 'absolute', right: 35, top: 180 }} onPress={openModal}>
          <Fontisto name="bookmark" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
      {modalVisible && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <TouchableOpacity onPress={closeModal}>
                <Text style={{ color: 'gray', fontSize: 17, textDecorationLine: 'underline' }}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity  style={[styles.button, { alignContent: 'flex-end', }]}>
                <Text style={styles.buttonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        renderItem={renderRow}
        data={loading ? [] : items}
        ref={listRef}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListFooterComponent={<View style={{ height: 120 }} />}
      />
    </View>
  );
};

export default ListingPage;

const styles = StyleSheet.create({
  heartLottie: {
    width: 80,
    height: 80,
  },
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#222',
    marginVertical: 0,
  },
  listView: {
    paddingLeft: 15,
    paddingRight: 20,
    paddingBottom: 20,
    paddingEnd: 20,
    paddingStart: 20,
    gap: 10,
  },
  image: {
    width: 340,
    height: 220,
    borderRadius: 20,
    backgroundColor: '#000',
    opacity: 0.85,
  },
  info: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
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
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  inputView: {
    width: '80%',
    backgroundColor: '#fff',
    borderWidth: 1,
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
});
