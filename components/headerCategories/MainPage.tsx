import { View, Text, StyleSheet, TouchableOpacity, Modal, PanResponder, TextInput, FlatList, TouchableWithoutFeedback, Image } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";
import { AntDesign } from '@expo/vector-icons';
import { URL_BACKEND } from 'api';
import { UsesContext } from 'components/Context/UsesContext';



export default function MainPage({ onSearchChanged }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const scrollViewRef = useRef(null);

    //
    const [searchQuery, setSearchQuery] = useState('');
    
    const [searchInit, setSearchInit] = useState('');
    const {search,setSearch} = useContext(UsesContext);
    const [hideSearch, setHideSearch] = useState(true);
    const [editable, setEditable] = useState(true);
    const [pays, setPays] = useState([]);
    const [filteredPays, setFilteredPays] = useState([]);

    // Fetch pays data from the backend
    const fetchPays = async () => {
        try {
            const response = await fetch(`${URL_BACKEND}/api/pays?populate=*&pagination[limit]=-1`);
            const data = await response.json();
            setPays(data.data); // Assuming data.data contains the array of pays
        } catch (error) {
            console.error('Error fetching pays:', error);
        }
    };

    useEffect(() => {
        fetchPays();
    }, []);

    useEffect(() => {
        // Filter pays whenever the search query changes
        if (searchQuery.length > 0) {
            const filtered = pays.filter(paysItem =>
                paysItem.attributes.label.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredPays(filtered);
            // console.log("inpu v : ",filtered)
        } else {
            setFilteredPays([]); // Clear suggestions when input is empty
        }
    }, [searchQuery, pays]);

    // Handle selecting a suggested pays
    const handleSelect = (label) => {
        setSearchQuery(label);
        setFilteredPays([]); // Clear suggestions after selection
    };
    //
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
        { id: 1, label: 'Tous les types', style: "op1" },
        { id: 2, label: 'Option 2', style: "op2" },
        { id: 3, label: 'Option 3', style: "op3" },
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
    const [activeTprM, setActiveTprM] = useState(false);
    const handleOptionSelectTprM = (option) => {
        setSelectedOptionTprM(option);
        console.log(option)

    };
    const [selectedOptionTprAp, setSelectedOptionTprAp] = useState('');
    const [activeTprAp, setActiveTprAp] = useState(false);
    const handleOptionSelectTprAp = (option) => {
        setSelectedOptionTprAp(option);
        console.log(option)

    };
    const [selectedOptionTprMh, setSelectedOptionTprMh] = useState('');
    const [activeTprMh, setActiveTprMh] = useState(false);
    const handleOptionSelectTprMh = (option) => {
        setSelectedOptionTprMh(option);
        console.log(option)

    };
    const [selectedOptionTprH, setSelectedOptionTprH] = useState('');
    const [activeTprH, setActiveTprH] = useState(false);
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
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>

                <View style={[styles.searchBar, searchQuery ? { marginBottom: 20 } : { marginBottom: 20 }]}>
                    {searchQuery &&
                        <TouchableOpacity onPress={() => { setSearch(''), setSearchQuery(''), setHideSearch(true), setEditable(true) }}>
                            <Ionicons name="arrow-back-outline" size={20} color="#fff" />
                        </TouchableOpacity>
                    }
                    <TextInput
                        style={{ color: '#fff', fontFamily: 'Roboto' }}
                        placeholder="Chercher une destination"
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        editable={editable}
                    />
                    
                    {hideSearch &&
                        (searchQuery === "" ? (
                            // Show search icon alone when searchQuery is empty
                            <Ionicons
                                name="search"
                                color="#fff"
                                size={33}
                                style={{ marginLeft: 10 }}
                            />
                        ) : (
                            // Show TouchableOpacity with onPress when searchQuery has text
                            <TouchableOpacity
                                onPress={() => {
                                    onSearchChanged(searchQuery);
                                    setHideSearch(false);
                                    setEditable(false);
                                }}
                            >
                                <Ionicons
                                    name="search"
                                    color="#fff"
                                    size={33}
                                    style={{ marginLeft: 10 }}
                                />
                            </TouchableOpacity>
                        ))}


                </View>
                {/* Display filtered pays */}


                <TouchableOpacity onPress={openModal1}>
                    <View style={[styles.searchBarbtn, searchQuery ? { marginBottom: 20 } : { marginBottom: 20 }]}>
                        <AntDesign name="filter" size={35} color="#fff" />
                    </View>
                </TouchableOpacity>

            </View>
            {searchQuery.length > 0 && (
                <FlatList
                    data={filteredPays}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableWithoutFeedback onPress={() => {handleSelect(item.attributes.label);onSearchChanged(searchQuery);
                            setHideSearch(false);
                            setEditable(false); }}>
                            <View style={styles.resultItem}>
                                <Image source={{ uri: item?.attributes.photos?.data[0]?.attributes.url }} style={styles.profileImage} />

                                <Text style={styles.resultText}>
                                    {item.attributes.label}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                    style={styles.resultsContainer}
                    // Add additional styles for absolute positioning
                    contentContainerStyle={styles.resultsContent}
                />
            )}


            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible1}
                onRequestClose={closeModal1}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity style={[styles.textFilter2]}>
                            <Text style={{ color: '#fff', }}>
                                Club All-In
                            </Text>
                            <View style={{ marginTop: 5, height: 2, width: 65, backgroundColor: '#fff' }}></View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.textFilter2}>
                            <Text style={{ color: '#fff' }}>Nos coups de coeur</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.textFilter2}>
                            <Text style={{ color: '#fff' }}>Tendance</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.textFilter2}>
                            <Text style={{ color: '#fff' }}>Top Seller</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.textFilter2, { flexDirection: 'row' }]} onPress={() => handleDateSelect1()}>
                            <Ionicons name="backspace-outline" size={24} color="#fff" />
                            <Text style={{ color: '#fff', marginLeft: 5 }} >Close</Text>

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
        justifyContent: 'space-between',
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
        width: '75%'
    },
    textFilter2: {
        paddingBottom: 15,
        alignItems: 'center'
    },
    searchBarbtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#222',
        borderRadius: 12,
        borderColor: '#999',
        padding: 10,
        marginLeft: 10,
        alignSelf: 'flex-start',
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
        bottom: 465,
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
        paddingTop: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    header: {
        backgroundColor: '#fff',
        padding: 20,
        width: '100%',
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,

    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        backgroundColor: '#fff',
        padding: 20,
        flex: 1
    },
    footer: {
        backgroundColor: '#fff',
        padding: 20,
        width: '100%',
        alignItems: 'center',
        borderTopColor: 'gray',
        borderTopWidth: 0.9,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    option: {
        borderWidth: 0.8,
        borderColor: '#ccc',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
        paddingBottom: 20,
        marginBottom: 10,
        width: '33.3%'
    },
    selectedOption: {
        backgroundColor: '#000',
        color: 'white',
    },
    op1: {
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,

    },
    op3: {
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    textdOption: {
        color: 'white',
    },
    viewFilter: {
        flexDirection: 'row',
        alignContent: 'space-around',
        borderBottomColor: '#999',
        borderBottomWidth: 0.8,
        marginBottom: 25,
        paddingBottom: 20
    },
    viewFilterCk: {
        alignContent: 'space-around',
        borderBottomColor: '#999',
        borderBottomWidth: 0.8,
        marginBottom: 25,
        paddingBottom: 20,
        width: '100%'
    },
    textFilter: {
        fontSize: 18,
        fontWeight: '500',
        paddingBottom: 15
    },
    optionNbrc: {
        borderWidth: 0.8,
        borderColor: '#ccc',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 12,
        marginLeft: 10,
        borderRadius: 20

    },
    selectedOptionNbrc: {
        backgroundColor: '#000',
        color: 'white',
    },
    optionTpr: {
        borderWidth: 0.8,
        borderColor: '#ccc',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 12,
        marginLeft: 2,
        borderRadius: 10,
        width: "100%",
    },
    selectedOptionTpr: {
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
    resultsContainer: {
        position: 'absolute', // Make the results container absolute
        top: 50, // Adjust based on your search bar height
        left: 30,
        right: 75,
        backgroundColor: '#444', // Background color for results
        borderRadius: 5,
        zIndex: 1000, // Ensure it floats above other components
    },
    resultsContent: {
        paddingVertical: 0, // Optional: add padding for aesthetics
    },
    resultItem: {
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center'
    },
    resultText: {
        fontSize: 16,
        color: '#fff',
        marginLeft: 10
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
})