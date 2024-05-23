import { View } from 'react-native'
import React, { useMemo, useState } from 'react'
import ExploreHeader from 'components/headerCategories/ExploreHeader';
import lisingData from '../../../assets/data/airbnb-listings.json';
import lisingDataMap from '../../../assets/data/airbnb-listings.geo.json';

import { NavigationProp } from '@react-navigation/native';
import ListingMapPage from '../listingPage/ListingMapPage';
import ListingsBottomSheet from '../listingPage/ListingBottomSheet';

interface Props{
  navigation: NavigationProp<any, any>;
}

const HomePage = ({navigation}:Props) => {
    const [category,setCategory]=useState('Tiny homes');
    const items= useMemo(() => lisingData as any,[]);
    const itemsMap= useMemo(() => lisingDataMap as any,[]);

    const onDataChange = (category:string)=>{
        
        setCategory(category);
    }
  return (
    <View>
        <ExploreHeader onCategoryChanged={onDataChange} />
        <ListingMapPage navigation={navigation} listing={itemsMap} category={category}/>
        <ListingsBottomSheet navigation={navigation} listings={items} category={category}/>
         {/* <ListingPage navigation={navigation} listings={items} category={category}/> */}
    </View>
  )
}

export default HomePage