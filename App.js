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

import CustomerHomeMap from "./Screens/CustomerHome";
import CustomerHomeSelectDes from "./Screens/CustomerHomeSelectDes";
import CustomerProfile from "./Screens/CustomerProfile";
import CustomerCheckFee from "./Screens/CustomerCheckFee";

import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createStackNavigator ();
const Tab = createBottomTabNavigator();

function CustomerHomeStack(){
  return(
 
  <Stack.Navigator initialRouteName={'CustomerHomeMap'}>
  <Stack.Screen
     name="CustomerHomeMap"
     component={CustomerHomeMap}
     
   ></Stack.Screen>
   <Stack.Screen
     name="CustomerHomeSelectDes"
     component={CustomerHomeSelectDes}
     
   ></Stack.Screen>
   <Stack.Screen
     name="CustomerCheckFee"
     component={CustomerCheckFee}
     
   ></Stack.Screen>
 </Stack.Navigator>
  );
}
function CustomerBottomTab(){
  return(
 
           <Tab.Navigator initialRouteName={'customerHomeStack'} 
           screenOptions={({ route }) => ({
            tabBarIcon: ({ focused,color, size }) => {
              let iconName;
    
              if (route.name === 'customerHomeStack') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'customerProfile') {
                iconName = focused ? 'person-circle' : 'person-circle-outline';
              }
    
              return <Ionicons name={iconName} size={size} color={color} />;
            },
    })}
    >
            <Tab.Screen name="customerHomeStack" component={CustomerHomeStack}  />
          
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
