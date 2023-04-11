

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

const DriverPickupPage = ({route,navigation }) => {
  const { data, pickupname, dropoffname } = route.params.newChildData;
  const snapshot = flatted.parse(route.params.Newsnapshot);
  const [passengerData,setPassengerData]=useState();
 
  
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
      <View  style={styles.btmbutton}>
      <CustomBtn
          btnText="I've Arrived"
          onPress={{}}
                   
      />
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
