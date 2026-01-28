import { SetStateAction, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './styles/style-register';
import { useUser } from './context';

export default function RegisterScreen() {

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
            setUsernameGlobal,
            setHasEggAllergyGlobal,
            setHasFishOrShellfishAllergyGlobal,
            setHasDairyIntoleranceGlobal,
            setHasMilkAllergyGlobal,
            setHasPeanutAllergyGlobal,
            setHasSesameAllergyGlobal,
            setHasSoyAllergyGlobal,
            setHasTreenutAllergyGlobal,
            setHasWheatAllergyGlobal,
            setHasGlutenAllergyGlobal,
            setIsVeganGlobal,
            setIsVegetarianGlobal,
            setPrefersHalalGlobal

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
        Send a request to the backend endpoint to create a new account

        param(s):
            string - name: The username entered by the user to create a new account
            string - psswrd: The password entered by the user to create a new account
    */
    const registerUser = async (name: string, psswrd: string) => {
        try {
            const res = await fetch(`http://127.0.0.1:5000/auth/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify( { username: name, password: psswrd } )
                }
            );
            const data = await res.json();

            // If the backend endpoint returns an error, store the error message
            // (The user failed to create a new account with the entered username and password)
            if (data.status === 'error') {
                setError(data);
                console.log(error);
            }
            // Else, update the copy of the user's username and profile settings and route the user to the 'home' page
            // (The user successfully created a new account with the entered username and password)

            // The profile settings on the frontend reflect the default user account profile settings on the backend
            // (For reference, see backend/models/users_profile.py)
            else {
                setUsernameGlobal(name);
                setHasEggAllergyGlobal(false),
                setHasFishOrShellfishAllergyGlobal(false);
                setHasDairyIntoleranceGlobal(false);
                setHasMilkAllergyGlobal(false);
                setHasPeanutAllergyGlobal(false);
                setHasSesameAllergyGlobal(false);
                setHasSoyAllergyGlobal(false);
                setHasTreenutAllergyGlobal(false);
                setHasWheatAllergyGlobal(false);
                setHasGlutenAllergyGlobal(false);
                setIsVeganGlobal(false);
                setIsVegetarianGlobal(false);
                setPrefersHalalGlobal(false);

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

            <Text style={styles.title}>Create Account</Text>

            <Text style={styles.subtitle}>Create new CU-Bytes account</Text>

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

            {visible && (
                <Text style={styles.description} id="registerErrorMessage">{error.message}</Text>            
            )}

            {/* Enter the username that corresponds to the new account that the user wants to create */}
            <TextInput id="usernameInput"
                style={styles.textInput}
                onChangeText={setUsername}
                placeholder={"Enter new CU-Bytes username"}
                value={username}
            >
            </TextInput>

            {/* Enter the password that corresponds to the new account that the user wants to create */}
            <TextInput id="passwordInput"
                style={styles.textInput}
                onChangeText={setPassword}
                placeholder={"Enter new CU-Bytes password"}
                value={password}
                secureTextEntry={true}
            >
            </TextInput>

            {/* Submit a request to the backend endpoint to create a new account */}
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={() => {
                    registerUser(username, password);
                    setVisible(true);
                }}
                disabled={loading}
            >
                <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>

        </View>
    )
}