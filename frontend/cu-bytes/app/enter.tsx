import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './style'

export default function EnterScreen() {

    const [loading, setLoading] = useState(false);

    // The page that the user sees in the app/browser
    return (

        <View style={styles.container}>
            <StatusBar style="auto" />

            <Text style={styles.title}>Enter</Text>
            <Text style={styles.subtitle}>Enter the food item manually</Text>

            {/*Enter the food item to get detailed information on*/}
            <TextInput
                style={styles.textInput}
                //onChange={}
                placeholder={"Enter the food item"}
                //value={}
            >
            </TextInput>

            {/*Send a request to the server to see food items in the database that match the entered food item*/}
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                //onPress={}
                disabled={loading}
            >
                <Text style={styles.buttonText}>Confirm</Text>

            </TouchableOpacity>

        </View>
    )
}