import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Pressable } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { apiService } from '../services/api';
import { styles } from './style';

export default function LoginScreen() {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('Enter a new username');
    const [password, setPassword] = useState('Enter a new password');

    const [data, setData] = useState({
        username: "",
        password: ""
    });

    function saveUsernameInputText(event) {
        setUsername(event.target.value);
    }

    function savePasswordInputText(event) {
        setPassword(event.target.value)
    }

    return (

        <View style={StyleSheet.container}>
            <StatusBar style="auto" />

            <Text style={styles.title}>Create Account for CU-Bytes</Text>
            <Text style={styles.subtitle}>Create a new CU-Bytes account</Text>

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

                // API call to backend register
                onPress={useEffect(() => {
                fetch("/register").then(res =>
                    res.json().then(data => {
                        // Setting a data from api
                        setData({
                            username: username,
                            password: password
                        });
                    })
                );
                })}

                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    Create Account
                </Text>

            </TouchableOpacity>

        </View>

    )

}