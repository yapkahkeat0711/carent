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
import CustomBtn from '../Components/CustomBtn';

const WaitingPickup = ({route,navigation }) => {
  const snapshot = route.params.snapshot;
  const [modalVisible,setmodalVisible]= useState(false);
  const [driver,setDriver]=useState({
    username: '' ,
    email:'',
    car:{
      car_brand:'',
      car_plate:'',
      car_color:'',
      car_photo:'',
    }
  });
  const btnRef = useRef();

  async function GetDriverInfo (snapshot) {
    try {
      
      const useremail =  snapshot.val().driver.email;
      const driversnapshot = await firestore()
        .collection("Car_of_Driver")
        .where("email", "==", useremail)
        .get();
      const fetchedData = driversnapshot.docs.map((doc) => doc.data())[0];
      console.log("dada",snapshot.val());
      console.log("dada",fetchedData);
      setDriver({
        username: snapshot.val().driver.username ,
        email:snapshot.val().driver.email,
        car:{
          car_brand:fetchedData.car_brand,
          car_plate:fetchedData.car_plate_number,
          car_color:fetchedData.car_color,
          car_photo:fetchedData.photoURL,
        }
      });
      
  } catch (error) {
      console.log("Error fetching user data: ", error);
      return { error: "Error fetching user data" };
  }
    
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Show the bottom tab bar when the screen comes into focus
      navigation.getParent()?.setOptions({tabBarStyle: {display: 'flex'}});
    });

    const subscribe = navigation.addListener('blur', () => {
      // Hide the bottom tab bar when the screen loses focus
      navigation.getParent()?.setOptions({tabBarStyle: {display: 'none'}});
    });
    WaitingDriverReach();
    GetDriverInfo(snapshot);
  }, [navigation])
  
 
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
    <View style={{ backgroundColor: 'blue',flex:1}}>
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
   
    <View  style={styles.circleWrapper}>
        <View style={styles.circle} >

        </View>
    </View>
   
    <View style={styles.bottomCard}>
    
      <Text style={{fontSize:20,textAlign:'center'}}>{driver.username}</Text>
      <View style = {styles.lineStyle} />
      <CustomBtn
          btnText="Cancel Booking"
          onPress={() => { navigation.getParent()?.setOptions({tabBarStyle: {display: 'flex'}});navigation.navigate('CustomerHomeMap');
         }}
          
      />
     
 

    </View>  
    </View> 
);
};

export default WaitingPickup;

const styles = StyleSheet.create({
  circleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  zIndex: 1,
  },
  circle: {
    
    top:50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'white',
   
  },
  lineStyle:{
    backgroundColor: '#A2A2A2',
    height: 2,
    width:'100%',
    marginBottom:5,
    marginTop:5,
},

  bottomCard: {
    flex:0.99,
    backgroundColor: 'white',
    width: '100%',
    zIndex: 2,
    padding: 30,
    borderTopEndRadius: 24,
    borderTopStartRadius: 24,
    zIndex: 0,
},
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