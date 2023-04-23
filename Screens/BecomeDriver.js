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
  Button,
  Image,
  PermissionsAndroid,
  TextInput,
  ImageBackground
} from "react-native";
import { launchImageLibrary } from 'react-native-image-picker';
import auth from "@react-native-firebase/auth";
import CustomBtn from '../Components/CustomBtn';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

const BecomeDriver = ({ navigation }) => {
  const [imageuri,setimageuri]=useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [car_brand, setCarBrand] = useState(null);
  const [car_color, setCarColor] = useState(null);
  const [car_plate_number, setCarPlate] = useState(null);

  
  const handleSelectImage = async() => {
    try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to your storage to select photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied!', 'You need to give storage permission to select photos.');
          return;
        }
        launchImageLibrary({ mediaType: 'photo' }, response => {
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else {
              const source = {uri:response.assets[0].uri};
              setSelectedImage(source); 
              setimageuri(response.assets[0].uri);     
            }
          });
      } catch (err) {
        console.warn(err);
      }
    
  };
  const uploadImage = async uri => {
    
    try {
    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
            title: 'Storage Permission',
            message: 'App needs access to your storage to upload photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
        },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission Denied!', 'You need to give storage permission to upload photos.');
        return;
        }
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = storage().ref().child(`images/${uuid.v4()}`);
    await ref.put(blob);
    const url = await ref.getDownloadURL();
    return url;
   

} catch (error) {
    console.error(error);
  }
  };

  async function saveData() {
    if (!car_brand) return alert("Please fill Car Brand");
    if (!car_color) return alert("Please fill Car Plate Number");
    if (!car_plate_number) return alert("Please fill Car Color");
    if (!selectedImage) return alert("Please insert Image");
    const currentUser = auth().currentUser;
    const querySnapshot = await firestore().collection('Car_of_driver').where('email', '==', currentUser.email).get();
    const storageurl = await uploadImage(imageuri);
    const newData = { photoURL:storageurl ,
        car_brand:car_brand,
        car_plate_number:car_plate_number,
        car_color:car_color,
        email:auth().currentUser.email };
    
    if (querySnapshot.empty) {
        //add new data in car of driver
        const snapshot = await firestore().collection('Car_of_driver').add(newData)
        .then((docRef) => {
            console.log('Document written with ID: ', docRef.id);
          })
          .catch((error) => {
            console.error('Error adding document: ', error);
          });

          //update isDriver to 1
          const userRef = firestore().collection("User").where('email', '==', currentUser.email);
          const userSnapshot = await userRef.get();
          const userDoc = userSnapshot.docs[0];
          await userDoc.ref.update({
            isDriver: 1,
          });
    } 
    alert('Regiter Succesfully');
    navigation.replace("DriverPage");
    
  }
  return (
    <View style={{ flex:1}}>
       <ImageBackground 
    source={require('../assets/backgroundImage.png')} 
    style={{ flex: 1, width: '100%', height: '100%', resizeMode: 'cover' }}>
   <View style={{ flex:0.5,alignItems: 'center'}}>
   {selectedImage && (
        <View>
        <Image source={selectedImage} style={{ width: 200, height: 200 }} />
        
           <CustomBtn
        btnText="change image"
        onPress={handleSelectImage} 
        />
        </View>
       
      )}
   {!selectedImage && (
            <CustomBtn
            btnText="add image"
            onPress={handleSelectImage}
            btnStyle={{ width: 200, height: 200 }}
            
        />
       
      )}
      
    </View>
    <View style={{ flex:0.4}}>
    <Text>
        Car Brand
    </Text>
    <TextInput
        onChangeText={(text) => {
            setCarBrand(text);
          }}
        value={car_brand}
        placeholder="Enter car brand here..."
      />
      <View style={{ borderBottomWidth: 0.8, borderBottomColor: 'gray' }} />
      <Text>
        Car Plate Number
    </Text>
    <TextInput
        onChangeText={(text) => {
            setCarPlate(text);
          }}
        value={car_plate_number}
        placeholder="Enter car brand here..."
      />
      <View style={{ borderBottomWidth: 0.8, borderBottomColor: 'gray' }} />
      <Text>
        Car Color
    </Text>
    <TextInput
        onChangeText={(text) => {
            setCarColor(text);
          }}
        value={car_color}
        placeholder="Enter car brand here..."
      />
      <View style={{ borderBottomWidth: 0.8, borderBottomColor: 'gray' }} />
    </View>
    <View style={{ alignItems: 'center', flex:0.1}}>
    <CustomBtn
          btnText="+ ADD"
          onPress={saveData}
          
      />
    </View>
    </ImageBackground>
  </View>
  );
};

export default BecomeDriver;

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