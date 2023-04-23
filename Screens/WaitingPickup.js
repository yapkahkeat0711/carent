// #6 Email Authentication using Firebase Authentication in React Native App
// https://aboutreact.com/react-native-firebase-authentication/

// Import React and Component
import React, { useEffect, useState, useRef } from "react";
import { Root, Popup } from 'react-native-popup-confirm-toast'
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Button,
  Image,
  ImageBackground,
} from "react-native";
import Modal from "react-native-modal";

import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CustomBtn from '../Components/CustomBtn';
import StarRating from 'react-native-star-rating';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
const WaitingPickup = ({ route, navigation }) => {
  const  requestkey  = route.params.requestkey;
  const [star, setStar] = useState(0);
  const [modalVisible, setmodalVisible] = useState(false);
  const [driver, setDriver] = useState({
    username: 'name',
    email: 'email',
    car: {
      car_brand: 'car_brand',
      car_plate: 'car_plate',
      car_color: 'car_color',
      car_photo: 'https://firebasestorage.googleapis.com/v0/b/carent-e9bfe.appspot.com/o/images%2Ff5cd82cd-0e12-4160-b5d9-0bb4d8a704f6?alt=media&token=5ce844c0-a08a-416c-a571-4f050db413a9',
    },
    rating: 0,
  });
  const btnRef = useRef();




  async function GetDriverInfo(requestData) {
    try {
          console.log('requestData',requestData);
          //find driver info
          const useremail = requestData.driver.email;
          const driversnapshot = await firestore()
            .collection("Car_of_driver")
            .where("email", "==", useremail)
            .get();
          const fetchedData = driversnapshot.docs.map((doc) => doc.data())[0];
          console.log('fetchedData',fetchedData);

           // find rating
           var totalRate = 0;
           var numOfRate = 0;
           const ratingSnapshot = await firestore()
             .collection("rating")
             .where("driver_email", "==", 'email')
             .get();
           ratingSnapshot.forEach((doc) => {
             totalRate += doc.data().rate;
             numOfRate++;
 
           });
 
           var aveRate = totalRate / numOfRate;

          setDriver({
            username: requestData.driver.username ,
            email:requestData.driver.email,
            car:{
              car_brand:fetchedData.car_brand,
              car_plate:fetchedData.car_plate_number,
              car_color:fetchedData.car_color,
              car_photo:fetchedData.photoURL,
            },
            rating:aveRate,
          });


         
       
         
    } catch (error) {
      console.log("Error fetching user data: ", error);
      return { error: "Error fetching user data" };
    }

  };



  //when driver click arrived it will change the request and create popup for user
  function WaitingDriverReach() {
    //only one request for a user in the same time
    const ridesRef = database().ref('rides').orderByChild("passenger/email").equalTo(auth().currentUser.email).limitToFirst(1);
    ridesRef.off("value");

    ridesRef.on("value", (snapshot) => {
      //put each value into firstRef
      snapshot.forEach(function (item) {
        var request = item.val();

        //check whether driver is arrived
        if (request.status === "arrived") {
          console.log("arrived");
          btnRef.current.props.onPress();


          //check whether ride is done
        } else if (request.status === "done") {
          console.log("ride done");
          setmodalVisible(!modalVisible);
        }
      });

    });


  }

  function onStarRatingPress(rating) {

    setStar(rating);
  }

  function submitRating() {
    var ratingData = {
      customer_email: auth().currentUser.email,
      driver_email: driver.email,
      rate: star,
    }
    const snapshot = firestore().collection('rating').add(ratingData)
      .then((docRef) => {
        console.log('Document written with ID: ', docRef.id);
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });

  }

  function deleteRequest(key) {
    const rideRef = database().ref(`rides`).child(key);
    rideRef.remove()
  .then(() => console.log('Data deleted successfully'))
  .catch(error => console.error(error));
    // rideRef.get().then((doc) => {
    //   if (doc.exists) {
    //     rideRef.delete().then(() => {
    //       console.log("Document successfully deleted!");
    //     }).catch((error) => {
    //       console.error("Error deleting document: ", error);
    //     });
    //   } else {
    //     console.log("Document does not exist");
    //   }
    // }).catch((error) => {
    //   console.log(error);
    // });
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
    console.log("requestkey:",requestkey);

    const rideRef = database().ref(`rides`).child(requestkey);
    rideRef.once('value', (snapshot) => {
      const requestData = snapshot.val();  
      GetDriverInfo(requestData);
    });
    
    WaitingDriverReach();

  }, [navigation])




  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/backgroundImage.png')}
        style={{ flex: 1, width: '100%', height: '100%', resizeMode: 'cover' }}>
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
              <StarRating
                disabled={false}
                maxStars={5}
                rating={star}
                selectedStar={(rating) => onStarRatingPress(rating)}
                fullStarColor={'yellow'}
              />
              <Button
                title="Submit"
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  submitRating();
                  console.log('requestkey',requestkey);
                  deleteRequest(requestkey);
                  navigation.replace('CustomerHomeMap');
                  setmodalVisible(!modalVisible);
                 
                }} />



            </View>
          </View>
        </Modal>


        <View style={styles.topCard}>
          <Ionicons
            name="call"
            size={30}
            style={{top: 70,left:50}}
          />
          <View style={styles.circleWrapper}>
            
            <View style={styles.circle} >
              <Image style={{ width: '100%', height: '100%' }} source={{ uri: driver.car.car_photo }} />
            </View>

          </View>
          <MIcon
            name="android-messages"
            size={30}
            style={{top: 70,right:50}}
          />

        </View>


        <View style={styles.bottomCard}>
          <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.showText}>{driver.username}</Text>
            <Ionicons
              name="md-star-sharp"
              size={30}
              color={'yellow'}
            />
            <Text style={styles.showText}>{driver.rating}</Text>
          </View>
          <View style={styles.lineStyle} />
          <Text style={styles.showText}>{driver.car.car_plate}</Text>
          <Text style={styles.showText}>{driver.car.car_brand}</Text>
          <Text style={styles.showText}>{`(${driver.car.car_color})`}</Text>
          {/* <CustomBtn
          btnText="Cancel Booking"
          onPress={() => { navigation.getParent()?.setOptions({tabBarStyle: {display: 'flex'}});navigation.navigate('CustomerHomeMap');
         }}
          
      />
      */}


        </View>
      </ImageBackground>
    </View>
  );
};

export default WaitingPickup;

const styles = StyleSheet.create({
  topCard: {
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    justifyContent: 'space-between',
  },
  showText: {
    fontSize: 26,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  circleWrapper: {

    justifyContent: 'center',
    alignItems: 'center',

  },
  circle: {

    top: 50,
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
    overflow: 'hidden',
  },
  lineStyle: {
    backgroundColor: '#A2A2A2',
    height: 2,
    width: '100%',
    marginBottom: 20,
    marginTop: 10,
  },

  bottomCard: {
    flex: 1,
    backgroundColor: 'white',
    width: '100%',
    zIndex: 2,
    paddingTop: 70,
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