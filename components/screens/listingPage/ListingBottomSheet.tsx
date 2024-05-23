import React, { useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import ListingPage from './ListingPage';
import { NavigationProp } from '@react-navigation/native';

interface Props {
  listings: any[];
  category: string;
  navigation: NavigationProp<any, any>;
}

const ListingsBottomSheet = ({ navigation, listings, category }: Props) => {
  const snapPoints = useMemo(() => ['21%', '82%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [refresh, setRefresh] = useState<number>(0);

  const onShowMap = () => {
    bottomSheetRef.current?.collapse();
    setRefresh(refresh + 1);
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      handleIndicatorStyle={{ backgroundColor: '#222' }}
      style={styles.sheetContainer}
      backgroundComponent={({ style }) => <View style={[style, { backgroundColor: '#222' }]} />}
      >
      <View style={styles.contentContainer}>
        <ListingPage listings={listings} navigation={navigation} refresh={refresh} category={category} />
        
        <View style={styles.absoluteView}>
          <TouchableOpacity onPress={onShowMap} style={styles.btn}>
            <Text style={{ color: '#fff' }}>Map</Text>
            <Ionicons name="map" size={20} style={{ marginLeft: 10 }} color={'#fff'} />
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  absoluteView: {
    position: 'absolute',
    bottom: 210,
    width: '100%',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: '#000',
    padding: 14,
    height: 50,
    borderRadius: 30,
    flexDirection: 'row',
    marginHorizontal: 'auto',
    alignItems: 'center',
  },
  sheetContainer: {
    flex:1,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
});

export default ListingsBottomSheet;