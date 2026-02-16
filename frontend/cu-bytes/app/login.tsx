import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './styles/style-login';
import { useUser } from './context';

export default function LoginScreen() {

    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [isBackPressed, setIsBackPressed] = useState(false);
    const [isLoginLogoutPressed, setIsLoginLogoutPressed] = useState(false);
    const [isLoginPressed, setIsLoginPressed] = useState(false);
    const [isCreateAccountPressed, setIsCreateAccountPressed] = useState(false);
    const [secureTextEntry, setSecureTextEntry] = useState(true);

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

    /*
        Variable and setter for storing and modifying the username entered by the user
    */
    const [username, setUsername] = useState('');

    /*
        Variable and setter for storing and modifying the password entered by the user
    */
    const [password, setPassword] = useState('');

    /*
        Send a request to the backend endpoint to get the logged-in user's username and profile settings
    */
    const loadSettings = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:5000/profile/retreive/${usernameGlobal}`);
            const data = await res.json();

            // Update the copy of the logged-in user's username and profile settings using the retrieved data
            setHasEggAllergyGlobal(data.has_egg_allergy);
            setHasFishOrShellfishAllergyGlobal(data.has_fish_or_shellfish_allergy);
            setHasDairyIntoleranceGlobal(data.has_dairy_intolerance);
            setHasMilkAllergyGlobal(data.has_milk_allergy);
            setHasPeanutAllergyGlobal(data.has_peanut_allergy);
            setHasSesameAllergyGlobal(data.has_sesame_allergy);
            setHasSoyAllergyGlobal(data.has_soy_allergy);
            setHasTreenutAllergyGlobal(data.has_treenut_allergy);
            setHasWheatAllergyGlobal(data.has_wheat_allergy);
            setHasGlutenAllergyGlobal(data.has_gluten_allergy);
            setIsVeganGlobal(data.is_vegan);
            setIsVegetarianGlobal(data.is_vegetarian);
            setPrefersHalalGlobal(data.prefers_halal);
            setShowStatsGlobal(data.show_stats);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

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
            // Else, update the copy of the user's username to the username they entered,
            // load the user's profile settings from the backend endpoint, and route the user to the 'home' page
            // (The user successfully logged in to an account with the entered username and password)
            else {
                setUsernameGlobal(name);
                loadSettings();
                router.push("/home");
            }

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    /*
        Log out the logged-in user by setting their username and profile settings to null, and routing to the splash page
    */
    const logout = () => {

        setUsernameGlobal("");
        setShowStatsGlobal(false);
        setHasEggAllergyGlobal(false);
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

        router.push('/');
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
                    onPress={() => router.push('/')}>

                    <Text id="backButtonText"
                        style={styles.headerButtonText}>

                        Back
                    </Text>

                </TouchableOpacity>

                <View style={styles.headerContainer}></View>

                <Text id="loginTitle"
                    style={styles.headerTitle}>

                    Login
                </Text>

                <Text id="loggedInUser"
                    style={styles.headerUsernameIcon}>

                    {usernameGlobal != '' ? `${usernameGlobal}` : 'Guest' }
                </Text>

                <TouchableOpacity id="loginLogoutButton"
                    style={[styles.headerButton,
                        { backgroundColor: isLoginLogoutPressed ? '#666666' : '#131312' }
                    ]}
                    onPressIn={() => setIsLoginLogoutPressed(true)}
                    onPressOut={() => setIsLoginLogoutPressed(false)}
                    onPress={() => usernameGlobal != '' ? logout() : router.push('/login')}>

                    <Text id="loginLogoutButtonText"
                        style={styles.headerButtonText}>

                        {usernameGlobal != '' ? 'Logout' : 'Login' }
                    </Text>

                </TouchableOpacity>

            </View>

            <Text id="loginInfo"
                style={styles.infoText}>

                Sign in or create a new CU-Bytes account
            </Text>

            <Text id="loginErrorMessage"
                style={styles.errorInfoText}>

                {visible ? error.message : 'To sign in to your CU-Bytes account, enter your username and password below' }
            </Text>

            {/* Enter the username that corresponds to the account that the user wants to log in to */}
            <TextInput id="loginUsernameTextInput"
                style={styles.usernameTextInput}
                onChangeText={setUsername}
                onChange={() => {
                    setError({ message: '', status: '' });
                    setVisible(false);
                }}
                placeholder={"Enter CU-Bytes username"}
                value={username}
            >
            </TextInput>

            {/* Enter the password that corresponds to the account that the user wants to log in to */}
            <TextInput id="loginPasswordTextInput"
                style={styles.passwordTextInput}
                onChangeText={setPassword}
                onChange={() => {
                    setError({ message: '', status: '' });
                    setVisible(false);
                }}
                placeholder={"Enter CU-Bytes password"}
                value={password}
                secureTextEntry={true}
            >
            </TextInput>

            {/* Submit a request to the backend endpoint to authenticate the entered credentials and log in to an account */}
            <TouchableOpacity id="loginButton"
                style={[styles.bodyButton,
                    { backgroundColor: isLoginPressed ? '#666666' : '#131312' }
                ]}

                onPressIn={() => setIsLoginPressed(true)}
                onPressOut={() => setIsLoginPressed(false)}
                onPress={() => {
                    loginUser(username, password);
                    setVisible(true);}}>

                <Text id="loginButtonText"
                    style={styles.bodyButtonText}>

                        Login
                </Text>

            </TouchableOpacity>

            {/* Route the user to the 'create account' page */}
            <TouchableOpacity id="createAccountButton"
                style={[styles.bodyButtonAlt,
                    { backgroundColor: isCreateAccountPressed ? '#DDDDDD' : '#FFFFFF' }
                ]}

                onPressIn={() => setIsCreateAccountPressed(true)}
                onPressOut={() => setIsCreateAccountPressed(false)}
                onPress={() => router.push("/register")}>

                <Text id="createAccountButtonText"
                    style={styles.bodyButtonTextAlt}>

                        Create Account
                </Text>

            </TouchableOpacity>

        </View>

    )
}
