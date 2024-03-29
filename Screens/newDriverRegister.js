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
  ImageBackground
} from "react-native";

import auth from "@react-native-firebase/auth";
import CustomBtn from '../Components/CustomBtn';
const NewDriverRegister = ({ navigation }) => {
  const [user, setUser] = useState();

  

  return (
    <ImageBackground 
    source={require('../assets/backgroundImage.png')} 
    style={{ flex: 1, width: '100%', height: '100%', resizeMode: 'cover' }}>
    <View style={{ alignItems: 'center', justifyContent: 'center',flex:1}}>
       <CustomBtn
          btnText="Become Driver"
          onPress={() => navigation.replace('BecomeDriver')}
          
      />
        <Text>
        {'\n'}
      </Text>
        <CustomBtn
          btnText="Back To Home"
          onPress={() => navigation.replace('Home')}
          
      />
    </View>
    </ImageBackground>
  );
};

export default NewDriverRegister;

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