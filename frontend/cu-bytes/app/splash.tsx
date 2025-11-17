import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './style-splash';

export default function SplashScreen() {
    const [loading, setLoading] = useState(false);
    
    // The page that the user sees in the app/browser
    return (

        <View style={styles.container}>
            <StatusBar style="auto" />

            <Text style={styles.title}>CU-Bytes</Text>
            <Text style={styles.subtitle}>Welcome to CU-Bytes!</Text>
            <Text style={styles.subtitle}>The go-to food app for Carleton University students and faculty!</Text>

            {/*Route the user to the login page*/}
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={() => router.push("/login")}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    Login
                </Text>
            </TouchableOpacity>

            {/*Route the user to the scan food page*/}
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={() => router.push("/scan")}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                {loading ? 'Checking...' : 'Scan Food'}
                </Text>
            </TouchableOpacity>

        </View>

    )

}