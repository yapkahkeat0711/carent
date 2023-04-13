

// Import React and Component
import React, { useEffect, useState,Component,useRef} from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  PermissionsAndroid ,
  Dimensions,
} from "react-native";
import MapView,{Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import CustomBtn from '../Components/CustomBtn';
import flatted from 'flatted';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'; 


const DriverPickupPage = ({route,navigation }) => {
  const { data, pickupname, dropoffname } = route.params.newChildData;
 
  const snapshot = route.params.Newsnapshot;
  const [passengerData,setPassengerData]=useState();
  const [requestStatus,setRequestStatus]=useState('accepted');

  
  const driverArrived = (snapshot) =>{
    setRequestStatus('arrived');
    const data = snapshot.val(); // Get the data from the snapshot
    const newData = { ...data, status:'arrived' }; // Update the desired field
    snapshot.ref.set(newData); // Set the updated data back to the database
    
  };
  const driverDone = (snapshot) =>{
    setRequestStatus('done');
    const data = snapshot.val(); // Get the data from the snapshot
    const newData = { ...data, status:'done' }; // Update the desired field
    snapshot.ref.set(newData); // Set the updated data back to the database
    navigation.replace('DriverPage');
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

   
   
     // Cleanup the listeners when the component unmounts
     return () => {
      unsubscribe();
      subscribe();
    };
  }, [navigation])
 


  return(
    <View style={{ backgroundColor: 'blue',flex:1}}>
       <View  style={styles.topCard}></View>
      <View style={styles.bottomCard}>
      
      <Text style={{fontSize:20,textAlign:'center'}}>From: {pickupname.streetAddress}</Text>
      <Text style={{fontSize:20,textAlign:'center'}}>To: {dropoffname.streetAddress}</Text>
      <View  style={styles.btmbutton}>
      {requestStatus==='accepted' && <CustomBtn
          btnText="I've Arrived"
          onPress={()=> driverArrived(snapshot)}
                   
      />}
      {requestStatus==='arrived' && <CustomBtn
          btnText="Done"
          onPress={()=> driverDone(snapshot)}
                   
      />}

      </View> 
      </View>  
          
    </View>
      
         
    
    
    
  );


}

export default DriverPickupPage;
const styles = StyleSheet.create({
  btmbutton:{
    
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: 'center'
    
  },
  container: {
    flex:1,
   
  },
  mapcontainer: {
    flex:0.8,
   
  },
  topCard: {
    flex:0.1,
    backgroundColor: 'blue',
    width: '100%',
    padding: 30,
    
},
  bottomCard: {
    flex:0.9,
    backgroundColor: 'white',
    width: '100%',
    padding: 30,
    borderTopEndRadius: 24,
    borderTopStartRadius: 24
},
inpuStyle: {
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    marginTop: 16
}

 
});
