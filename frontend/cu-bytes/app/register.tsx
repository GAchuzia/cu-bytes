import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './style-register';

export default function LoginScreen() {

    const [loading, setLoading] = useState(false);

    // The username and password variables
    // These values are passed to a JSON object that is sent to the register endpoint
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Sets the value of the username based on the value of the username text input 
    function saveUsernameInputText(event) {
        setUsername(event.target.value);
        console.log(username);
    }

    // Sets the value of the password based on the value of the password text input
    function savePasswordInputText(event) {
        setPassword(event.target.value);
        console.log(password);
    }

    // Sends a register request to the server containing the username and password 
    const handlePress = () => {
        fetch("http://127.0.0.1:5000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( { username: username, password: password } )
            }
        )
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            router.push("/login");
        })
        .catch(error => {
            console.log(error);

            const usernameInput = document.getElementById("usernameInput") as HTMLInputElement;
            const passwordInput = document.getElementById("passwordInput") as HTMLInputElement;

            if (usernameInput != null) {
                usernameInput.style.color = 'red';
                usernameInput.placeholder = 'Error!';
            }
            if (passwordInput != null) {
                passwordInput.style.color = 'red';
                passwordInput.placeholder = "Error!"
            }
        });
    }

    // The page that the user sees in the app/browser
    return (

        <View style={styles.container}>
            <StatusBar style="auto" />

            <Text style={styles.title}>Create Account for CU-Bytes</Text>
            <Text style={styles.subtitle}>Create a new CU-Bytes account</Text>

            <Text style={styles.subsubtitle}>
                Username Requirements:
            </Text>

            <Text style={styles.description}>
                - Username is unique to each user
                <br></br>
                - Between 1 and 80 characters in length
                <br></br>
                - Contains only letters, numbers, underscores, and spaces
            </Text>

            <Text style={styles.subsubtitle}>
                Password Requirements:
            </Text>

            <Text style={styles.description}>
                - Between 10 and 120 characters in length
                <br></br>
                - At least one lowercase letter, uppercase letter, number and special character 

            </Text>

            {/*Enter the username that will identify the new account*/}
            <TextInput id="usernameInput"
                style={styles.textInput}
                onChange={saveUsernameInputText}
                placeholder={"Enter a new username"}
                value={username}
            >
            </TextInput>

            {/*Enter the password that will secure the new account*/}
            <TextInput id="passwordInput"
                style={styles.textInput}
                onChange={savePasswordInputText}
                placeholder={"Enter a new password"}
                value={password}
                secureTextEntry={true}
            >
            </TextInput>

            {/*Send a request to the server to create a new account with the entered username and password */}
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handlePress}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    Register
                </Text>

            </TouchableOpacity>

        </View>

    )

}