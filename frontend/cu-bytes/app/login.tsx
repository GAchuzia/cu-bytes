import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Pressable } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { apiService } from '../services/api';
import { styles } from './style';

export default function LoginScreen() {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('Enter your username');
    const [password, setPassword] = useState('Enter your password');

    function saveUsernameInputText(event) {
        setUsername(event.target.value);
    }

    function savePasswordInputText(event) {
        setPassword(event.target.value)
    }

    return (

        <View style={StyleSheet.container}>
            <StatusBar style="auto" />

            <Text style={styles.title}>CU-Bytes</Text>
            <Text style={styles.subtitle}>Login in to your CU-Bytes account</Text>
            <Text style={styles.subtitle}>Or create a new CU-Bytes account</Text>

            <TextInput
                style={styles.textInput}
                onChange={saveUsernameInputText}
                value={username}
            >
            </TextInput>

            <TextInput
                style={styles.textInput}
                onChange={savePasswordInputText}
                value={password}
            >
            </TextInput>

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                // API call to backend login
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    Login
                </Text>

            </TouchableOpacity>

            <Pressable
                style={styles.pressableText}
                onPress={() => router.push("/register")}
            >
                Create Account
            </Pressable>

        </View>

    )

}