import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { apiService } from '../services/api';

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

      <Text style={styles.title}>CU Bytes</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 80,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 15,
    color: '#666',
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#888',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
});
