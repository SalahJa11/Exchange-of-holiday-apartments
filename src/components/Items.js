import React , { useState, useEffect }from 'react';
import * as ImagePicker from 'expo-image-picker';

import { StyleSheet, Text,ImageBackground,Image , View,SafeAreaView,TouchableOpacity, KeyboardAvoidingView,Platform,StatusBar, Button } from 'react-native';
export default function Items({Name , image } ) {
//     const [image, setImage] = useState(null);

//   const pickImage = async () => {
//     // No permissions request is necessary for launching the image library
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

   

//     if (!result.cancelled) {
//       setImage(result.uri);
//     }
//   };

    return (
        
       
        <View style = {styles.ItemsContainer}  >
           
            {/* <Button title="Pick an image from camera roll" onPress={pickImage} /> */}
            
      {image && <Image source={{ uri: image }} style={styles.Image} />}
      <Text>{Name}</Text>
     
   
        </View>
        
    );
}
const styles = StyleSheet.create({
    ItemsContainer : {
      
     width: 150, 
     height: 150 ,
    
     alignItems : 'center' , 
  
  
    
    },
    Image : {
      width: 150, 
      height: 150,
      borderWidth : 5,
      borderRadius : 10,
      borderColor :"#1c6669" ,
    },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "red",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: 100,
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
    
});