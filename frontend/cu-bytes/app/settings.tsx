import { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { screenChrome as sc } from './_styles/screenChrome';
import { styles } from './_styles/style-settings';
import { useUser } from './_context';
import { API_BASE_URL } from '../services/api';

export default function SettingsScreen() {

    const [loading, setLoading] = useState(true);
    const [isHomeOrSplashPressed, setIsHomeOrSplashPressed] = useState(false);
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
    const [hasSulfitesAllergy, setHasSulfitesAllergy] = useState(false);
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
            setHasSulfitesAllergyGlobal,
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
                setHasSulfitesAllergyGlobal(data.has_sulfites);
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
                setHasSulfitesAllergy(data.has_sulfites);
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
                            has_sulfites_allergy: hasSulfitesAllergy,
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
            setHasSulfitesAllergyGlobal(hasSulfitesAllergy),
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
        setHasSulfitesAllergy(false);
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
            <SafeAreaView style={[sc.safeRoot, { justifyContent: 'center', alignItems: 'center' }]} edges={['top', 'left', 'right']}>
                <ActivityIndicator size="large" color="#C5151A" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={sc.safeRoot} edges={['top', 'left', 'right']}>
        <View style={sc.container}>
            <StatusBar style="dark" />

            <View id="settingsStatusbar" style={sc.topBar}>
                <TouchableOpacity id="homeOrSplashButton"
                    style={[sc.headerButton, isHomeOrSplashPressed && sc.headerButtonPressed]}
                    onPressIn={() => setIsHomeOrSplashPressed(true)}
                    onPressOut={() => setIsHomeOrSplashPressed(false)}
                    onPress={() => router.push('/home')}
                    activeOpacity={0.9}>

                    <Text id="homeOrSplashButtonText" style={sc.headerButtonText} numberOfLines={1}>
                        Home
                    </Text>
                </TouchableOpacity>

                <Text id="loggedInUser" style={sc.userPill} numberOfLines={1}>
                    {usernameGlobal != '' ? `${usernameGlobal}` : 'Guest'}
                </Text>

                <TouchableOpacity id="loginLogoutButton"
                    style={[sc.headerButton, isLoginLogoutPressed && sc.headerButtonPressed]}
                    onPressIn={() => setIsLoginLogoutPressed(true)}
                    onPressOut={() => setIsLoginLogoutPressed(false)}
                    onPress={() => usernameGlobal != '' ? logout() : router.push('/login')}
                    activeOpacity={0.9}>

                    <Text id="loginLogoutButtonText" style={sc.headerButtonText} numberOfLines={1}>
                        {usernameGlobal != '' ? 'Log out' : 'Log in'}
                    </Text>
                </TouchableOpacity>
            </View>

            <Text id="settingsTitle" style={[sc.pageTitle, { paddingHorizontal: 20, alignSelf: 'stretch' }]}>
                Settings
            </Text>

            {!isChangePasswordPressed && !isDeleteAccountPressed && (
                <ScrollView id="settingsScrollView" style={sc.scrollView}
                    contentContainerStyle={sc.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled">

                    <Text id="settingsInfoText" style={sc.pageSubtitle}>
                        Allergies, intolerances, and dining preferences (used for warnings and recommendations).
                    </Text>

                    <View style={sc.formCard}>
                    <View id="hasDairyIntoleranceOuterView" style={styles.settingsRow}>
                        <Text id="hasDairyIntoleranceText" style={styles.label}>
                            Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>dairy</Text> products?
                        </Text>

                        <View id="hasDairyIntoleranceInnerView" style={styles.switchContainer}>
                            <Switch id="hasDairyIntoleranceSwitch" style={styles.switchScale}
                                value={hasDairyIntolerance}
                                onValueChange={setHasDairyIntolerance}/>
                        </View>
                    </View>

                    <View id="hasEggAllergyOuterView" style={styles.settingsRow}>
                        <Text id="hasEggAllergyText" style={styles.label}>
                            Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>eggs</Text>?
                        </Text>

                        <View id="hasEggAllergyInnerView" style={styles.switchContainer}>
                            <Switch id="hasEggAllergySwitch" style={styles.switchScale}
                                value={hasEggAllergy}
                                onValueChange={setHasEggAllergy}/>
                        </View>
                    </View>

                    <View id="hasFishOrShellfishAllergyOuterView" style={styles.settingsRow}>
                        <Text id="hasFishOrShellfishAllergyText" style={styles.label}>
                            Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>fish</Text> or <Text style={{ fontWeight: 'bold' }}>shellfish</Text>?
                        </Text>

                        <View id="hasFishOrShellfishAllergyInnerView" style={styles.switchContainer}>
                            <Switch id="hasFishOrShellfishAllergySwitch" style={styles.switchScale}
                                value={hasFishOrShellfishAllergy}
                                onValueChange={setHasFishOrShellfishAllergy}/>
                        </View>
                    </View>

                    <View id="hasGlutenAllergyOuterView" style={styles.settingsRow}>
                        <Text id="hasGlutenAllergyText" style={styles.label}>
                            Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>gluten</Text>?
                        </Text>

                        <View id="hasGlutenAllergyInnerView" style={styles.switchContainer}>
                            <Switch id="hasGlutenAllergySwitch" style={styles.switchScale}
                                value={hasGlutenAllergy}
                                onValueChange={setHasGlutenAllergy}/>
                        </View>
                    </View>

                    <View id="hasMilkAllergyOuterView" style={styles.settingsRow}>
                        <Text id="hasMilkAllergyText" style={styles.label}>
                            Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>milk</Text>?
                        </Text>

                        <View id="hasMilkAllergyInnerView" style={styles.switchContainer}>
                            <Switch id="hasMilkAllergySwitch" style={styles.switchScale}
                                value={hasMilkAllergy}
                                onValueChange={setHasMilkAllergy}/>
                        </View>
                    </View>

                    <View id="hasPeanutAllergyOuterView" style={styles.settingsRow}>
                        <Text id="hasPeanutAllergyText" style={styles.label}>
                            Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>peanuts</Text>?
                        </Text>

                        <View id="hasPeanutAllergyInnerView" style={styles.switchContainer}>
                            <Switch id="hasPeanutAllergySwitch" style={styles.switchScale}
                                value={hasPeanutAllergy}
                                onValueChange={setHasPeanutAllergy}/>
                        </View>
                    </View>

                    <View id="hasSesameAllergyOuterView" style={styles.settingsRow}>
                        <Text id="hasSesameAllergyText" style={styles.label}>
                            Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>sesame</Text>?
                        </Text>

                        <View id="hasSesameAllergyInnerView" style={styles.switchContainer}>
                            <Switch id="hasSesameAllergySwitch" style={styles.switchScale}
                                value={hasSesameAllergy}
                                onValueChange={setHasSesameAllergy}/>
                        </View>
                    </View>

                    <View id="hasSoyAllergyOuterView" style={styles.settingsRow}>
                        <Text id="hasSoyAllergyText" style={styles.label}>
                            Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>soy</Text>?
                        </Text>
                        
                        <View id="hasSoyAllergyInnerView" style={styles.switchContainer}>
                            <Switch id="hasSoyAllergySwitch" style={styles.switchScale}
                                value={hasSoyAllergy}
                                onValueChange={setHasSoyAllergy}/>
                        </View>
                    </View>

                    <View id="hasSulfitesAllergyOuterView" style={styles.settingsRow}>
                        <Text id="hasSulfitesAllergyText" style={styles.label}>
                            Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>sulfites</Text>?
                        </Text>

                        <View id="hasSulfitesAllergyInnerView" style={styles.switchContainer}>
                            <Switch id="hasSulfitesAllergySwitch" style={styles.switchScale}
                                value={hasSulfitesAllergy}
                                onValueChange={setHasSulfitesAllergy}/>
                        </View>
                    </View>

                    <View id="hasTreenutAllergyOuterView" style={styles.settingsRow}>
                        <Text id="hasTreenutAllergyText" style={styles.label}>
                            Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>treenuts</Text>?
                        </Text>

                        <View id="hasTreenutAllergyInnerView" style={styles.switchContainer}>
                            <Switch id="hasTreenutAllergySwitch" style={styles.switchScale}
                                value={hasTreenutAllergy}
                                onValueChange={setHasTreenutAllergy}/>
                        </View>
                    </View>

                    <View id="hasWheatAllergyOuterView" style={styles.settingsRow}>
                        <Text id="hasWheatAllergyText" style={styles.label}>
                            Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>wheat</Text>?
                        </Text>

                        <View id="hasWheatAllergyInnerView" style={styles.switchContainer}>
                            <Switch id="hasWheatAllergySwitch" style={styles.switchScale}
                                value={hasWheatAllergy}
                                onValueChange={setHasWheatAllergy}/>
                        </View>
                    </View>

                    <View id="isVeganOuterView" style={styles.settingsRow}>
                        <Text id="isVeganText" style={styles.label}>
                            Are you <Text style={{ fontWeight: 'bold' }}>vegan</Text>?
                        </Text>

                        <View id="isVeganInnerView" style={styles.switchContainer}>
                            <Switch id="isVeganSwitch" style={styles.switchScale}
                                value={isVegan}
                                onValueChange={setIsVegan}/>
                        </View>
                    </View>

                    <View id="isVegetarianOuterView" style={styles.settingsRow}>
                        <Text id="isVegetarianText" style={styles.label}>
                            Are you <Text style={{ fontWeight: 'bold' }}>vegetarian</Text>?
                        </Text>

                        <View id="isVegetarianInnerView" style={styles.switchContainer}>
                            <Switch id="isVegetarianSwitch" style={styles.switchScale}
                                value={isVegetarian}
                                onValueChange={setIsVegetarian}/>
                        </View>
                    </View>

                    <View id="prefersHalalOuterView" style={styles.settingsRow}>
                        <Text id="prefersHalalText" style={styles.label}>
                            Do you prefer <Text style={{ fontWeight: 'bold' }}>halal</Text> products?
                        </Text>

                        <View id="prefersHalalInnerView" style={styles.switchContainer}>
                            <Switch id="prefersHalalSwitch" style={styles.switchScale}
                                value={prefersHalal}
                                onValueChange={setPrefersHalal}/>
                        </View>
                    </View>

                    <View id="showStatsOuterView" style={[styles.settingsRow, styles.settingsRowLast]}>
                        <Text id="showStatsText" style={styles.label}>
                            Enable <Text style={{ fontWeight: 'bold' }}>comparisons & recommendations</Text>. Your food logs are always saved
                            to your account. If enabled, we will use your data to generate aggregated
                            trends and to personalize comparisons and recommendations.
                        </Text>

                        <View id="showStatsInnerView" style={styles.switchContainer}>
                            <Switch id="showStatsSwitch" style={styles.switchScale}
                                value={showStats}
                                onValueChange={setShowStats}/>
                        </View>
                    </View>
                    </View>

                    <TouchableOpacity id="settingsButton"
                        style={[sc.bodyButton, usernameGlobal === '' && sc.bodyButtonDisabled, isConfirmPressed && sc.bodyButtonPressed]}
                        onPressIn={() => setIsConfirmPressed(true)}
                        onPressOut={() => setIsConfirmPressed(false)}
                        onPress={() => handlePressConfirmSettings()}
                        disabled={usernameGlobal == '' ? true : false}
                        activeOpacity={0.92}>

                        <Text id="settingsButtonText" style={sc.bodyButtonText}>
                            Save preferences
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity id="changePasswordButton"
                        style={[sc.bodyButtonOutline, usernameGlobal === '' && { opacity: 0.45 }]}
                        onPress={() => {
                            setIsChangePasswordPressed(true)
                        }}
                        disabled={usernameGlobal === '' ? true : false}
                        activeOpacity={0.92}>

                        <Text id="changePasswordButtonText" style={sc.bodyButtonOutlineText}>
                            Change password
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity id="deleteAccountButton"
                        style={[styles.dangerButton, usernameGlobal === '' && { opacity: 0.45 }]}
                        onPress={() => {
                            setIsDeleteAccountPressed(true)
                        }}
                        disabled={usernameGlobal === '' ? true : false}
                        activeOpacity={0.92}>

                        <Text id="deleteAccountButtonText" style={styles.dangerButtonText}>
                            Delete account
                        </Text>
                    </TouchableOpacity>

                </ScrollView>
            )}

            {/* Display text inputs and the button used to notify the frontend to update the logged-in user's password in the backend database */}
            {isChangePasswordPressed && !isDeleteAccountPressed && (
                <ScrollView id="changePasswordScrollView" style={sc.scrollView}
                    contentContainerStyle={sc.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled">

                    <View id="changePasswordView" style={sc.formCard}>

                        <Text id="changePasswordInfoText" style={sc.pageSubtitle}>
                            Change your account password
                        </Text>

                        <Text id="changePasswordErrorMessage" style={sc.errorBanner}>
                            {error.status === 'error' ? error.message : 'Enter your current password and a new password.'}
                        </Text>

                        <TextInput id="currentPasswordTextInput" style={sc.textInput}
                            onChangeText={setCurrentPassword}
                            placeholder="Current password"
                            placeholderTextColor="#8E95A1"
                            value={currentPassword}
                            secureTextEntry={secureTextEntry}
                        />

                        <TextInput id="newPasswordTextInput" style={sc.textInput}
                            onChangeText={setNewPassword}
                            placeholder="New password"
                            placeholderTextColor="#8E95A1"
                            value={newPassword}
                            secureTextEntry={secureTextEntry}
                        />

                        <View id="hideOrUnhidePasswordView" style={sc.switchRow}>
                            <Text id="hideOrUnhidePasswordInfoText" style={sc.switchLabel}>
                                Hide Passwords
                            </Text>

                            <Switch id="hideOrUnhidePasswordSwitch" style={styles.switchScale}
                                value={secureTextEntry}
                                onValueChange={setSecureTextEntry}
                            />
                        </View>

                        <TouchableOpacity id="submitNewPasswordButton"
                            style={[sc.bodyButton, usernameGlobal === '' && sc.bodyButtonDisabled]}
                            onPress={() => {
                                handlePressSubmitNewPassword()}}
                            activeOpacity={0.92}>

                            <Text id="submitNewPasswordButtonText" style={sc.bodyButtonText}>
                                Update password
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity id="returnToSettingsButton"
                            style={sc.bodyButtonOutline}
                            onPress={() => {
                                setIsChangePasswordPressed(false);
                                setCurrentPassword('');
                                setNewPassword('')}}
                            activeOpacity={0.92}>

                            <Text id="returnToSettingsButtonText" style={sc.bodyButtonOutlineText}>
                                Back to settings
                            </Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            )}

            {/* Display text input and the button used to notify the frontend to delete the logged-in user's account from the backend database */}
            {!isChangePasswordPressed && isDeleteAccountPressed && (
                <ScrollView id="deleteAccountScrollView" style={sc.scrollView}
                    contentContainerStyle={sc.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled">

                    <View id="deleteAccountView" style={sc.formCard}>

                        <Text id="deleteAccountInfoText" style={sc.pageSubtitle}>
                            Permanently delete your account
                        </Text>

                        <Text id="deleteAccountErrorMessage" style={sc.errorBanner}>
                            {error.status === 'error' ? error.message : 'Enter your password to confirm deletion.'}
                        </Text>

                        <TextInput id="currentPasswordTextInput" style={sc.textInput}
                            onChangeText={setCurrentPassword}
                            placeholder="Current password"
                            placeholderTextColor="#8E95A1"
                            value={currentPassword}
                            secureTextEntry={secureTextEntry}
                        />

                        <View id="hideOrUnhidePasswordView" style={sc.switchRow}>
                            <Text id="hideOrUnhidePasswordInfoText" style={sc.switchLabel}>
                                Hide Passwords
                            </Text>

                            <Switch id="hideOrUnhidePasswordSwitch" style={styles.switchScale}
                                value={secureTextEntry}
                                onValueChange={setSecureTextEntry}
                            />
                        </View>

                        <TouchableOpacity id="deleteAccountButton"
                            style={[styles.dangerButton, usernameGlobal === '' && { opacity: 0.45 }]}
                            onPress={() => {
                                handlePressDeleteAccount();}}
                            activeOpacity={0.92}>

                            <Text id="deleteAccountButtonText" style={styles.dangerButtonText}>
                                Delete account permanently
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity id="returnToSettingsButton"
                            style={sc.bodyButtonOutline}
                            onPress={() => {
                                setIsDeleteAccountPressed(false);
                                setCurrentPassword('');
                                setNewPassword('')}}
                            activeOpacity={0.92}>

                            <Text id="returnToSettingsButtonText" style={sc.bodyButtonOutlineText}>
                                Back to settings
                            </Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            )}

        </View>
        </SafeAreaView>
    )

}
