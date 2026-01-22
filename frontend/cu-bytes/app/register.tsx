import { SetStateAction, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './styles/style-register';
import { useUser } from './context';

export default function RegisterScreen() {

    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);

    // Get the variables and setters used to access and modify a copy of the user profile elements
    const
        {
            usernameGlobal,
            setUsernameGlobal,
            setShowStatsGlobal,
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

    // Variables and setters for the username and password entered by the user
    // The variable values will be sent to a backend endpoint to attempt to create a new user account
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Variable and setter for the error returned by the backend endpoint
    const [error, setError] = useState({ message: '', status: '' });

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

    // Sends a register request to the backend endpoint containing the input username and password 
    function handlePressRegister() {

        setLoading(true);
        setError({ message: '', status: '' });
        
        fetch("http://127.0.0.1:5000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( { username: username, password: password } )
            }
        )
        .then((response) => response.json())

        .then(data => {

            setLoading(false);

            // If the backend endpoint returns an error message, store the error message
            if (data.status === 'error') {
                setError(data);
                console.log(error);
            }
            else {
                // Set the user profile global elements
                // This ensures that the updated user profile elements can be accessed across different fronted pages
                // (Without requiring sending retrieval requests to the backend endpoint)
                
                // Because the user account has been newly created, all of the boolean elements should be false by default
                // See backend/models/users_profile.py for details
                // However, the user profile elements should still be set on the frontend on registration to be used when scanning or browsing food items
                setUsernameGlobal(username),
                setShowStatsGlobal(false),
                setHasEggAllergyGlobal(false),
                setHasFishOrShellfishAllergyGlobal(false),
                setHasDairyIntoleranceGlobal(false),
                setHasMilkAllergyGlobal(false),
                setHasPeanutAllergyGlobal(false),
                setHasSesameAllergyGlobal(false),
                setHasSoyAllergyGlobal(false),
                setHasTreenutAllergyGlobal(false),
                setHasWheatAllergyGlobal(false),
                setHasGlutenAllergyGlobal(false),
                setIsVeganGlobal(false),
                setIsVegetarianGlobal(false),
                setPrefersHalalGlobal(false),
                
                // Route to the login page
                router.push("/login");
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

            {visible && (
                <Text style={styles.description} id="registerErrorMessage">{error.message}</Text>            
            )}

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
                onPress={() => {
                    handlePressRegister();
                    setVisible(true);
                }}
                disabled={loading}
            >
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

        </View>
    )
}