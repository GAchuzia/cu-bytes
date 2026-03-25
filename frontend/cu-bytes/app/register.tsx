import { useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, Switch } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles as regStyles } from './_styles/style-register';
import { screenChrome as sc } from './_styles/screenChrome';
import { useUser } from './_context';
import { API_BASE_URL } from '../services/api';

export default function RegisterScreen() {
  const [visible, setVisible] = useState(false);
  const [isHomeOrSplashPressed, setIsHomeOrSplashPressed] = useState(false);
  const [isLoginLogoutPressed, setIsLoginLogoutPressed] = useState(false);
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

  const loadSettings = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/profile/retreive/${username}`
      );
      const data = await res.json();

      setUsernameGlobal(username);
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

  const registerUser = async (name: string, psswrd: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, password: psswrd }),
      });
      const data = await res.json();

      if (data.status === 'error') {
        setError(data);
        console.log(error);
      } else {
        await loadSettings();
        router.push('/home');
      }
    } catch (err) {
      console.error(err);
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

        <View id="registerStatusbar" style={sc.topBar}>
          <TouchableOpacity
            id="homeOrSplashButton"
            style={[
              sc.headerButton,
              isHomeOrSplashPressed && sc.headerButtonPressed,
            ]}
            onPressIn={() => setIsHomeOrSplashPressed(true)}
            onPressOut={() => setIsHomeOrSplashPressed(false)}
            onPress={() => router.push('/login')}
            activeOpacity={0.9}
          >
            <Text id="homeOrSplashButtonText" style={sc.headerButtonText}>
              Back
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
            onPress={() =>
              usernameGlobal !== '' ? logout() : router.push('/login')
            }
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
          id="registerScrollView"
          style={sc.scrollView}
          contentContainerStyle={sc.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text id="registerTitle" style={sc.pageTitle}>
            Create account
          </Text>
          <Text id="createAccountInfo" style={sc.pageSubtitle}>
            Choose a username and password. Requirements apply.
          </Text>

          <View style={regStyles.requirementsBlock}>
            <Text
              id="usernameReqsTitle"
              style={[
                regStyles.requirementsSectionTitle,
                regStyles.requirementsSectionTitleFirst,
              ]}
            >
              Username
            </Text>
            <Text id="usernameUniqueReq" style={regStyles.requirementsLine}>
              Unique, 1–80 characters
            </Text>
            <Text id="usernameLengthReq" style={regStyles.requirementsLine}>
              Letters, numbers, and underscores only
            </Text>

            <Text id="passwordReqsTitle" style={regStyles.requirementsSectionTitle}>
              Password
            </Text>
            <Text id="passwordLengthReq" style={regStyles.requirementsLine}>
              10–120 characters
            </Text>
            <Text id="passwordCharReq" style={regStyles.requirementsLine}>
              At least one lowercase, uppercase, number, and special character
            </Text>
          </View>

          <View style={sc.formCard}>
            <Text id="createAccountErrorMessage" style={sc.errorBanner}>
              {visible ? error.message : 'Enter a valid username and password'}
            </Text>

            <TextInput
              id="createAccountUsernameTextInput"
              style={sc.textInput}
              onChangeText={setUsername}
              onChange={() => {
                setError({ message: '', status: '' });
                setVisible(false);
              }}
              placeholder="New username"
              placeholderTextColor="#8E95A1"
              value={username}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              id="createAccountPasswordTextInput"
              style={sc.textInput}
              onChangeText={setPassword}
              onChange={() => {
                setError({ message: '', status: '' });
                setVisible(false);
              }}
              placeholder="New password"
              placeholderTextColor="#8E95A1"
              value={password}
              secureTextEntry={secureTextEntry}
            />

            <View id="hideOrUnhidePasswordView" style={sc.switchRow}>
              <Text
                id="hideOrUnhidePasswordInfoText"
                style={sc.switchLabel}
              >
                Hide password
              </Text>
              <Switch
                id="hideOrUnhidePasswordSwitch"
                style={sc.switchScale}
                value={secureTextEntry}
                onValueChange={setSecureTextEntry}
              />
            </View>

            <TouchableOpacity
              id="createAccountButton"
              style={[
                sc.bodyButton,
                isCreateAccountPressed && sc.bodyButtonPressed,
              ]}
              onPressIn={() => setIsCreateAccountPressed(true)}
              onPressOut={() => setIsCreateAccountPressed(false)}
              onPress={() => {
                registerUser(username, password);
                setVisible(true);
              }}
              activeOpacity={0.92}
            >
              <Text id="createAccountButtonText" style={sc.bodyButtonText}>
                Create account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
