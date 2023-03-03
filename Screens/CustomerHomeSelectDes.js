

// Import React and Component
import { useNavigation } from '@react-navigation/native';
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import LocationInput from '../Components/LocationInput';
import CustomBtn from '../Components/CustomBtn';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const CustomerHomeSelectDes = ({ route,navigation }) => {

 
  
  
  const {customerPosition}= route.params;
  const [Destination, setDestination] = useState({
    
    latitude: 0,
    longitude: 0,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  });
  

  const fetchDestinationCords = (lat, lng, zipCode, cityText) => {
    console.log("zip code==>>>",zipCode)
    console.log('city texts',cityText)
    console.log('city texts',customerPosition)
    setDestination({
      latitude: lat,
      longitude: lng
    });
   
}
const onDone = () => {
  
}
  return(
    <View style={styles.container}>
            {/* <ScrollView
                keyboardShouldPersistTaps="handled"
                style={{ backgroundColor: 'white', flex: 1, padding: 24 }}
            > */}
               <View style={{ marginBottom: 16 }} />
               <LocationInput
                    placheholderText="Enter Destination Location"
                    fetchAddress={fetchDestinationCords}
                />
                   <CustomBtn
                    btnText="Done"
                    onPress={onDone}
                   
                />
               
            {/* </ScrollView> */}
        </View>
      
         
    
    
    
  );


}

export default CustomerHomeSelectDes;
const styles = StyleSheet.create({
  container: {
    flex:1,
   
  },
  
});
