import { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './_styles/style-index';

export default function IndexScreen() {

    const [loading, setLoading] = useState(false);
    const [isLoginPressed, setIsLoginPressed] = useState(false);
    const [isScanFoodItemPressed, setIsScanFoodItemPressed] = useState(false);
    const [isBrowseFoodItemsPressed, setIsBrowseFoodItemsPressed] = useState(false);
    const [isBrowseDiningLocationsPressed, setIsBrowseDiningLocationsPressed] = useState(false);
    
    return (

        <View id="splashView" style={styles.container}>
            
            <StatusBar style="auto" hidden={true}/>

            <View id="splashStatusBar" style={styles.statusbar}>
                <Text id="splashTitle" style={styles.headerTitle}>
                    CU-Bytes
                </Text>
            </View>

            <ScrollView id="splashScrollView" style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled">

                <Text id="splashInfoText" style={styles.infoText}>
                    Track Your Campus Meals!
                </Text>

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
                        Browse Dining
                    </Text>
                </TouchableOpacity>

            </ScrollView>

        </View>
    )

}
