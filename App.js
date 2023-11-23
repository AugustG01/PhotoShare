import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import {storage} from './firebase';

export default function App() {

  //const [imagePath, setImagePath] = useState(null)
  const [allImages, setAllImages] = useState([])


  async function launchImagePicker(){

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true
    })
    if(!result.canceled){
      //vis billedet
          console.log(result.assets[0].uri)
          //setImagePath(result.assets[0].uri)
          const imagePath = result.assets[0].uri
          uploadImage(imagePath)
    }
  }

  async function uploadImage(imagePath){
    console.log(imagePath)
    const res = await fetch(imagePath)
    const blob = await res.blob()
    const storageRef = ref(storage, `${Math.random().toString(36).substr(2, 8)}.jpg`);
    uploadBytes(storageRef, blob).then(() => {
      alert("image uploaded")
    })
  }


  async function downloadImage(id){

    getDownloadURL(ref(storage, id +'.jpg')).then((url) => {
      setImagePath(url)
    }).catch((error) => {
      console.log(error)
    })
  }

  return (
    <View style={styles.container}>
      
      <Text onPress={launchImagePicker} style={{top: 80}}>Add Image</Text>

      <FlatList
      data={allImages}
      keyExtractor={(item) => item.id.toString}
      renderItem={({ item }) => (
        <View>
          <Image
          source={{uri: item.url}}
          style={styles.image}
          />
        </View>
      )}
      >
      </FlatList>

      <StatusBar style="auto" />
    </View>
  );
}















const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
      
      height: 200,
      width: 200
  }
});
