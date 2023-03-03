

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
async function requestLocationPermission() {
  try {
      const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
              'title': 'Geolocation Permission Required',
              'message': 'This app needs to access your device location',
          }
      )

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted')

      }
      else {
          console.log('Location permission denied')
      }

      return granted
  }
  catch (err) {
      console.warn(err)
  }
}
const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const CustomerHome = ({ navigation }) => {

  const readLocation=()=> {
    Geolocation.getCurrentPosition(
        (position) => { 
          
          //update map focus
          mapRef.current.animateToRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
      }) 
      //update curr position, the marker will follow
      setCustomerPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      })  
      
    
    }
        ,
        (error) => console.log(error.message),
        {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000
        }
    );
  
  }
  const mapRef = useRef()
  
  const [customerPosition, setCustomerPosition] = useState({
    
    latitude: 0,
    longitude: 0,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  });

  const[granted, setGranted]=useState(
    PermissionsAndroid.RESULTS.DENIED
  );

  useEffect(() => {
    
    setGranted(requestLocationPermission());
    if(granted){
      readLocation();
    }
  }, [])



  return(
    <View style={styles.container}>
        <View style={styles.mapcontainer}>
          <MapView
          style={StyleSheet.absoluteFill}
          ref={mapRef}
          initialRegion={customerPosition}
            >
                <Marker coordinate={customerPosition} />
            </MapView>
            </View>
            <View style={styles.bottomCard}>
                <Text>Where are you going..?</Text>
                <CustomBtn
                    btnText="Choose your location"
                    onPress={() => navigation.navigate('CustomerHomeSelectDes',{customerPosition: customerPosition,})}
                   
                />
              
            </View>
          
    </View>
      
         
    
    
    
  );


}

export default CustomerHome;
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
