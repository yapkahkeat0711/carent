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
    TextInput,
    ImageBackground
} from "react-native";
import { launchImageLibrary } from 'react-native-image-picker';
import auth from "@react-native-firebase/auth";
import CustomBtn from '../Components/CustomBtn';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

const EditRentCar = ({ navigation, route }) => {
    const car_id = route.params.car_id;
    const [imageuri, setimageuri] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [car_brand, setCarBrand] = useState(null);
    const [car_color, setCarColor] = useState(null);
    const [car_plate_number, setCarPlate] = useState(null);
    const [price, setPrice] = useState(null);


    async function getRentCar(car_id) {
        try {

            const snapshot = await firestore()
                .collection("Car_for_rent")
                .doc(car_id)
                .get();
            const fetchedData = snapshot.data();

            const source = { uri: fetchedData.photoURL };
            setimageuri(fetchedData.photoURL)
            setSelectedImage(source);
            setCarBrand(fetchedData.car_brand);
            setCarColor(fetchedData.car_color);
            setCarPlate(fetchedData.car_plate_number);
            setPrice(fetchedData.price);

        } catch (error) {
            console.log("Error fetching user data: ", error);
            return { error: "Error fetching user data" };
        }

    };

    const handleSelectImage = async () => {
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
                    setimageuri(response.assets[0].uri);
                }
            });
        } catch (err) {
            console.warn(err);
        }

    };

    const handleNumberChange = (value) => {
        // Use regular expression to remove non-numeric characters
        const formattedValue = value.replace(/[^0-9]/g, '');
        setPrice(formattedValue);
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
            const response = await fetch(uri);
            const blob = await response.blob();
            const ref = storage().ref().child(`images/${uuid.v4()}`);
            await ref.put(blob);
            const url = await ref.getDownloadURL();
            return url;


        } catch (error) {
            console.error(error);
        }
    };

    async function updateData(car_id) {
        if (!car_brand) return alert("Please fill Car Brand");
        if (!car_color) return alert("Please fill Car Plate Number");
        if (!car_plate_number) return alert("Please fill Car Color");
        if (!price) return alert("Please fill Price");
        if (!selectedImage) return alert("Please insert Image");
        const currentUser = auth().currentUser;

        const storageurl = await uploadImage(imageuri);
        const newData = {
            photoURL: storageurl,
            car_brand: car_brand,
            car_plate_number: car_plate_number,
            car_color: car_color,
            price: price,
            email: auth().currentUser.email
        };


        //add new data in car of driver
        const carRef = await firestore().collection('Car_for_rent').doc(car_id);
        carRef.get().then((querySnapshot) => {
            if (!querySnapshot.empty) {

                carRef.update(newData)
                    .then(() => {
                        console.log('Document updated successfully!');
                        alert('Update Succesfully');
                        navigation.replace("MyCarHistory");
                    })
                    .catch((error) => {
                        console.error('Error updating document: ', error);
                    });
            }
        }).catch((error) => {
            console.error('Error getting documents: ', error);
        });

      

    };

    async function deleteData(car_id) {
        const carRef = firestore().collection('Car_for_rent').doc(car_id);
        carRef.delete().then(() => {
            console.log('Document deleted successfully!');
            alert('Delete Succesfully');
            navigation.replace("MyCarHistory");
        }).catch((error) => {
            console.error('Error deleting document: ', error);
        });


    };
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Show the bottom tab bar when the screen comes into focus
            navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex' } });
            console.log(car_id);
            getRentCar(car_id);
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


    return (
        <SafeAreaView
            style={styles.mainBody}
        >
            <ImageBackground
                source={require('../assets/backgroundImage.png')}
                style={{ flex: 1, width: '100%', height: '100%', resizeMode: 'cover' }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 0.5, alignItems: 'center' }}>
                        {selectedImage && (
                            <View>
                                <Image source={selectedImage} style={{ width: 200, height: 200 }} />

                                <CustomBtn
                                    btnText="change image"
                                    onPress={handleSelectImage}
                                />
                            </View>

                        )}
                        {!selectedImage && (
                            <CustomBtn
                                btnText="add image"
                                onPress={handleSelectImage}
                                btnStyle={{ width: 200, height: 200 }}

                            />

                        )}



                    </View>
                    <View style={{ flex: 0.5 }}>
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
                            placeholder="Enter car plate number here..."
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
                            placeholder="Enter car color here..."
                        />
                        <View style={{ borderBottomWidth: 0.8, borderBottomColor: 'gray' }} />
                        <Text>
                            Price Per Day
                        </Text>
                        <TextInput
                            keyboardType="numeric"
                            value={price}
                            onChangeText={handleNumberChange}
                            placeholder="Enter price here..."
                        />
                        <View style={{ borderBottomWidth: 0.8, borderBottomColor: 'gray' }} />

                    </View>
                    <View style={{ alignItems: 'center', flex: 0.1, flexDirection: 'row', justifyContent: 'center' }}>
                        <CustomBtn
                            btnText="UPDATE"
                            onPress={() => updateData(car_id)}
                            btnStyle={{ width: '40%' }}

                        />
                        <CustomBtn
                            btnText="DELETE"
                            onPress={() => deleteData(car_id)}
                            btnStyle={{ width: '40%' }}
                        />
                    </View>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default EditRentCar;

const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
    },
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