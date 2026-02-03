import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './styles/style-home';
import { useUser } from './context';

export default function HomeScreen() {

    const [loading, setLoading] = useState(false);
    const [isScanFoodItemPressed, setIsScanFoodItemPressed] = useState(false);
    const [isBrowseFoodItemsPressed, setIsBrowseFoodItemsPressed] = useState(false);
    const [isBrowseDiningLocationsPressed, setIsBrowseDiningLocationsPressed] = useState(false);
    const [isViewSavedFoodItemsPressed, setIsViewSavedFoodItemsPressed] = useState(false);
    const [isGoalsPressed, setIsGoalsPressed] = useState(false);
    const [isSettingsPressed, setIsSettingsPressed] = useState(false);

    /*
        Variables used to store a copy of the logged-in user's username and profile settings 
    */
    const
        {
            usernameGlobal

        } = useUser();

    return (

        <View style={styles.container}>
            <StatusBar
                style="auto"
                hidden={true}
            />

            <View
                style={styles.statusbar}>

                <View style={styles.headerContainer}></View>
                
                <View style={styles.headerContainer}></View>

                <Text id="homeTitle"
                    style={styles.headerTitle}>
                
                    Home
                </Text>

                <View style={styles.headerContainer}></View>

                <Text id="loggedInUser"
                    style={styles.headerUsernameIcon}>

                    {usernameGlobal != '' ? `${usernameGlobal}` : 'Guest' }
                </Text>

            </View>

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
                onPress={() => router.push("/scan")}
            >

                <Text id="scanFoodItemButtonText"
                    style={styles.bodyButtonText}>
                    
                    Scan Food Item
                </Text>
            </TouchableOpacity>

            {/* Route the user to the 'browse food items' page */}
            <TouchableOpacity id="browseFoodItemsButton"
                style={[styles.bodyButton,
                    { backgroundColor: isBrowseFoodItemsPressed || usernameGlobal == '' ? '#666666' : '#131312' }
                ]}
                onPressIn={() => setIsBrowseFoodItemsPressed(true)}
                onPressOut={() => setIsBrowseFoodItemsPressed(false)}
                onPress={() => router.push("/enter")}
            >
                <Text id="browseFoodItemsButtonText"
                    style={styles.bodyButtonText}>
                    
                    Browse Food Items
                </Text>
            </TouchableOpacity>

            {/* Route the user to the 'browse dining locations' page */}
            <TouchableOpacity id="browseDiningLocationsButton"
                style={[styles.bodyButton,
                    { backgroundColor: isBrowseDiningLocationsPressed || usernameGlobal == '' ? '#666666' : '#131312' }
                ]}
                onPressIn={() => setIsBrowseDiningLocationsPressed(true)}
                onPressOut={() => setIsBrowseDiningLocationsPressed(false)}
                onPress={() => router.push("/dining")}
            >
                <Text id="browseDiningLocationsButtonText"
                    style={styles.bodyButtonText}>
                    
                    Browse Dining Locations
                </Text>
            </TouchableOpacity>

            {/* Route the user to the 'view saved food items' page */}
            <TouchableOpacity id="viewSavedFoodItemsButton"
                style={[styles.bodyButton,
                    { backgroundColor: isViewSavedFoodItemsPressed || usernameGlobal == '' ? '#666666' : '#131312' }
                ]}

                onPressIn={() => setIsViewSavedFoodItemsPressed(true)}
                onPressOut={() => setIsViewSavedFoodItemsPressed(false)}
                onPress={() => router.push("/entries")}
                disabled={ usernameGlobal == '' ? true : false }
            >
                <Text id="viewSavedFoodItemsButtonText"
                    style={styles.bodyButtonText}>
                    
                    View Saved Food Items
                </Text>
            </TouchableOpacity>

            {/* Route the user to the 'goals' page */}
            <TouchableOpacity id="goalsButton"
                style={[styles.bodyButton,
                    { backgroundColor: isGoalsPressed || usernameGlobal == '' ? '#666666' : '#131312' }
                ]}
                onPressIn={() => setIsGoalsPressed(true)}
                onPressOut={() => setIsGoalsPressed(false)}
                onPress={() => router.push("/goals")}
                disabled={ usernameGlobal == '' ? true : false }
            >
                <Text id="goalsButtonText" 
                    style={styles.bodyButtonText}>
                    
                    Goals
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
                disabled={ usernameGlobal == '' ? true : false }
            >
                <Text id="settingsButtonText" 
                    style={styles.bodyButtonText}>
                    
                    Settings
                </Text>
            </TouchableOpacity>

        </View>
    )
}
