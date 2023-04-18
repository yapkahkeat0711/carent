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
import SendCarRequest from "./Screens/SendCarRequest";
import WaitingPickup from "./Screens/WaitingPickup";

import DriverHome from "./Screens/DriverHome";
import NewDriverRegister from "./Screens/newDriverRegister";
import DriverPage from "./Screens/DriverPage";
import BecomeDriver from "./Screens/BecomeDriver";
import DriverPickupPage from "./Screens/DriverPickupPage";

import CarHome from "./Screens/CarHome";
import AddRentCar from "./Screens/add_rent_car";
import CarDetail from "./Screens/car_detail";
import MyCarHistory from "./Screens/MyCarHistory";

import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createStackNavigator ();
const Tab = createBottomTabNavigator();

function CustomerHomeStack(){
  return(
 
  <Stack.Navigator initialRouteName={'CustomerHomeMap'}>
  <Stack.Screen
     name="CustomerHomeMap"
     component={CustomerHomeMap}
     options={{headerShown: false}}
   ></Stack.Screen>
   <Stack.Screen
     name="CustomerHomeSelectDes"
     component={CustomerHomeSelectDes}
     options={{headerShown: false}}
   ></Stack.Screen>
   <Stack.Screen
     name="CustomerCheckFee"
     component={CustomerCheckFee}
     options={{headerShown: false}}
   ></Stack.Screen>
   <Stack.Screen
     name="SendCarRequest"
     component={SendCarRequest}
     options={{headerShown: false}}
   ></Stack.Screen>
   <Stack.Screen
     name="WaitingPickup"
     component={WaitingPickup}
     options={{
      headerLeft: () => <></>,
    }}
   ></Stack.Screen>
 </Stack.Navigator>
  );
}


function DriverHomeStack(){
  return(
 
    <Stack.Navigator initialRouteName={'DriverHome'}>
    <Stack.Screen
       name="DriverHome"
       component={DriverHome}
       options={{headerShown:false}}
     ></Stack.Screen>
     
     <Stack.Screen
       name="NewDriverRegister"
       component={NewDriverRegister}
       options={{
        headerShown:false,
        headerLeft: () => <></>,
      }}
     ></Stack.Screen>

      <Stack.Screen
       name="BecomeDriver"
       component={BecomeDriver}
       options={{headerShown:false}}
     ></Stack.Screen>
    <Stack.Screen
       name="DriverPage"
       component={DriverPage}
       options={{
        headerShown:false,
        headerLeft: () => <></>,
      }}
     ></Stack.Screen>
     <Stack.Screen
       name="DriverPickupPage"
       component={DriverPickupPage}
       options={{
        headerShown:false,
        headerLeft: () => <></>,
      }}
     ></Stack.Screen>
   </Stack.Navigator>
    );

}

function CarHomeStack(){
  return(
 
    <Stack.Navigator initialRouteName={'CarHome'}>
    <Stack.Screen
       name="CarHome"
       component={CarHome}
       options={{
        headerShown:false,
        headerLeft: () => <></>,
      }}
     ></Stack.Screen>
      <Stack.Screen
       name="CarDetail"
       component={CarDetail}
       options={{
        headerShown:false,
        headerLeft: () => <></>,
      }}
     ></Stack.Screen>
     
     

   
   </Stack.Navigator>
    );
}


function MyCarHistoryStack(){
  return(
 
    <Stack.Navigator initialRouteName={'MyCarHistory'}>
    <Stack.Screen
       name="MyCarHistory"
       component={MyCarHistory}
       options={{
        headerShown:false,
        headerLeft: () => <></>,
      }}
     ></Stack.Screen>
      <Stack.Screen
       name="AddRentCar"
       component={AddRentCar}
       options={{
        headerShown:false,
        headerLeft: () => <></>,
      }}
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
                iconName = focused ? 'home-sharp' : 'home-outline';
              } else if (route.name === 'customerProfile') {
                iconName = focused ? 'person-circle' : 'person-circle-outline';
              }
    
              return <Ionicons name={iconName} size={size} color={color} />;
            },
    })}
    >
            <Tab.Screen name="customerHomeStack" component={CustomerHomeStack}    options={{headerShown: false}}/>
          
            <Tab.Screen name="customerProfile" component={CustomerProfile}   options={{headerShown: false}}/>
        
        </Tab.Navigator>

      
  );
}
function DriverBottomTab(){
  return (
    <Tab.Navigator initialRouteName={'driverHomeStack'} 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused,color, size }) => {
          let iconName;

          if (route.name === 'driverHomeStack') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'customerProfile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="driverHomeStack" component={DriverHomeStack}   options={{headerShown: false}} />
      <Tab.Screen name="customerProfile" component={CustomerProfile}   options={{headerShown: false}}/>
    </Tab.Navigator>
  );
}


function CarMarketplaceBottomTab(){
  return (
    <Tab.Navigator initialRouteName={'CarHomeStack'} 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused,color, size }) => {
          let iconName;

          if (route.name === 'CarHomeStack') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'customerProfile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }else if (route.name === 'myCarHistoryStack') {
            iconName = focused ? 'car-sport-sharp' : 'car-sport-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="CarHomeStack" component={CarHomeStack}  />
      <Tab.Screen name="myCarHistoryStack" component={MyCarHistoryStack}  />
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
            options={{headerShown: false}}
          ></Stack.Screen>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{headerShown: false}}
          ></Stack.Screen>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          ></Stack.Screen>
         <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{headerShown: false}}
          ></Stack.Screen>
          <Stack.Screen
            name="Customer"
            component={CustomerBottomTab}
            options={{headerShown: false}}
          ></Stack.Screen>
           <Stack.Screen
            name="Driver"
            component={DriverBottomTab}
            options={{headerShown:false}}
          ></Stack.Screen>
            <Stack.Screen
            name="CarMarketplace"
            component={CarMarketplaceBottomTab}
            options={{headerShown:false}}
          ></Stack.Screen>
        </Stack.Navigator>

      </NavigationContainer>
     
    );
  }
}
