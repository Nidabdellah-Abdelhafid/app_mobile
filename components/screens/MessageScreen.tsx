import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getEntities } from 'api';
import { FlatList } from 'react-native-gesture-handler';
import axios from 'axios';
import { TouchableOpacity } from '@gorhom/bottom-sheet';


const API_URL = 'http://192.168.91.62:8080/api';

const authenticate = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/authenticate`, {
      username,
      password,
    });
    return response.data.id_token;
  } catch (error) {
    console.error('Authentication failed:', error);
    throw error;
  }
};

const fetchOffres = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/offres`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching offres:', error);
    throw error;
  }
};


const MessageScreen = () => {
  const [entities, setEntities] = useState([]);
  const [token, setToken] = useState(null);
  const authenticateAndFetch = async () => {
    try {
      const token = await authenticate('admin', 'admin');
      setToken(token);
      const data = await fetchOffres(token);
      setEntities(data);
      // console.log("Jhipster: ",entities)
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };
  useEffect(() => {
    // authenticateAndFetch();
  }, []);

  const fetchdata= ()=>{
    authenticateAndFetch();
  }

  return (
    <View style={{padding:90}}>
      <Text>Hi hello ..................</Text>
      <TouchableOpacity onPress={()=> fetchdata()} style={{marginTop:20}}>
        <Text>Get ents..</Text>
      </TouchableOpacity>
      {/* <LivChat /> */}
    </View>
  )
}

export default MessageScreen