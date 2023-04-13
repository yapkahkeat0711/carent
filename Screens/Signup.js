// #6 Email Authentication using Firebase Authentication in React Native App
// https://aboutreact.com/react-native-firebase-authentication/

// Import React and Component
import React, { useState, createRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  ImageBackground
} from "react-native";
import CustomBtn from '../Components/CustomBtn';
import firestore from '@react-native-firebase/firestore';
import auth from "@react-native-firebase/auth";
import InteractiveTextInput from "react-native-text-input-interactive";

const SignUp = ({ navigation }) => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [errortext, setErrortext] = useState("");

  const emailInputRef = createRef();
  const passwordInputRef = createRef();


  async function saveData(name,email) {
    try {
      const snapshot = await firestore()
        .collection("User")
        .add({
            name: name,
            email: email,
            isDriver:0,
              })
        .then((docRef) => {
          console.log('Document written with ID: ', docRef.id);
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });
    
  } catch (error) {
      console.log("Error saving user data: ", error);
  }
    
  };

  const handleSubmitButton = () => {
    setErrortext("");
    if (!userName) return alert("Please fill Name");
    if (!userEmail) return alert("Please fill Email");
    if (!userPassword) return alert("Please fill Address");

    auth()
      .createUserWithEmailAndPassword(
        userEmail,
        userPassword
      )
      .then((user) => {
        saveData(userName,userEmail.toLowerCase());
        alert(
          "Registration Successful. Please Login to proceed"
        );
        console.log(user);
        if (user) {
          auth()
            .currentUser.updateProfile({
              displayName: userName,
              photoURL:
                "https://aboutreact.com/profile.png",
            })
            .then(() => navigation.replace("Login"))
            .catch((error) => {
              alert(error);
              console.error(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.code === "auth/email-already-in-use") {
          setErrortext(
            "That email address is already in use!"
          );
        } else {
          setErrortext(error.message);
        }
      });
  };

  return (
    <SafeAreaView
      style={styles.mainBody}
    >
       <ImageBackground 
    source={require('../assets/backgroundImage.png')} 
    style={{ flex: 1, width: '100%', height: '100%', resizeMode: 'cover' }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <View >
          
        </View>
        <KeyboardAvoidingView enabled>
          <View style={styles.sectionStyle}>
            <InteractiveTextInput
            onChangeText={(UserName) =>
              setUserName(UserName)
            }
            underlineColorAndroid="#f000"
            placeholder="Enter Name"
            placeholderTextColor="#8b9cb5"
            autoCapitalize="sentences"
            returnKeyType="next"
            onSubmitEditing={() =>
              emailInputRef.current &&
              emailInputRef.current.focus()
            }
            blurOnSubmit={false}
            />
          
          </View>
          <View style={styles.sectionStyle}>
            <InteractiveTextInput
             onChangeText={(UserEmail) =>
              setUserEmail(UserEmail)
            }
            underlineColorAndroid="#f000"
            placeholder="Enter Email"
            placeholderTextColor="#8b9cb5"
            keyboardType="email-address"
            ref={emailInputRef}
            returnKeyType="next"
            onSubmitEditing={() =>
              passwordInputRef.current &&
              passwordInputRef.current.focus()
            }
            blurOnSubmit={false}
            />
           
          </View>
          <View style={styles.sectionStyle}>
            <InteractiveTextInput
             onChangeText={(UserPassword) =>
              setUserPassword(UserPassword)
            }
            underlineColorAndroid="#f000"
            placeholder="Enter Password"
            placeholderTextColor="#8b9cb5"
            ref={passwordInputRef}
            returnKeyType="next"
            secureTextEntry={true}
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit={false}
            />
           
          </View>
          {errortext != "" ? (
            <Text style={styles.errorTextStyle}>
              {" "}
              {errortext}{" "}
            </Text>
          ) : null}
            <View  style={{ alignItems: 'center'}}>
            <CustomBtn
          btnText="REGISTER"
          onPress={handleSubmitButton}    
          />
            </View>
         
       
          
        </KeyboardAvoidingView>
      </ScrollView>
      </ImageBackground>
     
    </SafeAreaView>
  );
};
export default SignUp;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  sectionStyle: {
    flexDirection: "row",
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
    justifyContent: "center",
    alignContent: "center",
  },
  buttonStyle: {
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
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: "white",
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#dadae8",
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
});