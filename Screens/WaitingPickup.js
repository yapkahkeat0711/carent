// #6 Email Authentication using Firebase Authentication in React Native App
// https://aboutreact.com/react-native-firebase-authentication/

// Import React and Component
import React, { useEffect, useState,useRef } from "react";
import { Root, Popup } from 'react-native-popup-confirm-toast'
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Button,
  
} from "react-native";
import Modal from "react-native-modal";

import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'; 

const WaitingPickup = ({ navigation }) => {
  
  const [modalVisible,setmodalVisible]= useState(false);
  const btnRef = useRef();
  useEffect(() => {
      
    WaitingDriverReach();
   
  }, [])

  //when driver click arrived it will change the request and create popup for user
  function WaitingDriverReach(){
    //only one request for a user in the same time
    const ridesRef = database().ref('rides').orderByChild("passenger/email").equalTo(auth().currentUser.email).limitToFirst(1);
    ridesRef.off("value");
    
    ridesRef.on("value", (snapshot) => {
      //put each value into firstRef
      snapshot.forEach(function(item) {
        var request = item.val();

        //check whether driver is arrived
        if(request.status==="arrived"){
          console.log("arrived");
          btnRef.current.props.onPress();
            
          
        //check whether ride is done
        }else if(request.status==="done"){
          console.log("ride done");
          setmodalVisible(!modalVisible);
        }
      });

    });
    
    
  }

  return (
    <View>
      <Text>Waiting Driver to Pickup ...</Text>
  {/* arrived popup    */}
  <Root>
    <View style={{ display: "none" }}>
        <Button 
            title="Click Me"
            ref={btnRef}
            onPress={() =>
               
                Popup.show({
                    type: 'success',
                    textBody: 'Driver is arrived !!!',
                    buttonText: 'Confirm',
                    confirmText: 'Vazgeç',
                    callback: () => {
                        Popup.hide();
                    },
                    
                })
            }
        />
            
        
    </View>
</Root>
  <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setmodalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Rate the Driver!</Text>
              <Button
                title="Close"
                style={[styles.button, styles.buttonClose]}
                onPress={() => setmodalVisible(!modalVisible)} />
              
              
            </View>
          </View>
    </Modal>

    </View>   
);
};

export default WaitingPickup;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonStyle: {
    minWidth: 300,
    backgroundColor: "#7DE24E",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#7DE24E",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
  },


});