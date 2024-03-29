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
  FlatList,
  Image,
  ImageBackground,
} from "react-native";

import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';       

import CustomBtn from '../Components/CustomBtn';
import Ionicons from 'react-native-vector-icons/Ionicons';
const MyCarHistory = ({ navigation }) => {
 const [listofCar, setlistofCar]= useState();
 

  async function fetchData () {
    try {
      const useremail =  auth().currentUser.email;
      console.log(useremail);
      const snapshot = await firestore()
        .collection("Car_for_rent")
        .where("email", "==", useremail)
        .get();
        const fetchedData = snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
      console.log("from getData:", fetchedData);
      setlistofCar(fetchedData);
     
  } catch (error) {
      console.log("Error fetching user data: ", error);
  }
    
  };


 
  useEffect(() => {
      
    const unsubscribe = navigation.addListener('focus', () => {
      // Show the bottom tab bar when the screen comes into focus
      navigation.getParent()?.setOptions({tabBarStyle: {display: 'flex'}});
      fetchData();
    });

    const subscribe = navigation.addListener('blur', () => {
      // Hide the bottom tab bar when the screen loses focus
      navigation.getParent()?.setOptions({tabBarStyle: {display: 'none'}});
    });
    
    // Cleanup the listeners when the component unmounts
    return () => {
      unsubscribe();
      subscribe();
    };
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground 
    source={require('../assets/backgroundImage.png')} 
    style={{ flex: 1, width: '100%', height: '100%', resizeMode: 'cover' }}>


        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style={{fontWeight:'bold',fontSize:36}}>MY CARS</Text>    
            <TouchableOpacity  onPress={() => navigation.navigate("AddRentCar")}>
            <Ionicons 
                    name="md-add-circle-outline"
                    size={70}
                    
                />
            </TouchableOpacity>
              
          </View>
          


        <FlatList
        data={listofCar}
        keyExtractor={item => item.id}
        renderItem={({ item: car }) => 
        <View  style={{flex:1,alignContent:'center',alignItems:'center',paddingBottom:40}}>
          
           
            <TouchableOpacity onPress={() => navigation.navigate('EditRentCar',{car_id:car.id})} style={{flex:1,alignContent:'center',alignItems:'center',backgroundColor:'white',width:'80%',borderRadius:10}}  
              >
                <Image  
                style={{width:'80%',height:250,margin:5,zIndex:1}}
                source={{ uri: car.photoURL }}
              />
              
                    <Text>{car.car_brand}</Text>
                    <Text style={styles.itemPrice}>Price: {car.price}/day</Text>
            </TouchableOpacity>  
                
            
        </View>
        
      }
      
      />
 </ImageBackground>
    </SafeAreaView>
  );
};

export default MyCarHistory;

const styles = StyleSheet.create({
  itemPrice:{
    fontSize:16,
    padding:10
  }
  
});