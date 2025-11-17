import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './style-item'

export default function HomeScreen() {

    const [loading, setLoading] = useState(false);

    // The page that the user sees in the app/browser
    return (

        <View style={styles.container}>
            <StatusBar style="auto" />

            <Text style={styles.title}>Food Item</Text>

        </View>
    )
}