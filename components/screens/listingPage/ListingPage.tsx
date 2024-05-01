import { View, Text, StyleSheet,  ListRenderItem, TouchableOpacity,Modal, Image, Button } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { NavigationProp } from '@react-navigation/native';
import { FlatList, TextInput } from 'react-native-gesture-handler';

interface Props{
    listings: any[];
    category:string;
    navigation: NavigationProp<any, any>;
    refresh: number;
}



const ListingPage = ({ navigation, listings:items,refresh, category}:Props) => {
    const [loading,setLoading]= useState(false);
    const listRef = useRef<FlatList>(null);
    const [isFavorited, setIsFavorited] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const toggleFavorite = () => {
        setIsFavorited(!isFavorited);
    };

    useEffect(() => {
        if (refresh) {
          scrollListTop();
        }
      }, [refresh]);

      const scrollListTop = () => {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
      };

    useEffect(()=>{
        setLoading(true);
        console.log("R List ");
        setTimeout(()=>{
            setLoading(false);
        },100)
    },[category]);
    
    const renderRow: ListRenderItem<any> = ({item}) => (
            <TouchableOpacity onPress={() => navigation.navigate('DetailPage', { itemId: item.id })}>
            <Animated.View style={styles.listView} entering={FadeInRight} exiting={FadeOutLeft}>
                <Image source={{ uri: item.medium_url }} style={styles.image} />
                <TouchableOpacity style={{ position: 'absolute', right: 30, top: 30 }} onPress={openModal}>
                    <Ionicons name={isFavorited ? 'heart' : 'heart-outline'} size={24} color={isFavorited ? 'red' : '#000'} />
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
                    <View style={{ flexDirection: 'row', gap: 4 }}>
                        <Ionicons name="star" size={16} />
                        <Text style={{}}>{item.review_scores_rating / 20}</Text>
                    </View>
                </View>
                <Text style={{ fontWeight: '400' }}>{item.room_type}</Text>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                    <Text style={{ fontWeight: '900' }}>€ {item.price}</Text>
                    <Text style={{}}>night</Text>
                </View>
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
                          <Text style={{color:'gray',fontSize:17,textDecorationLine: 'underline'}}>Close</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={toggleFavorite} style={[styles.button,{alignContent: 'flex-end',}]}>
                          <Text  style={styles.buttonText}>Create</Text>
                      </TouchableOpacity>
                      </View>
                    </View>
                </Modal>
            )}
        </TouchableOpacity>
        
    )
  return (
    <View style={styles.container}>
      <FlatList
        renderItem={renderRow}
        data={loading ? [] : items}
        ref={listRef}
        ListHeaderComponent={<Text style={styles.info}>{items.length} homes</Text>}
        
      />
      {/* <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
          
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                    <View style={styles.inputView}>
                  <TextInput
                    style={styles.inputText}
                    placeholder="Email"
                    placeholderTextColor="#003f5c"
                  />
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                  <Button title="close" onPress={closeModal} />
                  <Button title="add" onPress={setEtatFavorie(true)} />
                </View>
                    </View>
                </View>
            </Modal> */}
    </View>
  )
}

export default ListingPage

const styles= StyleSheet.create({
    container:{
        padding: 10,
        backgroundColor:'#fff',
        marginVertical: 0,
    },
    listView:{
        padding:16,
        gap: 10,
        marginVertical: 16,
    },
    image:{
        width: 340,
        height: 300,
        borderRadius:10,
    },
    info: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight:'500',
        
      },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 22,
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
        justifyContent:'space-between',
        flexDirection:'row',
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
})