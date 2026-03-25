import { useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, Switch } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { screenChrome as sc } from './_styles/screenChrome';
import { useUser } from './_context';
import { API_BASE_URL } from '../services/api';

export default function LoginScreen() {
  const [visible, setVisible] = useState(false);
  const [isHomeOrSplashPressed, setIsHomeOrSplashPressed] = useState(false);
  const [isLoginLogoutPressed, setIsLoginLogoutPressed] = useState(false);
  const [isLoginPressed, setIsLoginPressed] = useState(false);
  const [isCreateAccountPressed, setIsCreateAccountPressed] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const [error, setError] = useState({
    message: '',
    status: '',
  });

  const {
    usernameGlobal,
    setUsernameGlobal,
    setHasConfiguredSettingsGlobal,
    setShowStatsGlobal,
    setHasDairyIntoleranceGlobal,
    setHasEggAllergyGlobal,
    setHasFishOrShellfishAllergyGlobal,
    setHasGlutenAllergyGlobal,
    setHasMilkAllergyGlobal,
    setHasPeanutAllergyGlobal,
    setHasSesameAllergyGlobal,
    setHasSulfitesAllergyGlobal,
    setHasSoyAllergyGlobal,
    setHasTreenutAllergyGlobal,
    setHasWheatAllergyGlobal,
    setIsVeganGlobal,
    setIsVegetarianGlobal,
    setPrefersHalalGlobal,
  } = useUser();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loadSettings = async (loggedInAs: string) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/profile/retreive/${encodeURIComponent(loggedInAs)}`
      );
      const data = await res.json();

      setUsernameGlobal(loggedInAs);
      setHasConfiguredSettingsGlobal(data.has_configured_settings);
      setShowStatsGlobal(data.show_stats);
      setHasEggAllergyGlobal(data.has_egg_allergy);
      setHasFishOrShellfishAllergyGlobal(data.has_fish_or_shellfish_allergy);
      setHasDairyIntoleranceGlobal(data.has_dairy_intolerance);
      setHasMilkAllergyGlobal(data.has_milk_allergy);
      setHasPeanutAllergyGlobal(data.has_peanut_allergy);
      setHasSesameAllergyGlobal(data.has_sesame_allergy);
      setHasSoyAllergyGlobal(data.has_soy_allergy);
      setHasSulfitesAllergyGlobal(data.has_sulfites);
      setHasTreenutAllergyGlobal(data.has_treenut_allergy);
      setHasWheatAllergyGlobal(data.has_wheat_allergy);
      setHasGlutenAllergyGlobal(data.has_gluten_allergy);
      setIsVeganGlobal(data.is_vegan);
      setIsVegetarianGlobal(data.is_vegetarian);
      setPrefersHalalGlobal(data.prefers_halal);
    } catch (err) {
      console.error(err);
    }
  };

  const loginUser = async (name: string, psswrd: string) => {
    const trimmedUser = name.trim();
    const trimmedPass = psswrd.trim();
    setError({ message: '', status: '' });

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: trimmedUser,
          password: trimmedPass,
        }),
      });

      let data: { status?: string; message?: string } = {};
      try {
        data = await res.json();
      } catch {
        setError({
          message: 'Invalid response from server.',
          status: 'error',
        });
        return;
      }

      if (data.status === 'error' || !res.ok) {
        setError({
          message: data.message || `Login failed (${res.status})`,
          status: 'error',
        });
        return;
      }

      if (data.status === 'success') {
        setUsername(trimmedUser);
        await loadSettings(trimmedUser);
        router.push('/home');
      }
    } catch (err) {
      console.error(err);
      setError({
        message: 'Network error. Check your connection and try again.',
        status: 'error',
      });
    }
  };

  const logout = () => {
    setUsernameGlobal('');
    setHasConfiguredSettingsGlobal(false);
    setShowStatsGlobal(false);
    setHasDairyIntoleranceGlobal(false);
    setHasEggAllergyGlobal(false);
    setHasFishOrShellfishAllergyGlobal(false);
    setHasGlutenAllergyGlobal(false);
    setHasMilkAllergyGlobal(false);
    setHasPeanutAllergyGlobal(false);
    setHasSesameAllergyGlobal(false);
    setHasSoyAllergyGlobal(false);
    setHasSulfitesAllergyGlobal(false);
    setHasTreenutAllergyGlobal(false);
    setHasWheatAllergyGlobal(false);
    setIsVeganGlobal(false);
    setIsVegetarianGlobal(false);
    setPrefersHalalGlobal(false);

    router.push('/');
  };

  return (
    <SafeAreaView style={sc.safeRoot} edges={['top', 'left', 'right']}>
      <View style={sc.container}>
        <StatusBar style="dark" />

        <View id="loginStatusbar" style={sc.topBar}>
          <TouchableOpacity
            id="homeOrSplashButton"
            style={[
              sc.headerButton,
              isHomeOrSplashPressed && sc.headerButtonPressed,
            ]}
            onPressIn={() => setIsHomeOrSplashPressed(true)}
            onPressOut={() => setIsHomeOrSplashPressed(false)}
            onPress={() => router.push('/')}
            activeOpacity={0.9}
          >
            <Text id="homeOrSplashButtonText" style={sc.headerButtonText}>
              Home
            </Text>
          </TouchableOpacity>

          <Text id="loggedInUser" style={sc.userPill} numberOfLines={1}>
            {usernameGlobal !== '' ? usernameGlobal : 'Guest'}
          </Text>

          <TouchableOpacity
            id="loginLogoutButton"
            style={[
              sc.headerButton,
              isLoginLogoutPressed && sc.headerButtonPressed,
            ]}
            onPressIn={() => setIsLoginLogoutPressed(true)}
            onPressOut={() => setIsLoginLogoutPressed(false)}
            onPress={() => (usernameGlobal !== '' ? logout() : null)}
            activeOpacity={0.9}
          >
            <Text
              id="loginLogoutButtonText"
              style={sc.headerButtonText}
              numberOfLines={1}
            >
              {usernameGlobal !== '' ? 'Log out' : 'Log in'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          id="loginScrollView"
          style={sc.scrollView}
          contentContainerStyle={sc.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text id="loginTitle" style={sc.pageTitle}>
            Log In
          </Text>
          <Text id="loginInfoText" style={sc.pageSubtitle}>
            Welcome back — or create a new account below.
          </Text>

          <View style={sc.formCard}>
            <Text
              id="loginErrorMessage"
              style={visible && error.status === 'error' ? sc.errorBanner : sc.infoBanner}
            >
              {visible && error.status === 'error'
                ? error.message
                : 'Enter your username and password'}
            </Text>

            <TextInput
              id="loginUsernameTextInput"
              style={sc.textInput}
              onChangeText={setUsername}
              onChange={() => {
                setError({ message: '', status: '' });
                setVisible(false);
              }}
              placeholder="CU-Bytes username"
              placeholderTextColor="#8E95A1"
              value={username}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              id="loginPasswordTextInput"
              style={sc.textInput}
              onChangeText={setPassword}
              onChange={() => {
                setError({ message: '', status: '' });
                setVisible(false);
              }}
              placeholder="Password"
              placeholderTextColor="#8E95A1"
              value={password}
              secureTextEntry={secureTextEntry}
            />

            <View id="hideOrUnhidePasswordView" style={sc.switchRow}>
              <Text
                id="hideOrUnhidePasswordInfoText"
                style={sc.switchLabel}
              >
                Hide Password
              </Text>
              <Switch
                id="hideOrUnhidePasswordSwitch"
                style={sc.switchScale}
                value={secureTextEntry}
                onValueChange={setSecureTextEntry}
              />
            </View>

            <TouchableOpacity
              id="loginButton"
              style={[
                sc.bodyButton,
                isLoginPressed && sc.bodyButtonPressed,
              ]}
              onPressIn={() => setIsLoginPressed(true)}
              onPressOut={() => setIsLoginPressed(false)}
              onPress={() => {
                loginUser(username, password);
                setVisible(true);
              }}
              activeOpacity={0.92}
            >
              <Text id="loginButtonText" style={sc.bodyButtonText}>
                Log In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              id="createAccountButton"
              style={[
                sc.bodyButtonOutline,
                isCreateAccountPressed && { opacity: 0.88 },
              ]}
              onPressIn={() => setIsCreateAccountPressed(true)}
              onPressOut={() => setIsCreateAccountPressed(false)}
              onPress={() => router.push('/register')}
              activeOpacity={0.92}
            >
              <Text
                id="createAccountButtonText"
                style={sc.bodyButtonOutlineText}
              >
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
