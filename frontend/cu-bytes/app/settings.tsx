import { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';

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

            <ScrollView id="settingsScrollView" style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled">

                <Text id="settingsInfoText" style={styles.infoText}>
                    What allergies, intolerances, or preferences do you have?
                </Text>

                <View id="hasDairyIntoleranceOuterView" style={styles.row}>
                    <Text id="hasDairyIntoleranceText" style={styles.label}>
                        Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>dairy</Text> products?
                    </Text>

                    <View id="hasDairyIntoleranceInnerView" style={styles.switchContainer}>
                        <Switch id="hasDairyIntoleranceSwitch" style={styles.switch}
                            value={hasDairyIntolerance}
                            onValueChange={setHasDairyIntolerance}/>
                    </View>
                </View>

                <View id="hasEggAllergyOuterView" style={styles.row}>
                    <Text id="hasEggAllergyText" style={styles.label}>
                        Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>eggs</Text>?
                    </Text>

                    <View id="hasEggAllergyInnerView" style={styles.switchContainer}>
                        <Switch id="hasEggAllergySwitch" style={styles.switch}
                            value={hasEggAllergy}
                            onValueChange={setHasEggAllergy}/>
                    </View>
                </View>

                <View id="hasFishOrShellfishAllergyOuterView" style={styles.row}>
                    <Text id="hasFishOrShellfishAllergyText" style={styles.label}>
                        Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>fish</Text> or <Text style={{ fontWeight: 'bold' }}>shellfish</Text>?
                    </Text>

                    <View id="hasFishOrShellfishAllergyInnerView" style={styles.switchContainer}>
                        <Switch id="hasFishOrShellfishAllergySwitch" style={styles.switch}
                            value={hasFishOrShellfishAllergy}
                            onValueChange={setHasFishOrShellfishAllergy}/>
                    </View>
                </View>

                <View id="hasGlutenAllergyOuterView" style={styles.row}>
                    <Text id="hasGlutenAllergyText" style={styles.label}>
                        Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>gluten</Text>?
                    </Text>

                    <View id="hasGlutenAllergyInnerView" style={styles.switchContainer}>
                        <Switch id="hasGlutenAllergySwitch" style={styles.switch}
                            value={hasGlutenAllergy}
                            onValueChange={setHasGlutenAllergy}/>
                    </View>
                </View>

                <View id="hasMilkAllergyOuterView" style={styles.row}>
                    <Text id="hasMilkAllergyText" style={styles.label}>
                        Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>milk</Text>?
                    </Text>

                    <View id="hasMilkAllergyInnerView" style={styles.switchContainer}>
                        <Switch id="hasMilkAllergySwitch" style={styles.switch}
                            value={hasMilkAllergy}
                            onValueChange={setHasMilkAllergy}/>
                    </View>
                </View>

                <View id="hasPeanutAllergyOuterView" style={styles.row}>
                    <Text id="hasPeanutAllergyText" style={styles.label}>
                        Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>peanuts</Text>?
                    </Text>

                    <View id="hasPeanutAllergyInnerView" style={styles.switchContainer}>
                        <Switch id="hasPeanutAllergySwitch" style={styles.switch}
                            value={hasPeanutAllergy}
                            onValueChange={setHasPeanutAllergy}/>
                    </View>
                </View>

                <View id="hasSesameAllergyOuterView" style={styles.row}>
                    <Text id="hasSesameAllergyText" style={styles.label}>
                        Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>sesame</Text>?
                    </Text>

                    <View id="hasSesameAllergyInnerView" style={styles.switchContainer}>
                        <Switch id="hasSesameAllergySwitch" style={styles.switch}
                            value={hasSesameAllergy}
                            onValueChange={setHasSesameAllergy}/>
                    </View>
                </View>

                <View id="hasSoyAllergyOuterView" style={styles.row}>
                    <Text id="hasSoyAllergyText" style={styles.label}>
                        Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>soy</Text>?
                    </Text>
                    
                    <View id="hasSoyAllergyInnerView" style={styles.switchContainer}>
                        <Switch id="hasSoyAllergySwitch" style={styles.switch}
                            value={hasSoyAllergy}
                            onValueChange={setHasSoyAllergy}/>
                    </View>
                </View>

                <View id="hasTreenutAllergyOuterView" style={styles.row}>
                    <Text id="hasTreenutAllergyText" style={styles.label}>
                        Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>treenuts</Text>?
                    </Text>

                    <View id="hasTreenutAllergyInnerView" style={styles.switchContainer}>
                        <Switch id="hasTreenutAllergySwitch" style={styles.switch}
                            value={hasTreenutAllergy}
                            onValueChange={setHasTreenutAllergy}/>
                    </View>
                </View>

                <View id="hasWheatAllergyOuterView" style={styles.row}>
                    <Text id="hasWheatAllergyText" style={styles.label}>
                        Do you have an allergy or intolerance to <Text style={{ fontWeight: 'bold' }}>wheat</Text>?
                    </Text>

                    <View id="hasWheatAllergyInnerView" style={styles.switchContainer}>
                        <Switch id="hasWheatAllergySwitch" style={styles.switch}
                            value={hasWheatAllergy}
                            onValueChange={setHasWheatAllergy}/>
                    </View>
                </View>

                <View id="isVeganOuterView" style={styles.row}>
                    <Text id="isVeganText" style={styles.label}>
                        Are you <Text style={{ fontWeight: 'bold' }}>vegan</Text>?
                    </Text>

                    <View id="isVeganInnerView" style={styles.switchContainer}>
                        <Switch id="isVeganSwitch" style={styles.switch}
                            value={isVegan}
                            onValueChange={setIsVegan}/>
                    </View>
                </View>

                <View id="isVegetarianOuterView" style={styles.row}>
                    <Text id="isVegetarianText" style={styles.label}>
                        Are you <Text style={{ fontWeight: 'bold' }}>vegetarian</Text>?
                    </Text>

                    <View id="isVegetarianInnerView" style={styles.switchContainer}>
                        <Switch id="isVegetarianSwitch" style={styles.switch}
                            value={isVegetarian}
                            onValueChange={setIsVegetarian}/>
                    </View>
                </View>

                <View id="prefersHalalOuterView" style={styles.row}>
                    <Text id="prefersHalalText" style={styles.label}>
                        Do you prefer <Text style={{ fontWeight: 'bold' }}>halal</Text> products?
                    </Text>

                    <View id="prefersHalalInnerView" style={styles.switchContainer}>
                        <Switch id="prefersHalalSwitch" style={styles.switch}
                            value={prefersHalal}
                            onValueChange={setPrefersHalal}/>
                    </View>
                </View>

                <View id="showStatsOuterView" style={styles.row}>
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

            </ScrollView>

        </View>
    )

}
