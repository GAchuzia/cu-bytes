import { SetStateAction, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './styles/style-login';

export default function LoginScreen() {

    ////////////////////////////////////////////////// Set color and placeholder text of username and password elements //////////////////////////////////////////////////
    // Create constants for elements that will be modified based on the submitted username or password
    const usernameInput = document.getElementById("usernameInput") as HTMLInputElement;
    const passwordInput = document.getElementById("passwordInput") as HTMLInputElement;

    /*
    Reset the username-related element
    */
    function resetUsernameElement() {
        if (usernameInput != null) {
            setVisible(false);
            usernameInput.style.color = 'black';
            usernameInput.placeholder = 'Enter your username';
        }
    }

    /*
    Reset the password-related element
    */
    function resetPasswordElement() {
        if (passwordInput != null) {
            setVisible(false);
            passwordInput.style.color = 'black';
            passwordInput.placeholder = 'Enter your password';            
        }        
    }
    ////////////////////////////////////////////////// Set color and placeholder text of username and password elements //////////////////////////////////////////////////

    ////////////////////////////////////////////////// Username, Password, Loading, and Visibile Variables and Setters //////////////////////////////////////////////////

    const [loading, setLoading] = useState('');
    const [visible, setVisible] = useState(false);

    // The username and password variables
    // These values are passed to a JSON object that is sent to the login endpoint
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Sets the value of the username based on the value of the username text input
    function saveUsernameInputText(event: { target: { value: SetStateAction<string>; }; }) {
        resetUsernameElement();
        setUsername(event.target.value);
    }

    // Sets the value of the password based on the value of the password text input
    function savePasswordInputText(event: { target: { value: SetStateAction<string>; }; }) {
        resetPasswordElement();
        setPassword(event.target.value);
    }
    ////////////////////////////////////////////////// Username, Password, Loading, and Visibile Variables and Setters //////////////////////////////////////////////////

    ////////////////////////////////////////////////// Send login request //////////////////////////////////////////////////
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
            router.push("/home");
        })
        .catch(error => {
            console.log(error);

            setVisible(true);

            // Modify the username element if there is an error with the login request
            if (usernameInput != null) { 
                usernameInput.style.color = 'red';
                usernameInput.placeholder = 'Error!';
            }
            // Modify the password element if there is an error with the login request
            if (passwordInput != null) { 
                passwordInput.style.color = 'red'; 
                passwordInput.placeholder = 'Error!';
            }
        });
    }
    ////////////////////////////////////////////////// Send login request //////////////////////////////////////////////////

    // The page that the user sees in the app/browser
    return (

        <View style={styles.container}>
            <StatusBar style="auto" />

            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Login in to your CU-Bytes account or create a new CU-Bytes account</Text>

            {/*Enter the username that will identify the existing account*/}
            <TextInput id="usernameInput"
                style={styles.textInput}
                onChange={saveUsernameInputText}
                placeholder={"Enter your username"}
                value={username}
            >
            </TextInput>

            {/*Enter the password that will access the existing account*/}
            <TextInput id="passwordInput"
                style={styles.textInput}
                onChange={savePasswordInputText}
                placeholder={"Enter your password"}
                value={password}
                secureTextEntry={true}
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

            {visible && (
                <Text id="errorMessage"
                    style={styles.subsubtitleError}
                >
                    Error! Incorrect username, incorrect password, or unregistered account!
                </Text>
            )}

        </View>

    )
}