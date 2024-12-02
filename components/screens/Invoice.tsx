
import React, {  useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button, Dimensions, TextInput, } from 'react-native';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';

import { FontAwesome6, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

const Invoice = () => {
    const [modalVisible, setModalVisible] = useState(false);
  const scrollViewRef = useRef(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState('');


  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a network request
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
    // Fetch pays data from the backend
    const scrollToBottom = () => {
        console.log("Button pressed: Scrolling to bottom...");
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      };
      const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const contentHeight = event.nativeEvent.contentSize.height;
        const layoutHeight = event.nativeEvent.layoutMeasurement.height;
        setShowScrollToBottom(offsetY < contentHeight - layoutHeight - 50); // show button if scrolled up by 50 units from bottom
      };
    
      

    return (
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
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <View style={{width:50,height:100,backgroundColor:'red'}}>
            <Text>gg</Text>
          </View>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <View style={{width:50,height:100,backgroundColor:'red'}}>
            <Text>gg</Text>
          </View>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <View style={{width:50,height:100,backgroundColor:'red'}}>
            <Text>gg</Text>
          </View>
          <View style={{width:50,height:100,backgroundColor:'red'}}>
            <Text>gg</Text>
          </View>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <View style={{width:50,height:100,backgroundColor:'red'}}>
            <Text>gg</Text>
          </View>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
          <Text>fffff</Text>
        </ScrollView>
        {showScrollToBottom && (
          <TouchableOpacity
            style={styles.scrollToBottomButton}
            onPress={scrollToBottom}
          >
            <FontAwesome name="angle-double-down" size={30} color="#666" />
          </TouchableOpacity>
        )}
        <View style={[styles.inputContainer]}>
        
        <TouchableOpacity onPress={()=>{}} style={{ marginRight: 10 }}>
          <FontAwesome6 name="file" size={24} color="#2E86C1" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginRight: 10 }}>
          <FontAwesome name="smile-o" size={24} color="#2E86C1" />
        </TouchableOpacity>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Message"
          style={styles.input}
        />
        <TouchableOpacity style={styles.sendButton} onPress={()=>{}} >
          <MaterialCommunityIcons name="send" size={22} color="white" />
        </TouchableOpacity>
      </View>
        </View>
    );
};
const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
    flex: 1,

        padding: 10,
    },
    
    //
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        width: width,
        top: 100,

    },
    modalViewtest: {
        width: "80%", // Uses percentage for better responsiveness
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: height * 0.50,

    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
      },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: "center", // Centered text for better aesthetics
    },
    closeButton: {
        backgroundColor: "#2196F3",
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    closeButtonText: {
        color: "white",
        fontSize: 16,
    },
    input: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 20,
        marginRight:10
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
        bottom: 100, // Reduced from 80 to ensure it's closer to the screen bottom
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
});

export default Invoice;
