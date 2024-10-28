
  import { URL_BACKEND } from 'api';
import React, { useEffect, useState } from 'react';
  import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, TouchableWithoutFeedback } from 'react-native';
  import Ionicons from 'react-native-vector-icons/Ionicons';
  
  const Invoice = () => {
      const [searchQuery, setSearchQuery] = useState('');
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
          } else {
              setFilteredPays([]); // Clear suggestions when input is empty
          }
      }, [searchQuery, pays]);
  
      // Handle selecting a suggested pays
      const handleSelect = (label) => {
          setSearchQuery(label);
          setFilteredPays([]); // Clear suggestions after selection
      };
  
      return (
          <View style={styles.container}>
              <View style={styles.searchBar}>
                  <TextInput
                      style={styles.input}
                      placeholder="Chercher une destination"
                      placeholderTextColor="#999"
                      value={searchQuery}
                      onChangeText={setSearchQuery} // Update search query on change
                  />
                  <TouchableOpacity>
                      <Ionicons name="search" color="#fff" size={28} style={styles.searchIcon} />
                  </TouchableOpacity>
              </View>
  
              {/* Display filtered pays */}
              {searchQuery.length > 0 && (
                  <FlatList
                      data={filteredPays}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => (
                          <TouchableWithoutFeedback onPress={() => handleSelect(item.attributes.label)}>
                              <View style={styles.resultItem}>
                                  <Text style={styles.resultText}>
                                      {item.attributes.label}
                                  </Text>
                              </View>
                          </TouchableWithoutFeedback>
                      )}
                      style={styles.resultsContainer}
                  />
              )}
          </View>
      );
  };
  
  const styles = StyleSheet.create({
      container: {
          padding: 10,
      },
      searchBar: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#333', // Background color of the search bar
          borderRadius: 5,
          padding: 10,
      },
      input: {
          flex: 1,
          fontSize: 17,
          color: '#fff',
          fontFamily: 'Roboto',
      },
      searchIcon: {
          marginLeft: 10,
      },
      resultsContainer: {
          marginTop: 10,
          backgroundColor: '#444', // Background color for results
          borderRadius: 5,
      },
      resultItem: {
          padding: 10,
      },
      resultText: {
          fontSize: 16,
          color: '#fff',
      },
  });
  
  export default Invoice;
  