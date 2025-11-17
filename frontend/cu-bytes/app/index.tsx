import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { apiService } from '../services/api';

import { styles } from './style-index';

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);

  const healthCheck = async () => {
    setLoading(true);
    try {
      const response = await apiService.healthCheck();
      Alert.alert(
        'Health Check Success',
        `Status: ${response.status}\nMessage: ${response.message}\nTimestamp: ${response.timestamp}`
      );
    } catch (error) {
      console.error('Health check error:', error);
      // Fix TypeScript error by properly typing the error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert(
        'Health Check Failed',
        `Error: ${errorMessage}\n\nMake sure:\n• Flask server is running\n• Both devices are on same WiFi\n• IP address is correct`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Text style={styles.title}>CU-Bytes</Text>
      <Text style={styles.subtitle}>Server Health Check</Text>
      <Text style={styles.description}>
        Click the button below to check if the server is running and healthy.
      </Text>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={healthCheck}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Checking...' : 'Health Check'}
        </Text>

      </TouchableOpacity>

      <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={() => router.push("/splash")}
          disabled={loading}
      >
          <Text style={styles.buttonText}>
            Splash
          </Text>
      </TouchableOpacity>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Troubleshooting:</Text>
        <Text style={styles.infoText}>• Make sure Flask server is running</Text>
        <Text style={styles.infoText}>• Both devices on same WiFi network</Text>
        <Text style={styles.infoText}>• Check IP address in api.ts</Text>
        <Text style={styles.infoText}>• Test in browser: http://YOUR_IP:5000/api/health</Text>
      </View>
    </View>
  );
}
