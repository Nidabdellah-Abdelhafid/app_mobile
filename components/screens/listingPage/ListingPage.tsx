import { View, Text, StyleSheet,  ListRenderItem, TouchableOpacity,Modal, Image, Button } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import { Ionicons ,Fontisto} from '@expo/vector-icons';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { NavigationProp } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';

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
                <TouchableOpacity style={{ position: 'absolute', right: 32, top: 15 }} onPress={openModal}>
                    <Ionicons name={isFavorited ? 'heart' : 'heart-outline'} size={25} color={isFavorited ? 'white' : '#fff'} />
                </TouchableOpacity>
                
                <View style={{ position: 'absolute',left: 35, top: 160,flexDirection:'row', justifyContent: 'space-between' }}>
                    <View >
                    <Text style={{ fontSize: 17, fontWeight: '900' ,color:'#fff'}}>{item.name}</Text>
                    <View style={{ flexDirection: 'row', gap: 4 }}>
                        <Ionicons name="star" size={16} color='orange'/>
                        <Ionicons name="star" size={16} color='orange'/>
                        <Ionicons name="star" size={16} color='orange'/>
                        <Ionicons name="star" size={16} color='orange'/>
                        <Ionicons name="star" size={16} color='orange'/>
                        {/* <Text style={{}}>{Number(item.review_scores_rating / 20)}</Text> */}
                    </View>
                    </View>
                    
                    
                </View>
                <TouchableOpacity style={{ position: 'absolute', right: 35, top: 180 }} onPress={openModal}>
                    {isFavorited ?<Fontisto name='favorite' size={25} color='white' /> :<Fontisto name="bookmark" size={24} color="#fff" />}
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
        // ListHeaderComponent={<Text style={styles.info}>{items.length} homes</Text>}
        
      />
      
    </View>
  )
}

export default ListingPage

const styles= StyleSheet.create({
    container:{
        paddingLeft:10,
        paddingRight:10,
        backgroundColor:'#222',
        marginVertical: 0,
    },
    listView:{
        paddingLeft:15,
        paddingRight:20,
        paddingBottom:20,
        paddingEnd:20,
        paddingStart:20,
        gap: 10,
    },
    image:{
        width: 340,
        height: 220,
        borderRadius:20,
        backgroundColor:'#000',
        opacity:0.85
    },
    info: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight:'500',
        
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