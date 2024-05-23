import { View, Text, StyleSheet, TouchableOpacity, Modal, Button, ScrollView, PanResponder } from 'react-native'
import React, { useRef, useState } from 'react'
import { FontAwesome6 } from '@expo/vector-icons';
import Ionicons from "@expo/vector-icons/Ionicons";
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';




export default function MainPage() {  
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const scrollViewRef = useRef(null);
    

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };
    const handleDateSelect = (selectedDate) => {
        // Handle the selected date here
        console.log(selectedDate);
        // Close the modal
        closeModal();
    };
    
    const openModal1 = () => {
        setModalVisible1(true);
    };

    const closeModal1 = () => {
        setModalVisible1(false);
    };
    const handleDateSelect1 = () => {
        // Close the modal
        closeModal1();
    };
    

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderRelease: (e, gestureState) => {
                if (gestureState.dy > 0 && gestureState.vy > 1) {
                    // If swipe down velocity is high enough
                    closeModal();
                }
            },
        })
    ).current;
   

    const options = [
        { id: 1, label: 'Tous les types' , style:"op1"},
        { id: 2, label: 'Option 2' , style:"op2"},
        { id: 3, label: 'Option 3' , style:"op3"},
    ];

    const [selectedOption, setSelectedOption] = useState(options[0]);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        console.log(option.label)
    };

    const optionsNbr = [
        { id: 1, label: 'Tout' },
        { id: 2, label: '1' },
        { id: 3, label: '2' },
        { id: 4, label: '3' },
        { id: 5, label: '4' },
        { id: 6, label: '5' },
        { id: 7, label: '6' },
        { id: 8, label: '7' },
        { id: 9, label: '+8' },
    ];

    const [selectedOptionNbrc, setSelectedOptionNbrc] = useState(optionsNbr[0]);

    const handleOptionSelectNbrc = (option) => {
        setSelectedOptionNbrc(option);
        console.log(option.label)
    };

    const [selectedOptionTprM, setSelectedOptionTprM] = useState('');
    const [activeTprM,setActiveTprM]=useState(false);    
    const handleOptionSelectTprM = (option) => {
        setSelectedOptionTprM(option);
        console.log(option)
        
    };
    const [selectedOptionTprAp, setSelectedOptionTprAp] = useState('');
    const [activeTprAp,setActiveTprAp]=useState(false);
    const handleOptionSelectTprAp = (option) => {
        setSelectedOptionTprAp(option);
        console.log(option)
        
    };
    const [selectedOptionTprMh, setSelectedOptionTprMh] = useState('');
    const [activeTprMh,setActiveTprMh]=useState(false);
    const handleOptionSelectTprMh = (option) => {
        setSelectedOptionTprMh(option);
        console.log(option)
        
    };
    const [selectedOptionTprH, setSelectedOptionTprH] = useState('');
    const [activeTprH,setActiveTprH]=useState(false);
    const handleOptionSelectTprH = (option) => {
        setSelectedOptionTprH(option);
        console.log(option)
        
    };

    const [showAll, setShowAll] = useState(false);
    const [checkboxes, setCheckboxes] = useState(Array(10).fill(false));

    // Function to toggle checkbox
    const toggleCheckbox = (index) => {
        setCheckboxes(prevState => {
        const newCheckboxes = [...prevState];
        newCheckboxes[index] = !newCheckboxes[index];
        return newCheckboxes;
        });
    };

    // Function to toggle showing all checkboxes
    const toggleShowAll = () => {
        setShowAll(prevState => !prevState);
    };

    return (
        <View style={styles.container}>
            <View style={{flexDirection:'row',justifyContent:'center',alignContent:'center',alignItems:'center'}}>
            
            <TouchableOpacity onPress={openModal}>
                <View style={styles.searchBar}>
                    <View>
                        <Text style={{ fontSize: 17, color: '#999', fontWeight: '600' ,fontFamily: 'Roboto'}}>Chercher une destination</Text>
                        
                    </View>
                    <Ionicons name="search" color="#fff" size={33} style={{ marginLeft: 45  }} />
                    
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={openModal1}>
                <View style={styles.searchBarbtn}>
                    <AntDesign name="filter" size={35} color="#fff" />
                </View>
            </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer} {...panResponder.panHandlers}>
                {/* Header */}
                <View style={styles.header}>
                <TouchableOpacity onPress={closeModal} style={{flexDirection:'row',alignItems:'center'}}>
                    <AntDesign name="close" size={20} color="black" />
                    <Text style={{fontSize:18,fontWeight:'600',marginLeft:12}}>Filters</Text>
                </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.content} >
                    <ScrollView 
                    ref={scrollViewRef}
                    style={{flex:1}}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    >
                    <Text style={styles.textFilter}>Type de logement</Text>
                    <View style={styles.viewFilter}>
                     {options.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                 style= {option.style==="op1" ? [styles.option,styles.op1,selectedOption?.id === option.id && styles.selectedOption ] : (option.style==="op3" ? [styles.option,styles.op3,selectedOption?.id === option.id && styles.selectedOption ]:[styles.option,selectedOption?.id === option.id && styles.selectedOption ])}
                                onPress={() => handleOptionSelect(option)}
                            >
                                <Text
                                style={[ selectedOption?.id === option.id && styles.textdOption]} 
                                >{option.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={styles.textFilter}>Chambres et lits</Text>
                    <Text style={{}}>Chambres</Text>

                    <View style={styles.viewFilter}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                     {optionsNbr.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                 style= {[styles.optionNbrc,selectedOptionNbrc?.id === option.id && styles.selectedOptionNbrc ]}
                                onPress={() => handleOptionSelectNbrc(option)}
                            >
                                <Text
                                style={[ selectedOptionNbrc?.id === option.id && styles.textdOption]} 
                                >{option.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    </View>
                    <Text style={styles.textFilter}>Type de propriete</Text>
                    <View style={styles.viewFilter}>
                        <View style={{width:"46%"}}>
                        <TouchableOpacity
                                 style={activeTprM ? [styles.optionTpr, styles.selectedOptionTpr] :[styles.optionTpr]}
                            onPress={() => {
                                setActiveTprM(!activeTprM)
                                if(activeTprM===false){
                                handleOptionSelectTprM('Maison')
                                   
                            }else if(activeTprM===true){
                                 handleOptionSelectTprM('')
                            }
                            }}
                        >
                            <AntDesign name="home" size={28} color="black" />
                            <Text
                                style={{fontWeight:'500',marginTop:32}}
                            >Maison</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                                 style={activeTprMh ? [styles.optionTpr, styles.selectedOptionTpr] :[styles.optionTpr]}
                            onPress={() => 
                                {
                                    setActiveTprMh(!activeTprMh) 
                                    if(activeTprMh===false){
                                    handleOptionSelectTprMh(`Maison d'hôtes`)
                                      
                                }else if(activeTprMh===true){
                                    handleOptionSelectTprMh('')
                            }
                            }
                            }
                        >
                            <Ionicons name="bed" color="#000" size={28} />
                            <Text
                                style={{fontWeight:'500',marginTop:32}}
                            >Maison d'hôtes</Text>
                        </TouchableOpacity>
                        </View>
                            
                        <View style={{marginLeft:20,width:"46%"}}>
                            <TouchableOpacity
                                style={activeTprAp ? [styles.optionTpr, styles.selectedOptionTpr] :[styles.optionTpr]}
                            onPress={() =>{
                                setActiveTprAp(!activeTprAp)
                                if(activeTprAp===false){
                                    handleOptionSelectTprAp('Appatement')
                                    
                                }else if(activeTprAp===true){
                                    handleOptionSelectTprAp('')
                            }
                            } 
                        }
                        >
                            <MaterialIcons name="apartment" size={28} color="black" />
                            <Text
                                style={{fontWeight:'500',marginTop:32}}
                            >Appatement</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                                style={activeTprH ? [styles.optionTpr, styles.selectedOptionTpr] : [styles.optionTpr]}
                            onPress={() => {
                                setActiveTprH(!activeTprH)
                                if(activeTprH===false){
                                handleOptionSelectTprH('Hôtel')
                                    
                            }else if(activeTprH===true){
                                handleOptionSelectTprH('')
                            }
                        }}
                        >
                            <FontAwesome6 name="hotel" size={28} color="black" />
                            <Text
                                style={{fontWeight:'500',marginTop:32}}
                            >Hôtel</Text>
                        </TouchableOpacity>
                        </View>
                        
                        
                    
                    </View>
                    <Text style={styles.textFilter}>Type de propriete 2</Text>
                    <View style={styles.viewFilterCk}>
                        {/* Render first three checkboxes */}
                        {checkboxes.slice(0, showAll ? checkboxes.length : 3).map((isChecked, index) => (
                            <TouchableOpacity
                            key={index}
                            style={{ flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center',  marginBottom: 10 }}
                            onPress={() => toggleCheckbox(index)}
                            >
                            
                            <Text  style={isChecked ? ({alignSelf:'center',fontSize:15,color:'black'}):({alignSelf:'center',fontSize:15,color:'#555'})}>Checkbox {index + 1}</Text>
                            <View >
                                
                                <Ionicons
                                name={isChecked ? 'checkbox' : 'square-outline'}
                                size={28}
                                color={isChecked ? 'black' : '#999'}
                                style={{marginLeft:10,alignSelf:'flex-end'}}
                                
                            />
                            </View>
                            </TouchableOpacity>
                        ))}

                        {/* Render "Show More" button */}
                        {checkboxes.length > 3 && (
                            <TouchableOpacity onPress={toggleShowAll} style={{flexDirection:'row',alignItems:'center',alignContent:'center'}}>
                            <Text style={{ color: 'black' ,fontWeight:'700',textDecorationLine: 'underline'}}>
                                {showAll ? 'Show Less' : 'Show More'}
                                
                            </Text>
                            {showAll ? <MaterialIcons name="expand-less" size={24} color="black" /> : <MaterialIcons name="expand-more" size={24} color="black" />}
                            </TouchableOpacity>
                        )}
                    </View>
                    </ScrollView>
                    
                </View>

                {/* Footer */}
                <View style={[styles.footer,]}>
                    <TouchableOpacity onPress={closeModal} >
                        <Text style={{fontWeight:'700'}}>Tout effacer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={closeModal} style={[styles.button,{alignContent: 'flex-end',}]}>
                        <Text style={styles.buttonText}>Afficher les logements</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible1}
                onRequestClose={closeModal1}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity style={[styles.textFilter2]}>
                            <Text style={{color:'#fff',}}>
                                Club All-In
                            </Text>
                            <View style={{marginTop:5,height:2,width:65,backgroundColor:'#fff'}}></View> 
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.textFilter2}>
                            <Text style={{color:'#fff'}}>Croisiere</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.textFilter2}>
                            <Text style={{color:'#fff'}}>Honeymoon</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.textFilter2}>
                            <Text style={{color:'#fff'}}>Family</Text>
                        </TouchableOpacity>
                        <TouchableOpacity  style={styles.textFilter2}>
                            <Text style={{color:'#fff'}}>Ski</Text>
                        </TouchableOpacity>
                        <TouchableOpacity  style={styles.textFilter2}>
                            <Text style={{color:'#fff'}}>Plage</Text>
                        </TouchableOpacity >
                        <TouchableOpacity style={styles.textFilter2} onPress={() => handleDateSelect1()}>
                            <Text style={{color:'#fff'}}>close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        padding: 0,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        backgroundColor: '#222',
        borderRadius: 12,
        padding: 11,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    textFilter2:{
        paddingBottom:15,
        alignItems:'center'
    },
    searchBarbtn:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#222',
        borderRadius: 12,
        borderColor:'#999',
        padding: 10,
        marginLeft: 10,
        marginBottom:20,
        alignSelf:'flex-start',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        position: 'absolute',
        bottom: 420,
        left: 150,
        right: 10,
        backgroundColor: '#111',
        borderRadius: 20,
        padding: 35,
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

    modalContainer: {
        
        flex: 1,
        paddingTop:10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      header: {
        backgroundColor: '#fff',
        padding: 20,
        width: '100%',
        borderBottomColor:'gray',
        borderBottomWidth:0.5,
        borderTopRightRadius:18,
        borderTopLeftRadius:18,
        
      },
      headerText: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      content: {
        backgroundColor: '#fff',
        padding: 20,
        flex:1
      },
      footer: {
        backgroundColor: '#fff',
        padding: 20,
        width: '100%',
        alignItems: 'center',
        borderTopColor:'gray',
        borderTopWidth:0.9,
        flexDirection:'row',
        justifyContent:'space-between'
      },
      option: {
        borderWidth: 0.8,
        borderColor: '#ccc',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
        paddingBottom: 20,
        marginBottom: 10,
        width:'33.3%'
    },
    selectedOption: {
        backgroundColor: '#000',
        color:'white',
    },
    op1:{
        borderTopLeftRadius:10,
        borderBottomLeftRadius:10,

    },
    op3:{
        borderTopRightRadius:10,
        borderBottomRightRadius:10,
    },
    textdOption: {
        color:'white',
    },
    viewFilter:{
        flexDirection:'row',
        alignContent:'space-around',
        borderBottomColor:'#999',
        borderBottomWidth:0.8,
        marginBottom:25,
        paddingBottom:20
    },
    viewFilterCk:{
        alignContent:'space-around',
        borderBottomColor:'#999',
        borderBottomWidth:0.8,
        marginBottom:25,
        paddingBottom:20,
        width:'100%'
    },
    textFilter:{
        fontSize:18,
        fontWeight:'500',
        paddingBottom:15
    },
   optionNbrc:{
        borderWidth: 0.8,
        borderColor: '#ccc',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop:10,
        paddingBottom:10,
        marginTop:12,
        marginLeft: 10,
        borderRadius:20
        
   },
   selectedOptionNbrc:{
        backgroundColor: '#000',
        color:'white',
   },
   optionTpr:{
        borderWidth: 0.8,
        borderColor: '#ccc',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop:10,
        paddingBottom:10,
        marginTop:12,
        marginLeft: 2,
        borderRadius:10,
        width:"100%",
   },
   selectedOptionTpr:{
        borderWidth: 2,
        borderColor: '#000',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
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