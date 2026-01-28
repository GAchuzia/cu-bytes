import { SetStateAction, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './styles/style-login';
import { useUser } from './context';

export default function LoginScreen() {

    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);

    /*
        Variable and setter for storing and modifying the error returned from the backend endpoint
    */
    const [error, setError] = useState(
        {
            message: '',
            status: ''
        }
    );

    /*
        Variables and setters used to store a copy of the logged-in user's username and profile settings 
    */
    const 
        { 
            usernameGlobal,
            setUsernameGlobal
        
        } = useUser();
    
    /*
        Variable and setter for storing and modifying the username entered by the user
    */
    const [username, setUsername] = useState('');

    /*
        Variable and setter for storing and modifying the password entered by the user
    */
    const [password, setPassword] = useState('');

    /*
        Send a request to the backend endpoint to login the user to an account

        param(s):
            string - name: The username entered by the user to login into an account
            string - psswrd: The password entered by the user to login into an account
    */
    const loginUser = async (name: string, psswrd: string) => {
        try {
            const res = await fetch(`http://127.0.0.1:5000/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify( { username: name, password: psswrd} )
                }
            );
            const data = await res.json();

            // If the backend endpoint returns an error, store the error message
            // (The user failed to log in to an account with the entered username and password)
            if (data.status === 'error') {
                setError(data);
                console.log(error);
            }
            // Else, update the copy of the user's username to the username they entered and route the user to the 'home' page
            // (The user successfully logged in to an account with the entered username and password)
            else {
                setUsernameGlobal(name);
                router.push("/home");
            }
        
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (

        <View style={styles.container}>
            <StatusBar style="auto" />

            <Text style={styles.subtitle}>{usernameGlobal != "" ? `Logged in as ${usernameGlobal}` : "Not logged in"}</Text>

            <Text style={styles.title}>Login</Text>

            <Text style={styles.subtitle}>Log in in to your CU-Bytes account or create a new CU-Bytes account</Text>

            {visible && (
                <Text style={styles.subsubtitle} id="loginErrorMessage">{error.message}</Text>
            )}

            {/* Enter the username that corresponds to the account that the user wants to log in to */}
            <TextInput id="usernameInput"
                style={styles.textInput}
                onChangeText={setUsername}
                placeholder={"Enter CU-Bytes username"}
                value={username}
            >
            </TextInput>

            {/* Enter the password that corresponds to the account that the user wants to log in to */}
            <TextInput id="passwordInput"
                style={styles.textInput}
                onChangeText={setPassword}
                placeholder={"Enter CU-Bytes password"}
                value={password}
                secureTextEntry={true}
            >
            </TextInput>

            {/* Submit a request to the backend endpoint to authenticate the entered credentials and log in to an account */}
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={() => {
                    loginUser(username, password);
                    setVisible(true);
                }}
                disabled={loading}
            >
                <Text style={styles.buttonText}>Login</Text>

            </TouchableOpacity>

            {/* Route the user to the 'create account' page */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/register")}
            >
                <Text style={styles.buttonText}>Create Account</Text>

            </TouchableOpacity>

        </View>

    )
}