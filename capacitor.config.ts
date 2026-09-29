import { CapacitorConfig } from '@capacitor/cli';
const appUrl = process.env.HOSPITALX_APP_URL
  ?? process.env.NEXT_PUBLIC_SITE_URL
  ?? 'http://10.0.2.2:3000';
const config: CapacitorConfig = {
  appId: 'com.hospitalx.app',
  appName: 'HospitalX',
  webDir: 'native-shell',
  server: {
    url: appUrl,
    cleartext: appUrl.startsWith('http://'),
    androidScheme: 'https',
  }
};
export default config;
