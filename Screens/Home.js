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
  ImageBackground,
  Image
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
      
      <ImageBackground 
    source={require('../assets/backgroundImage.png')} 
    style={{ flex: 1, width: '100%', height: '100%', resizeMode: 'cover' }}>
      
      <View style={{ flex: 1, padding: 16 }}>
      
      <View style={styles.welcomeWord}>
      {user ? (
            <Text  style={{ fontWeight: 'bold', fontSize: 25 }}>
              WELCOME !
             
            </Text>
          ) : null}
      {user ? (
            <Text  style={{ fontWeight: 'bold', fontSize: 30 }}>
            
              {user.displayName
                ? user.displayName
                : user.email}
                {'\n'}
            </Text>
          ) : null}
        
          {user ? (
            <Text  style={{ fontSize: 15,opacity:0.7 }}>
              WHAT DO YOU WANT TO DO ?
             
            </Text>
          ) : null}
        </View>

        
        <View
         style={styles.horizontalView}
        >
        
          <View style={styles.Row}>
         
        
          <TouchableOpacity
            style={styles.clickButton}
            activeOpacity={0.5}
            onPress={() =>
                navigation.replace("Customer")
              }
          >
              <View style={{flex: 4}}>
              <Image source={require('../assets/customer_view.png')} style={{width: '100%', height: '100%', resizeMode: 'cover'}}/>
            </View>
            <View style={{flex: 2}}>
              <Text style={styles.buttonTextStyle}>
                To Customer View
              </Text>
            </View>
          </TouchableOpacity>
          <View style={{width:"5%"}}></View>

         
          <TouchableOpacity
            style={styles.clickButton}
            activeOpacity={0.5}
            onPress={() =>
                navigation.replace("Driver")
              }
          >
             <View style={{flex: 4}}>
              <Image source={require('../assets/driver_view.png')} style={{width: '100%', height: '120%', resizeMode: 'cover'}}/>
            </View>
            <View style={{flex: 2}}>
            <Text style={styles.buttonTextStyle}>
              To Driver View
            </Text>
            </View>
          </TouchableOpacity>
          </View>
         
          <View style={styles.Row}>
         
          <TouchableOpacity
            style={styles.clickButton}
            activeOpacity={0.5}
            onPress={() =>
                navigation.replace("CarMarketplace")
              }
          >
             <View style={{flex: 4}}>
              <Image source={require('../assets/car_view.png')} style={{width: '100%', height: '100%', resizeMode: 'cover'}}/>
            </View>
            <View style={{flex: 2}}>
            <Text style={styles.buttonTextStyle}>
              To Car View
            </Text>
            </View>
          </TouchableOpacity>
          <View style={{width:"5%"}}></View>
          <TouchableOpacity
            style={styles.clickButton}
            activeOpacity={0.5}
            onPress={logout}
          >
             <View style={{flex: 4}}>
              <Image source={require('../assets/logout.png')} style={{width: '100%', height: '100%', resizeMode: 'cover'}}/>
            </View>
            <View style={{flex: 2}}>
            <Text style={styles.buttonTextStyle}>
              Logout
            </Text>
            </View>
          </TouchableOpacity>
          </View>
        </View>
        
      </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  welcomeWord:{
    top:70,

  },
  horizontalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  Row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
   
  },
  buttonTextStyle: {
    color: "#000",
    paddingVertical: 10,
    fontSize: 16,
    textAlign: 'center',
   
  },
  clickButton: {
    flexDirection: "column",
    display: 'flex',
    justifyContent: 'center',
    width: "40%",
    height:"70%",
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
    opacity:0.8,
   
  }

});

