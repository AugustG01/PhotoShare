import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, FlatList, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {ref, uploadBytes, getDownloadURL, list} from 'firebase/storage';
import {storage} from './firebase';

export default function App() {

  //const [imagePath, setImagePath] = useState(null)
  const [allImages, setAllImages] = useState([])
  const [numColumns, setNumColumns] = useState(2); // Initial number of columns

  useEffect(() => {
    setAllImages(getAllImages)
  }, [])


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

  const getAllImages = async () => {
    const storageRef = ref(storage, 'gs://photoshare-540cf.appspot.com'); // Replace with your actual storage directory

  try {
    const result = await list(storageRef);

    // result.items is an array containing all the files in the directory
    const fileUrls = [];
    

    for (const item of result.items) {
      const url = await getDownloadURL(item);
      fileUrls.push({ name: item.name, url });
    }

    console.log(fileUrls);
    setAllImages(fileUrls)

  } catch (error) {
    console.error('Error fetching files from Firestore Storage:', error);
  }
  };

  return (
    <View style={styles.container}>
      
      <Text onPress={launchImagePicker} style={{top: 80}}>Add Image</Text>

      <View style={styles.pictures}>
      <FlatList
      data={allImages}
      keyExtractor={(item) => item.name}
      numColumns={numColumns} // Set the number of columns here
      renderItem={({ item }) => (
        <View style={styles.imageContainer}>
          <Image
          source={{uri: item.url}}
          style={styles.image}
          />
        </View>
      )}
      >
      </FlatList>
      </View>

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
    height: 'auto',
  },
  image: {
      height: 150,
      width: 150
  },
  imageContainer: {
      margin: 5,
      padding: 5,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: 'black'
  },
  pictures: {
    top: 150,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    left: 25,
    height: 'auto',
  }
});
