import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, RefreshControl, StyleSheet, Modal, Alert, Image, Dimensions, Platform } from 'react-native';
import socket from './socket';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FIREBASE_DB } from "FirebaseConfig";
import { NavigationProp } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { FontAwesome6, FontAwesome } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { URL_BACKEND } from "api";
import { Linking } from 'react-native';
import MessageService from 'services/MessageService';
import UserService from 'services/UserService';
import * as MediaLibrary from 'expo-media-library';
interface RouterProps {
  navigation: NavigationProp<any, any>;
  route: any;
}
const { width,height } = Dimensions.get('window');

const ADMIN_ID = 1;

const MessageScreen = ({ route, navigation }: RouterProps) => {
  const { user: currentUser } = route.params;
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userDC, setUserDC] = useState(null);
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const scrollViewRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const messageInputRef = useRef(null);


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
      const response = await MessageService.getMessage();
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
      setShowScrollToBottom(false);
    }
  };

  const fetchUser = async () => {
    if (!userData) return;

    try {
      const response = await UserService.getUser();
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
        fetchMessages();
      });

      return () => {
        socket.off('recvMsg');
      };
    }
  }, [userData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMessages();
    // Simulate a network request
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };


  const handleFilePicker = async () => {
    try {
      // Request permission to access media library (file system)
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission denied", "You need to allow access to your files to pick a document.");
        return;
      }

      // Open the document picker if permission is granted
      const result = await DocumentPicker.getDocumentAsync({});

      // Check if the user canceled the file picker
      if (result.canceled === true) {
        return; // Exit early if the user canceled
      }

      // If a file was picked, process it
      setSelectedFile(result);
    } catch (error) {
      console.error('Error picking file:', error);
      alert("An error occurred while picking the file. Please try again.");
    }
  };

  const sendMessage = async () => {
    if (!userDC || (!message && !selectedFile)) {
      messageInputRef.current?.focus();
      return;
    }

    const newMessage = {
      content: message,
      sender: userDC?.id,
      receiver: ADMIN_ID, // Always sending to admin
    };

    // Handle file upload
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('files.document', {
          uri: selectedFile?.uri,
          name: selectedFile?.name,
          size: selectedFile?.size,
          type: selectedFile?.mimeType,
        });
        formData.append('data', JSON.stringify(newMessage));

        const fileUploadResponse = await MessageService.addMessage(formData);


        if (fileUploadResponse.status === 200) {
          setMessage('');
          setSelectedEmojis([]);
          setSelectedFile(null);
          fetchMessages();
        } else {
          throw new Error('File upload failed');
        }
      } catch (error) {
        // console.error('Error uploading file:', error);
        alert("Try again!")
        return;
      }
    }

    else {
      socket.emit('sendMsg', newMessage);

      setMessage('');
      setSelectedEmojis([]);
      setSelectedFile(null);
      fetchMessages();
    }
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

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${formattedDate} ~ ${formattedTime}`;
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;
    setShowScrollToBottom(offsetY < contentHeight - layoutHeight - 50); // show button if scrolled up by 50 units from bottom
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ paddingBottom: 25 }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh} />
          }>
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
                  {item?.attributes?.document?.data ? (
                    <View style={styles.messageFile}>
                      {item.attributes.document?.data.attributes.mime.includes('image') ? (
                        <Image
                          source={{ uri: `${URL_BACKEND}${item.attributes.document?.data.attributes.url}` }}
                          style={{ width: "100%", height: 200, borderRadius: 15 }}
                          resizeMode='contain'
                        />
                      ) : (
                        <TouchableOpacity
                          onPress={() => Linking.openURL(`${URL_BACKEND}${item.attributes.document?.data.attributes.url}`)}
                        >
                          <Text style={{ color: 'blue' }}>{item.attributes.document?.data.attributes.name}</Text>

                        </TouchableOpacity>
                      )}
                    </View>
                  ) : null}
                  <Text style={styles.messageText}>{formatDateTime(item?.attributes?.createdAt)}</Text>

                </View>
              </View>
            );
          })}
        </ScrollView>

        {showScrollToBottom && (
          <TouchableOpacity
            style={styles.scrollToBottomButton}
            onPress={scrollToBottom}
          >
            <FontAwesome name="angle-double-down" size={30} color="#666" />
          </TouchableOpacity>
        )}
        {selectedFile && (
          <View style={[styles.filePreviewContainer, selectedFile ? styles.borderTp : {}]}>
            {selectedFile.mimeType.includes('image') ? (
              <Image
                source={{ uri: selectedFile.uri }}
                style={styles.filePreviewImage}
              />
            ) : (
              <Text style={styles.filePreviewText}>{selectedFile.name}</Text>
            )}
            <TouchableOpacity onPress={() => setSelectedFile(null)} style={styles.removeFileButton}>
              <FontAwesome name="times" size={24} color="#ff0000" />
            </TouchableOpacity>
          </View>
        )}
        <View style={[styles.inputContainer, selectedFile ? {} : styles.borderTp]}>

          <TouchableOpacity onPress={handleFilePicker} style={{ marginRight: 10 }}>
            <FontAwesome6 name="file" size={24} color="#2E86C1" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginRight: 10 }}>
            <FontAwesome name="smile-o" size={24} color="#2E86C1" />
          </TouchableOpacity>
          <TextInput
            ref={messageInputRef}
            value={message}
            onChangeText={setMessage}
            placeholder="Message"
            style={styles.input}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <MaterialCommunityIcons name="send" size={22} color="white" />
          </TouchableOpacity>
          
        </View>


        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModel}
        >
          <View style={styles.modalContainer}>

            <View style={styles.modalContent}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={40} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

    </View>
  );
};


const styles = StyleSheet.create({
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
    width: "100%",
    height: 100,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5, // Android shadow
    shadowColor: 'black', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    marginBottom: 10,
  },
  messageContent: {
    padding: 10,
    borderRadius: 10,
  },
  senderMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  receiverMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FAE9E9',
    borderRadius: 10
  },
  adminMessage: {
    borderColor: '#2E86C1',
    borderWidth: 1,
  },
  userMessage: {
    borderColor: '#2ECC71',
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
  },
  messageFile: {
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  borderTp: {
    borderTopWidth: 2,
    borderTopColor: '#DDD',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 20,
    marginRight: 10
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 30,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollToBottomButton: {
    position: 'absolute',
    bottom: height*0.05,  // Platform.OS=="ios" ? height*0.15  : height*0.085,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Red background for visibility
    borderRadius: 30,
    padding: 10,
    elevation: 10,
    zIndex: 100,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  filePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    paddingTop: 5
  },
  filePreviewImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  filePreviewText: {
    // flex:3,
    maxWidth: 200,
    marginRight: 10,
  },
  removeFileButton: {
    marginLeft: 10,
  },
});

export default MessageScreen;
