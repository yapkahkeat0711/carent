

// Import React and Component
import React, { useEffect, useState, Component, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Dimensions,
  ImageBackground
} from "react-native";
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import CustomBtn from '../Components/CustomBtn';
import flatted from 'flatted';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const DriverPickupPage = ({ route, navigation }) => {
  const { data, pickupname, dropoffname } = route.params.newChildData;

  const requestkey = route.params.Newsnapshotkey;
  const [passengerName, setPassengerName] = useState('');
  const [requestStatus, setRequestStatus] = useState('accepted');


  const driverArrived = (snapshot) => {
    setRequestStatus('arrived');
    const data = snapshot.val(); // Get the data from the snapshot
    const newData = { ...data, status: 'arrived' }; // Update the desired field
    snapshot.ref.set(newData); // Set the updated data back to the database

  };
  const driverDone = (snapshot) => {
    setRequestStatus('done');
    const data = snapshot.val(); // Get the data from the snapshot
    const newData = { ...data, status: 'done' }; // Update the desired field
    snapshot.ref.set(newData); // Set the updated data back to the database
    navigation.replace('DriverPage');
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Show the bottom tab bar when the screen comes into focus
      navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex' } });
    });

    const subscribe = navigation.addListener('blur', () => {
      // Hide the bottom tab bar when the screen loses focus
      navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
    });

    const rideRef = database().ref(`rides`).child(requestkey);
    rideRef.once('value', (snapshot) => {
      setPassengerName(snapshot.val().passenger.username);
    });

    // Cleanup the listeners when the component unmounts
    return () => {
      unsubscribe();
      subscribe();
    };
  }, [navigation])



  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/backgroundImage.png')}
        style={{ flex: 1, width: '100%', height: '100%', resizeMode: 'cover' }}>
        <View style={styles.topCard}></View>
        <View style={styles.bottomCard}>
          <Text style={{ fontSize: 18,color:'black',fontWeight:'bold' }}>{passengerName}</Text>
          <Text style={{ fontSize: 18 }}>Normal Ride</Text>
          <Text style={{ fontSize: 18 ,color:'black',fontWeight:'bold'}}>RM {data.fee}</Text>
          <View style={styles.lineStyle} />
          <Text style={styles.modalText}>{pickupname.streetAddress}, {pickupname.postalCode}, {pickupname.city}, {pickupname.state}, {pickupname.country}</Text>
          <FontAwesome5 name='grip-lines-vertical' size={20} />
          <FontAwesome5 name='grip-lines-vertical' size={20} />
          <FontAwesome5 name='grip-lines-vertical' size={20} />
          <FontAwesome5 name='grip-lines-vertical' size={20} style={{ marginBottom: 20 }} />
          <Text style={styles.modalText}>{dropoffname.streetAddress}, {dropoffname.postalCode}, {dropoffname.city}, {dropoffname.state}, {dropoffname.country}</Text>
          <View style={styles.btmbutton}>
            {requestStatus === 'accepted' && <CustomBtn
              btnText="I've Arrived"
              onPress={() => {
                const rideRef = database().ref(`rides`).child(requestkey);
                rideRef.once('value', (snapshot) => {
                  driverArrived(snapshot);
                });
              }}

            />}
            {requestStatus === 'arrived' && <CustomBtn
              btnText="Done"
              onPress={() => {
                const rideRef = database().ref(`rides`).child(requestkey);
                rideRef.once('value', (snapshot) => {
                  driverDone(snapshot);
                });
              }}

            />}

          </View>
        </View>
      </ImageBackground>
    </View>





  );


}

export default DriverPickupPage;
const styles = StyleSheet.create({
  lineStyle: {
    backgroundColor: '#A2A2A2',
    height: 2,
    width: 350,
    marginBottom: 5,
    marginTop: 5,
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green'
  },
  btmbutton: {

    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center'

  },
  container: {
    flex: 1,

  },
  mapcontainer: {
    flex: 0.8,

  },
  topCard: {
    flex: 0.1,
    width: '100%',
    padding: 30,

  },
  bottomCard: {
    flex: 0.9,
    backgroundColor: 'white',
    width: '100%',
    padding: 30,
    borderTopEndRadius: 24,
    borderTopStartRadius: 24,
    alignContent: 'center',
    alignItems: 'center',
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
