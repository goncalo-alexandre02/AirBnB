import { CapacitorConfig } from '@capacitor/cli';

const config = {
  appId: 'io.ionic.airbnb',
  appName: 'AirBnB',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    baseUrl: 'http://localhost:4200/'
  }
};

export default config;
