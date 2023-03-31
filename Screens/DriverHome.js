// #6 Email Authentication using Firebase Authentication in React Native App
// https://aboutreact.com/react-native-firebase-authentication/

// Import React and Component
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";


import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';  

const DriverHome = ({ navigation }) => {
  const [user, setUser] = useState();
  
  useEffect(() => {
    navigation.getParent()?.setOptions({tabBarStyle: {display: 'flex'}});
    const useremail =  auth().currentUser.email;
    console.log(useremail);
    
    const fetchData = async () => {
      const snapshot = await firestore()
        .collection("User")
        .where("email", "==", useremail)
        .get();
  
      snapshot.forEach((doc) => {
        const fetchedData = doc.data();
        if (fetchedData.isDriver === 0) {
        
          navigation.replace("NewDriverRegister");
        } else {
         
          navigation.replace("DriverPage");
        }
      });
    };
  
    fetchData();
  }, [navigation]);

}

export default DriverHome;

