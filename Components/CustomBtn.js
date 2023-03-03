import React, { Component } from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';


const CustomBtn = ({
    onPress = () => {},
    btnStyle = {},
    btnText
}) => {
    return (
     <TouchableOpacity
     onPress={onPress}
     style={{...styles.btnStyle,...btnStyle}}
     >
         <Text  style={{...styles.buttonTextStyle}}>{btnText}</Text>
     </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    btnStyle: {
        
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
      },
      buttonTextStyle: {
        color: "#000",
        paddingVertical: 10,
        fontSize: 16,
        textAlign: 'center',
       
      },
});


export default CustomBtn;
