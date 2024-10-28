import { StyleSheet, TouchableOpacity, View , Animated, Easing,} from 'react-native';
import React, { useEffect, useState, useRef} from 'react';
import ExploreHeader from 'components/headerCategories/ExploreHeader';
import { NavigationProp } from '@react-navigation/native';
import ListingMapPage from '../listingPage/ListingMapPage';
import ListingsBottomSheet from '../listingPage/ListingBottomSheet';
import { URL_BACKEND } from 'api';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Props {
  navigation: NavigationProp<any, any>;
  route;
}

const HomePage = ({ route, navigation }: Props) => {
  const { user ,searchQuery} = route.params || {};
  const [category, setCategory] = useState('Sur Mesures'); // The theme label you want to filter by
  const [search, setSearch] = useState(''); // The theme label you want to filter by
  const [searchQueryi, setSearchQueryi] = useState(searchQuery); // The theme label you want to filter by
  const [datafetch, setDatafetch] = useState([]); // For pays data
  const [filteredOffers, setFilteredOffers] = useState([]); // For offers filtered by theme
  const [paysWithOffers, setPaysWithOffers] = useState([]); // For pays containing the filtered offers
  // console.log("src 2 : ",searchQuery);
  
  const fetchData = async () => {
    try {
      // Fetch pays data
      const response = await fetch(`${URL_BACKEND}/api/pays?populate=*&pagination[limit]=-1`);
      const data = await response.json();

      // Fetch themes (categories) data
      const responset = await fetch(`${URL_BACKEND}/api/themes?populate=*&pagination[limit]=-1`);
      const datat = await responset.json();

      // Fetch offres data
      const responseofr = await fetch(`${URL_BACKEND}/api/offres?populate=*&pagination[limit]=-1`);
      const dataofr = await responseofr.json();

      const offersByTheme = dataofr.data.filter(offer => {
        return offer.attributes.themes.data.some(theme => theme.attributes.label === category);
      });

      setFilteredOffers(offersByTheme);

      const paysContainingOffers = data.data.filter(pays => {
        // Check if the pays has offers and if any of them match the filtered offers
        return pays.attributes.offres.data.some(offer =>
          offersByTheme.some(filteredOffer =>
            filteredOffer.id === offer.id // Assuming each offer has a unique id
          )
        );
      });

      // Filter paysContainingOffers by search value if search is not empty
      const filteredPaysWithSearch = search || searchQueryi
        ? paysContainingOffers.filter(pays =>
            {
              if(search){
                return pays.attributes.label.toLowerCase().includes(search.toLowerCase())
              }
              else if(searchQueryi){
                return pays.attributes.label.toLowerCase().includes(searchQueryi.toLowerCase())
              }
            
          }
          
          )
        : paysContainingOffers;

      setPaysWithOffers(filteredPaysWithSearch);
      setDatafetch(data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category, search,searchQueryi]); // Fetch data whenever category or search changes

  const onDataChange = (category) => {
    setCategory(category); // Update the category when selected
  };

  const onSearchChange = (search) => {
    setSearch(search); 
    // console.log('se v: ', search);
  };
  const onSearcInitSq = () => {
    // console.log('se v: ', search);
    setSearchQueryi('');
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

    // Optionally, clean up the animation when the component unmounts
    return () => {
      spinAnimation.stop();
    };
  }, [spinValue]);

  // Interpolating the spin value to create a 360-degree rotation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  return (
    <View>
      <ExploreHeader onCategoryChanged={onDataChange} onSearchChanged={onSearchChange} />
      <ListingMapPage navigation={navigation} listing={datafetch} category={category} />
      {searchQueryi && !search &&
      <TouchableOpacity onPress={onSearcInitSq}  style={[styles.btn, { marginTop: 15 }]}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Ionicons name="reload" size={20} color="#fff" />
      </Animated.View>
    </TouchableOpacity>
      }
      
      <ListingsBottomSheet
        navigation={navigation}
        listings={paysWithOffers}
        category={category}
        user={user}
      />
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  btn: {
      backgroundColor: '#000',
      position:'absolute',
      top:'15%',
      left:'45%',
      padding: 10,
      height: 40,
      borderRadius: 30,
      flexDirection: 'row',
      marginHorizontal: 'auto',
      alignItems: 'center',
      zIndex:1000
    },

  })