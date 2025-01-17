import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Button, ActivityIndicator, Modal, ListRenderItem, ImageBackground, Platform, Dimensions } from "react-native";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from "FirebaseConfig";
import { NavigationProp } from '@react-navigation/native';
import { Ionicons, Fontisto, MaterialCommunityIcons, MaterialIcons, FontAwesome6 } from '@expo/vector-icons';
import fileData from '../../assets/data/file.json';
import { FlatList, TextInput } from "react-native-gesture-handler";
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { URL_BACKEND } from "api";
import axios from "axios";
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Card, Title, Paragraph } from 'react-native-paper';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import UserService from "services/UserService";
import FavorieService from "services/FavorieService";
import PaysService from "services/PaysService";
import EnregetreService from "services/EnregetreService";
import ReservationService from "services/ReservationService";
import OffreService from "services/OffreService";
import FactureService from "services/FactureService";
import CarteService from "services/CarteService";
import PaiementService from "services/PaiementService";

interface RouterProps {
  navigation: NavigationProp<any, any>;
  route
}
const { width, height } = Dimensions.get('window');

const ProfileScreen = ({ route, navigation }: RouterProps) => {
  const { user: currentUser } = route.params;
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible8, setModalVisible8] = useState(false);
  const [modalVisible9, setModalVisible9] = useState(false);
  const [modalVisible10, setModalVisible10] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [isButtonPressed2, setIsButtonPressed2] = useState(false);
  const [userDC, setUserDC] = useState(null);
  const [favorie, setFavorie] = useState(null);
  const [reservation, setReservation] = useState(null);
  const [enregetrer, setEnregetrer] = useState(null);
  const [facture, setFacture] = useState(null);
  const [offrebyid, setOffrebyid] = useState(null);
  const [carte, setCarte] = useState([]);
  const [datafetch, setDatafetch] = useState([]);
  const [paysfavorieUser, setPaysfavorieUser] = useState([]);
  const [paysenregetrerUser, setPaysenregetrerUser] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [filteredReservationsTrue, setFilteredReservationsTrue] = useState([]);
  const [filteredReservationsTrueById, setFilteredReservationsTrueById] = useState([]);
  const [filteredFacture, setFilteredFacture] = useState([]);
  const [hideIntrfece, setHideInterface] = useState(false);
  const [hideIntrfecepaie, setHideInterfacepaie] = useState(false);
  const [hideIntrfececarte, setHideInterfacecarte] = useState(false);

  const [modals, setModals] = useState({
    modal1: false,
    modal2: false,
    modal3: false,
    modal4: false,
    modal5: false,
    modal6: false,
    modal7: false
  });

  const openModal = (modalName) => {
    setHideInterface(true);
    setModals((prev) => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setHideInterface(false);
    setModals((prev) => ({ ...prev, [modalName]: false }));
  };

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
    if (userDC) {
      fetchReservation();
    }
  }, [userDC]);

  useEffect(() => {
    if (favorie && datafetch && userDC) {
      filterPaysFavorieUser();
    }

  }, [favorie, datafetch, userDC]);

  useEffect(() => {
    if (reservation && userDC) {
      filterReservations();
    }

  }, [reservation, userDC]);

  useEffect(() => {
    if (userDC) {
      handleGetFacture();
    }

  }, [userDC]);
  useEffect(() => {
    if (userDC) {
      handleGetCarte();
    }

  }, [userDC]);


  useEffect(() => {
    if (enregetrer && datafetch && userDC) {
      filterPaysEnregetrerUser();
    }

  }, [enregetrer, datafetch, userDC]);

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
      const response = await UserService.getUser();
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
      const response = await PaysService.getPays();
      // Assuming the data is in response.data
      setDatafetch(response.data.data); // Set the data to state
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchFavories = async () => {
    try {
      const response = await FavorieService.getFavorie();
      const favories = response.data.data;
      setFavorie(favories);
      // console.log('Favories fetched:', favories);
    } catch (error) {
      console.error('Error fetching favories:', error);
    }
  };

  const fetchEnregetrers = async () => {
    try {
      const response = await EnregetreService.getEnregetre();
      const enregetrers = response.data.data;
      setEnregetrer(enregetrers);
      // console.log('Favories fetched:', enregetrers);
    } catch (error) {
      console.error('Error fetching favories:', error);
    }
  };
  const fetchReservation = async () => {
    try {
      const response = await ReservationService.getReservation();
      const reservations = response.data.data;
      setReservation(reservations);
      // console.log('Reservations fetched:', reservations);
    } catch (error) {
      console.error('Error fetching favories:', error);
    }
  };

  const filterReservations = () => {
    const filtered = reservation.filter(reservation =>
      reservation.attributes.user?.data.id === userDC.id && reservation.attributes.status === false
    );
    const filteredtrue = reservation.filter(reservation =>
      reservation.attributes.user?.data.id === userDC.id && reservation.attributes.status === true
    );

    setFilteredReservations(filtered);
    setFilteredReservationsTrue(filteredtrue);
    // console.log('Filtered Reservations:', filtered[0].attributes.offre?.data);
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
            // console.log('Match found for pays:', pays);
          }
          return favMatch;
        });
        return isEnregetrer;
      } else {
        // console.log('favories is not an array for pays:', pays);
      }
      return false;
    });
    // console.log('Filtered pays:', filteredPays);
    setPaysenregetrerUser(filteredPays);
  };

  const handleButtonPress = () => {
    setIsButtonPressed(true);
  };

  const handleButtonPress2 = () => {
    setIsButtonPressed2(true);
    openModal9();

  };


  const openModal8 = (itemid) => {
    setHideInterfacepaie(true);
    handleGetOffre(itemid);
    filterDataFacture(itemid)
    setModalVisible8(true);
  };

  const closeModal8 = () => {
    setModalVisible8(false);
  };
  const handleDateSelect8 = () => {
    setCurrentStep(1);
    closeModal8();
    setHideInterfacepaie(false);
  };

  const openModal9 = () => {
    setHideInterfacecarte(true);
    setModalVisible9(true);
  };

  const closeModal9 = () => {
    setModalVisible9(false);
  };
  const handleDateSelect9 = () => {
    setIsButtonPressed2(false);
    closeModal9();
    setHideInterfacecarte(false);

  };

  const openModal10 = () => {
    setModalVisible10(true);
  };

  const closeModal10 = () => {
    setModalVisible10(false);
  };
  const handleDateSelect10 = () => {
    closeModal10();
  };

  const handleGetOffre = async (itemid) => {
    try {
      const responseOffre = await OffreService.getOffreById(itemid);
      const resesoffrebyid = responseOffre.data.data;
      setOffrebyid(resesoffrebyid);
      // console.log(resesoffrebyid)
    } catch (error) {
      console.error('Error fetching user:', error);
    }

  };
  const handleGetFacture = async () => {
    try {
      const responsefacture = await FactureService.getFacture();
      const factures = responsefacture.data.data;
      setFacture(factures);
      // console.log(factures[0].attributes.reservation.data)
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };
  const handleGetCarte = async () => {
    try {
      const responsecarte = await CarteService.getCarte();
      const carte = responsecarte.data.data;
      const carteFiltered = carte.filter(carte =>
        carte.attributes.user?.data.id === userDC.id
      );
      setCarte(carteFiltered);
      // console.log(carteFiltered)
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };
  const filterDataFacture = async (itemid) => {

    const filterded = reservation.filter(reservation =>
      reservation.attributes.user?.data.id === userDC.id && reservation.attributes.offre?.data.id === itemid
    );
    const filtered = facture.filter(facture =>
      facture.attributes.reservation?.data.id === filterded[0].id
    );
    setFilteredReservationsTrueById(filterded)
    // console.log(filtered)
    setFilteredFacture(filtered);
  }

  const handlePaiement = async () => {
    // console.log('id f : ',filteredReservationsTrueById)
    try {
      const ref = new Date();
      const refInSeconds = Math.floor(ref.getTime() / 1000);
      const paiementData = {
        reference: 'REF' + refInSeconds + 'PYM1',
        typePaiement: 'Carte',
        date: new Date(),
        factures: [filteredFacture[0].id]
      };
      const responsefacture = await PaiementService.addPaiement({
        data: paiementData,
      });
      try {
        const response = await FactureService.updateFacture(filteredFacture[0].id, {
          data: { status: true }
        });
        // console.log('Item updated facture :', response.data);
      } catch (error) {
        console.error('Error updating item:', error);
      }
      try {
        const response = await ReservationService.updateReservation(filteredReservationsTrueById[0].id, {
          data: { status: true },
        });
        // console.log('Item updated res :', response.data);
      } catch (error) {
        console.error('Error updating item:', error);
      }

    } catch (error) {
      console.log('Error', error.response?.data || error.message);
    }
  };

  const handleRefresh = () => {

    setRefreshing(true);
    filterPaysFavorieUser();
    setRefreshing(false);

  }
  const renderRow: ListRenderItem<any> = ({ item }) => (

    <Animated.View key={`fv-${item.id}`} style={styles.listViewlike} entering={FadeInRight} exiting={FadeOutLeft}>
      <Image source={{ uri: item.attributes?.photos.data[0].attributes?.url }} style={styles.imagelike} />
      <TouchableOpacity style={{ position: 'absolute', right: 18, top: 10 }}>
        <Ionicons name='heart' size={25} color='white' />
      </TouchableOpacity>

      <View style={{ position: 'absolute', left: 10, top: 105, flexDirection: 'row' }}>
        <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
          <View>
            <Text style={{ fontSize: 17, fontWeight: '900', color: '#fff' }}>{item.attributes?.label}</Text>
          </View>

          <TouchableOpacity style={{ borderColor: '#fff', borderWidth: 2, borderRadius: 10, padding: 3, width: 110, alignItems: 'center', marginRight: 20, justifyContent: 'center', flexDirection: 'row' }} onPress={() => {
            navigation.navigate('HomePageNav', {
              screen: 'DetailPage',
              params: { itemId: item.id },
            });
            closeModal("modal1");
          }}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Voir l'Offre
            </Text>
            <Ionicons name="chevron-forward" size={12} color="white" />
          </TouchableOpacity>
        </View>
      </View>

    </Animated.View>
  )

  const renderRowErg: ListRenderItem<any> = ({ item }) => (

    <Animated.View key={`eng-${item.id}`} style={styles.listViewlike} entering={FadeInRight} exiting={FadeOutLeft}>
      <Image source={{ uri: item.attributes?.photos.data[0].attributes?.url }} style={styles.imageSave} />

      <TouchableOpacity style={{ position: 'absolute', right: 15, top: 10, borderColor: '#fff', borderWidth: 2, borderRadius: 10, padding: 3, width: 110, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }} onPress={() => {

        navigation.navigate('HomePageNav', {
          screen: 'DetailPage',
          params: { itemId: item.id },
        });
        closeModal("modal2");
      }}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Voir l'Offre  </Text>
        <Ionicons name="chevron-forward" size={12} color="white" />
      </TouchableOpacity>

      <View style={{ position: 'absolute', left: 10, top: 130, flexDirection: 'row' }}>
        <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
          <View>
            <Text style={{ fontSize: 17, fontWeight: '900', color: '#fff' }}>{item.attributes?.label}</Text>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              <StarRating reviews={item?.attributes.reviews} />
            </View>
          </View>
          <Fontisto name='favorite' size={25} color='white' style={{ marginRight: 30 }} />
        </View>
      </View>

    </Animated.View>
  )

  const renderRowResF: ListRenderItem<any> = ({ item }) => (

    <Animated.View key={`rf-${item.id}`} style={styles.listViewlike} entering={FadeInRight} exiting={FadeOutLeft}>
      <Image source={{ uri: item.attributes?.offre?.data.attributes?.image }} style={styles.imageSave} />

      <View style={{ position: 'absolute', right: 10, top: 10, flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
        <TouchableOpacity style={{ borderColor: '#fff', borderWidth: 2, borderRadius: 10, padding: 10, width: 110, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginLeft: 20 }} onPress={() => openModal8(item.attributes?.offre?.data.id)}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Paiement  </Text>
          <Ionicons name="chevron-forward" size={12} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={{ borderColor: '#fff', borderWidth: 2, borderRadius: 10, padding: 3, width: 110, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }} onPress={() => {
          navigation.setParams({ itemId: null });
          navigation.navigate('HomePageNav', {
            screen: 'DetailOffre',
            params: { itemId: item.attributes?.offre?.data.id },
          });
          closeModal("modal4");
        }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Voir l'Offre  </Text>
          <Ionicons name="chevron-forward" size={12} color="white" />
        </TouchableOpacity>
      </View>

      <View style={{ position: 'absolute', left: 10, top: 130, flexDirection: 'row' }}>
        <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
          <View>
            <Text style={{ fontSize: 17, fontWeight: '800', color: '#fff' }}>{item.attributes?.offre?.data.attributes?.label}</Text>

          </View>
        </View>


      </View>

    </Animated.View>
  )

  const renderRowResT: ListRenderItem<any> = ({ item }) => (

    <Animated.View key={`rt-${item.id}`} style={styles.listViewlike} entering={FadeInRight} exiting={FadeOutLeft}>
      <Image source={{ uri: item.attributes?.offre?.data.attributes?.image }} style={styles.imageSave} />

      <View style={{ width: '100%', position: 'absolute', top: 85, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ marginBottom: 5 }}>
            <View>
              <Text style={{ fontSize: 17, fontWeight: '800', color: '#fff' }}>{item.attributes?.offre?.data.attributes?.label}</Text>
            </View>
          </View>
          <TouchableOpacity style={{ borderColor: '#fff', borderWidth: 2, borderRadius: 10, padding: 8, width: 130, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }} onPress={() => {
            navigation.setParams({ itemId: null });
            navigation.navigate('HomePageNav', {
              screen: 'DetailOffre',
              params: { itemId: item.attributes?.offre?.data.id },
            });
            closeModal("modal5");
          }}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Voir l'Offre </Text>
            <Ionicons name="chevron-forward" size={12} color="white" />
          </TouchableOpacity>
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
  const formatCardNumber = (cardNumber) => {
    // Split the card number into an array by spaces
    const parts = cardNumber.split(' ');
    // Get the last part (last 4 digits)
    const lastPart = parts[parts.length - 1];
    // Return the masked number with only the last 4 digits visible
    return `**** **** **** ${lastPart}`;
  };

  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
    if (currentStep === 2) {
      handlePaiement();
      filterReservations();

    }
    if (currentStep === 3) {
      handleDateSelect8();
      filterReservations();
    }

  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);

    }

  };

  const getButtonText = () => {
    switch (currentStep) {
      case 1:
        return 'Passer au Paiement';
      case 2:
        return 'Confirmer';
      case 3:

        return 'Merci';
      default:
        return 'Next';
    }
  };
  const viewRef = useRef();

  const saveFacture = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 1,
      });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const dateNow = new Date();
  const formattedDate = formatDate(dateNow);

  return (
    <ImageBackground source={{ uri: 'https://s3.eu-west-1.amazonaws.com/fractalitetest/2024-06-10T10:47:18.607875882_profile%20bg@2x.png' }} style={styles.container}>

      {userData ? (
        <View style={hideIntrfece ? styles.hidden : [{ marginTop: 75, alignItems: 'center' }]}>
          <View style={styles.imageFloat}>
            <Image source={{ uri: userData?.image }} style={styles.profileImage} />
          </View>
          <View style={[styles.card, { pointerEvents: 'box-none' }]}>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userData?.fullName}</Text>

            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 15 }}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>1,239    </Text>
              <Text style={{ color: '#A4A3A3' }}>Total des leux visites</Text>

            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

              <View style={{ justifyContent: 'space-between', alignItems: 'center', padding: 13 }}>
                <Ionicons name="heart" size={25} color="white" />
                <Text style={{ color: '#C4C2C2', fontWeight: '700', }}>{paysfavorieUser?.length} Places Like</Text>
                <TouchableOpacity style={{ borderColor: '#fff', borderWidth: 2, borderRadius: 15, padding: 10, width: 110, alignItems: 'center' }} onPress={() => openModal("modal1")}>
                  <Text style={{ color: '#fff', fontWeight: '800' }}>Voir</Text>

                </TouchableOpacity>

              </View>

              <View style={{ justifyContent: 'center', alignItems: 'center', padding: 1, height: 155, backgroundColor: '#fff', marginLeft: 5 }}></View>

              <View style={{ justifyContent: 'space-between', alignItems: 'center', padding: 13 }}>
                <Fontisto name='favorite' size={25} color='white' />
                <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                  <Text style={{ color: '#C4C2C2', fontWeight: '700', }}>Enregistre</Text>
                  <Text style={{ color: '#C4C2C2', fontWeight: '700' }}>dans les favoris</Text>
                </View>
                <TouchableOpacity style={{ borderColor: '#fff', borderWidth: 2, borderRadius: 15, padding: 10, width: 110, alignItems: 'center' }} onPress={() => openModal("modal2")}>
                  <Text style={{ color: '#fff', fontWeight: '800' }}>Voir</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ justifyContent: 'center', marginTop: 10 }}>
              <TouchableOpacity style={styles.loginBtnOption} onPress={() => openModal("modal3")}>
                <FontAwesome6 name="user-large" size={19} color="white" style={styles.icon} />
                <View style={{ flex: 5, flexDirection: 'row' }}>
                  <Text style={styles.loginTextOption}>Modifier le profil</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="white" style={{ marginRight: 10 }} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.loginBtnOption} onPress={() => openModal("modal4")}>
                <MaterialIcons name="shopping-cart" size={25} color="white" style={styles.icon} />
                <View style={{ flex: 5, flexDirection: 'row' }}>
                  <Text style={styles.loginTextOption}>Panier</Text>
                  <View style={styles.notifView}>
                    <Text style={{ color: '#000', fontWeight: '700' }}>{filteredReservations?.length}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="white" style={{ marginRight: 10 }} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.loginBtnOption} onPress={() => openModal("modal5")}>
                <MaterialCommunityIcons name="clipboard-text" size={25} color="white" style={styles.icon} />
                <View style={{ flex: 5, flexDirection: 'row' }}>
                  <Text style={styles.loginTextOption}>Historique</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="white" style={{ marginRight: 10 }} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.loginBtnOption} onPress={() => openModal("modal6")}>
                <Ionicons name="notifications" size={25} color="white" style={styles.icon} />
                <View style={{ flex: 5, flexDirection: 'row' }}>
                  <Text style={styles.loginTextOption}>Notification</Text>
                  <View style={styles.notifView}>
                    <Text style={{ color: '#000', fontWeight: '700' }}>4</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="white" style={{ marginRight: 10 }} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.loginBtnOption} onPress={() => openModal("modal7")}>
                <MaterialIcons name="credit-card" size={25} color="white" style={styles.icon} />
                <View style={{ flex: 5, flexDirection: 'row' }}>
                  <Text style={styles.loginTextOption}>Cartes</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="white" style={{ marginRight: 10 }} />
              </TouchableOpacity>
            </View>

          </View>

        </View>

      ) : (
        <View style={[styles.loadingContainer, { marginTop: 100 }]}>
          <ActivityIndicator size="large" color="blue" />
          <Text style={{ color: "white", fontSize: 15, fontWeight: '800' }}>Loading...</Text>
        </View>
      )}

      {/* <View style={{margin:30,justifyContent:'flex-end',alignContent:'flex-end',alignSelf:'center',alignItems:'center'}}>
               
          </View> */}
      <Modal
        visible={modals.modal1}
        transparent={true}
        onRequestClose={() => closeModal("modal1")}>
        <View style={styles.centeredView}>
          <View style={styles.imageFloatM}>
            <Image source={{ uri: userData?.image }} style={styles.profileImage} />
          </View>
          <View style={styles.modalView}>

            <View style={[styles.userInfo, { marginBottom: 20 }]}>
              <Text style={styles.userName}>{userData?.fullName}</Text>
            </View>
            <Ionicons name="heart" size={25} color="white" />
            <Text style={{ color: '#C4C2C2', fontWeight: '700', marginTop: 10 }}>{paysfavorieUser?.length} Places Like</Text>
            <TouchableOpacity style={styles.closeBTN} onPress={() => closeModal("modal1")}>
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
        visible={modals.modal2}
        transparent={true}
        onRequestClose={() => closeModal("modal2")}
      >
        <View style={styles.centeredView}>
          <View style={styles.imageFloatM}>
            <Image source={{ uri: userData?.image }} style={styles.profileImage} />
          </View>
          <View style={styles.modalView}>

            <View style={[styles.userInfo, { marginBottom: 20 }]}>
              <Text style={styles.userName}>{userData?.fullName}</Text>
            </View>
            <Fontisto name='favorite' size={25} color='white' />
            <Text style={{ color: '#C4C2C2', fontWeight: '700', marginTop: 10 }}>Enregistre dans les favoris</Text>
            <TouchableOpacity style={styles.closeBTN} onPress={() => closeModal("modal2")}>
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
        visible={modals.modal3}
        transparent={true}
        onRequestClose={() => closeModal("modal3")}
      >
        <View style={styles.centeredView}>
          <View style={styles.imageFloatM}>
            <Image source={{ uri: userData?.image }} style={styles.profileImage} />
          </View>
          <View style={styles.modalView}>

            <View style={[styles.userInfo, { marginBottom: 20 }]}>
              <Text style={styles.userName}>{userData?.fullName}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <FontAwesome6 name="user-large" size={19} color="white" />
              <Text style={{ color: '#C4C2C2', fontWeight: '700', marginLeft: 10 }}>Modifier le profil</Text>
            </View>
            <TouchableOpacity style={styles.closeBTN} onPress={() => closeModal("modal3")}>
              <Ionicons name="close" size={26} color="white" />
            </TouchableOpacity>
            <View style={{ width: '100%', marginTop: 20, padding: 10 }}>
              <Text style={styles.inputText}>Le nom complet</Text>
              <TextInput
                placeholder=""
                value={null}
                onChangeText={null}
                style={styles.inputView}
              />
            </View>
            <View style={{ width: '100%', padding: 10 }}>
              <Text style={styles.inputText}>Email</Text>
              <TextInput
                placeholder=""
                value={null}
                onChangeText={null}
                style={styles.inputView}
              />
            </View>
            <View style={{ width: '100%', padding: 10 }}>
              <Text style={styles.inputText}>Numero de telephone</Text>
              <TextInput
                placeholder=""
                value={null}
                onChangeText={null}
                style={styles.inputView}
              />
            </View>
            <View style={{ width: '100%', padding: 10, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={handleButtonPress}
                style={[styles.button2, isButtonPressed ? styles.buttonPressed : null]}
              >
                <Text style={[styles.loginText, isButtonPressed ? { color: 'black', fontSize: 15, fontWeight: '700' } : null]}>Approve</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={modals.modal4}
        transparent={true}
        onRequestClose={() => closeModal("modal4")}
      >
        <View style={styles.centeredView}>
          <View style={styles.imageFloatM}>
            <Image source={{ uri: userData?.image }} style={styles.profileImage} />
          </View>
          <View style={styles.modalView}>

            <View style={[styles.userInfo, { marginBottom: 20 }]}>
              <Text style={styles.userName}>{userData?.fullName}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <MaterialIcons name="shopping-cart" size={25} color="white" />
              <Text style={{ color: '#C4C2C2', fontWeight: '700', marginLeft: 10 }}>Panier</Text>
            </View>
            <TouchableOpacity style={styles.closeBTN} onPress={() => closeModal("modal4")}>
              <Ionicons name="close" size={26} color="white" />
            </TouchableOpacity>
            <FlatList
              renderItem={renderRowResF}
              data={filteredReservations}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={modals.modal5}
        transparent={true}
        onRequestClose={() => closeModal("modal5")}
      >
        <View style={styles.centeredView}>
          <View style={styles.imageFloatM}>
            <Image source={{ uri: userData?.image }} style={styles.profileImage} />
          </View>
          <View style={styles.modalView}>

            <View style={[styles.userInfo, { marginBottom: 20 }]}>
              <Text style={styles.userName}>{userData?.fullName}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <MaterialCommunityIcons name="clipboard-text" size={25} color="white" />
              <Text style={{ color: '#C4C2C2', fontWeight: '700', marginLeft: 10 }}>Historique</Text>
            </View>
            <TouchableOpacity style={styles.closeBTN} onPress={() => closeModal("modal5")}>
              <Ionicons name="close" size={26} color="white" />
            </TouchableOpacity>
            <FlatList
              renderItem={renderRowResT}
              data={filteredReservationsTrue}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={modals.modal6}
        transparent={true}
        onRequestClose={() => closeModal("modal6")}
      >
        <View style={styles.centeredView}>
          <View style={styles.imageFloatM}>
            <Image source={{ uri: userData?.image }} style={styles.profileImage} />
          </View>
          <View style={styles.modalView}>

            <View style={[styles.userInfo, { marginBottom: 20 }]}>
              <Text style={styles.userName}>{userData?.fullName}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Ionicons name="notifications" size={25} color="white" />
              <Text style={{ color: '#C4C2C2', fontWeight: '700', marginLeft: 10 }}>Notification</Text>
            </View>
            <TouchableOpacity style={styles.closeBTN} onPress={() => closeModal("modal6")}>
              <Ionicons name="close" size={26} color="white" />
            </TouchableOpacity>
            <Text style={{ color: '#fff' }}>6</Text>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modals.modal7}
        transparent={true}
        onRequestClose={() => closeModal("modal7")}
      >
        <View style={styles.centeredView}>
          <View style={styles.imageFloatM}>
            <Image source={{ uri: userData?.image }} style={styles.profileImage} />
          </View>
          <View style={styles.modalView}>

            <View style={[styles.userInfo, { marginBottom: 20 }]}>
              <Text style={styles.userName}>{userData?.fullName}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <MaterialIcons name="credit-card" size={25} color="white" />
              <Text style={{ color: '#C4C2C2', fontWeight: '700', marginLeft: 10 }}>Cartes</Text>
            </View>
            <TouchableOpacity style={styles.closeBTN} onPress={() => closeModal("modal7")}>
              <Ionicons name="close" size={26} color="white" />
            </TouchableOpacity>

            <View style={{ width: "100%", height: 170, padding: 10, marginTop: 15, backgroundColor: '#333', borderRadius: 20 }}>
              <Text style={{ color: '#fff', marginBottom: 20, height: 20, fontWeight: '900', fontSize: 17 }}>Paiement</Text>

              <View style={{ width: "100%", height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Image source={{ uri: 'https://www.pngmart.com/files/22/Mastercard-Logo-PNG-HD.png' }} style={{ width: 80, height: 40 }} />
                <View style={{ width: "60%", height: 50, marginLeft: 5 }}>
                  <Text style={{ color: '#fff' }}>Master Card</Text>
                  <Text style={{ color: '#fff', fontWeight: '900', fontSize: 18 }}>{carte[0]?.attributes?.numero ? formatCardNumber(carte[0].attributes.numero) : ''}</Text>
                </View>
                <AntDesign name="checkcircle" size={30} color="green" />
              </View>

              <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={handleButtonPress2}
                  style={[styles.button3, isButtonPressed2 ? styles.buttonPressed : null]}
                >
                  <Text style={[styles.loginText, isButtonPressed2 ? { color: 'black', fontSize: 15, fontWeight: '700' } : null]}>Modifier</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flexDirection: 'row', width: "100%", padding: 25 }}>
              <TouchableOpacity style={{ backgroundColor: '#fff' }}>
                <AntDesign name="check" size={20} color="#000" />
              </TouchableOpacity>
              <Text style={{ color: '#fff', marginLeft: 5, fontSize: 13, fontWeight: '700' }}>Utiliser comme mode de paiement par defaut</Text>
            </View>

          </View>
        </View>
      </Modal>


      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible8}
        onRequestClose={closeModal8}

      >
        <View style={styles.centeredView}>
          <View style={styles.imageFloatM}>
            <Image source={{ uri: userData?.image }} style={styles.profileImage} />
          </View>
          <View style={styles.modalView}>

            <View style={[styles.userInfo, { marginBottom: 20 }]}>
              <Text style={styles.userName}>{userData?.fullName}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <MaterialIcons name="shopping-cart" size={25} color="white" />
              <Text style={{ color: '#C4C2C2', fontWeight: '700', marginLeft: 10 }}>Panier</Text>
            </View>
            <TouchableOpacity style={styles.closeBTN} onPress={() => handleDateSelect8()}>
              <Ionicons name="close" size={26} color="white" />
            </TouchableOpacity>
            <View style={{ width: '100%', marginTop: 10, padding: 20, alignItems: 'center' }}>
              <View style={{ width: '95%', padding: 5, backgroundColor: '#fff', alignItems: 'center', borderRadius: 20 }}>
                <Image source={{ uri: offrebyid?.attributes.image }} style={styles.imagePay} />

                {currentStep === 1 && (
                  <View>
                    <Text style={{ textAlign: 'center', fontWeight: '700' }}>{offrebyid?.attributes.label}</Text>
                    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
                      <Text style={{ textAlign: 'center', fontWeight: '700', marginRight: 5 }}>{offrebyid?.attributes.pay?.data.attributes.label}</Text>
                      <Entypo name="location" size={20} color="#999" />
                    </View>
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', borderRadius: 3, borderTopWidth: 1, borderColor: '#999', marginTop: 15 }}>
                      <View style={{ marginTop: 10 }}>
                        <Text style={{ fontWeight: '700', fontSize: 14 }}>Passager</Text>
                        <Text>{filteredReservationsTrueById[0]?.attributes.nbr_voyageurs_adultes} Adulte</Text>
                        <Text>{filteredReservationsTrueById[0]?.attributes.nbr_voyageurs_enfants} Enfant</Text>
                      </View>
                      <View style={{ marginTop: 10 }}>
                        <Text style={{ fontWeight: '700', fontSize: 14 }}>Depart</Text>
                        <Text>{filteredReservationsTrueById[0]?.attributes.date_partir}</Text>
                      </View>
                      <View style={{ marginTop: 10 }}>
                        <Text style={{ fontWeight: '700', fontSize: 14 }}>Classe</Text>
                        <Text>{filteredReservationsTrueById[0]?.attributes.cabine}</Text>
                      </View>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                      <TouchableOpacity onPress={openModal10} style={{ width: '65%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', padding: 5, backgroundColor: '#999', borderRadius: 8 }}>
                        <MaterialIcons name="save-alt" size={22} color="white" />
                        <Text style={{ color: '#fff' }}>Telecharger</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {currentStep === 2 && (
                  <View style={{ justifyContent: 'center', marginBottom: 20 }}>
                    <Text style={{ color: '#000', fontWeight: '900', textAlign: 'center', marginBottom: 30, fontSize: 20 }}>Confirmation</Text>
                    <View style={{ width: "100%", flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                      <TouchableOpacity style={{ backgroundColor: '#000', marginRight: 20 }}>
                        <AntDesign name="check" size={20} color="#fff" />
                      </TouchableOpacity>
                      <Fontisto name="mastercard" size={30} color="black" />
                      <View style={{ width: "60%", height: 50, marginLeft: 10 }}>
                        <Text style={{ color: '#111', fontWeight: '900', fontSize: 17 }}>{carte[0]?.attributes?.numero ? formatCardNumber(carte[0].attributes.numero) : ''}</Text>
                        <Text style={{ color: '#000', fontWeight: '600' }}>Master Card</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 30 }}>
                      <TouchableOpacity style={{ backgroundColor: '#fff', marginRight: 20, borderWidth: 1, width: 20, marginLeft: 5 }}>

                      </TouchableOpacity>
                      <Text style={{ color: '#999', fontWeight: '600' }}>Je souhaite passer à l'agence</Text>
                    </View>

                  </View>
                )}

                {currentStep === 3 && (
                  <View style={{ justifyContent: 'center' }}>
                    <Text style={{ color: '#000', fontWeight: '900', textAlign: 'center', marginBottom: 5, fontSize: 20 }}>Felicitations</Text>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                      <FontAwesome name="check" size={30} color="green" />
                    </View>
                    <View style={{ width: "100%", justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ color: '#444', fontWeight: '500', textAlign: 'center', fontSize: 13 }}>Nous confirmons que nous avons bien recu votre paiement securise en ligne. Voici une copie detaillee de votre facture</Text>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                      <TouchableOpacity onPress={openModal10} style={{ width: '65%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', padding: 5, backgroundColor: '#444', borderRadius: 8 }}>
                        <MaterialIcons name="save-alt" size={22} color="white" />
                        <Text style={{ color: '#fff' }}>Telecharger</Text>
                      </TouchableOpacity>
                    </View>


                  </View>
                )}
                <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                  <View style={{ height: 2, backgroundColor: '#999', width: 16, marginRight: 10 }}></View>
                  <View style={{ height: 2, backgroundColor: '#999', width: 16, marginRight: 10 }}></View>
                  <View style={{ height: 2, backgroundColor: '#999', width: 16, marginRight: 10 }}></View>
                  <View style={{ height: 2, backgroundColor: '#999', width: 16, marginRight: 10 }}></View>
                  <View style={{ height: 2, backgroundColor: '#999', width: 16, marginRight: 10 }}></View>
                  <View style={{ height: 2, backgroundColor: '#999', width: 16, marginRight: 10 }}></View>
                  <View style={{ height: 2, backgroundColor: '#999', width: 16, marginRight: 10 }}></View>
                  <View style={{ height: 2, backgroundColor: '#999', width: 16, marginRight: 10 }}></View>
                  <View style={{ height: 2, backgroundColor: '#999', width: 16, marginRight: 10 }}></View>
                  <View style={{ height: 2, backgroundColor: '#999', width: 17 }}></View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>


                  {currentStep > 1 && currentStep < 3 && (
                    <TouchableOpacity
                      style={{ width: '30%', alignItems: 'center', padding: 10, borderRadius: 8, borderWidth: 1, marginBottom: 20, marginRight: 40 }}
                      onPress={() => handlePrevStep()}
                    >
                      <Text style={{ color: '#000', fontWeight: '700' }}>Retour</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={currentStep > 1 ? { width: '50%', alignItems: 'center', padding: 10, backgroundColor: '#000', borderRadius: 8, marginBottom: 20 } : { width: '70%', alignItems: 'center', padding: 10, backgroundColor: '#000', borderRadius: 8, marginBottom: 20 }}
                    onPress={() => handleNextStep()}
                  >
                    <Text style={{ color: '#fff', fontWeight: '700' }}>{getButtonText()}</Text>
                  </TouchableOpacity>

                </View>

              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible9}
        onRequestClose={closeModal9}
      >
        <View style={styles.centeredView}>
          <View style={styles.imageFloatM}>
            <Image source={{ uri: userData?.image }} style={styles.profileImage} />
          </View>
          <View style={styles.modalView}>

            <View style={[styles.userInfo, { marginBottom: 20 }]}>
              <Text style={styles.userName}>{userData?.fullName}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <MaterialIcons name="credit-card" size={25} color="white" />
              <Text style={{ color: '#C4C2C2', fontWeight: '700', marginLeft: 10 }}>Cartes</Text>
            </View>
            <TouchableOpacity style={styles.closeBTN} onPress={() => handleDateSelect9()}>
              <Ionicons name="close" size={26} color="white" />
            </TouchableOpacity>
            <View style={{ width: '100%', marginTop: 20, padding: 10 }}>
              <Text style={styles.inputText}>Le nom sur la carte</Text>
              <TextInput
                placeholder=""
                value={carte[0]?.attributes.nameOncard}
                onChangeText={null}
                style={styles.inputViewCarte}
              />
            </View>
            <View style={{ width: '100%', padding: 10 }}>
              <Text style={styles.inputText}>Numero de carte</Text>
              <TextInput
                placeholder=""
                value={carte[0]?.attributes.numero}
                onChangeText={null}
                style={styles.inputViewCarte}
              />
            </View>
            <View style={{ width: '100%', padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ width: '55%' }}>
                <Text style={styles.inputText}>Date d'expiration</Text>
                <TextInput
                  placeholder=""
                  value={carte[0]?.attributes.numero}
                  onChangeText={null}
                  style={styles.inputViewCarte}
                />
              </View>
              <View style={{ width: '45%' }}>
                <Text style={styles.inputText}>CVV</Text>
                <TextInput
                  placeholder=""
                  value={carte[0]?.attributes.CVV}
                  onChangeText={null}
                  style={styles.inputViewCarte}
                />
              </View>


            </View>
            <View style={{ width: '100%', padding: 16, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => handleDateSelect9()}
                style={[styles.button4]}
              >
                <Text style={[styles.loginText, isButtonPressed ? { color: 'black', fontSize: 15, fontWeight: '700' } : null]}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDateSelect9()}
                style={[styles.button4, styles.buttonPressed, {}]}
              >
                <Text style={[styles.loginText, { color: 'black', fontSize: 15, fontWeight: '700' }]}>Valider</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible10}
        onRequestClose={closeModal10}
      >
        <View style={styles.centeredView}>
          <View style={styles.imageFloatM}>
            <Image source={{ uri: userData?.image }} style={styles.profileImage} />
          </View>
          <View style={styles.modalView}>

            <View style={[styles.userInfo, { marginBottom: 20 }]}>
              <Text style={styles.userName}>{userData?.fullName}</Text>
            </View>
            <TouchableOpacity style={styles.closeBTN} onPress={() => handleDateSelect10()}>
              <Ionicons name="close" size={26} color="white" />
            </TouchableOpacity>
            <ScrollView style={styles.containerf}
              contentContainerStyle={{ paddingBottom: 150 }}
              scrollEventThrottle={16}
            >
              <View ref={viewRef} style={styles.invoicef} >
                <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/base-stage.appspot.com/o/profileImage%2FTOPimage.jpg?alt=media&token=22f95c62-8b93-4faf-97d4-289daae51b6c' }} style={{
                  width: "100%",
                  height: 80,
                  backgroundColor: '#000',
                  opacity: 0.8
                }} />
                <View style={styles.headerf}>
                  <Text style={styles.headerTextf}>{offrebyid?.attributes.label}</Text>
                  <Text style={styles.headerSubTextf}>{offrebyid?.attributes.pay?.data.attributes.label}</Text>
                  <Text style={[styles.invoiceNumberf, { flex: 1, marginTop: 10 }]}>N° {filteredFacture[0]?.id}</Text>
                  <Text style={[styles.invoiceDatef, { flex: 2 }]}>{formattedDate}</Text>

                </View>
                <View style={styles.contactInfof}>
                  <View>
                    <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center' }}>
                      <View style={{ width: 25, height: 25, backgroundColor: '#FF9800', borderRadius: 40, marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <Entypo name="location-pin" size={20} color="#fff" />
                      </View>
                      <Text style={styles.contactTextf}>Atlas voyages, n°3</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center' }}>
                      <View style={{ width: 25, height: 25, backgroundColor: '#FF9800', borderRadius: 40, marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesome name="phone" size={20} color="#fff" />
                      </View>
                      <Text style={styles.contactTextf}>(212) 529 001 002</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center' }}>
                      <View style={{ width: 25, height: 25, backgroundColor: '#FF9800', borderRadius: 40, marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialIcons name="email" size={20} color="#fff" />
                      </View>
                      <Text style={styles.contactTextf}>https://atlasvoyages.com</Text>
                    </View>


                  </View>
                </View>


                <Card style={styles.cardf}>
                  <Card.Content>
                    <Title>Passager</Title>
                    <View style={styles.itemHeaderf}>
                      <Text style={styles.itemTextf}>Description</Text>
                      <Text style={styles.itemTextf}>Price</Text>
                      <Text style={styles.itemTextf}>Qty</Text>
                      <Text style={styles.itemTextf}>Total</Text>
                    </View>
                    <View style={styles.itemf}>
                      <Text style={styles.itemTextf}>Adultes</Text>
                      <Text style={styles.itemTextf}>{offrebyid?.attributes.prix}DH</Text>
                      <Text style={styles.itemTextf}>{filteredReservationsTrueById[0]?.attributes.nbr_voyageurs_adultes}</Text>
                      <Text style={styles.itemTextf}>{offrebyid?.attributes.prix * filteredReservationsTrueById[0]?.attributes.nbr_voyageurs_enfants}DH</Text>

                    </View>
                    <View style={styles.itemf}>
                      <Text style={styles.itemTextf}>Enfant</Text>
                      <Text style={styles.itemTextf}>{offrebyid?.attributes.prix}DH</Text>
                      <Text style={styles.itemTextf}>{filteredReservationsTrueById[0]?.attributes.nbr_voyageurs_enfants}</Text>
                      <Text style={styles.itemTextf}>{offrebyid?.attributes.prix * filteredReservationsTrueById[0]?.attributes.nbr_voyageurs_enfants}DH</Text>
                    </View>
                    <View style={styles.itemf}>
                      <Text style={styles.itemTextf}>Duree(J)</Text>
                      <Text style={styles.itemTextf}>{offrebyid?.attributes.prix}DH</Text>
                      <Text style={styles.itemTextf}>{filteredReservationsTrueById[0]?.attributes.duree}</Text>
                      <Text style={styles.itemTextf}>{offrebyid?.attributes.prix * filteredReservationsTrueById[0]?.attributes.duree}DH</Text>
                    </View>
                  </Card.Content>
                </Card>
                <View style={styles.summaryf}>
                  <Text style={styles.summaryTextf}><Text style={{ color: '#FF9800' }}>TOTAL</Text> {filteredFacture[0]?.attributes.prixTotal}DH</Text>
                </View>
                <View style={styles.paymentInfof}>
                  <Text style={[styles.paymentTextf, { fontWeight: '900', color: '#FF9800' }]}>Payment Information</Text>
                  <Text style={styles.paymentTextf}>Account: {carte[0]?.attributes.numero}</Text>
                  <Text style={styles.paymentTextf}>Name: {carte[0]?.attributes.nameOncard}</Text>
                </View>
                <View style={styles.footerf}>
                  <Text style={styles.footerTextf}>https://atlasvoyages.com</Text>
                </View>
              </View>

              <Button title="Save Facture" onPress={saveFacture} />
            </ScrollView>
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
    opacity: 0.9,
    borderRadius: 20,
    height: "92%",
    margin: 20,
    elevation: 5,
    padding: 10,
    top: 25,
    width: "90%"
  },
  profileImage: {
    width: 75,
    height: 75,
    borderRadius: 75,
  },
  imageFloat: {
    position: 'absolute',
    top: 0,
    zIndex: 2,
    alignItems: 'center',
  },
  imageFloatM: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 2,
    top: 27
  },
  userInfo: {

  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 5,
    marginTop: 30,
    color: '#fff',
    textAlign: 'center'
  },
  loginBtnOption: {
    width: '100%',
    borderRadius: 15,
    borderColor: '#C4C2C2',
    borderWidth: 2,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 9,
    flexDirection: 'row'
  },
  icon: {
    marginLeft: 15,
    flex: 1
  },
  loginTextOption: {
    color: '#A4A3A3',
    fontWeight: '700',
    marginRight: 10
  },
  notifView: {
    backgroundColor: '#fff',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    height: 22,
    width: 22,
    alignSelf: 'center'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,

  },
  modalView: {
    position: 'absolute',
    top: Platform.OS == "ios" ? height * 0.15 : height * 0.085,
    left: 20,
    right: 20,
    height: Platform.OS == "ios" ? height * 0.73 : height * 0.78,
    backgroundColor: '#000',
    opacity: 0.8,
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

  listViewlike: {
    gap: 10,
    marginTop: 10
  },
  imagelike: {
    width: 315,
    height: 150,
    borderRadius: 20,
    backgroundColor: '#000',
    opacity: 0.8
  },
  imagePay: {
    width: "100%",
    height: 160,
    borderRadius: 20,
    backgroundColor: '#000',
    opacity: 0.8,
    marginBottom: 5
  },
  inputView: {
    width: '100%',
    borderRadius: 10,
    height: 50,
    padding: 10,
    color: '#EDECEC',
    backgroundColor: '#444',
    marginBottom: 11,
    marginTop: 10,
    justifyContent: 'center'

  },
  inputViewCarte: {
    width: '100%',
    borderRadius: 10,
    height: 50,
    padding: 10,
    color: '#EDECEC',
    // backgroundColor:'#444',
    marginBottom: 11,
    marginTop: 10,
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    justifyContent: 'center'

  },
  imageSave: {
    width: 315,
    height: 180,
    borderRadius: 20,
    backgroundColor: '#000',
    opacity: 0.8
  },
  inputText: {
    fontSize: 16,
    color: '#E1E1E1',
  },
  button2: {
    width: '62%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Default background color
    padding: 0,
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 15,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },

  button4: {
    width: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Default background color
    padding: 0,
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 15,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  button3: {
    width: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Default background color
    padding: 0,
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 15,
    height: 40,
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
    fontWeight: '700',
    fontSize: 15
  },
  containerf: {
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  invoicef: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 8,
    marginBottom: 10
  },
  headerf: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTextf: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  headerSubTextf: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  invoiceNumberf: {
    fontSize: 16,
    color: '#000',
  },
  invoiceDatef: {
    fontSize: 16,
    color: '#000',
  },
  contactInfof: {
    alignItems: 'center',
    marginBottom: 20,
  },
  contactTextf: {
    fontSize: 16,
    color: '#000',
  },
  cardf: {
    marginBottom: 20,
  },
  itemHeaderf: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
    marginBottom: 8,
  },
  itemf: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  itemTextf: {
    fontSize: 12,
    color: '#000',
    width: 70
  },
  summaryf: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  summaryTextf: {
    fontSize: 16,
    color: '#000',
  },
  paymentInfof: {
    borderWidth: 1,
    borderColor: '#FF9800',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  paymentTextf: {
    fontSize: 16,
  },
  footerf: {
    alignItems: 'center',
  },
  footerTextf: {
    fontSize: 16,
    color: '#FF9800',
  },
  hidden: {
    display: 'none',
  },
  closeBTN: {
    position: 'absolute',
    top: -8,
    right: 0,
    backgroundColor: '#000',
    borderRadius: 26,
    opacity: 0.5
  }
});

export default ProfileScreen;