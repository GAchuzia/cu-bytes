import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './_styles/style-index';
import { useUser } from './_context';

export default function IndexScreen() {

    const [loading, setLoading] = useState(false);
    const [isLoginPressed, setIsLoginPressed] = useState(false);
    const [isScanFoodItemPressed, setIsScanFoodItemPressed] = useState(false);
    const [isBrowseFoodItemsPressed, setIsBrowseFoodItemsPressed] = useState(false);
    const [isBrowseDiningLocationsPressed, setIsBrowseDiningLocationsPressed] = useState(false);

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

                <Text id="splashTitle"
                    style={styles.headerTitle}>

                    CU-Bytes
                </Text>

            </View>

            <View style={styles.scrollView}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
            >
            <Text id="splashInfo"
                style={styles.infoText}>

                Track Your Campus Meals!
            </Text>

            {/* Route the user to the 'login' page */}
            <TouchableOpacity id="loginButton"
                style={[styles.bodyButton,
                    { backgroundColor: isLoginPressed ? '#6666666' : '#131312' }
                ]}

                onPressIn={() => setIsLoginPressed(true)}
                onPressOut={() => setIsLoginPressed(false)}
                onPress={() => router.push("/login")}>

                <Text id="loginButtonText"
                    style={styles.bodyButtonText}>
                    
                    Login
                </Text>
            </TouchableOpacity>

            {/* Route the user to the 'scan food item' page */}
            <TouchableOpacity id="scanFoodButton"
                style={[styles.bodyButtonAlt,
                    { backgroundColor: isScanFoodItemPressed ? '#DDDDDD' : '#FFFFFF' }
                ]}

                onPressIn={() => setIsScanFoodItemPressed(true)}
                onPressOut={() => setIsScanFoodItemPressed(false)}
                onPress={() => router.push("/scan")}>

                <Text id="scanFoodButtonText"
                    style={styles.bodyButtonTextAlt}>
                    
                    Scan Food Item
                </Text>

            </TouchableOpacity>
            
            {/* Route the user to the 'browse food items' page */}
            <TouchableOpacity id="browseFoodButton"
                style={[styles.bodyButtonAlt,
                    { backgroundColor: isBrowseFoodItemsPressed ? '#DDDDDD' : '#FFFFFF' }
                ]}

                onPressIn={() => setIsBrowseFoodItemsPressed(true)}
                onPressOut={() => setIsBrowseFoodItemsPressed(false)}
                onPress={() => router.push("/enter")}>

                <Text id="browseFoodButtonText"
                    style={styles.bodyButtonTextAlt}>
                    
                    Browse Food Items
                </Text>

            </TouchableOpacity>

            {/* Route the user to the 'browse dining locations' page */}
            <TouchableOpacity id="browseDiningButton"
                style={[styles.bodyButtonAlt,
                    { backgroundColor: isBrowseDiningLocationsPressed ? '#DDDDDD' : '#FFFFFF' }
                ]}

                onPressIn={() => setIsBrowseDiningLocationsPressed(true)}
                onPressOut={() => setIsBrowseDiningLocationsPressed(false)}
                onPress={() => router.push("/dining")}>

                <Text id="browseDiningButtonText"
                    style={styles.bodyButtonTextAlt}>
                    
                    Browse Dining Locations
                </Text>

            </TouchableOpacity>

            </ScrollView>
            </View>

        </View>
    )

}
