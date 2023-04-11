

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
  Button,
} from "react-native";
import MapView,{Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import CustomBtn from '../Components/CustomBtn';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'; 
import Modal from "react-native-modal";
import Geocoder from 'react-native-geocoding';
import flatted from 'flatted';

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


const DriverPage = ({ navigation }) => {

  const mapRef = useRef();
  const [Newsnapshot, setSnapshot] = useState(null);
  const [status, setStatus] = useState(false);
  const [available, setAvailable] = useState(true);
  const [modalVisible, setmodalVisible] = useState(false);
  const [newChildData, setNewChildData] = useState({
    data:{
      fee:'',
    },
    pickupname:'',
    dropoffname:'',
  });
  const [customerPosition, setCustomerPosition] = useState({
    
    latitude: 0,
    longitude: 0,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  });
  async function findDriverName () {
    try {
      const useremail =  auth().currentUser.email;
      const snapshot = await firestore()
        .collection("User")
        .where("email", "==", useremail)
        .get();
      const fetchedData = snapshot.docs.map((doc) => doc.data())[0];
      return fetchedData;
      
  } catch (error) {
      console.log("Error fetching user data: ", error);
      return { error: "Error fetching user data" };
  }
    
  };
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
  
  };

  const readlivelocation = async () => {
    const locPermission = await requestLocationPermission();
    if(locPermission){
      readLocation();
    }
  };

  const getAddressComponents = (addressComponents) => {
    const result = {
      city: null,
      state: null,
      country: null,
      streetAddress:null,
      postalCode:null,
    };
  
    addressComponents.forEach((component) => {
      if (component.types.includes("route")) {
        result.streetAddress = component.long_name;
      }
      if (component.types.includes("street_number")) {
        result.streetAddress += " " + component.long_name;
      }
      if (component.types.includes("postal_code")) {
        result.postalCode = component.long_name;
      }
      if (component.types.includes("locality")) {
        result.city = component.long_name;
      }
      if (component.types.includes("administrative_area_level_1")) {
        result.state = component.short_name;
      }
      if (component.types.includes("country")) {
        result.country = component.long_name;
      }
    });
  
    return result;
  };

  const  accepteRequest = async (Newsnapshot) =>{
    const driver = await findDriverName();
    const data = Newsnapshot.val(); // Get the data from the snapshot
    const newData = { ...data,  driver: { email: auth().currentUser.email , username:driver.name } }; // Update the desired field
    Newsnapshot.ref.set(newData); // Set the updated data back to the database
  };

  const onChildAdded = (snapshot) => {
  
      if(snapshot.val().status==="requested"){
        setSnapshot(snapshot);
        setmodalVisible(!modalVisible);
       
        //check location name
        Geocoder.init("AIzaSyBS0SHCUgOxAQ5gqVUSTtug_5AdQDloy4A");
        Geocoder.from(snapshot.val().pickupLocation.latitude, snapshot.val().pickupLocation.longitude)
        .then((json) => {
          var addressComponents = json.results[0].address_components;
          const pickuppoint = getAddressComponents(addressComponents);
          setNewChildData(prevState => ({
            ...prevState,
            pickupname: pickuppoint
          }));
        })
        .catch((error) => console.warn(error));
        Geocoder.from(snapshot.val().dropoffLocation.latitude, snapshot.val().dropoffLocation.longitude)
        .then((json) => {
          var addressComponents = json.results[0].address_components;
          const pickuppoint = getAddressComponents(addressComponents);
          setNewChildData(prevState => ({
            ...prevState,
            dropoffname: pickuppoint
          }));
        })
        .catch((error) => console.warn(error));

        setNewChildData(prevState => ({
          ...prevState,
          data:snapshot.val(),
        }));
        console.log(newChildData);
      }
     
  };

  const goOnline = () => {
    const availableRef = database().ref('rides').orderByChild("driver/email").equalTo(auth().currentUser.email).limitToFirst(1);
        availableRef.on('value', (avalablesnapshot) => {
          if (avalablesnapshot.exists()) {
            // Data exists, do nothing
          } else {
            // Data doesn't exist, popup
            setAvailable(true);

            
          }
        }, (error) => {
          // Handle any errors that occur while listening for the data
        });

    if(status===false && available===true){
      console.log("Onlining");
      database().ref('rides').on('child_added', onChildAdded);
       
        
     
    }else{
      console.log("offlining");
      database().ref('rides').off('child_added', onChildAdded);
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
      clearInterval(interval);
      database().ref('rides').off('child_added', onChildAdded);
    });
   
     const interval = setInterval(() => {
        readlivelocation();
      }, 5000);
     

 // Cleanup the listeners when the component unmounts
      return () => {
        clearInterval(interval);
        unsubscribe();
        subscribe();
       
      };

  }, [navigation]);



  return(
    <View style={styles.container}>
   
     
   {modalVisible && (<Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setmodalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>New Request!</Text>
              <Text style={styles.modalText}>From:{newChildData.pickupname.streetAddress}</Text>
              <Text style={styles.modalText}>To:{newChildData.dropoffname.streetAddress}</Text>
              <Text style={styles.modalText}>RM {newChildData.data.fee}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button
                  title="Accept"
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    accepteRequest(Newsnapshot);
                    const serializedSnapshot = flatted.stringify(Newsnapshot);
                    navigation.replace('DriverPickupPage',{newChildData:newChildData,Newsnapshot:serializedSnapshot});
                  }}
                />
                <Button
                  title="Decline"
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setmodalVisible(!modalVisible)}
                />
              </View>
            </View>
          </View>
        </Modal>)}
     
      

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
            
                <CustomBtn
                    btnText={status ? 'Go Offline' : 'Go Online'}
                    onPress={() => {
                      goOnline();
                      setStatus(!status);
                     
                  }}
                   
                />
              
            </View>
          
    </View>
      
         
    
    
    
  );


}

export default DriverPage;
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
},
centeredView: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 22,
},
modalView: {
  margin: 0,
  backgroundColor: 'white',
  borderRadius: 20,
  padding: 50,
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
