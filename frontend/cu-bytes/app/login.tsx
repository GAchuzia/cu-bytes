import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './style';

export default function LoginScreen() {

    const [loading, setLoading] = useState(false);

    // The validity of the username and password entered by the user
    const [validCredentials, setValidCredentials] = useState(false);

    // The username and password variables
    // These values are passed to a JSON object that is sent to the login endpoint
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // The status and message returned by the server as a JSON object
    const [responseData, setResponseData] = useState({ status: '', message: '' });

    // Sets the value of the username based on the value of the username text input
    function saveUsernameInputText(event) {
        setUsername(event.target.value);
        console.log(username);
    }

    // Sets the value of the password based on the value of the password text input
    function savePasswordInputText(event) {
        setPassword(event.target.value);
        console.log(username);
    }

    // Sends a login request to the server containing the username and password
    const handlePress = () => {
        fetch("http://127.0.0.1:5000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( { username: username, password: password } )
            }
        )
        .then(response => {
            if (!response.ok) {
                throw new Error (`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            setResponseData(data);
            setValidCredentials(true);
        })
        .catch(error => {
            console.log(error);
        });
    }

    // The page that the user sees in the app/browser
    return (

        <View style={styles.container}>
            <StatusBar style="auto" />

            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Login in to your CU-Bytes account</Text>
            <Text style={styles.subtitle}>Or create a new CU-Bytes account</Text>

            {/*Enter the username that will identify the existing account*/}
            <TextInput
                style={styles.textInput}
                onChange={saveUsernameInputText}
                placeholder={"Enter your username"}
                value={username}
            >
            </TextInput>

            {/*Enter the password that will access the existing account*/}
            <TextInput
                style={styles.textInput}
                onChange={savePasswordInputText}
                placeholder={"Enter your password"}
                value={password}
            >
            </TextInput>

            {/*Send a request to the server to access an existing account with the entered username and password */}
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handlePress}
                disabled={loading}
            >
                <Text style={styles.buttonText}>Login</Text>

            </TouchableOpacity>

            {/*Route the user to the register/create account page*/}
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/register")}
            >
                <Text style={styles.buttonText}>Create Account</Text>

            </TouchableOpacity>

            {responseData && (
                <Text style={styles.subtitle}>
                    {responseData.message}
                </Text>
            )}

        </View>

    )
}