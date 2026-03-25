// GitHub Pages (this repo): https://gachuzia.github.io/cu-bytes/ → EXPO_PUBLIC_BASE_URL="/cu-bytes"
// CI sets it from the repo name; for local static tests: EXPO_PUBLIC_BASE_URL=/cu-bytes npx expo export -p web
const pagesBaseUrl = (process.env.EXPO_PUBLIC_BASE_URL || "").trim();

export default {
  expo: {
    name: "cu-bytes",
    slug: "cu-bytes",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/cu-bytes-logo.png",
    scheme: "cubytes",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSAppTransportSecurity: {
          // Dev: allow http://<LAN-IP>:5000 from a physical iPhone
          NSAllowsLocalNetworking: true,
        },
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/cu-bytes-logo.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.gachuzia.cubytes",
      usesCleartextTraffic: true,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/cu-bytes-logo.png",
    },
    plugins: [
      "expo-router",
      "expo-web-browser",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
      ...(pagesBaseUrl ? { baseUrl: pagesBaseUrl } : {}),
    },
    extra: {
      // This will be overridden by environment variables
      apiIP: process.env.EXPO_PUBLIC_API_IP || "YOUR_IP_HERE",
      router: {},
      eas: {
        projectId: "8840b0bd-e767-4056-8437-91b2013ea798",
      },
    },
  },
};
