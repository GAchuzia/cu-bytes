import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { apiService } from '../services/api';

import { styles } from './style';

export default function SplashScreen() {
    const [loading, setLoading] = useState(false);
    
    return (

        <View style={StyleSheet.container}>
            <StatusBar style="auto" />

            <Text style={styles.title}>CU-Bytes</Text>
            <Text style={styles.subtitle}>Welcome to CU-Bytes!</Text>
            <Text style={styles.subtitle}>The go-to food app for Carleton University students and faculty!</Text>

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={() => router.push("/login")}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    Login
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}

                disabled={loading}
            >
                <Text style={styles.buttonText}>
                {loading ? 'Checking...' : 'Scan Food'}
                </Text>
            </TouchableOpacity>

        </View>

    )

}