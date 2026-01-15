import { SetStateAction, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './styles/style-login';
import { useUser } from './context';

export default function LoginScreen() {

    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);

    // Get the variables or setters used to access or modify a copy of the user profile elements
    const { usernameGlobal, setUsernameGlobal } = useUser();

    // Variables and setters for the username and password entered by the user
    // The variable values will be sent to a backend endpoint to attempt to login to an existing user account
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Variable and setter for the error returned by the backend endpoint
    const [error, setError] = useState({message: '', status: ''});

    /*
    Set the value of the username variable to the value entered in the username text input element
    event: The event is the current string value in the username text input element
    */
    function saveUsernameInputText(event: { target: { value: SetStateAction<string>; }; }) {
        setError({ message: '', status: '' });
        setUsername(event.target.value);
        setVisible(false);
    }

    /*
    Set the value of the password variable to the value entered in the password text input element
    event: The event is the current string value in the password text input element
    */
    function savePasswordInputText(event: { target: { value: SetStateAction<string>; }; }) {
        setError({ message: '', status: '' });
        setPassword(event.target.value);
        setVisible(false);
    }

    // Sends a login request to the server containing the username and password
    function handlePressLogin() {
        
        setLoading(true);
        setError({ message: '', status: '' });

        fetch("http://127.0.0.1:5000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( { username: username, password: password } )
            }
        )
        .then((response) => response.json())

        .then((data) => {

            setLoading(false);

            // If the backend endpoint returns an error message, store the error message
            if (data.status === 'error') {
                setError(data);
                console.log(error);
            }
            else {
                setUsernameGlobal(username);
                router.push("/home");
            }
        })

        .catch((error) => {
            setError(error);
            console.log(error);
        });
    }

    // The page that the user sees in the app/browser
    return (

        <View style={styles.container}>
            <StatusBar style="auto" />

            <Text style={styles.subtitle}>Logged in as {usernameGlobal}</Text>

            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Login in to your CU-Bytes account or create a new CU-Bytes account</Text>

            {visible && (
                <Text style={styles.description} id="loginErrorMessage">{error.message}</Text>
            )}

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
                onPress={() => {
                    handlePressLogin();
                    setVisible(true);
                }}
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

        </View>

    )
}