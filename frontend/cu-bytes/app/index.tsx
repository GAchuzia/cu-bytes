import { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { screenChrome as sc } from './_styles/screenChrome';
import { styles } from './_styles/style-index';

export default function IndexScreen() {
  const [browseButtons, setBrowseButtons] = useState(false);
  const [isLoginPressed, setIsLoginPressed] = useState(false);
  const [isScanFoodItemPressed, setIsScanFoodItemPressed] = useState(false);
  const [isBrowsePressed, setIsBrowsePressed] = useState(false);
  const [isBrowseFoodItemsPressed, setIsBrowseFoodItemsPressed] = useState(false);
  const [isBrowseDiningLocationsPressed, setIsBrowseDiningLocationsPressed] =
    useState(false);
  const [isBackPressed, setIsBackPressed] = useState(false);

  return (
    <SafeAreaView style={sc.safeRoot} edges={['top', 'left', 'right', 'bottom']}>
      <View id="splashView" style={sc.container}>
        <StatusBar style="dark" />

        <ScrollView
          id="splashScrollView"
          style={sc.scrollView}
          contentContainerStyle={sc.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text id="splashTitle" style={[sc.pageTitle, styles.brandTitle]}>
            CU-Bytes
          </Text>
          <Text style={[sc.pageSubtitle, styles.subtitleCenter, styles.taglineTight]}>
            Track your campus meals
          </Text>
          <Text style={[sc.pageSubtitle, styles.hintCenter]}>
            {!browseButtons ? 'Choose an option' : 'Browse'}
          </Text>

          {!browseButtons && (
            <View id="defaultButtonsView" style={styles.actionsStack}>
              <TouchableOpacity
                id="loginButton"
                style={[
                  sc.bodyButton,
                  isLoginPressed && sc.bodyButtonPressed,
                ]}
                onPressIn={() => setIsLoginPressed(true)}
                onPressOut={() => setIsLoginPressed(false)}
                onPress={() => router.push('/login')}
                activeOpacity={0.92}
              >
                <Text id="loginButtonText" style={sc.bodyButtonText}>
                  Log in
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                id="scanFoodButton"
                style={[
                  sc.bodyButton,
                  isScanFoodItemPressed && sc.bodyButtonPressed,
                ]}
                onPressIn={() => setIsScanFoodItemPressed(true)}
                onPressOut={() => setIsScanFoodItemPressed(false)}
                onPress={() => router.push('/scan')}
                activeOpacity={0.92}
              >
                <Text id="scanFoodButtonText" style={sc.bodyButtonText}>
                  Scan food
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                id="browseButton"
                style={[
                  sc.bodyButtonOutline,
                  isBrowsePressed && { opacity: 0.88 },
                ]}
                onPressIn={() => setIsBrowsePressed(true)}
                onPressOut={() => setIsBrowsePressed(false)}
                onPress={() => setBrowseButtons(true)}
                activeOpacity={0.92}
              >
                <Text id="browseButtonText" style={sc.bodyButtonOutlineText}>
                  Browse menu &amp; locations
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {browseButtons && (
            <View id="browseButtonsView" style={styles.actionsStack}>
              <TouchableOpacity
                id="browseFoodButton"
                style={[
                  sc.bodyButton,
                  isBrowseFoodItemsPressed && sc.bodyButtonPressed,
                ]}
                onPressIn={() => setIsBrowseFoodItemsPressed(true)}
                onPressOut={() => setIsBrowseFoodItemsPressed(false)}
                onPress={() => router.push('/enter')}
                activeOpacity={0.92}
              >
                <Text id="browseFoodButtonText" style={sc.bodyButtonText}>
                  Browse food
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                id="browseDiningButton"
                style={[
                  sc.bodyButton,
                  isBrowseDiningLocationsPressed && sc.bodyButtonPressed,
                ]}
                onPressIn={() => setIsBrowseDiningLocationsPressed(true)}
                onPressOut={() => setIsBrowseDiningLocationsPressed(false)}
                onPress={() => router.push('/dining')}
                activeOpacity={0.92}
              >
                <Text id="browseDiningButtonText" style={sc.bodyButtonText}>
                  Dining locations
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                id="browseDiningLocationsButton"
                style={[
                  sc.bodyButtonOutline,
                  isBackPressed && { opacity: 0.88 },
                ]}
                onPressIn={() => setIsBackPressed(true)}
                onPressOut={() => setIsBackPressed(false)}
                onPress={() => setBrowseButtons(false)}
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
