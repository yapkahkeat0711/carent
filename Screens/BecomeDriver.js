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
  TextInput
} from "react-native";
import { launchImageLibrary } from 'react-native-image-picker';
import auth from "@react-native-firebase/auth";
import CustomBtn from '../Components/CustomBtn';
import storage from '@react-native-firebase/storage';

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
              const source = { uri: response.assets[0].uri };
              setSelectedImage(source);
              uploadImage(source);
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
    // const response = await fetch(uri);
    // const blob = await response.blob();
    // const ref = firebase.storage().ref().child(`images`);
    // const metadata = {
    //     contentType: 'image/jpeg',
    //   };
    // await ref.put(blob,metadata);
    // const url = await ref.getDownloadURL();
   
    console.log(uri);
    // saveImageToFirestore(downloadURL);

} catch (error) {
    console.error(error);
  }
  };

//   const saveImageToFirestore = downloadURL => {
//     const currentUser = firebase.auth().currentUser;
  
//     firebase.firestore().collection('users').doc(currentUser.uid).set({
//       photoURL: downloadURL,
//     }, { merge: true });
//   };


  return (
    <View style={{ flex:1}}>
   <View style={{ flex:0.5,alignItems: 'center'}}>
   {selectedImage && (
        <Image source={selectedImage} style={{ width: 200, height: 200 }} />
      )}
   {!selectedImage && (
        <View style={{ width: 200, height: 200 }} />
      )}
     
    <CustomBtn
          btnText="add image"
        onPress={handleSelectImage}
          
      />
      
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
          onPress={() => navigation.replace('BecomeDriver')}
          
      />
    </View>
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