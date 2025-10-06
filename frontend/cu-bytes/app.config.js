export default {
  expo: {
    name: "cu-bytes",
    slug: "cu-bytes",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: ["expo-router"],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      // This will be overridden by environment variables
      apiIP: process.env.EXPO_PUBLIC_API_IP || "YOUR_IP_HERE",
    },
  },
};
