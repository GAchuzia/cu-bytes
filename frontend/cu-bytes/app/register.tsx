import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './style-register';

export default function RegisterScreen() {

    // The text elements are stored as constants and will be modified if errors are detected in the username
    const usernameReq = document.getElementById("usernameReq") as HTMLElement;
    const usernameUniqueReq = document.getElementById("usernameUniqueReq") as HTMLElement;
    const usernameLengthReq = document.getElementById("usernameLengthReq") as HTMLElement;
    const usernameCharReq = document.getElementById("usernameCharReq") as HTMLElement;

    // The text elements are stored as constants and will be modified if errors are detected in the password
    const passwordReq = document.getElementById("passwordReq") as HTMLElement;
    const passwordLengthReq = document.getElementById("passwordLengthReq") as HTMLElement;
    const passwordCharReq = document.getElementById("passwordCharReq") as HTMLElement;

    // Check if the value of a string variable contains any lowercase letters
    function containsLowerCaseLetters(str) {
        const lowerCaseLetters = /[abcdefghijklmnopqrstuvwxyz]/;
        return lowerCaseLetters.test(str);
    }
    // Check if the value of a string variable contains any uppercase letters
    function containsUpperCaseLetters(str) {
        const upperCaseLetters = /[ABCDEFGHIJKLMNOPQRSTUVWXYZ]/;
        return upperCaseLetters.test(str);
    }
    // Check if the value of a string variable contains any numbers
    function containsNumbers(str) {
        const numbers = /[1234567890]/;
        return numbers.test(str);
    }
    // Check if the value of a string variable contains any special characters
    function containsSpecialChars(str) {
        const specialChars = /[`!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
        return specialChars.test(str);
    }

    const [loading, setLoading] = useState('');

    // The username and password variables
    // These values are passed to a JSON object that is sent to the register endpoint
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Sets the value of the username based on the value of the username text input
    function saveUsernameInputText(event) {

        // Ensure that the first element in the group has loaded before attempting to alter the element styles
        if (usernameReq != null) {
            usernameReq.style.color = 'black';
            usernameUniqueReq.style.color = 'black';
            usernameLengthReq.style.color = 'black';
            usernameCharReq.style.color = 'black';            
        }

        setUsername(event.target.value);
        console.log(username);
    }

    // Sets the value of the password based on the value of the password text input
    function savePasswordInputText(event) {

        // Ensure that the first element in the group has loaded before attempting to alter the element styles
        if (passwordReq != null) {
            passwordReq.style.color = 'black';
            passwordLengthReq.style.color = 'black';
            passwordCharReq.style.color = 'black';
        }

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

            // Notify the user if the submitted username is less than 1 character or greater than 80 characters
            if (username.length < 0 || username.length > 80 || username == '') {
                usernameReq.style.color = 'red';
                usernameLengthReq.style.color = 'red';
            }
            // Notify the user if the submitted username contains unauthorised characters
            if (containsSpecialChars(username)) {
                usernameReq.style.color = 'red';
                usernameCharReq.style.color = 'red';
            }
            // Notify the user if the submitted password contains less than 10 characters or greater than 120 characters
            if (password.length < 10 || password.length > 120) {
                passwordReq.style.color = 'red';
                passwordLengthReq.style.color = 'red';
            }
            // Notify the user if the submitted password does not contain one or more of the required types of characters
            if (!containsLowerCaseLetters(password) || containsUpperCaseLetters(password) ||
                !containsNumbers(password) || containsSpecialChars(password)
            ) {
                passwordReq.style.color = 'red';
                passwordCharReq.style.color = 'red';
            }
        });
    }

    // The page that the user sees in the app/browser
    return (

        <View style={styles.container}>
            <StatusBar style="auto" />

            <Text style={styles.title}>Create Account for CU-Bytes</Text>
            <Text style={styles.subtitle}>Create a new CU-Bytes account</Text>

            <Text style={styles.subsubtitle} id="usernameReq">
                Username Requirements:
            </Text>

            <Text style={styles.description} id="usernameUniqueReq">
                - Username is unique to each user
            </Text>
            <Text style={styles.description} id="usernameLengthReq">
                - Between 1 and 80 characters in length
            </Text>
            <Text style={styles.description} id="usernameCharReq">
                - Contains only letters, numbers, underscores, and spaces
            </Text>

            <Text style={styles.subsubtitle} id="passwordReq">
                Password Requirements:
            </Text>

            <Text style={styles.description} id="passwordLengthReq">
                - Between 10 and 120 characters in length
            </Text>

            <Text style={styles.description} id="passwordCharReq">
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