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
  ImageBackground,
  Image,
  TextInput,
  DatePickerAndroid,
  Button 
} from "react-native";

import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';  
import DatePicker from 'react-native-date-picker'
import CustomBtn from '../Components/CustomBtn';
import { format } from "date-fns";

const CarDetail = ({ route,navigation }) => {
  const today = new Date();
  const tomorrow = new Date(today);  
  tomorrow.setDate(today.getDate() + 1);
  const {car_id}= route.params;
  const [car,setCar]=useState();
  const [fdate, setFDate] = useState(new Date(today));
  const [tdate, setTDate] = useState(new Date(tomorrow));
  const [fopen, setFOpen] = useState(false);
  const [topen, setTOpen] = useState(false);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  async function getCarDetail() {
    try {
      
      const snapshot = await firestore()
        .collection("Car_for_rent")
        .doc(car_id)
        .get();
      const fetchedData = snapshot.data();
      console.log("from getData:", fetchedData);
      setCar(fetchedData);
     
  } catch (error) {
      console.log("Error fetching user data: ", error);
  }
    
  };
  
  async function bookRentCar(){

    try {
      // const carRef = await firestore().collection('Car_for_rent').doc(car_id);
      // const rentalData = {
      //   car_id: firestore().doc(`Car_for_rent/${car_id}`),
        
      // };

      // await firestore()
      //   .collection('log_rented_car')
      //   .add(rentalData)
      //   .then((docRef) => {
      //     console.log('Document written with ID: ', docRef.id);
      //   })
      //   .catch((error) => {
      //     console.error('Error adding document: ', error);
      //   });

      //checking does the duration is available or not
      var available = true;
      const carRef = firestore().collection('Car_for_rent').doc(car_id);
      const snapshot = await firestore()
      .collection("log_rented_car")
      .where("car_id", "==", carRef)
      .get();
      
      snapshot.forEach((doc) => {
        
        const fetchedData = doc.data();
        
        if (
          (fdate.getTime() >= new Date(fetchedData.start_date).getTime() &&
           fdate.getTime() <= new Date(fetchedData.end_date).getTime()) ||
          (tdate.getTime() >= new Date(fetchedData.start_date).getTime() &&
           tdate.getTime() <= new Date(fetchedData.end_date).getTime()) || 
          (tdate.getTime() < fdate.getTime())
           
        ){      
          console.log('not available');
          available=false;
        } else {
          console.log('available');
          
        }

      
       
      });

      // if available then add data

      if(available){
       
        const data = {
          car_id:carRef,
          start_date: format(fdate, 'yyyy-MM-dd'),
          end_date:format(tdate, 'yyyy-MM-dd'),
          rented_by:auth().currentUser.email, 
        };

        const snapshot = await firestore()
        .collection("log_rented_car")
        .add(data)
        .then((docRef) => {
          console.log('Document written with ID: ', docRef.id);
          alert("Booking successfully made");
          navigation.navigate('ShowRentedCar');
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });

      }else{
        alert("Selected date is not available");
      }
      
     
  } catch (error) {
      console.log("Error fetching user data: ", error);
  }
       
      
  }
  useEffect(() => {
   
    const unsubscribe = navigation.addListener('focus', () => {
      // Show the bottom tab bar when the screen comes into focus
      navigation.getParent()?.setOptions({tabBarStyle: {display: 'none'}});
      getCarDetail();
    
    });

    const subscribe = navigation.addListener('blur', () => {
      // Hide the bottom tab bar when the screen loses focus
      navigation.getParent()?.setOptions({tabBarStyle: {display: 'flex'}});
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
      <View style={{ flex: 1, padding: 16 }}>
        { car && (
            <View style={{ flex: 1}}>
            <Text>{car.car_brand}</Text>
            <Text>{car.car_color}</Text>

            <View style={{alignContent:'center',alignItems:'center'}}>
            <Image  
                style={{width:'80%',height:250,margin:5,zIndex:1,}}
                source={{ uri: car.photoURL }}
              />
            </View>
           

             
              <Text>
                  From Date:
              </Text>
             
                <TouchableOpacity onPress={() => setFOpen(true)}>
                    <Text>{fdate.toLocaleDateString(undefined, options)}</Text>
                    
                    <View style={{ borderBottomWidth: 0.8, borderBottomColor: 'black' }} />
                  
                    <DatePicker
                      modal
                      mode="date"
                      open={fopen}
                      date={fdate}
                      onConfirm={(date) => {
                        setFOpen(false)
                        setFDate(date)
                      }}
                      onCancel={() => {
                        setFOpen(false)
                      }}
                    />
                </TouchableOpacity>
                    
              
              <Text>
                  To Date:
              </Text>
              <TouchableOpacity onPress={() => setTOpen(true)}>
                    <Text>{tdate.toLocaleDateString(undefined, options)}</Text>
                    
                    <View style={{ borderBottomWidth: 0.8, borderBottomColor: 'black' }} />
                  
                    <DatePicker
                      modal
                      mode="date"
                      open={topen}
                      date={tdate}
                      onConfirm={(date) => {
                        setTOpen(false)
                        setTDate(date)
                      }}
                      onCancel={() => {
                        setTOpen(false)
                      }}
                    />
                </TouchableOpacity>
              <Text>
                  Price:
              </Text>


              <View style={{flexDirection:'row'}}>
                  <Text>
                      MYR 
                  </Text>
                  <Text>
                      {car.price} 
                  </Text>
                  <Text>
                      /day
                  </Text>
              </View>
            </View>
        

        )}
         
         <View style={{flexDirection:'row',width:'100%'}}>
              <CustomBtn
                btnText="BOOK"
                btnStyle={{width:'50%'}}
                onPress={() =>
                  bookRentCar()}
                
                />
                
               
                
                <CustomBtn
                btnText="CANCEL"
                btnStyle={{width:'50%'}}
                onPress={() =>
                  navigation.navigate("CarHome")}
                
                />

         </View>
        
      
      </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default CarDetail;

const styles = StyleSheet.create({
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