import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './styles/style-register';
import { useUser } from './context';

export default function RegisterScreen() {

    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [isBackPressed, setIsBackPressed] = useState(false);
    const [isCreateAccountPressed, setIsCreateAccountPressed] = useState(false);

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
            <StatusBar
                style="auto"
                hidden={true}
            />

            <View
                style={styles.statusbar}>
                
                <TouchableOpacity id="backButton"
                    style={[styles.headerButton,
                        { backgroundColor: isBackPressed ? '#666666' : '#131312' }
                    ]}

                    onPressIn={ () => setIsBackPressed(true) }
                    onPressOut={ () => setIsBackPressed(false) }
                    onPress={ () => router.push('/login') }>

                    <Text id="backButtonText"
                        style={styles.headerButtonText}>
                        
                        Back
                    </Text>

                </TouchableOpacity>

                <Text id="createAccountTitle"
                    style={styles.headerTitle}>
                
                    New Account
                </Text>

                <Text id="loggedInUser"
                    style={styles.headerUsernameIcon}>

                    {usernameGlobal != '' ? `${usernameGlobal}` : 'Guest' }
                </Text>

            </View>

            <Text id="createAccountInfo"
                style={styles.infoText}>

                Create a new CU-Bytes account
            </Text>

            <Text id="usernameReqsTitle"
                style={styles.usernameReqTitle}>
                
                Username Requirements
            </Text>

            <Text id="usernameUniqueReq"
                style={styles.usernameReqInfoText}>

                Must be unique and not shared by any other user account
            </Text>
            
            <Text id="usernameLengthReq"
                style={styles.usernameReqInfoText}>

                Must be between 1 and 80 characters long
            </Text>
            
            <Text id="usernameCharReq"
                style={styles.usernameReqInfoText}>

                Must contain only letters, numbers, or underscores
            </Text>

            <Text id="passwordReqsTitle"
                style={styles.passwordReqTitle}>
                
                Password Requirements
            </Text>

            <Text id="passwordLengthReq"
                style={styles.passwordReqInfoText}>
                    
                Must be between 10 and 120 characters long
            </Text>

            <Text id="passwordCharReq"
                style={styles.passwordReqInfoText}>

                Must contain at least one lowercase letter, uppercase letter, number, and special character
            </Text>

            <Text id="createAccountErrorMessage"
                style={styles.errorInfoText}>

                {visible ? error.message : 'To create a new CU-Bytes account, enter a valid username and valid password below' }
            </Text> 

            {/* Enter the username that corresponds to the new account that the user wants to create */}
            <TextInput id="createAccountUsernameTextInput"
                style={styles.usernameTextInput}
                onChangeText={setUsername}
                onChange={() => {
                    setError({ message: '', status: '' });
                    setVisible(false);
                }}
                placeholder={"Enter new CU-Bytes username"}
                value={username}
            >
            </TextInput>

            {/* Enter the password that corresponds to the new account that the user wants to create */}
            <TextInput id="createAccountPasswordTextInput"
                style={styles.passwordTextInput}
                onChangeText={setPassword}
                onChange={() => {
                    setError({ message: '', status: '' });
                    setVisible(false);
                }}
                placeholder={"Enter new CU-Bytes password"}
                value={password}
                secureTextEntry={true}
            >
            </TextInput>

            {/* Submit a request to the backend endpoint to create a new account */}
            <TouchableOpacity id="createAccountButton"
                style={[styles.bodyButton,
                    { backgroundColor: isCreateAccountPressed ? '#666666' : '#131312' }
                ]}

                onPressIn={() => setIsCreateAccountPressed(true)}
                onPressOut={() => setIsCreateAccountPressed(false)}
                onPress={() => {
                    registerUser(username, password);
                    setVisible(true);
                }}
            >
                <Text id="createAccountButtonText"
                    style={styles.bodyButtonText}>
                    
                    Create Account
                </Text>

            </TouchableOpacity>

        </View>
    )
}