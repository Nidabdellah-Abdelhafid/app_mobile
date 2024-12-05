import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Text,
  Modal,
  Button,
} from "react-native";
import { NavigationProp, useFocusEffect } from "@react-navigation/native";
import ExploreHeader from "components/headerCategories/ExploreHeader";
import ListingMapPage from "../listingPage/ListingMapPage";
import ListingsBottomSheet from "../listingPage/ListingBottomSheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import { UsesContext } from "components/Context/UsesContext";
import PaysService from "services/PaysService";
import ThemeService from "services/ThemeService";
import OffreService from "services/OffreService";
import NetInfo from '@react-native-community/netinfo'; // For network status

interface Props {
  navigation: NavigationProp<any, any>;
  route;
}

const HomePage = ({ route, navigation }: Props) => {
  const { user, searchQuery } = route.params || {};
  const [category, setCategory] = useState("Sur Mesures");
  const [search, setSearch] = useState("");
  const [searchQueryi, setSearchQueryi] = useState(searchQuery || "");
  const [datafetch, setDatafetch] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [paysWithOffers, setPaysWithOffers] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [responseError, setResponseError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // New state for error message
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [errorType, setErrorType] = useState(""); // New state to control error type for icon

  // Check network connection status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const fetchData = async () => {
    if (!isConnected) {
      setConnectionError(true);
      setErrorMessage("No internet connection available.");
      setErrorType("warning"); // Set warning icon for connection issue
      setModalVisible(true); // Show modal
      return;
    }

    try {
      let data = null;
      let datat = null;
      let dataoffr = null;

      // Fetch pays data
      try {
        const paysResponse = await PaysService.getPays();
        if (paysResponse && paysResponse.data) {
          data = paysResponse.data; // assuming the response data is an array of pays
        } else {
          throw new Error('Invalid response for pays');
        }
      } catch (error) {
        console.error("Error fetching pays data:", error);
        setResponseError(true); // Set response error for pays API
        setErrorMessage("Error fetching pays data.");
        setErrorType("error"); // Set error icon for response issue
        setModalVisible(true); // Show modal
      }

      // Fetch theme data
      try {
        const themeResponse = await ThemeService.getTheme();
        if (themeResponse && themeResponse.data) {
          datat = themeResponse.data; // assuming the response data is an array of themes
        } else {
          throw new Error('Invalid response for themes');
        }
      } catch (error) {
        console.error("Error fetching theme data:", error);
        setResponseError(true); // Set response error for theme API
        setErrorMessage("Error fetching theme data.");
        setErrorType("error"); // Set error icon for response issue
        setModalVisible(true); // Show modal
      }

      // Fetch offre data
      try {
        const offreResponse = await OffreService.getOffre();
        if (offreResponse && offreResponse.data) {
          dataoffr = offreResponse.data; // assuming the response data is an array of offers
        } else {
          throw new Error('Invalid response for offers');
        }
      } catch (error) {
        console.error("Error fetching offre data:", error);
        setResponseError(true); // Set response error for offre API
        setErrorMessage("Error fetching offers data.");
        setErrorType("error"); // Set error icon for response issue
        setModalVisible(true); // Show modal
      }

      if (!data || !datat || !dataoffr) {
        console.error("One or more responses are missing data.");
        setResponseError(true);
        setErrorMessage("One or more responses are missing data.");
        setErrorType("error"); // Set error icon for response issue
        setModalVisible(true); // Show modal
        return;
      }

      // Filter offers by theme
      const offersByTheme = dataoffr.data.filter((offer) => {
        return offer.attributes.themes.data.some(
          (theme) => theme.attributes.label === category
        );
      });

      setFilteredOffers(offersByTheme);

      // Filter pays containing offers
      const paysContainingOffers = data.data.filter((pays) => {
        return pays.attributes.offres.data.some((offer) =>
          offersByTheme.some(
            (filteredOffer) => filteredOffer.id === offer.id // Assuming each offer has a unique id
          )
        );
      });

      // Filter pays containing offers by search value if search is not empty
      const filteredPaysWithSearch = search || searchQueryi 
        ? paysContainingOffers.filter((pays) => {
            if (search) {
              return pays.attributes.label
                .toLowerCase()
                .includes(search.toLowerCase());
            } else if (searchQueryi) {
              return pays.attributes.label
                .toLowerCase()
                .includes(searchQueryi.toLowerCase());
            }
          })
        : paysContainingOffers;

      setPaysWithOffers(filteredPaysWithSearch);
      setDatafetch(data.data);

    } catch (error) {
      console.error("Error fetching data:", error);
      setResponseError(true); // Set response error globally
      setErrorMessage("An error occurred while fetching data.");
      setErrorType("error"); // Set error icon for general issue
      setModalVisible(true); // Show modal
    }
  };

  useEffect(() => {
    fetchData();
  }, [category, search, searchQueryi]);

  useEffect(() => {
    if (route.params?.searchQuery !== undefined) {
      setSearchQueryi(route.params.searchQuery); // Sync internal state with param
    }
  }, [route.params?.searchQuery]);

  const onDataChange = (category) => setCategory(category);
  const onSearchChange = (search) => setSearch(search);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchQueryi(""); // Sync local state if `searchQuery` is cleared
    }
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQueryi("");
    navigation.setParams({ searchQuery: "" }); // Update navigation param to reflect clear state
  };

  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();

    return () => {
      spinAnimation.stop();
    };
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // Function to close the modal
  const closeModal = () => setModalVisible(false);

  // Function to render the icon based on error type
  const renderErrorIcon = () => {
    if (errorType === "warning") {
      return <Ionicons name="warning" size={40} color="orange" />;
    }
    return <Ionicons name="close-circle" size={40} color="red" />;
  };

  return (
    <View style={{ flex: 1 }}>

      <UsesContext.Provider value={{ search, setSearch }}>
        <ExploreHeader
          onCategoryChanged={onDataChange}
          onSearchChanged={onSearchChange}
        />
        <ListingMapPage
          navigation={navigation}
          listing={datafetch}
          category={category}
        />
        {searchQueryi && !search && (
          <TouchableOpacity
            onPress={clearSearch}
            style={[styles.btn, { marginTop: 15 }]}
          >
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Ionicons name="reload" size={20} color="#fff" />
            </Animated.View>
          </TouchableOpacity>
        )}
        <ListingsBottomSheet
          navigation={navigation}
          listings={paysWithOffers}
          category={category}
          user={user}
        />

        {/* Modal for error messages */}
        <View style={{ flex: 1, pointerEvents: 'box-none' }}>
        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              {renderErrorIcon()} {/* Render appropriate icon */}
              <Text style={styles.modalText}>{errorMessage}</Text>
              <Button title="Close" onPress={closeModal} />
            </View>
          </View>
        </Modal>
        </View>
      </UsesContext.Provider>
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#000",
    position: "absolute",
    top: "15%",
    left: "45%",
    padding: 10,
    height: 40,
    borderRadius: 30,
    flexDirection: "row",
    marginHorizontal: "auto",
    alignItems: "center",
    zIndex: 1000,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  }
});

export default HomePage;
