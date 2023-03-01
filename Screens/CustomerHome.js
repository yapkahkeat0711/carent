

// Import React and Component
import React, { useEffect, useState,Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import MapView,{Marker} from 'react-native-maps';

const CustomerHome = ({ navigation }) => {
  const tokyoRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  return(
    <View style={styles.container}>
    <MapView
    style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
          <Marker coordinate={tokyoRegion} />
      </MapView>
    </View>
    
  );


}

export default CustomerHome;
const styles = StyleSheet.create({
  
  container: {
    flex:0.8,
   
  },
 
});
