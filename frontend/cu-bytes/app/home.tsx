import { useEffect, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Modal } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './_styles/style-home';
import { screenChrome as sc } from './_styles/screenChrome';
import { useUser } from './_context';
import { API_BASE_URL } from '../services/api';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [browseButtons, setBrowseButtons] = useState(false);

  const [isSettingsPressed, setIsSettingsPressed] = useState(false);
  const [isLoginLogoutPressed, setIsLoginLogoutPressed] = useState(false);

  const [isScanFoodItemPressed, setIsScanFoodItemPressed] = useState(false);
  const [isBrowsePressed, setIsBrowsePressed] = useState(false);
  const [isBrowseFoodItemsPressed, setIsBrowseFoodItemsPressed] =
    useState(false);
  const [isBrowseDiningLocationsPressed, setIsBrowseDiningLocationsPressed] =
    useState(false);

  const [isViewSavedFoodItemsPressed, setIsViewSavedFoodItemsPressed] =
    useState(false);
  const [isStatisticsPressed, setIsStatisticsPressed] = useState(false);
  const [isRecommendationsPressed, setIsRecommendationsPressed] =
    useState(false);

  const {
    usernameGlobal,
    hasConfiguredSettingsGlobal,
    setUsernameGlobal,
    setHasConfiguredSettingsGlobal,
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

  useEffect(() => {
    const getProfileConfigured = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/profile/configured/${usernameGlobal}`
        );
        const data = await res.json();

        if (!data.has_configured_settings) {
          setModalVisible(true);
          setTimeout(() => {
            setModalVisible(false);
          }, 2000);
        }
      } catch (err) {
        console.error(err);
      }
    };

    getProfileConfigured();
  }, []);

  const logout = () => {
    setUsernameGlobal('');
    setHasConfiguredSettingsGlobal(false);
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

  const guest = usernameGlobal === '';

  return (
    <SafeAreaView style={sc.safeRoot} edges={['top', 'left', 'right']}>
      <View style={sc.container}>
        <StatusBar style="dark" />

        <View id="homeStatusbar" style={sc.topBar}>
          <TouchableOpacity
            id="settingsButton"
            style={[
              sc.headerButton,
              isSettingsPressed && sc.headerButtonPressed,
              guest && sc.headerButtonDisabled,
            ]}
            onPressIn={() => setIsSettingsPressed(true)}
            onPressOut={() => setIsSettingsPressed(false)}
            onPress={() => router.push('/settings')}
            disabled={guest}
            activeOpacity={0.9}
          >
            <Text id="settingsButtonText" style={sc.headerButtonText}>
              Settings
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
          id="homeScrollView"
          style={sc.scrollView}
          contentContainerStyle={sc.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {!hasConfiguredSettingsGlobal && modalVisible && (
            <Modal
              id="notConfiguredSettingsModal"
              animationType="fade"
              transparent
              visible={modalVisible}
            >
              <View
                id="notConfiguredSettingsOuterView"
                style={styles.notConfiguredSettingsOuter}
              >
                <View
                  id="notConfiguredSettingsInnerView"
                  style={styles.notConfiguredSettingsInner}
                >
                  <Text
                    id="notConfiguredSettingsText"
                    style={styles.notConfiguredSettingsText}
                  >
                    You have not configured your profile
                  </Text>
                </View>
              </View>
            </Modal>
          )}

          <Text id="homeTitle" style={sc.pageTitle}>
            Home
          </Text>
          <Text id="homeInfoText" style={sc.pageSubtitle}>
            What would you like to do?
          </Text>

          {!browseButtons && (
            <View id="defaultButtonsView">
              <TouchableOpacity
                id="scanFoodItemButton"
                style={[
                  sc.bodyButton,
                  guest && sc.bodyButtonDisabled,
                  !guest &&
                    isScanFoodItemPressed &&
                    sc.bodyButtonPressed,
                ]}
                onPressIn={() => setIsScanFoodItemPressed(true)}
                onPressOut={() => setIsScanFoodItemPressed(false)}
                onPress={() => router.push('/scan')}
                disabled={guest}
                activeOpacity={0.92}
              >
                <Text id="scanFoodItemButtonText" style={sc.bodyButtonText}>
                  Scan food
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                id="browseButton"
                style={[
                  sc.bodyButtonOutline,
                  guest && sc.bodyButtonDisabled,
                  !guest && isBrowsePressed && { opacity: 0.85 },
                ]}
                onPressIn={() => setIsBrowsePressed(true)}
                onPressOut={() => setIsBrowsePressed(false)}
                onPress={() => setBrowseButtons(true)}
                disabled={guest}
                activeOpacity={0.92}
              >
                <Text id="browseButtonText" style={sc.bodyButtonOutlineText}>
                  Browse
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                id="viewSavedFoodItemsButton"
                style={[
                  sc.bodyButton,
                  guest && sc.bodyButtonDisabled,
                  !guest &&
                    isViewSavedFoodItemsPressed &&
                    sc.bodyButtonPressed,
                ]}
                onPressIn={() => setIsViewSavedFoodItemsPressed(true)}
                onPressOut={() => setIsViewSavedFoodItemsPressed(false)}
                onPress={() => router.push('/entries')}
                disabled={guest}
                activeOpacity={0.92}
              >
                <Text
                  id="viewSavedFoodItemsButtonText"
                  style={sc.bodyButtonText}
                >
                  Saved Foods
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                id="statisticsButton"
                style={[
                  sc.bodyButton,
                  guest && sc.bodyButtonDisabled,
                  !guest &&
                    isStatisticsPressed &&
                    sc.bodyButtonPressed,
                ]}
                onPressIn={() => setIsStatisticsPressed(true)}
                onPressOut={() => setIsStatisticsPressed(false)}
                onPress={() => router.push('/statistics')}
                disabled={guest}
                activeOpacity={0.92}
              >
                <Text id="statisticsButtonText" style={sc.bodyButtonText}>
                  Statistics
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                id="recommendationsButton"
                style={[
                  sc.bodyButton,
                  guest && sc.bodyButtonDisabled,
                  !guest &&
                    isRecommendationsPressed &&
                    sc.bodyButtonPressed,
                ]}
                onPressIn={() => setIsRecommendationsPressed(true)}
                onPressOut={() => setIsRecommendationsPressed(false)}
                onPress={() => router.push('/recommendations')}
                disabled={guest}
                activeOpacity={0.92}
              >
                <Text
                  id="recommendationsButtonText"
                  style={sc.bodyButtonText}
                >
                  Food & Dining Recommendations
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {browseButtons && (
            <View id="browseButtonsView">
              <TouchableOpacity
                id="browseFoodItemsButton"
                style={[
                  sc.bodyButton,
                  guest && sc.bodyButtonDisabled,
                  !guest &&
                    isBrowseFoodItemsPressed &&
                    sc.bodyButtonPressed,
                ]}
                onPressIn={() => setIsBrowseFoodItemsPressed(true)}
                onPressOut={() => setIsBrowseFoodItemsPressed(false)}
                onPress={() => router.push('/enter')}
                disabled={guest}
                activeOpacity={0.92}
              >
                <Text
                  id="browseFoodItemsButtonText"
                  style={sc.bodyButtonText}
                >
                  Browse food
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                id="browseDiningLocationsButton"
                style={[
                  sc.bodyButton,
                  guest && sc.bodyButtonDisabled,
                  !guest &&
                    isBrowseDiningLocationsPressed &&
                    sc.bodyButtonPressed,
                ]}
                onPressIn={() => setIsBrowseDiningLocationsPressed(true)}
                onPressOut={() => setIsBrowseDiningLocationsPressed(false)}
                onPress={() => router.push('/dining')}
                disabled={guest}
                activeOpacity={0.92}
              >
                <Text
                  id="browseDiningLocationsButtonText"
                  style={sc.bodyButtonText}
                >
                  Dining locations
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                id="browseDiningLocationsButton"
                style={[
                  sc.bodyButtonOutline,
                  guest && sc.bodyButtonDisabled,
                ]}
                onPressIn={() => setIsBrowseDiningLocationsPressed(true)}
                onPressOut={() => setIsBrowseDiningLocationsPressed(false)}
                onPress={() => setBrowseButtons(false)}
                disabled={guest}
                activeOpacity={0.92}
              >
                <Text
                  id="browseDiningLocationsButtonText"
                  style={sc.bodyButtonOutlineText}
                >
                  Back
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
