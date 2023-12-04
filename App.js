import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, FlatList, ScrollView, TouchableOpacity, Button, Modal } from 'react-native';
import { Input } from 'react-native-elements';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {ref, uploadBytes, getDownloadURL, list} from 'firebase/storage';
import {storage} from './firebase';
import { getDatabase, set } from "firebase/database";
import axios from 'axios';


export default function App({userData}) {

  //const [imagePath, setImagePath] = useState(null)
  const [allImages, setAllImages] = useState([])
  const [numColumns, setNumColumns] = useState(2); // Initial number of columns
  const [user, setUser] = useState(null);
  const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
  const url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="
  const urlSignUp = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="
  const getUserData = "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key="
  const databaseURL = "https://photoshare-540cf-default-rtdb.europe-west1.firebasedatabase.app/users"
  const [enteredEmail, setEnteredEmail] = useState("")
  const [enteredPassword, setEnteredPassword] = useState("")
  const [modalVisible, setModalVisible] = useState(false);
  const [shareEmail, setShareEmail] = useState("");



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
    const storageRef = ref(storage, user.data.localId + `-${Math.random().toString(36).substr(2, 8)}.jpg`);
    uploadBytes(storageRef, blob).then(() => {
      getAllImages(user.data.localId)
      alert("image uploaded")
    })
  }
    

  function signOut(user){
    setUser(null)

  }
  
  async function downloadImage(id){
    getDownloadURL(ref(storage, id +'.jpg')).then((url) => {
      setImagePath(url)
    }).catch((error) => {
      console.log(error)
    })
  }

  async function login(){
    try{
      const response = await axios.post(url + API_KEY, {
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true
      })

      setUser(response);
      console.log(response.data.localId);
      
      setAllImages(getAllImages(response.data.localId));

      

      return(
        < App userData={user}/>
      )
    }catch(error){
      alert("Forkert kode eller email, prøv igen.")
    }
  }

  async function signup(){
    try{
      const response = await axios.post(urlSignUp + API_KEY, {
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true
      })

      // Insert user into Firebase realtime database
      const userUID = response.data.localId;
      const data = {
        email: enteredEmail,
        userUID: userUID,
        shared: []
      }
      await axios.post(databaseURL + ".json", data);

      alert("Oprettet!" + response.data.idToken)
    }catch(error){
      alert("Ikke Oprettet!!" + error.message)
    }
  }

  const shareImages = async () => {
    console.log(shareEmail);

    // Get all user's uid from email in Firebase realtime database
    const response = await axios.get(databaseURL + ".json");
    const users = response.data;
    const userEmails = Object.values(users).map(user => user.email);
    const shareUserUID = Object.values(users).find(user => user.email === shareEmail).userUID;
    console.log(shareUserUID);

  }


  const getAllImages = async (userUID) => {
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
    //fileUrls.filter(fileUrls => fileUrls.name.includes(userUID));
    let filteredFileUrls = fileUrls.filter(fileUrl => fileUrl.name.includes(userUID));
    console.log(filteredFileUrls);
    setAllImages(filteredFileUrls);

  } catch (error) {
    console.error('Error fetching files from Firestore Storage:', error);
  }
  };

  if (user && user != undefined) {
  return (
    
    
    <View style={styles.container}>
    
    <View style={styles.signOut}>
      <Button title='Sign out' color='red' style={{ top: 80, left: 20, color: '#fff'}} onPress={signOut}/>
    </View>
    <View style={styles.addImage}>
      <Button title='Add Image' onPress={launchImagePicker} style={{ top: 80 }} />
    </View>
    <View style={styles.share}>
      <Button title='Share' onPress={() => setModalVisible(true)} style={{ top: 80 }} />
    </View>
      

    <View style={styles.pictures}>
      <FlatList
        style={{ height: '100%' }}
        data={allImages}
        keyExtractor={(item) => item.name}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.url }} style={styles.image} />
          </View>
        )}
      />
    </View>

    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.modalView}>
        <Input placeholder="Email" onChangeText={setShareEmail} />
        <Button title="Share!" onPress={shareImages} />
      </View>
    </Modal>

    <StatusBar style="auto" />
  </View>
  );
}
else {
  return (
    <View style={styles.logInScreen}>
      <Image source={require('./assets/logo.png')} style={styles.logo} />
            <Text style={styles.welcomeScreen}>PhotoShare</Text>
            <View>
                <Input type="text" placeholder="email" onChangeText={setEnteredEmail} />
                <Input secureTextEntry={true} type="password" placeholder="password" onChangeText={setEnteredPassword} />
                <Button title="login" onPress={login}/>
            </View>
            <View>
                <Text>Don't have an account?</Text>
                <Button title="Sign up" onPress={signup}/>
            </View>
        </View>
  )
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%', // Change this line
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto'
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
      borderColor: 'black',
  },
  pictures: {
    top: 80,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    left: 5,
    height: '100%',
    marginBottom: 120,
  },
  signOut: {
    top: 50,
    left: -127,
    marginBottom: 20,


  },
  addImage: {
    top: 50,
    width: 335
    
  },
  logInScreen: {
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    top: '10%'
  },
  welcomeScreen: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50
  },
  logo:{
    width: 200,
    height: 200,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 10
  },
  share: {
    top: -43,
    width: 335,
    left: 127
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    top: 250,
    left: 20,
    alignItems: "center",
    shadowColor: "#000",
    width: 300,
    height: 300,
    shadowOffset: {
      width: 0,
      height: 2
    }
  }
});
