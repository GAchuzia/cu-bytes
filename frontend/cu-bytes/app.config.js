export default {
  expo: {
    name: "cu-bytes",
    slug: "cu-bytes",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/CU-Bytes Logo.png",
    scheme: "cubytes",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/CU-Bytes Logo.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.gachuzia.cubytes",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
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
