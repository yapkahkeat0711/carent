// #6 Email Authentication using Firebase Authentication in React Native App
// https://aboutreact.com/react-native-firebase-authentication/

// Import React and Component
import {React, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

import auth from "@react-native-firebase/auth";

const Home = ({ navigation }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      console.log("user", JSON.stringify(user));
      setUser(user);
    });

    return subscriber;
  }, []);

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
      <View style={{ flex: 1, padding: 16 }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            Firebase Auth
          </Text>
          {user ? (
            <Text>
              Welcome{" "}
              {user.displayName
                ? user.displayName
                : user.email}
            </Text>
          ) : null}
          <TouchableOpacity
            style={styles.clickButton}
            activeOpacity={0.5}
            onPress={logout}
          >
            <Text style={styles.buttonTextStyle}>
              Logout
            </Text>
          </TouchableOpacity>
        
          <TouchableOpacity
            style={styles.clickButton}
            activeOpacity={0.5}
            onPress={() =>
                navigation.replace("Customer")
              }
          >
            <Text style={styles.buttonTextStyle}>
              To Customer View
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontSize: 18,
            textAlign: "center",
            color: "grey",
          }}
        >
          React Native Firebase Authentication
        </Text>
        <Text
          style={{
            fontSize: 16,
            textAlign: "center",
            color: "grey",
          }}
        >
          www.aboutreact.com
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  
  buttonTextStyle: {
    color: "#000",
    paddingVertical: 10,
    fontSize: 16,
    textAlign: 'center',
   
  },
  clickButton: {
    display: 'flex',
    justifyContent: 'center',
    width: 230,
    height: 54,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 8,
  }

});

