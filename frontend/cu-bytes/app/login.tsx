import { useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, Switch } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './_styles/style-login';
import { useUser } from './_context';
import { API_BASE_URL } from '../services/api';

export default function LoginScreen() {

    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [isBackPressed, setIsBackPressed] = useState(false);
    const [isHomeOrSplashPressed, setIsHomeOrSplashPressed] = useState(false);
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
            const res = await fetch(`${API_BASE_URL}/profile/retreive/${username}`);
            const data = await res.json();

            // Update the copy of the logged-in user's username and profile settings using the retrieved data
            setUsernameGlobal(username)
            setShowStatsGlobal(data.show_stats);
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
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
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
            else if (data.status === 'success') {
                await loadSettings();
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
        
        setUsernameGlobal('');
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
            
            <StatusBar style="auto" hidden={true}/>

            <View id="loginStatusbar" style={styles.statusbar}>

                {/* Route the user to the 'splash' page */}
                <TouchableOpacity id="homeOrSplashButton"
                    style={[styles.headerButtonDefault, {backgroundColor: isHomeOrSplashPressed ? '#666666' : '#131312'}]}
                    onPressIn={() => setIsHomeOrSplashPressed(true)}
                    onPressOut={() => setIsHomeOrSplashPressed(false)}
                    onPress={() => router.push('/')}>

                    <Text id="homeOrSplashButtonText" style={styles.headerButtonTextDefault} numberOfLines={1}>
                        Home
                    </Text>
                </TouchableOpacity>

                <Text id="loggedInUser" style={styles.headerUsernameIcon}>
                    {usernameGlobal != '' ? `${usernameGlobal}` : 'Guest'}
                </Text>

                {/* Route the user to the 'splash' page or the 'login' page */}
                <TouchableOpacity id="loginLogoutButton"
                    style={[styles.headerButtonDefault, {backgroundColor: isLoginLogoutPressed ? '#666666' : '#131312'}]}
                    onPressIn={() => setIsLoginLogoutPressed(true)}
                    onPressOut={() => setIsLoginLogoutPressed(false)}
                    onPress={() => usernameGlobal != '' ? logout() : null}>

                    <Text id="loginLogoutButtonText" style={styles.headerButtonTextDefault} numberOfLines={1}>
                        {usernameGlobal != '' ? 'Logout' : 'Login'}
                    </Text>
                </TouchableOpacity>

            </View>

            <Text id="loginTitle" style={styles.headerTitle}>
                Login
            </Text>

            <ScrollView id="loginScrollView" style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled">

                <Text id="loginInfoText" style={styles.infoText}>
                    Or create a new account
                </Text>

                <Text id="loginErrorMessage" style={styles.errorInfoText}>
                    {visible ? error.message : 'Enter your username and password'}
                </Text>

                {/* Enter the username that corresponds to the account that the user wants to access */}
                <TextInput id="loginUsernameTextInput" style={styles.usernameTextInput}
                    onChangeText={setUsername}
                    onChange={() => {
                        setError({ message: '', status: '' });
                        setVisible(false);
                    }}
                    placeholder={"Enter CU-Bytes username"}
                    value={username}>
                </TextInput>

                {/* Enter the password that corresponds to the account that the user wants to access */}
                <TextInput id="loginPasswordTextInput" style={styles.passwordTextInput}
                    onChangeText={setPassword}
                    onChange={() => {
                        setError({ message: '', status: '' });
                        setVisible(false);
                    }}
                    placeholder={"Enter CU-Bytes password"}
                    value={password}
                    secureTextEntry={secureTextEntry}>
                </TextInput>

                {/* Toggle the switch to hide or unhide the password input by converting the characters to or from the * character */}
                <View id="hideOrUnhidePasswordView" style={styles.row}>
                    <Text id="hideOrUnhidePasswordInfoText" style={styles.passwordSwitchInfoText}>
                        Hide or unhide the password
                    </Text>

                    <Switch id="hideOrUnhidePasswordSwitch" style={styles.switch}
                        value={secureTextEntry}
                        onValueChange={setSecureTextEntry}>
                    </Switch>
                </View> 

                {/* Submit a request to the backend endpoint to authenticate the entered credentials and log in to an account */}
                <TouchableOpacity id="loginButton"
                    style={[styles.bodyButtonDefault, {backgroundColor: isLoginPressed ? '#666666' : '#131312'}]}
                    onPressIn={() => setIsLoginPressed(true)}
                    onPressOut={() => setIsLoginPressed(false)}
                    onPress={() => {
                        loginUser(username, password);
                        setVisible(true);}}>

                    <Text id="loginButtonText" style={styles.bodyButtonTextDefault}>
                        Login
                    </Text>
                </TouchableOpacity>

                {/* Route the user to the 'create account' page */}
                <TouchableOpacity id="createAccountButton"
                    style={[styles.bodyButtonAlt, {backgroundColor: isCreateAccountPressed ? '#DDDDDD' : '#FFFFFF'}]}
                    onPressIn={() => setIsCreateAccountPressed(true)}
                    onPressOut={() => setIsCreateAccountPressed(false)}
                    onPress={() => router.push("/register")}>

                    <Text id="createAccountButtonText" style={styles.bodyButtonTextAlt}>
                        Create Account
                    </Text>
                </TouchableOpacity>

            </ScrollView>

        </View>
    )

}
