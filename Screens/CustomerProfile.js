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
import CustomBtn from "../Components/CustomBtn";
import firestore from '@react-native-firebase/firestore';



const CustomerProfile = ({ navigation }) => {
  const [user, setUser] = useState();
  const [driver, setDriver] = useState(false);


  async function checkDriver() {
    try {

      const snapshot = await firestore()
        .collection("User")
        .where("email", "==", auth().currentUser.email)
        .get();
      const fetchedData = snapshot.docs.map((doc) => doc.data())[0];
      setUser(fetchedData);
      if (fetchedData.isDriver === 1) {
        setDriver(true);
      }
      console.log(fetchedData);

    } catch (error) {
      console.log("Error fetching user data: ", error);
      return { error: "Error fetching user data" };
    }

  };


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Show the bottom tab bar when the screen comes into focus
      navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex' } });
      checkDriver();
    });

    const subscribe = navigation.addListener('blur', () => {
      // Hide the bottom tab bar when the screen loses focus
      navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });


    });



    return () => {

      unsubscribe();
      subscribe();

    };
  }, [navigation]);

  const logout = () => {
    Alert.alert(
      "Logout",
      "Are you sure? You want to logout?",
      [
        {
          text: "Cancel",
          onPress: () => {
            return null;
          },
        },
        {
          text: "Confirm",
          onPress: () => {
            auth()
              .signOut()
              .then(() => navigation.replace("Login"))
              .catch((error) => {
                console.log(error);
                if (error.code === "auth/no-current-user")
                  navigation.replace("Login");
                else alert(error);
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/backgroundImage.png')}
        style={{ flex: 1, width: '100%', height: '100%', resizeMode: 'cover' }}>
        <View style={{ flex: 1, padding: 16 }}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >

            {user ? (
              <Text>
                Welcome{" "}
                {user.displayName
                  ? user.displayName
                  : user.email}
              </Text>
            ) : null}



            <CustomBtn
              btnText="Logout"
              onPress={logout}
            />

            <Text>
              {'\n'}
            </Text>

            <CustomBtn
              btnText="Back To Home"
              onPress={() =>
                navigation.navigate("Home")
              }
            />

            {driver ?
              (
                <View>
                  <Text>
                    {'\n'}
                  </Text>

                  <CustomBtn
                    btnText="Edit Your Car"
                    onPress={() =>
                      navigation.navigate("DriverEditCar")
                    }
                  />
                </View>
              ) : null}
          </View>


        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default CustomerProfile;

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