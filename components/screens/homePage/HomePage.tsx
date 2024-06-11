import { View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import ExploreHeader from 'components/headerCategories/ExploreHeader';
import { NavigationProp } from '@react-navigation/native';
import ListingMapPage from '../listingPage/ListingMapPage';
import ListingsBottomSheet from '../listingPage/ListingBottomSheet';
interface Props{
  navigation: NavigationProp<any, any>;
}

const HomePage = ({navigation}:Props) => {
    const [category,setCategory]=useState('Tiny homes');
    const [datafetch,setDatafetch]=useState([]) ;
   
    const fetchData = async () => {
      try {
        const response = await fetch(`http://192.168.11.107:1337/api/pays?populate=*&pagination[limit]=-1`);
        const data = await response.json();
        // console.log('Result:', data.data[0].attributes);
        setDatafetch(data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };


    useEffect(() => {
      fetchData();
     
    }, []);
    useEffect(() => {
      //console.log('Data fetched2:', datafetch);
    }, [datafetch]);


    const onDataChange = (category:string)=>{
       
        setCategory(category);
    }


  return (
    <View>
        <ExploreHeader onCategoryChanged={onDataChange} />
        <ListingMapPage navigation={navigation} listing={datafetch} category={category}/>
        <ListingsBottomSheet navigation={navigation} listings={datafetch} category={category}/>
         {/* <ListingPage navigation={navigation} listings={items} category={category}/> */}
    </View>
  )
}


export default HomePage
