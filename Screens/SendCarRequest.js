

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
    const {customerPosition,destination}= route.params;
    
    
    
    useEffect(() => {
      
        fetchData()
       
      }, [])

      
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
          requestRide(fetchedData, customerPosition, destination);
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
            status: 'available',
          
          },
          pickupLocation: pickupLocation,
          dropoffLocation: dropoffLocation,
          status: 'requested'
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
              navigation.goBack();
            }, 20000);
        
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
          <Text>Finding Driver ...</Text>
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