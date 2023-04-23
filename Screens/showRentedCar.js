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
    FlatList,
    Image,
    ImageBackground,
} from "react-native";

import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import CustomBtn from '../Components/CustomBtn';
import Ionicons from 'react-native-vector-icons/Ionicons';


const ShowRentedCar = ({ navigation }) => {
    const [listofCar, setlistofCar] = useState();


    async function fetchData() {
        try {
            const useremail = auth().currentUser.email;
            console.log(useremail);
            const snapshot = await firestore()
                .collection("log_rented_car")
                .where("rented_by", "==", useremail)
                .get();


            const promises = snapshot.docs.map(async (doc) => {
                const carRef = doc.data().car_id;
                const carSnapshot = await carRef.get();
                const carData = carSnapshot.data();
                console.log("Car data", carData);
                return { id: doc.id, ...doc.data(), ...carData };
            });

            const fetchedData = await Promise.all(promises);


            console.log('fetchedData', fetchedData);


            setlistofCar(fetchedData);

        } catch (error) {
            console.log("Error fetching user data: ", error);
        }

    };



    useEffect(() => {

        const unsubscribe = navigation.addListener('focus', () => {
            // Show the bottom tab bar when the screen comes into focus
            navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex' } });
            fetchData();
        });

        const subscribe = navigation.addListener('blur', () => {
            // Hide the bottom tab bar when the screen loses focus
            navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
        });

        // Cleanup the listeners when the component unmounts
        return () => {
            unsubscribe();
            subscribe();
        };
    }, [navigation]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground
                source={require('../assets/backgroundImage.png')}
                style={{ flex: 1, width: '100%', height: '100%', resizeMode: 'cover' }}>


                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 36 }}>RENTED CARS</Text>
                </View>



                <FlatList
                    data={listofCar}
                    keyExtractor={item => item.id}
                    renderItem={({ item: car }) =>
                        <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', paddingBottom: 40 }}>


                            <TouchableOpacity style={{ flex: 1, alignContent: 'center', alignItems: 'center', backgroundColor: 'white', width: '80%', borderRadius: 10 }}
                            >
                                <Image
                                    style={{ width: '80%', height: 250, margin: 5, zIndex: 1 }}
                                    source={{ uri: car.photoURL }}
                                />

                                <Text>{car.car_brand}</Text>
                                <Text style={styles.itemPrice}>Price: {car.price}/day</Text>
                                <Text>{car.start_date} - {car.end_date}</Text>
                             
                            </TouchableOpacity>


                        </View>

                    }

                />
            </ImageBackground>
        </SafeAreaView>
    );
};

export default ShowRentedCar;

const styles = StyleSheet.create({
    itemPrice: {
        fontSize: 16,
        padding: 10
    }

});