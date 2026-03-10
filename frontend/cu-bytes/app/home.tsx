import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

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

            <View
                style={styles.statusbar}>

                <Text id="homeTitle"
                    style={styles.headerTitle}>

                    Home
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
                        style={styles.headerButtonText}
                        numberOfLines={1}>

                        {usernameGlobal != '' ? 'Logout' : 'Login' }
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.scrollView}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
            >
            <Text id="homeInfo"
                style={styles.infoText}>

                What would you like to do?
            </Text>

                {/* Route the user to the 'scan food item' page */}
                <TouchableOpacity id="scanFoodItemButton"
                    style={[styles.bodyButton,
                        { backgroundColor: isScanFoodItemPressed || usernameGlobal == '' ? '#666666' : '#131312' }
                    ]}
                    onPressIn={() => setIsScanFoodItemPressed(true)}
                    onPressOut={() => setIsScanFoodItemPressed(false)}
                    onPress={() => router.push("/scan")}>

                    <Text id="scanFoodItemButtonText" style={styles.bodyButtonText}>
                        Scan{'\n'}Food Item
                    </Text>
                </TouchableOpacity>

                {/* Route the user to the 'browse food items' page */}
                <TouchableOpacity id="browseFoodItemsButton"
                    style={[styles.bodyButton,
                        { backgroundColor: isBrowseFoodItemsPressed || usernameGlobal == '' ? '#666666' : '#131312' }
                    ]}
                    onPressIn={() => setIsBrowseFoodItemsPressed(true)}
                    onPressOut={() => setIsBrowseFoodItemsPressed(false)}
                    onPress={() => router.push("/enter")}>

                    <Text id="browseFoodItemsButtonText" style={styles.bodyButtonText}>
                        Browse{'\n'}Food Items
                    </Text>
                </TouchableOpacity>

                {/* Route the user to the 'browse dining locations' page */}
                <TouchableOpacity id="browseDiningLocationsButton"
                    style={[styles.bodyButton,
                        { backgroundColor: isBrowseDiningLocationsPressed || usernameGlobal == '' ? '#666666' : '#131312' }
                    ]}
                    onPressIn={() => setIsBrowseDiningLocationsPressed(true)}
                    onPressOut={() => setIsBrowseDiningLocationsPressed(false)}
                    onPress={() => router.push("/dining")}>

                    <Text id="browseDiningLocationsButtonText" style={styles.bodyButtonText}>
                        Browse{'\n'}Locations
                    </Text>
                </TouchableOpacity>
 
                {/* Route the user to the 'statistics' page */}
                <TouchableOpacity id="statisticsButton"
                    style={[styles.bodyButton,
                        { backgroundColor: isStatisticsPressed || usernameGlobal == '' ? '#666666' : '#131312' }
                    ]}
                    onPressIn={() => setIsStatisticsPressed(true)}
                    onPressOut={() => setIsStatisticsPressed(false)}
                    onPress={() => router.push("/statistics")}
                    disabled={ usernameGlobal == '' ? true : false }>
                        
                    <Text id="statisticsButtonText" style={styles.bodyButtonText}>
                        View{'\n'}Statistics
                    </Text>
                </TouchableOpacity>

                {/* Route the user to the 'recommendations' page */}
                <TouchableOpacity id="recommendationsButton"
                    style={[styles.bodyButton,
                        { backgroundColor: isRecommendationsPressed || usernameGlobal == '' ? '#666666' : '#131312' }
                    ]}
                    onPressIn={() => setIsRecommendationsPressed(true)}
                    onPressOut={() => setIsRecommendationsPressed(false)}
                    onPress={() => router.push("/recommendations")}
                    disabled={ usernameGlobal == '' ? true : false }>

                    <Text id="recommendationsButtonText" style={styles.bodyButtonText}>
                        View{'\n'}Recs.
                    </Text>
                </TouchableOpacity>

                {/* Route the user to the 'settings' page */}
                <TouchableOpacity id="settingsButton"
                    style={[styles.bodyButton,
                        { backgroundColor: isSettingsPressed || usernameGlobal == '' ? '#666666' : '#131312' }
                    ]}
                    onPressIn={() => setIsSettingsPressed(true)}
                    onPressOut={() => setIsSettingsPressed(false)}
                    onPress={() => router.push("/settings")}
                    disabled={ usernameGlobal == '' ? true : false }>
                <Text>
                    Settings
                </Text>
            </TouchableOpacity>

            </ScrollView>
            </View>

        </View>
    )
}
