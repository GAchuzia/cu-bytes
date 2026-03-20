import { useEffect, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Modal } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './_styles/style-home';
import { useUser } from './_context';
import { API_BASE_URL } from '../services/api';

export default function HomeScreen() {

    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [browseButtons, setBrowseButtons] = useState(false);
    
    const [isSettingsPressed, setIsSettingsPressed] = useState(false);
    const [isLoginLogoutPressed, setIsLoginLogoutPressed] = useState(false);

    const [isScanFoodItemPressed, setIsScanFoodItemPressed] = useState(false);
    const [isBrowsePressed, setIsBrowsePressed] = useState(false);
    const [isBrowseFoodItemsPressed, setIsBrowseFoodItemsPressed] = useState(false);
    const [isBrowseDiningLocationsPressed, setIsBrowseDiningLocationsPressed] = useState(false);
    
    const [isViewSavedFoodItemsPressed, setIsViewSavedFoodItemsPressed] = useState(false);
    const [isStatisticsPressed, setIsStatisticsPressed] = useState(false);
    const [isRecommendationsPressed, setIsRecommendationsPressed] = useState(false)

    /*
        Variables used to store a copy of the logged-in user's username and profile settings
    */
    const
        {
            usernameGlobal,
            hasConfiguredSettingsGlobal,
            setUsernameGlobal,
            setHasConfiguredSettingsGlobal,
            setHasDairyIntoleranceGlobal,            
            setHasEggAllergyGlobal,
            setHasFishOrShellfishAllergyGlobal,
            setHasGlutenAllergyGlobal,
            setHasMilkAllergyGlobal,
            setHasPeanutAllergyGlobal,
            setHasSesameAllergyGlobal,
            setHasSulfitesAllergyGlobal,
            setHasSoyAllergyGlobal,
            setHasTreenutAllergyGlobal,
            setHasWheatAllergyGlobal,
            setIsVeganGlobal,
            setIsVegetarianGlobal,
            setPrefersHalalGlobal

        } = useUser();

    /*
        Send a request to the backend endpoint to get whether or not the logged-in user has configured their profile
    */
    useEffect(() => {
        const getProfileConfigured = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/profile/configured/${usernameGlobal}`);
                const data = await res.json();

                // If the logged-in user has not configured their profile
                // Enable a message to be briefly displayed every time the page renders
                if (!data.has_configured_settings) {
                    setModalVisible(true);
                    setTimeout(() => {setModalVisible(false);}, 2000);            
                }                

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
          
        };

        getProfileConfigured();

    }, []);

    /*
        Log out the logged-in user by setting their profile settings to false, and routing to the splash page
    */
    const logout = () => { 
        
        setUsernameGlobal('');
        setHasConfiguredSettingsGlobal(false);
        setHasDairyIntoleranceGlobal(false);        
        setHasEggAllergyGlobal(false);
        setHasFishOrShellfishAllergyGlobal(false);
        setHasGlutenAllergyGlobal(false);
        setHasMilkAllergyGlobal(false);
        setHasPeanutAllergyGlobal(false);
        setHasSesameAllergyGlobal(false);
        setHasSoyAllergyGlobal(false);
        setHasSulfitesAllergyGlobal(false);
        setHasTreenutAllergyGlobal(false);
        setHasWheatAllergyGlobal(false);
        setIsVeganGlobal(false);
        setIsVegetarianGlobal(false);
        setPrefersHalalGlobal(false);

        router.push('/');
    }

    return (

        <View style={styles.container}>
            
            <StatusBar style="auto" hidden={true}/>

            <View id="homeStatusbar" style={styles.statusbar}>

                {/* Route the user to the 'settings' page */}
                <TouchableOpacity id="settingsButton"
                    style={[styles.headerButtonDefault, {backgroundColor: isSettingsPressed || usernameGlobal === '' ? '#666666' : '#131312'}]}
                    onPressIn={() => setIsSettingsPressed(true)}
                    onPressOut={() => setIsSettingsPressed(false)}
                    onPress={() => router.push("/settings")}
                    disabled={usernameGlobal === '' ? true : false}>
                    
                    <Text id="settingsButtonText" style={styles.headerButtonTextDefault}>
                        Settings
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

            <ScrollView id="homeScrollView" style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled">

                {/* Display a message if the logged-in user has not configured their profile */}
                {!hasConfiguredSettingsGlobal && modalVisible && (
                    <Modal id="notConfiguredSettingsModal"
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}>

                        <View id="notConfiguredSettingsOuterView">

                            <View id="notConfiguredSettingsInnerView" style={styles.notConfiguredSettingsMessageContainer}>

                                <Text id="notConfiguredSettingsText" style={styles.notConfiguredSettingsText}>
                                    You have not configured your profile
                                </Text>
                            </View>
                        </View>

                    </Modal>
                )}

                <Text id="homeTitle" style={styles.headerTitle}>
                    Home
                </Text>

                <Text id="homeInfoText" style={styles.infoText}>
                    What would you like to do?
                </Text>

                {/* Display buttons that are not related to browsing food items or browsing dining locations */}
                {!browseButtons && (
                    <View id="defaultButtonsView" style={styles.container}>

                        {/* Route the user to the 'scan food item' page */}
                        <TouchableOpacity id="scanFoodItemButton"
                            style={[styles.bodyButtonDefault, {backgroundColor: isScanFoodItemPressed || usernameGlobal === '' ? '#666666' : '#131312'}]}
                            onPressIn={() => setIsScanFoodItemPressed(true)}
                            onPressOut={() => setIsScanFoodItemPressed(false)}
                            onPress={() => router.push("/scan")}
                            disabled={usernameGlobal === '' ? true : false}>

                            <Text id="scanFoodItemButtonText" style={styles.bodyButtonTextDefault}>
                                Scan Food
                            </Text>
                        </TouchableOpacity>

                        {/* Button that allows the browse food items and browse dining locations buttons to be displayed */}
                        <TouchableOpacity id="browseButton"
                            style={[styles.bodyButtonDefault, {backgroundColor: isBrowsePressed || usernameGlobal === '' ? '#666666' : '#131312'}]}
                            onPressIn={() => setIsBrowseFoodItemsPressed(true)}
                            onPressOut={() => setIsBrowseFoodItemsPressed(false)}
                            onPress={() => setBrowseButtons(true)}
                            disabled={usernameGlobal === '' ? true : false}>

                            <Text id="browseButtonText" style={styles.bodyButtonTextDefault}>
                                Browse
                            </Text>
                        </TouchableOpacity>

                        {/* Route the user to the 'view saved food items' page */}
                        <TouchableOpacity id="viewSavedFoodItemsButton"
                            style={[styles.bodyButtonDefault, {backgroundColor: isViewSavedFoodItemsPressed || usernameGlobal === '' ? '#666666' : '#131312'}]}
                            onPressIn={() => setIsViewSavedFoodItemsPressed(true)}
                            onPressOut={() => setIsViewSavedFoodItemsPressed(false)}
                            onPress={() => router.push("/entries")}
                            disabled={usernameGlobal === '' ? true : false}>

                            <Text id="viewSavedFoodItemsButtonText"
                                style={[styles.bodyButtonTextDefault, {backgroundColor: usernameGlobal === '' ? '#666666' : '#131312'}]}>
                                View Saved Foods
                            </Text>
                        </TouchableOpacity>

                        {/* Route the user to the 'statistics' page */}
                        <TouchableOpacity id="statisticsButton"
                            style={[styles.bodyButtonDefault,  {backgroundColor: isStatisticsPressed || usernameGlobal === '' ? '#666666' : '#131312'}]}
                            onPressIn={() => setIsStatisticsPressed(true)}
                            onPressOut={() => setIsStatisticsPressed(false)}
                            onPress={() => router.push("/statistics")}
                            disabled={usernameGlobal === '' ? true : false}>
                                
                            <Text id="statisticsButtonText"
                                style={[styles.bodyButtonTextDefault, {backgroundColor: usernameGlobal === '' ? '#666666' : '#131312'}]}>
                                View Statistics
                            </Text>
                        </TouchableOpacity>

                        {/* Route the user to the 'recommendations' page */}
                        <TouchableOpacity id="recommendationsButton"
                            style={[styles.bodyButtonDefault,  {backgroundColor: isRecommendationsPressed || usernameGlobal === '' ? '#666666' : '#131312'}]}
                            onPressIn={() => setIsRecommendationsPressed(true)}
                            onPressOut={() => setIsRecommendationsPressed(false)}
                            onPress={() => router.push("/recommendations")}
                            disabled={usernameGlobal === '' ? true : false}>

                            <Text id="recommendationsButtonText"
                                style={[styles.bodyButtonTextDefault, {backgroundColor: usernameGlobal === '' ? '#666666' : '#131312'}]}>
                                View Food and Dining Recommendations
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Display buttons that are related to browsing food items or browsing dining locations */}
                {browseButtons && (
                    <View id="browseButtonsView" style={styles.container}>

                        {/* Route the user to the 'browse food items' page */}
                        <TouchableOpacity id="browseFoodItemsButton"
                            style={[styles.bodyButtonDefault, {backgroundColor: isBrowseFoodItemsPressed || usernameGlobal === '' ? '#666666' : '#131312'}]}
                            onPressIn={() => setIsBrowseFoodItemsPressed(true)}
                            onPressOut={() => setIsBrowseFoodItemsPressed(false)}
                            onPress={() => router.push("/enter")}
                            disabled={usernameGlobal === '' ? true : false}>

                            <Text id="browseFoodItemsButtonText" style={styles.bodyButtonTextDefault}>
                                Browse Food
                            </Text>
                        </TouchableOpacity>

                        {/* Route the user to the 'browse dining locations' page */}
                        <TouchableOpacity id="browseDiningLocationsButton"
                            style={[styles.bodyButtonDefault, {backgroundColor: isBrowseDiningLocationsPressed || usernameGlobal === '' ? '#666666' : '#131312'}]}
                            onPressIn={() => setIsBrowseDiningLocationsPressed(true)}
                            onPressOut={() => setIsBrowseDiningLocationsPressed(false)}
                            onPress={() => router.push("/dining")}
                            disabled={usernameGlobal === '' ? true : false}>

                            <Text id="browseDiningLocationsButtonText" style={styles.bodyButtonTextDefault}>
                                Browse Dining Locations
                            </Text>
                        </TouchableOpacity>

                        {/* Display the buttons that were previously displayed */}
                        <TouchableOpacity id="browseDiningLocationsButton"
                            style={[styles.bodyButtonDefault, {backgroundColor: isBrowseDiningLocationsPressed || usernameGlobal === '' ? '#666666' : '#131312'}]}
                            onPressIn={() => setIsBrowseDiningLocationsPressed(true)}
                            onPressOut={() => setIsBrowseDiningLocationsPressed(false)}
                            onPress={() => setBrowseButtons(false)}
                            disabled={usernameGlobal === '' ? true : false}>

                            <Text id="browseDiningLocationsButtonText" style={styles.bodyButtonTextDefault}>
                                Back
                            </Text>
                        </TouchableOpacity>

                    </View>
                )}

            </ScrollView>

        </View>
    )
}
