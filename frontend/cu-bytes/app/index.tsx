import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './styles/style-index';
import { useUser } from './context';

export default function IndexScreen() {

    const [loading, setLoading] = useState(false);
    /*
        Variables used to store a copy of the logged-in user's username and profile settings 
    */
    const
        {
            usernameGlobal

        } = useUser();
    
    return (

        <View style={styles.container}>
            <StatusBar style="auto" />

            <Text style={styles.subtitle}>{usernameGlobal != "" ? `Logged in as ${usernameGlobal}` : "Not logged in"}</Text>

            <Text style={styles.title}>CU-Bytes</Text>
            <Text style={styles.subtitle}>Track Your Campus Meals!</Text>

            {/* Route the user to the 'login' page */}
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={() => router.push("/login")}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    Login
                </Text>
            </TouchableOpacity>

            {/* Route the user to the 'scan and identify a food item' page */}
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={() => router.push("/scan")}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    Scan and Identify a Food Item
                </Text>
            </TouchableOpacity>

        </View>
    )

}
