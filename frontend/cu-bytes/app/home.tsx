import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './styles/style-home';
import { useUser } from './context';

export default function HomeScreen() {

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

            <Text style={styles.title}>Home</Text>

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

            {/* Route the user to the 'browse food items by dining location' page */}
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={() => router.push("/dining")}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    Browse Food Items by Dining Location
                </Text>
            </TouchableOpacity>

            {/* Route the user to the 'view my saved food items' page */}
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={() => router.push("/entries")}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    View My Saved Food Items
                </Text>
            </TouchableOpacity>

            {/* Route the user to the 'goals' page */}
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                //onPress={() => router.push("/goals")}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    Goals
                </Text>
            </TouchableOpacity>

            {/* Route the user to the 'settings' page */}
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={() => router.push("/settings")}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    Settings
                </Text>
            </TouchableOpacity>

        </View>
    )
}
