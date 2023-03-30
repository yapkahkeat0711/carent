

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
import MapViewDirections from 'react-native-maps-directions';

const CustomerCheckFee = ({ route,navigation }) => {
    const { width, height } = Dimensions.get('window');
    const mapRef = useRef()
    const {customerPosition,destination}= route.params;
    const [calinfo, setCal]=useState({
        time: 0,
        distance: 0,
    });
    

    const fetchTime = (d, t) => {
        setCal({
            distance: d,
            time: t
        })
        
    }
  return(
     <View style={styles.container}>
          {calinfo.distance !== 0 && calinfo.time !== 0 && (<View style={{ alignItems: 'center', marginVertical: 16 }}>
                <Text>Time Needed : {calinfo.time.toFixed(0)} mins</Text>
                <Text>Distance : {calinfo.distance.toFixed(0)} KM</Text>
                <Text>Price : RM{(calinfo.distance * 0.25).toFixed(2)}</Text>
            </View>)}
        
        <View style={styles.mapcontainer}>
          <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={customerPosition}
            >
                <Marker coordinate={customerPosition} />
                <Marker coordinate={destination} />
                 <MapViewDirections
                    origin={customerPosition}
                    destination={destination}
                    apikey={'AIzaSyBS0SHCUgOxAQ5gqVUSTtug_5AdQDloy4A'}
                    strokeWidth={6}
                    strokeColor="red"
                    optimizeWaypoints={true}
                    onReady={result => {
                        console.log(`Distance: ${result.distance} km`)
                        console.log(`Duration: ${result.duration} min.`)
                        fetchTime(result.distance, result.duration),
                        
                        mapRef.current.fitToCoordinates(result.coordinates, {
                            edgePadding: {
                              right: (width / 20),
                              bottom: (height / 20),
                              left: (width / 20),
                              top: (height / 20),
                            }
                        });
                    }}
                    onError={(errorMessage) => {
                        console.log('GOT AN ERROR');
                    }}
                />
                
                 
            </MapView>
            </View>
            <View style={styles.bottomCard}>
             
                <CustomBtn
                    btnText="Book Your Car"
                    onPress={() => navigation.navigate('SendCarRequest',{customerPosition: customerPosition,destination:destination})}
                   
                />
               
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
