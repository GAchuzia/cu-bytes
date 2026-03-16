import { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './_styles/style-settings';
import { useUser } from './_context';
import { API_BASE_URL } from '../services/api';

export default function SettingsScreen() {

    const [loading, setLoading] = useState(true);
    const [isBackPressed, setIsBackPressed] = useState(false);
    const [isLoginLogoutPressed, setIsLoginLogoutPressed] = useState(false);
    const [isConfirmPressed, setIsConfirmPressed] = useState(false);
    const [isChangePasswordPressed, setIsChangePasswordPressed] = useState(false);
    const [isDeleteAccountPressed, setIsDeleteAccountPressed] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const [showStats, setShowStats] = useState(false);
    const [hasEggAllergy, setHasEggAllergy] = useState(false);
    const [hasFishOrShellfishAllergy, setHasFishOrShellfishAllergy] = useState(false);
    const [hasDairyIntolerance, setHasDairyIntolerance] = useState(false);
    const [hasMilkAllergy, setHasMilkAllergy] = useState(false);
    const [hasPeanutAllergy, setHasPeanutAllergy] = useState(false);
    const [hasSesameAllergy, setHasSesameAllergy] = useState(false);
    const [hasSoyAllergy, setHasSoyAllergy] = useState(false);
    const [hasTreenutAllergy, setHasTreenutAllergy] = useState(false);
    const [hasWheatAllergy, setHasWheatAllergy] = useState(false);
    const [hasGlutenAllergy, setHasGlutenAllergy] = useState(false);
    const [isVegan, setIsVegan] = useState(false);
    const [isVegetarian, setIsVegetarian] = useState(false);
    const [prefersHalal, setPrefersHalal] = useState(false);

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
        (Frontend copy updated based on the backend data)
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
        Send a request to the backend endpoint to get the logged-in user's username and profile settings
    */
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/profile/retreive/${usernameGlobal}`);
                const data = await res.json();

                // Update the copy of the logged-in user's username and profile settings using the retrieved data
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
                
                setShowStats(data.show_stats);
                setHasEggAllergy(data.has_egg_allergy);
                setHasFishOrShellfishAllergy(data.has_fish_or_shellfish_allergy);
                setHasDairyIntolerance(data.has_dairy_intolerance);
                setHasMilkAllergy(data.has_milk_allergy);
                setHasPeanutAllergy(data.has_peanut_allergy);
                setHasSesameAllergy(data.has_sesame_allergy);
                setHasSoyAllergy(data.has_soy_allergy);
                setHasTreenutAllergy(data.has_treenut_allergy);
                setHasWheatAllergy(data.has_wheat_allergy);
                setHasGlutenAllergy(data.has_gluten_allergy);
                setIsVegan(data.is_vegan);
                setIsVegetarian(data.is_vegetarian);
                setPrefersHalal(data.prefers_halal);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadSettings();

    }, []);

    /*
        Send a request to the backend endpoint to update the logged-in user's profile settings
    */
    const handlePressConfirmSettings = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/profile/edit`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(
                        {
                            username: usernameGlobal,
                            has_egg_allergy: hasEggAllergy,
                            has_fish_or_shellfish_allergy: hasFishOrShellfishAllergy,
                            has_dairy_intolerance: hasDairyIntolerance,
                            has_milk_allergy: hasMilkAllergy,
                            has_peanut_allergy: hasPeanutAllergy,
                            has_sesame_allergy: hasSesameAllergy,
                            has_soy_allergy: hasSoyAllergy,
                            has_treenut_allergy: hasTreenutAllergy,
                            has_wheat_allergy: hasWheatAllergy,
                            has_gluten_allergy: hasGlutenAllergy,
                            is_vegan: isVegan,
                            is_vegetarian: isVegetarian,
                            prefers_halal: prefersHalal,
                            show_stats: showStats,
                        }
                    )
                }
            );

            setShowStatsGlobal(showStats);
            setHasEggAllergyGlobal(hasEggAllergy),
            setHasFishOrShellfishAllergyGlobal(hasFishOrShellfishAllergy);
            setHasDairyIntoleranceGlobal(hasDairyIntolerance);
            setHasMilkAllergyGlobal(hasMilkAllergy);
            setHasPeanutAllergyGlobal(hasPeanutAllergy);
            setHasSesameAllergyGlobal(hasSesameAllergy);
            setHasSoyAllergyGlobal(hasSoyAllergy);
            setHasTreenutAllergyGlobal(hasTreenutAllergy);
            setHasWheatAllergyGlobal(hasWheatAllergy);
            setHasGlutenAllergyGlobal(hasGlutenAllergy);
            setIsVeganGlobal(isVegan);
            setIsVegetarianGlobal(isVegetarian);
            setPrefersHalalGlobal(prefersHalal);

            router.push("/home");

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }

    }

    /*
        Send a request to the backend endpoint to change the logged-in user's password
    */
    const handlePressSubmitNewPassword = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:5000/auth/change-pw`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(
                        {
                            username: usernameGlobal,
                            old_password: currentPassword,
                            new_password: newPassword
                        }
                    )
                }
            );
            const data = await res.json();

            // If the backend endpoint returns an error, store the error message
            // (The user failed to provide the correct current password)
            // (The user failed to provide a new password that met the password criteria)
            if (data.status === 'error') {
                setError(data);
                console.log(error);
            }

            // Else, hide the components used to change the password
            else if (data.status === 'success') {
                setIsChangePasswordPressed(false);
            }

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    /*
        Send a request to the backend endpoint to delete the logged-in user's account
    */
    const handlePressDeleteAccount = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:5000//profile/${usernameGlobal}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(
                        {
                            password: currentPassword
                        }
                    )
                }
            );
            const data = await res.json();

            // If the backend endpoint returns an error, store the error message
            // (The user failed to provide the correct current password)
            if (data.status === 'error') {
                setError(data);
                console.log(error);
            }

            // Else, hide the components used to change the password
            else if (data.message === 'User deleted successfully') {
                setIsDeleteAccountPressed(false);
                logout();
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

    // Display loading symbol while the profiles are being fetched
    if (loading) {
        return (
            <View>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            
            <StatusBar style="auto" hidden={true}/>

            <View id="settingsStatusbar" style={styles.statusbar}>

                {/* Route the user to the 'home' page */}
                <TouchableOpacity id="backButton"
                    style={[styles.headerButtonDefault, {backgroundColor: isBackPressed ? '#666666' : '#131312'}]}
                    onPressIn={() => setIsBackPressed(true)}
                    onPressOut={() => setIsBackPressed(false)}
                    onPress={() => router.push('/home')}>

                    <Text id="backButtonText" style={styles.headerButtonTextDefault} numberOfLines={1}>
                        Back
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
                    onPress={() => usernameGlobal != '' ? logout() : router.push('/login')}>

                    <Text id="loginLogoutButtonText" style={styles.headerButtonTextDefault} numberOfLines={1}>
                        {usernameGlobal != '' ? 'Logout' : 'Login'}
                    </Text>
                </TouchableOpacity>

            </View>

            <Text id="settingsTitle" style={styles.headerTitle}>
                Settings
            </Text>          

            {!isChangePasswordPressed && !isDeleteAccountPressed && (
                <ScrollView id="settingsScrollView" style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={true}
                    keyboardShouldPersistTaps="handled">

                    <Text id="settingsInfoText" style={styles.infoText}>
                        What allergies, intolerances, or preferences do you have?
                    </Text>

                    <View id="hasDairyIntoleranceOuterView" style={styles.settingsSwitchRow}>
                        <Text id="hasDairyIntoleranceText" style={styles.label}>
                            Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>dairy</Text> products?
                        </Text>

                        <View id="hasDairyIntoleranceInnerView" style={styles.switchContainer}>
                            <Switch id="hasDairyIntoleranceSwitch" style={styles.switch}
                                value={hasDairyIntolerance}
                                onValueChange={setHasDairyIntolerance}/>
                        </View>
                    </View>

                    <View id="hasEggAllergyOuterView" style={styles.settingsSwitchRow}>
                        <Text id="hasEggAllergyText" style={styles.label}>
                            Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>eggs</Text>?
                        </Text>

                        <View id="hasEggAllergyInnerView" style={styles.switchContainer}>
                            <Switch id="hasEggAllergySwitch" style={styles.switch}
                                value={hasEggAllergy}
                                onValueChange={setHasEggAllergy}/>
                        </View>
                    </View>

                    <View id="hasFishOrShellfishAllergyOuterView" style={styles.settingsSwitchRow}>
                        <Text id="hasFishOrShellfishAllergyText" style={styles.label}>
                            Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>fish</Text> or <Text style={{ fontWeight: 'bold' }}>shellfish</Text>?
                        </Text>

                        <View id="hasFishOrShellfishAllergyInnerView" style={styles.switchContainer}>
                            <Switch id="hasFishOrShellfishAllergySwitch" style={styles.switch}
                                value={hasFishOrShellfishAllergy}
                                onValueChange={setHasFishOrShellfishAllergy}/>
                        </View>
                    </View>

                    <View id="hasGlutenAllergyOuterView" style={styles.settingsSwitchRow}>
                        <Text id="hasGlutenAllergyText" style={styles.label}>
                            Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>gluten</Text>?
                        </Text>

                        <View id="hasGlutenAllergyInnerView" style={styles.switchContainer}>
                            <Switch id="hasGlutenAllergySwitch" style={styles.switch}
                                value={hasGlutenAllergy}
                                onValueChange={setHasGlutenAllergy}/>
                        </View>
                    </View>

                    <View id="hasMilkAllergyOuterView" style={styles.settingsSwitchRow}>
                        <Text id="hasMilkAllergyText" style={styles.label}>
                            Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>milk</Text>?
                        </Text>

                        <View id="hasMilkAllergyInnerView" style={styles.switchContainer}>
                            <Switch id="hasMilkAllergySwitch" style={styles.switch}
                                value={hasMilkAllergy}
                                onValueChange={setHasMilkAllergy}/>
                        </View>
                    </View>

                    <View id="hasPeanutAllergyOuterView" style={styles.settingsSwitchRow}>
                        <Text id="hasPeanutAllergyText" style={styles.label}>
                            Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>peanuts</Text>?
                        </Text>

                        <View id="hasPeanutAllergyInnerView" style={styles.switchContainer}>
                            <Switch id="hasPeanutAllergySwitch" style={styles.switch}
                                value={hasPeanutAllergy}
                                onValueChange={setHasPeanutAllergy}/>
                        </View>
                    </View>

                    <View id="hasSesameAllergyOuterView" style={styles.settingsSwitchRow}>
                        <Text id="hasSesameAllergyText" style={styles.label}>
                            Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>sesame</Text>?
                        </Text>

                        <View id="hasSesameAllergyInnerView" style={styles.switchContainer}>
                            <Switch id="hasSesameAllergySwitch" style={styles.switch}
                                value={hasSesameAllergy}
                                onValueChange={setHasSesameAllergy}/>
                        </View>
                    </View>

                    <View id="hasSoyAllergyOuterView" style={styles.settingsSwitchRow}>
                        <Text id="hasSoyAllergyText" style={styles.label}>
                            Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>soy</Text>?
                        </Text>
                        
                        <View id="hasSoyAllergyInnerView" style={styles.switchContainer}>
                            <Switch id="hasSoyAllergySwitch" style={styles.switch}
                                value={hasSoyAllergy}
                                onValueChange={setHasSoyAllergy}/>
                        </View>
                    </View>

                    <View id="hasTreenutAllergyOuterView" style={styles.settingsSwitchRow}>
                        <Text id="hasTreenutAllergyText" style={styles.label}>
                            Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>treenuts</Text>?
                        </Text>

                        <View id="hasTreenutAllergyInnerView" style={styles.switchContainer}>
                            <Switch id="hasTreenutAllergySwitch" style={styles.switch}
                                value={hasTreenutAllergy}
                                onValueChange={setHasTreenutAllergy}/>
                        </View>
                    </View>

                    <View id="hasWheatAllergyOuterView" style={styles.settingsSwitchRow}>
                        <Text id="hasWheatAllergyText" style={styles.label}>
                            Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>wheat</Text>?
                        </Text>

                        <View id="hasWheatAllergyInnerView" style={styles.switchContainer}>
                            <Switch id="hasWheatAllergySwitch" style={styles.switch}
                                value={hasWheatAllergy}
                                onValueChange={setHasWheatAllergy}/>
                        </View>
                    </View>

                    <View id="isVeganOuterView" style={styles.settingsSwitchRow}>
                        <Text id="isVeganText" style={styles.label}>
                            Are you <Text style={{ fontWeight: 'bold' }}>vegan</Text>?
                        </Text>

                        <View id="isVeganInnerView" style={styles.switchContainer}>
                            <Switch id="isVeganSwitch" style={styles.switch}
                                value={isVegan}
                                onValueChange={setIsVegan}/>
                        </View>
                    </View>

                    <View id="isVegetarianOuterView" style={styles.settingsSwitchRow}>
                        <Text id="isVegetarianText" style={styles.label}>
                            Are you <Text style={{ fontWeight: 'bold' }}>vegetarian</Text>?
                        </Text>

                        <View id="isVegetarianInnerView" style={styles.switchContainer}>
                            <Switch id="isVegetarianSwitch" style={styles.switch}
                                value={isVegetarian}
                                onValueChange={setIsVegetarian}/>
                        </View>
                    </View>

                    <View id="prefersHalalOuterView" style={styles.settingsSwitchRow}>
                        <Text id="prefersHalalText" style={styles.label}>
                            Do you prefer <Text style={{ fontWeight: 'bold' }}>halal</Text> products?
                        </Text>

                        <View id="prefersHalalInnerView" style={styles.switchContainer}>
                            <Switch id="prefersHalalSwitch" style={styles.switch}
                                value={prefersHalal}
                                onValueChange={setPrefersHalal}/>
                        </View>
                    </View>

                    <View id="showStatsOuterView" style={styles.settingsSwitchRow}>
                        <Text id="showStatsText" style={styles.label}>
                            Enable <Text style={{ fontWeight: 'bold' }}>comparisons & recommendations</Text>. Your food logs are always saved
                            to your account. If enabled, we will use your data to generate aggregated
                            trends and to personalize comparisons and recommendations.
                        </Text>

                        <View id="showStatsInnerView" style={styles.switchContainer}>
                            <Switch id="showStatsSwitch" style={styles.switch}
                                value={showStats}
                                onValueChange={setShowStats}/>
                        </View>
                    </View>

                    <TouchableOpacity id="settingsButton"
                        style={[styles.bodyButtonDefault, {backgroundColor: isConfirmPressed || usernameGlobal == '' ? '#666666' : '#131312'}]}
                        onPressIn={() => setIsConfirmPressed(true)}
                        onPressOut={() => setIsConfirmPressed(false)}
                        onPress={() => handlePressConfirmSettings()}
                        disabled={usernameGlobal == '' ? true : false}>

                        <Text id="settingsButtonText" style={styles.bodyButtonTextDefault}>
                            Confirm
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity id="changePasswordButton"
                        style={[styles.bodyButtonDefault, {backgroundColor: usernameGlobal === '' ? '#666666' : '#131312'}]}
                        onPress={() => {
                            setIsChangePasswordPressed(true)
                        }}
                        disabled={usernameGlobal === '' ? true : false}>

                        <Text id="changePasswordButtonText" style={styles.bodyButtonTextDefault}>
                            Change Password
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity id="deleteAccountButton"
                        style={[styles.bodyButtonDefault, {backgroundColor: usernameGlobal === '' ? '#666666' : '#131312'}]}
                        onPress={() => {
                            setIsDeleteAccountPressed(true)
                        }}
                        disabled={usernameGlobal === '' ? true : false}>

                        <Text id="deleteAccountButtonText" style={styles.bodyButtonTextDefault}>
                            Delete Account
                        </Text>
                    </TouchableOpacity>      

                </ScrollView>
            )}

            {/* Display text inputs and the button used to notify the frontend to update the logged-in user's password in the backend database */}
            {isChangePasswordPressed && !isDeleteAccountPressed && (
                <ScrollView id="changePasswordScrollView" style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={true}
                    keyboardShouldPersistTaps="handled">
                    
                    <View id="changePasswordView" style={styles.container}>
                        
                        <Text id="changePasswordInfoText" style={styles.infoText}>
                            Change your account password
                        </Text>

                        <Text id="changePasswordErrorMessage" style={styles.errorInfoText}>
                            {error.status === 'error' ? error.message : 'To change your account password, enter your current password and your new password'}
                        </Text>

                        {/* Enter the current password for the logged-in user account */}
                        <TextInput id="currentPasswordTextInput" style={styles.passwordTextInput}
                            onChangeText={setCurrentPassword}
                            placeholder={'Enter current password'}
                            value={currentPassword}
                            secureTextEntry={secureTextEntry}>
                        </TextInput>

                        {/* Enter the new password for the logged-in user account */}
                        <TextInput id="newPasswordTextInput" style={styles.passwordTextInput}
                            onChangeText={setNewPassword}
                            placeholder={'Enter new password'}
                            value={newPassword}
                            secureTextEntry={secureTextEntry}>
                        </TextInput>

                        {/* Toggle the switch to hide or unhide the password inputs by converting the characters to or from the * character */}
                        <View id="hideOrUnhidePasswordView" style={styles.passwordSwitchRow}>
                            <Text id="hideOrUnhidePasswordInfoText" style={styles.passwordSwitchInfoText}>
                                Hide or unhide the passwords
                            </Text>

                            <Switch id="hideOrUnhidePasswordSwitch" style={styles.switch}
                                value={secureTextEntry}
                                onValueChange={setSecureTextEntry}>
                            </Switch>
                        </View>

                        {/* Display a button to change the password */}
                        <TouchableOpacity id="submitNewPasswordButton"
                            style={[styles.bodyButtonDefault, {backgroundColor: usernameGlobal === '' ? '#666666' : '#131312'}]}
                            onPress={() => {
                                handlePressSubmitNewPassword()}}>

                            <Text id="submitNewPasswordButtonText" style={styles.bodyButtonTextDefault}>
                                Change Password
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity id="submitNewPasswordButton"
                            style={[styles.bodyButtonDefault, {backgroundColor: usernameGlobal === '' ? '#666666' : '#131312'}]}
                            onPress={() => {
                                setIsChangePasswordPressed(false);
                                setCurrentPassword('');
                                setNewPassword('')}}>

                            <Text id="submitNewPasswordButtonText" style={styles.bodyButtonTextDefault}>
                                Return to Settings
                            </Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            )}

            {/* Display text input and the button used to notify the frontend to delete the logged-in user's account from the backend database */}
            {!isChangePasswordPressed && isDeleteAccountPressed && (
                <ScrollView id="deleteAccountScrollView" style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={true}
                    keyboardShouldPersistTaps="handled">

                    <View id="deleteAccountView" style={styles.container}>
                        
                        <Text id="deleteAccountInfoText" style={styles.infoText}>
                            Delete your account
                        </Text>

                        <Text id="deleteAccountErrorMessage" style={styles.errorInfoText}>
                            {error.status === 'error' ? error.message : 'To delete your account, enter your current password'}
                        </Text>

                        {/* Enter the current password for the logged-in user account */}
                        <TextInput id="currentPasswordTextInput" style={styles.passwordTextInput}
                            onChangeText={setCurrentPassword}
                            placeholder={'Enter current password'}
                            value={currentPassword}
                            secureTextEntry={secureTextEntry}>
                        </TextInput>

                        {/* Toggle the switch to hide or unhide the password input by converting the characters to or from the * character */}
                        <View id="hideOrUnhidePasswordView" style={styles.passwordSwitchRow}>
                            <Text id="hideOrUnhidePasswordInfoText" style={styles.passwordSwitchInfoText}>
                                Hide or unhide the password
                            </Text>

                            <Switch id="hideOrUnhidePasswordSwitch" style={styles.switch}
                                value={secureTextEntry}
                                onValueChange={setSecureTextEntry}>
                            </Switch>
                        </View> 

                        {/* Display a button to delete the account */}
                        <TouchableOpacity id="deleteAccountButton"
                            style={[styles.bodyButtonDefault, {backgroundColor: usernameGlobal === '' ? '#666666' : '#131312'}]}
                            onPress={() => {
                                handlePressDeleteAccount();}}>

                            <Text id="deleteAccountButtonText" style={styles.bodyButtonTextDefault}>
                                Delete Account
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity id="submitNewPasswordButton"
                            style={[styles.bodyButtonDefault, {backgroundColor: usernameGlobal === '' ? '#666666' : '#131312'}]}
                            onPress={() => {
                                setIsDeleteAccountPressed(false);
                                setCurrentPassword('');
                                setNewPassword('')}}>

                            <Text id="submitNewPasswordButtonText" style={styles.bodyButtonTextDefault}>
                                Return to Settings
                            </Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            )}

        </View>
    )

}
