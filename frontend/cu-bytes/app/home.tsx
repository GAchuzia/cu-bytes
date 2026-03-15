import { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './_styles/style-home';
import { useUser } from './_context';

export default function HomeScreen() {

    const [loading, setLoading] = useState(false);
    const [isLoginLogoutPressed, setIsLoginLogoutPressed] = useState(false);
    const [isScanFoodItemPressed, setIsScanFoodItemPressed] = useState(false);
    const [isBrowseFoodItemsPressed, setIsBrowseFoodItemsPressed] = useState(false);
    const [isBrowseDiningLocationsPressed, setIsBrowseDiningLocationsPressed] = useState(false);
    const [isViewSavedFoodItemsPressed, setIsViewSavedFoodItemsPressed] = useState(false);
    const [isStatisticsPressed, setIsStatisticsPressed] = useState(false);
    const [isRecommendationsPressed, setIsRecommendationsPressed] = useState(false)
    const [isSettingsPressed, setIsSettingsPressed] = useState(false);

    /*
        Variables used to store a copy of the logged-in user's username and profile settings
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

            <View id="homeStatusbar" style={styles.statusbar}>

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

            <ScrollView id="homeScrollView" style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled">

                <Text id="homeTitle" style={styles.headerTitle}>
                    Home
                </Text>

                <Text id="homeInfoText" style={styles.infoText}>
                    What would you like to do?
                </Text>

                {/* Route the user to the 'scan food item' page */}
                <TouchableOpacity id="scanFoodItemButton"
                    style={[styles.bodyButtonDefault, {backgroundColor: isScanFoodItemPressed || usernameGlobal == '' ? '#666666' : '#131312'}]}
                    onPressIn={() => setIsScanFoodItemPressed(true)}
                    onPressOut={() => setIsScanFoodItemPressed(false)}
                    onPress={() => router.push("/scan")}
                    disabled={usernameGlobal == '' ? true : false}>

                    <Text id="scanFoodItemButtonText" style={styles.bodyButtonTextDefault}>
                        Scan Food
                    </Text>
                </TouchableOpacity>

                {/* Route the user to the 'browse food items' page */}
                <TouchableOpacity id="browseFoodItemsButton"
                    style={[styles.bodyButtonDefault, {backgroundColor: isBrowseFoodItemsPressed || usernameGlobal == '' ? '#666666' : '#131312'}]}
                    onPressIn={() => setIsBrowseFoodItemsPressed(true)}
                    onPressOut={() => setIsBrowseFoodItemsPressed(false)}
                    onPress={() => router.push("/enter")}
                    disabled={usernameGlobal == '' ? true : false}>

                    <Text id="browseFoodItemsButtonText" style={styles.bodyButtonTextDefault}>
                        Browse Food
                    </Text>
                </TouchableOpacity>

                {/* Route the user to the 'browse dining locations' page */}
                <TouchableOpacity id="browseDiningLocationsButton"
                    style={[styles.bodyButtonDefault, {backgroundColor: isBrowseDiningLocationsPressed || usernameGlobal == '' ? '#666666' : '#131312'}]}
                    onPressIn={() => setIsBrowseDiningLocationsPressed(true)}
                    onPressOut={() => setIsBrowseDiningLocationsPressed(false)}
                    onPress={() => router.push("/dining")}
                    disabled={usernameGlobal == '' ? true : false}>

                    <Text id="browseDiningLocationsButtonText" style={styles.bodyButtonTextDefault}>
                        Browse Dining
                    </Text>
                </TouchableOpacity>

                {/* Route the user to the 'view saved food items' page */}
                <TouchableOpacity id="viewSavedFoodItemsButton"
                    style={[styles.bodyButtonAlt, {backgroundColor: usernameGlobal == '' ? '#FFFFFF' : '#FFFFFF'}]}
                    onPressIn={() => setIsViewSavedFoodItemsPressed(true)}
                    onPressOut={() => setIsViewSavedFoodItemsPressed(false)}
                    onPress={() => router.push("/entries")}
                    disabled={usernameGlobal == '' ? true : false}>

                    <Text id="viewSavedFoodItemsButtonText" style={[styles.bodyButtonTextAlt, {color: usernameGlobal == '' ? '#FFFFFF' : '#C5151A'}]}>
                        View Saved Foods
                    </Text>
                </TouchableOpacity>

                {/* Route the user to the 'statistics' page */}
                <TouchableOpacity id="statisticsButton"
                    style={[styles.bodyButtonAlt, {backgroundColor: usernameGlobal == '' ? '#FFFFFF' : '#FFFFFF'}]}
                    onPressIn={() => setIsStatisticsPressed(true)}
                    onPressOut={() => setIsStatisticsPressed(false)}
                    onPress={() => router.push("/statistics")}
                    disabled={usernameGlobal == '' ? true : false}>
                        
                    <Text id="statisticsButtonText" style={[styles.bodyButtonTextAlt, {color: usernameGlobal == '' ? '#FFFFFF' : '#C5151A'}]}>
                        View Stats
                    </Text>
                </TouchableOpacity>

                {/* Route the user to the 'recommendations' page */}
                <TouchableOpacity id="recommendationsButton"
                    style={[styles.bodyButtonAlt, {backgroundColor: usernameGlobal == '' ? '#FFFFFF' : '#FFFFFF'}]}
                    onPressIn={() => setIsRecommendationsPressed(true)}
                    onPressOut={() => setIsRecommendationsPressed(false)}
                    onPress={() => router.push("/recommendations")}
                    disabled={usernameGlobal == '' ? true : false}>

                    <Text id="recommendationsButtonText" style={[styles.bodyButtonTextAlt, {color: usernameGlobal == '' ? '#FFFFFF' : '#C5151A'}]}>
                        View Recs
                    </Text>
                </TouchableOpacity>

                {/* Route the user to the 'settings' page */}
                <TouchableOpacity id="settingsButton"
                    style={[styles.bodyButtonAlt, {backgroundColor: usernameGlobal == '' ? '#FFFFFF' : '#FFFFFF'}]}
                    onPressIn={() => setIsSettingsPressed(true)}
                    onPressOut={() => setIsSettingsPressed(false)}
                    onPress={() => router.push("/settings")}
                    disabled={usernameGlobal == '' ? true : false}>
                    
                    <Text id="settingsButtonText" style={[styles.bodyButtonTextAlt, {color: usernameGlobal == '' ? '#FFFFFF' : '#C5151A'}]}>
                        Settings
                    </Text>
                </TouchableOpacity>

            </ScrollView>

        </View>
    )
}
