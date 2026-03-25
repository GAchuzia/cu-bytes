import { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './_styles/style-index';

export default function IndexScreen() {

    const [loading, setLoading] = useState(false);
    const [browseButtons, setBrowseButtons] = useState(false);
    const [isLoginPressed, setIsLoginPressed] = useState(false);
    const [isScanFoodItemPressed, setIsScanFoodItemPressed] = useState(false);
    const [isBrowsePressed, setIsBrowsePressed] = useState(false);
    const [isBrowseFoodItemsPressed, setIsBrowseFoodItemsPressed] = useState(false);
    const [isBrowseDiningLocationsPressed, setIsBrowseDiningLocationsPressed] = useState(false);
    
    return (

        <View id="splashView" style={styles.container}>
            
            <StatusBar style="auto" hidden={true}/>

            <View id="splashStatusBar" style={styles.statusbar}>
                <View style={styles.headerTitleBox}>
                    <Text id="splashTitle" style={styles.headerTitleText}>
                        CU-Bytes
                    </Text>
                </View>
            </View>

            <ScrollView id="splashScrollView" style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled">

                <View style={styles.infoTextBox}>
                    <Text id="splashInfoText" style={styles.infoText}>
                        Track Your Campus Meals!
                    </Text>
                </View>

                {/* Display buttons that are not related to browsing food items or browsing dining locations */}
                {!browseButtons && (
                    <View id="defaultButtonsView" style={styles.container}>

                        {/* Route the user to the 'login' page */}
                        <TouchableOpacity id="loginButton"
                            style={[styles.bodyButtonDefault, {backgroundColor: isLoginPressed ? '#666666' : '#131312'}]}
                            onPressIn={() => setIsLoginPressed(true)}
                            onPressOut={() => setIsLoginPressed(false)}
                            onPress={() => router.push("/login")}>

                            <Text id="loginButtonText" style={styles.bodyButtonTextDefault}>
                                Login
                            </Text>
                        </TouchableOpacity>

                        {/* Route the user to the 'scan food item' page */}
                        <TouchableOpacity id="scanFoodButton"
                            style={[styles.bodyButtonDefault, {backgroundColor: isScanFoodItemPressed ? '#666666' : '#131312'}]}
                            onPressIn={() => setIsScanFoodItemPressed(true)}
                            onPressOut={() => setIsScanFoodItemPressed(false)}
                            onPress={() => router.push("/scan")}>

                            <Text id="scanFoodButtonText" style={styles.bodyButtonTextDefault}>
                                Scan Food
                            </Text>
                        </TouchableOpacity>

                        {/* Button that allows the browse food items and browse dining locations buttons to be displayed */}
                        <TouchableOpacity id="browseButton"
                            style={[styles.bodyButtonDefault, {backgroundColor: isBrowsePressed ? '#666666' : '#131312'}]}
                            onPressIn={() => setIsBrowseFoodItemsPressed(true)}
                            onPressOut={() => setIsBrowseFoodItemsPressed(false)}
                            onPress={() => setBrowseButtons(true)}>

                            <Text id="browseButtonText" style={styles.bodyButtonTextDefault}>
                                Browse
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Display buttons that are related to browsing food items or browsing dining locations */}
                {browseButtons && (
                    <View id="browseButtonsView" style={styles.container}>

                        {/* Route the user to the 'browse food items' page */}
                        <TouchableOpacity id="browseFoodButton"
                            style={[styles.bodyButtonDefault, {backgroundColor: isBrowseFoodItemsPressed ? '#666666' : '#131312'}]}
                            onPressIn={() => setIsBrowseFoodItemsPressed(true)}
                            onPressOut={() => setIsBrowseFoodItemsPressed(false)}
                            onPress={() => router.push("/enter")}>

                            <Text id="browseFoodButtonText" style={styles.bodyButtonTextDefault}>
                                Browse Food
                            </Text>
                        </TouchableOpacity>

                        {/* Route the user to the 'browse dining locations' page */}
                        <TouchableOpacity id="browseDiningButton"
                            style={[styles.bodyButtonDefault, {backgroundColor: isBrowseDiningLocationsPressed ? '#666666' : '#131312'}]}
                            onPressIn={() => setIsBrowseDiningLocationsPressed(true)}
                            onPressOut={() => setIsBrowseDiningLocationsPressed(false)}
                            onPress={() => router.push("/dining")}>

                            <Text id="browseDiningButtonText" style={styles.bodyButtonTextDefault}>
                                Browse Dining Locations
                            </Text>
                        </TouchableOpacity>
        
                        {/* Display the buttons that were previously displayed */}
                        <TouchableOpacity id="browseDiningLocationsButton"
                            style={[styles.bodyButtonDefault, {backgroundColor: isBrowseDiningLocationsPressed ? '#666666' : '#131312'}]}
                            onPressIn={() => setIsBrowseDiningLocationsPressed(true)}
                            onPressOut={() => setIsBrowseDiningLocationsPressed(false)}
                            onPress={() => setBrowseButtons(false)}>

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
