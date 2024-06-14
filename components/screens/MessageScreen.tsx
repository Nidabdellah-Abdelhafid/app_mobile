import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, Alert } from 'react-native';
import axios from 'axios';
import socket from './socket';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FIREBASE_DB } from "FirebaseConfig";
import { NavigationProp } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { FontAwesome6 } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { Ionicons } from '@expo/vector-icons';
import io from 'socket.io-client';
import { URL_BACKEND } from "api";

interface RouterProps {
  navigation: NavigationProp<any, any>;
  route: any;
}

const ADMIN_ID = 1; // Replace with actual admin ID

const MessageScreen = ({ route, navigation }: RouterProps) => {
  const { user: currentUser } = route.params;
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userDC, setUserDC] = useState(null);
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const scrollViewRef = useRef(null);

 
  const fetchUserData = async () => {
    try {
      const userQuery = query(collection(FIREBASE_DB, 'users'), where('email', '==', currentUser));
      const querySnapshot = await getDocs(userQuery);
      const userData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (userData.length > 0) {
        setUserData(userData[0]);
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchMessages = async () => {
    if (!userData) return;

    try {
      const response = await axios.get(`${URL_BACKEND}/api/messages?populate=*&pagination[limit]=-1`);
      const messages = response.data.data;

      const currentUserEmail = userData?.email;
      const adminEmail = 'admin@atlasvoyage.com';

      const filteredMessages = messages.filter(message => {
        const senderEmail = message?.attributes.sender?.data?.attributes.email;
        const receiverEmail = message?.attributes.receiver?.data?.attributes.email;

        return (senderEmail === currentUserEmail && receiverEmail === adminEmail) ||
              (senderEmail === adminEmail && receiverEmail === currentUserEmail);
      });

      setMessages(filteredMessages);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  
 const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };
  
  const fetchUser = async () => {
    if (!userData) return;

    try {
      const response = await axios.get(`${URL_BACKEND}/api/users?populate=*&pagination[limit]=-1`);
      const users = response.data;

      const email = userData?.email;
      const currentUserData = users.find(user => user.email === email);
      setUserDC(currentUserData);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchMessages();
      fetchUser();
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      socket.on('recvMsg', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.off('recvMsg');
      };
    }
  }, [userData]);

  const sendMessage = () => {
    if (!userDC || !message) {
      Alert.alert("🚫 Le message est vide!");
      return;
    }

    const newMessage = {
      content: message,
      sender: userDC?.id,
      receiver: ADMIN_ID, // Always sending to admin
    };

    socket.emit('sendMsg', newMessage);

    setMessage('');
    setSelectedEmojis([]);
    fetchMessages();
  };

  const isCurrentUser = (messageSender) => {
    return messageSender === userDC?.username;
  };

  const isAdmin = (messageSender) => {
    return messageSender === ADMIN_ID;
  };

  const handleEmojiSelect = emoji => {
    const newEmojis = [...selectedEmojis, emoji];
    setSelectedEmojis(newEmojis);
    setMessage(message + newEmojis.join(''));
  };

  const closeModel = () => {
    setModalVisible(false);
  };

  const handleDateSelect1 = () => {
    closeModel();
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModel}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={handleDateSelect1}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.modalContent}>
            <EmojiSelector columns={5} onEmojiSelected={handleEmojiSelect} category={Categories.emotion} />
          </View>
        </View>
      </Modal>
      <View style={styles.container}>
        <ScrollView ref={scrollViewRef} contentContainerStyle={{ paddingBottom: 25 }}>
          {messages.map((item, index) => {
            const isSender = isCurrentUser(item?.attributes?.sender?.data?.attributes?.username);
            const isMessageFromAdmin = isAdmin(item?.attributes?.sender?.data?.id);
            return (
              <View
                key={index}
                style={[
                  styles.messageContainer,
                  isSender ? styles.senderMessage : styles.receiverMessage,
                ]}
              >
                <View style={[styles.messageContent, isMessageFromAdmin ? styles.adminMessage : styles.userMessage]}>
                  {!isSender ? <Text>~{item?.attributes?.sender?.data?.attributes?.username}~</Text> : <Text>~you~</Text>}
                  <Text style={styles.messageText}>{item?.attributes?.content}</Text>
                  <Text style={styles.timestamp}>{item?.attributes?.createdAt}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <View style={{ height: 1, backgroundColor: '#999' }}></View>
      <View style={styles.containerSender}>
        <View style={styles.bubble}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <FontAwesome6 name="face-laugh" size={24} color="black" style={styles.icon} />
          </TouchableOpacity>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message"
            style={styles.input}
          />
        </View>
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <MaterialCommunityIcons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'skyblue',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5, // Android shadow
    shadowColor: 'black', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectedEmojiContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  selectedEmojiText: {
    fontSize: 20,
  },
  clearSelection: {
    marginTop: 10,
    color: 'red',
    textDecorationLine: 'underline',
  },
  containerSender: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 15,
  },
  bubble: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    flex: 1,
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#201E1F',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendText: {
    color: '#fff',
    fontSize: 18,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  senderMessage: {
    justifyContent: 'flex-end',
  },
  receiverMessage: {
    justifyContent: 'flex-start',
  },
  adminMessage: {
    backgroundColor: '#E9FFDE',
  },
  userMessage: {
    backgroundColor: '#FAE9E9',
  },
  messageContent: {
    maxWidth: '80%',
    marginLeft: 8,
    marginRight: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#AEAEAE',
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  input: {
    padding: 8,
    marginVertical: 5,
    width: '90%',
  },
});

export default MessageScreen;
