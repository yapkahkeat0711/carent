

// Import React and Component
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";


import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';       
      
const SendCarRequest = ({ route,navigation }) => {
    const ridesRef = database().ref('rides');
    const {customerPosition,destination,fee}= route.params;
   
    
    
    useEffect(() => {
      
      const unsubscribe = navigation.addListener('focus', () => {
        // Show the bottom tab bar when the screen comes into focus
        navigation.getParent()?.setOptions({tabBarStyle: {display: 'none'}});
      });
  
      const subscribe = navigation.addListener('blur', () => {
        // Hide the bottom tab bar when the screen loses focus
        navigation.getParent()?.setOptions({tabBarStyle: {display: 'flex'}});
      });
      fetchData();
      // Cleanup the listeners when the component unmounts
      return () => {
        unsubscribe();
        subscribe();
      };
        
       
      }, [navigation]);

      
      async function fetchData () {
        try {
          const useremail =  auth().currentUser.email;
          console.log(useremail);
          const snapshot = await firestore()
            .collection("User")
            .where("email", "==", useremail)
            .get();
          const fetchedData = snapshot.docs.map((doc) => doc.data())[0];
          console.log("from getData:", fetchedData);
          requestRide(fetchedData, customerPosition, destination)
          .then((result) => {
            // Do something with the result
          })
          .catch((error) => {
            console.log("Promise rejected:", error);
            navigation.goBack();
          });
      } catch (error) {
          console.log("Error fetching user data: ", error);
      }
        
      };
      function requestRide( user,pickupLocation, dropoffLocation) {
        // Add a new ride to the database
        const newRideRef = ridesRef.push({
          
          passenger: {
            username: user.name, // Replace with actual passenger username
            email: user.email
          },
          driver: {
            username: '' ,
            email:'',  
          },
          pickupLocation: pickupLocation,
          dropoffLocation: dropoffLocation,
          status: 'requested',
          fee:fee,
        });
        console.log('Request created');

        return new Promise((resolve, reject) => {
            // Set a timeout of 20 seconds
            const timeout = setTimeout(() => {
              // Remove the ride reference from the database
              newRideRef.off("value");
              newRideRef
                .remove()
                .then(() => {
                  console.log("Ride request deleted successfully");
                  reject(new Error("Request timed out"));
                })
                .catch((error) => reject(error));
             
            }, 15000);
            
            // Listen for changes to the new ride request
            newRideRef.on("value", (snapshot) => {
              const ride = snapshot.val();
              if (ride.status === "accepted") {
                // The ride request has been accepted by a driver
                console.log("Ride accepted:", ride);
                // Clear the timeout and resolve the promise with the new ride reference
                clearTimeout(timeout);
                newRideRef.off("value");
                navigation.replace('WaitingPickup');
              } else {
                // Ride has not been accepted yet
              }
            });
          });
      
     

      }
    return (
        <View style={styles.container}>
          <Text style={{textAlign:'center',fontSize:30}}>Finding Driver ...</Text>
            <ActivityIndicator size="large"/>
            
        </View>
        
    );
};

export default SendCarRequest;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
      },
});