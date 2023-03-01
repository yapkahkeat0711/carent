// import React, {Component} from "react";
// import { Text, View, StyleSheet, TextInput,TouchableOpacity } from "react-native";
// import firestore from '@react-native-firebase/firestore';


// export default class App extends Component<Props>{
//     constructor(props){
//         super(props);
//         this.state={
//           x: '0',
//           y: '0',
//           sum: '0',
//           diff: '0',
//           prod: '0'
//         };
//         this._save = this._save.bind(this); 
//         this._read = this._read.bind(this); 
//       }
     
//     _save(){
//     firestore()
//     .collection('User')
//     .doc('2')
//     .set({
//         name: 'Utkarsha',
//         city: 'Ajax',
//     })
//     .then(() => {
//         console.log('User added!');
//     });
//     }

//     _read(){
//         firestore()
//         .collection('User')
//         .doc('1')
//         .get()
//         .then(documentSnapshot => {
//           console.log('User exists: ', documentSnapshot.exists);
//         data= documentSnapshot.data();
//           if (documentSnapshot.exists) {
//             console.log('User data: ', data.Name);
//           }
//         });
//         }

//     render(){
//         return(
           
          
            
//         );
//     }

// }
import React, {Component} from "react";
import {Text, StyleSheet,View} from  "react-native";
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Login from "./Screens/Login";
import SignUp from "./Screens/Signup";
import Home from "./Screens/Home";
import Splash from "./Screens/Splash";

import CustomerHome from "./Screens/CustomerHome";
import CustomerProfile from "./Screens/CustomerProfile";

import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createStackNavigator ();
const Tab = createBottomTabNavigator();
function CustomerBottomTab(){
  return(
 
           <Tab.Navigator initialRouteName={'customerHome'} 
           screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName='people';
    
              if (route.name === 'customerHome') {
                iconName = 'people';
              } else if (route.name === 'customerProfile') {
                iconName = 'people';
              }
    
              return <Ionicons name={iconName} size={size} color={color} />;
            },
    })}
    >
            <Tab.Screen name="customerHome" component={CustomerHome}  />
          
            <Tab.Screen name="customerProfile" component={CustomerProfile} />
        
        </Tab.Navigator>

      
  );
}
export default class App extends Component{

  render(){
    return(
      
      
      <NavigationContainer>
         <Stack.Navigator initialRouteName={'Splash'}>
         <Stack.Screen
            name="Splash"
            component={Splash}
            
          ></Stack.Screen>
          <Stack.Screen
            name="Home"
            component={Home}
            
          ></Stack.Screen>
          <Stack.Screen
            name="Login"
            component={Login}
           
          ></Stack.Screen>
         <Stack.Screen
            name="SignUp"
            component={SignUp}
           
          ></Stack.Screen>
          <Stack.Screen
            name="Customer"
            component={CustomerBottomTab}
            options={{headerShown: false}}
          ></Stack.Screen>
        </Stack.Navigator>

      </NavigationContainer>
     
    );
  }
}
