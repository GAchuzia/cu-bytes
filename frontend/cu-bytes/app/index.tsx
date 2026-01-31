import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './styles/style-index';
import { useUser } from './context';

export default function IndexScreen() {

    const [loading, setLoading] = useState(false);
    const [isLoginPressed, setIsLoginPressed] = useState(false);
    const [isScanFoodPressed, setIsScanFoodPressed] = useState(false);

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

            {/* Route the user to the 'scan and identify a food item' page */}
            <TouchableOpacity id="scanFoodButton"
                style={[styles.bodyButtonAlt,
                    { backgroundColor: isScanFoodPressed ? '#DDDDDD' : '#FFFFFF' }
                ]}

                onPressIn={() => setIsScanFoodPressed(true)}
                onPressOut={() => setIsScanFoodPressed(false)}
                onPress={() => router.push("/scan")}>

                <Text id="scanFoodButtonText"
                    style={styles.bodyButtonTextAlt}>
                    
                    Scan Food Item
                </Text>

            </TouchableOpacity>

        </View>
    )

}
