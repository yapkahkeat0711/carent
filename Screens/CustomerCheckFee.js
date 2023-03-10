

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

const CustomerCheckFee = ({ route,navigation }) => {

    const {customerPosition,destination}= route.params;
  


  return(
     <View style={styles.container}>
        <View style={styles.mapcontainer}>
          <MapView
          style={StyleSheet.absoluteFill}
          initialRegion={customerPosition}
            >
                <Marker coordinate={customerPosition} />
                <Marker coordinate={destination} />
                 
            </MapView>
            </View>
            
          
    </View>
      
         
    
    
    
  );


}

export default CustomerCheckFee;
const styles = StyleSheet.create({
  container: {
    flex:1,
   
  },
  mapcontainer: {
    flex:0.8,
   
  },
  bottomCard: {
    flex:0.2,
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
