import { SetStateAction, useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './styles/style-register';

import { useUser } from './context';

export default function RegisterScreen() {

    const { setUser } = useUser();

    ////////////////////////////////////////////////// Set color of username and password elements //////////////////////////////////////////////////
    // Create constants for elements that will be modified based on the submitted username
    const usernameReq = document.getElementById("usernameReq") as HTMLElement;
    const usernameUniqueReq = document.getElementById("usernameUniqueReq") as HTMLElement;
    const usernameLengthReq = document.getElementById("usernameLengthReq") as HTMLElement;
    const usernameCharReq = document.getElementById("usernameCharReq") as HTMLElement;

    // Create constants for elements that will be modified based on the submitted password
    const passwordReq = document.getElementById("passwordReq") as HTMLElement;
    const passwordLengthReq = document.getElementById("passwordLengthReq") as HTMLElement;
    const passwordCharReq = document.getElementById("passwordCharReq") as HTMLElement;

    /*
    Reset the color of every username-related element
    */
    function resetUsernameElements() {
        if (usernameReq != null && usernameUniqueReq != null && usernameLengthReq != null && usernameCharReq != null) {
            usernameReq.style.color = 'black';
            usernameUniqueReq.style.color = 'black';
            usernameLengthReq.style.color = 'black';
            usernameCharReq.style.color = 'black';            
        }
    }

    /*
    Reset the color of every password-related element
    */
    function resetPasswordElements() {
        if (passwordReq != null && passwordLengthReq != null && passwordCharReq != null) {
            passwordReq.style.color = 'black';
            passwordLengthReq.style.color = 'black';
            passwordCharReq.style.color = 'black';
        }
    }
    ////////////////////////////////////////////////// Set color of username and password elements //////////////////////////////////////////////////

    ////////////////////////////////////////////////// Testing username and password submissions //////////////////////////////////////////////////
    /* 
    Check if a string variable contains any lowercase letters
    str: The string variable to be tested
    returns: true if the string variable contains any lowercase letters
    */
    function containsLowerCaseLetters(str: string) {
        const lowerCaseLetters = /[abcdefghijklmnopqrstuvwxyz]/;
        return lowerCaseLetters.test(str);
    }

    /*
    Check if a string variable contains any uppercase letters
    str: The string variable to be tested
    returns: true if the string variable contains any uppercase letters
    */
    function containsUpperCaseLetters(str: string) {
        const upperCaseLetters = /[ABCDEFGHIJKLMNOPQRSTUVWXYZ]/;
        return upperCaseLetters.test(str);
    }

    /*
    Check if a string variable contains any numbers
    str: The string variable to be created
    returns: true if the string variable contains any numbers
    */
    function containsNumbers(str: string) {
        const numbers = /[1234567890]/;
        return numbers.test(str);
    }

    /*
    Check if a string variable contains any special characters
    str: The string variable to be created
    returns: true if the string variable contains any special characters
    */
    function containsSpecialChars(str: string) {
        const specialChars = /[`!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~ ]/;
        return specialChars.test(str);
    }
    ////////////////////////////////////////////////// Testing username and password submissions //////////////////////////////////////////////////

    ////////////////////////////////////////////////// Username, Password, and Loading Variables and Setters //////////////////////////////////////////////////
    const [loading, setLoading] = useState('');

    // The username and password variables
    // These values are passed to a JSON object that is sent to the register endpoint
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    /*
    Set the value of the username variable to the value entered in the username text input element
    event: The event is the current string value in the username text input element
    */
    function saveUsernameInputText(event: { target: { value: SetStateAction<string>; }; }) {
        resetUsernameElements();
        setUsername(event.target.value);
    }

    /*
    Set the value of the password variable to the value entered in the password text input element
    event: The event is the current string value in the password text input element
    */
    function savePasswordInputText(event: { target: { value: SetStateAction<string>; }; }) {
        resetPasswordElements();
        setPassword(event.target.value);
    }
    ////////////////////////////////////////////////// Username, Password, and Loading Variables and Setters //////////////////////////////////////////////////

    ////////////////////////////////////////////////// Send register request //////////////////////////////////////////////////
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
            // Set the global username value to the local username value
            setUser(username);
            return response.json();
        })
        .then(data => {
            router.push("/login");
        })
        .catch(error => {

            // Modify the username elements if the submitted username is less than 1 character or greater than 80 characters
            if (username.length < 0 || username.length > 80 || username == '') {
                usernameReq.style.color = 'red';
                usernameLengthReq.style.color = 'red';
            }
            // Modify the username elements if the submitted username contains unauthorised characters
            if (containsSpecialChars(username)) {
                usernameReq.style.color = 'red';
                usernameCharReq.style.color = 'red';
            }
            // Modify the password elements if the submitted password contains less than 10 characters or greater than 120 characters
            if (password.length < 10 || password.length > 120) {
                passwordReq.style.color = 'red';
                passwordLengthReq.style.color = 'red';
            }
            // Modify the password elements if the submitted password does not contain one or more of the required types of characters
            if (!containsLowerCaseLetters(password) || containsUpperCaseLetters(password) || !containsNumbers(password) || containsSpecialChars(password)
            ) {
                passwordReq.style.color = 'red';
                passwordCharReq.style.color = 'red';
            }
        });
    }
    ////////////////////////////////////////////////// Send register request //////////////////////////////////////////////////

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
                - Contains only letters, numbers, and underscores
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