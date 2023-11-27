import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, FlatList, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {ref, uploadBytes, getDownloadURL, list} from 'firebase/storage';
import {storage} from './firebase';

export default function LoginScreen () {
    

    return (
        <View>
            <Text>loginScreen</Text>
            <View>
                <Input type="text" placeholder="user name" />
                <Input type="password" placeholder="password" />
                <Button title="login" />
            </View>
            <View>
                <Text>Don't have an account?</Text>
                <Button title="Sign up" />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
});