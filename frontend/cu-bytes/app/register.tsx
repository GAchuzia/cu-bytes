import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Pressable } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { apiService } from '../services/api';
import { styles } from './style';

export default function LoginScreen() {
    
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(
        {
            username: '',
            password: ''
        }
    );

    const [username, setUsername] = useState('Enter a new username');
    const [password, setPassword] = useState('Enter a new password');

    function saveUsernameInputText(event) {
        setUsername(event.target.value);
        console.log(username);
    }

    function savePasswordInputText(event) {
        setPassword(event.target.value);
        console.log(password);
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
                style={[styles.button, data && styles.buttonDisabled]}

                onPress={() => {
                        fetch("http://127.0.0.1:5000/auth/register", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify( { username: username, password: password } )
                            
                            }
                        ) 
                    }
                }

                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    Create Account
                </Text>

            </TouchableOpacity>

        </View>

    )

}