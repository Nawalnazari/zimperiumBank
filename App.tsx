import React, { useEffect, useState } from 'react';
import Config from 'react-native-config';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import ZDefendThreatModal from './src/components/ZDefendThreatModal';
import {
  ZDefend,
  ZDeviceStatus,
  ZDefendThreat,
  ZDefendLicenseKeyNames,
  ZDefendLicenseKey,
} from 'zdefend';

const LICENSE_KEYS = ZDefendLicenseKeyNames.values();
const HAS_MULTIPLE_LICENSE_KEYS = LICENSE_KEYS.length > 1;

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0A2463',
    secondary: '#FFB800',
    background: '#F0F3FA',
    surface: '#FFFFFF',
  },
};

interface SecurityState {
  loginStatus: string;
  scanProgress: number;
  activeThreats: ZDefendThreat[];
  activeNewThreats: ZDefendThreat[];
  licenseKey: string;
}

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [security, setSecurity] = useState<SecurityState>({
    loginStatus: '',
    scanProgress: 0,
    activeThreats: [],
    activeNewThreats: [],
    licenseKey: '',
  });

  const licenseKeyName = Config.APP_ENV ?? 'No License Key Avalaible';
  const selectedKey = ZDefendLicenseKeyNames.fromString(licenseKeyName);
  console.log('[zDefend] Available license keys:', JSON.stringify(LICENSE_KEYS));
  ZDefendLicenseKey.selectLicenseKey(selectedKey);
  console.log('[zDefend] Env:', Config.APP_ENV, '| License key:', selectedKey);

  useEffect(() => {
    function deviceStatusCallback(deviceStatus: ZDeviceStatus) {
      console.log('[zDefend] deviceStatusCallback fired');
      console.log('[zDefend] loginStatus:', deviceStatus.loginStatus);
      console.log(
        '[zDefend] scanProgress:',
        deviceStatus.initialScanProgressPercentage,
      );
      console.log('lastError:', deviceStatus.loginLastError);

      const activeThreats = deviceStatus.activeThreats;
      const activeNewThreats = deviceStatus.activeNewThreats;

      if (activeNewThreats.length > 0) {
        console.log('[zDefend] --- NEW ACTIVE THREATS ---');
        for (const threat of activeNewThreats) {
          console.log(
            '[zDefend] Threat:',
            threat.localizedName,
            '| ID:',
            threat.internalThreatID,
            '| Severity:',
            threat.severity,
          );
        }
      }

      if (activeThreats.length > 0) {
        console.log('[zDefend] --- ACTIVE THREATS ---');
        for (const threat of activeThreats) {
          console.log(
            '[zDefend] Threat:',
            threat.localizedName,
            '| ID:',
            threat.internalThreatID,
            '| Severity:',
            threat.severity,
          );
        }
      }

      if (activeThreats.length === 0 && activeNewThreats.length === 0) {
        console.log('[zDefend] No active threats.');
      }

      setSecurity(prev => ({
        ...prev,
        loginStatus: String(deviceStatus.loginStatus),
        scanProgress: deviceStatus.initialScanProgressPercentage,
        activeThreats,
        activeNewThreats,
        licenseKey: licenseKeyName,
      }));

      if (activeThreats.length > 0 || activeNewThreats.length > 0) {
        setModalVisible(true);
      }
    }

    function errorCallback(error: string) {
      console.warn('[zDefend] Error:', error);
    }

    ZDefend.setTrackingIds({
      tag1: 'zimperiumBank',
      tag2: 'dev-session',
      errorCallback,
    });

    const registration = ZDefend.addDeviceStatusCallback({
      deviceStatusCallback,
    });

    return () => {
      registration.deregister();
    };
  }, []);

  return (
    <PaperProvider theme={theme}>
      <AppNavigator />
      <ZDefendThreatModal
        visible={modalVisible}
        loginStatus={security.loginStatus}
        scanProgress={security.scanProgress}
        licenseKey={security.licenseKey}
        hasMultipleLicenseKeys={HAS_MULTIPLE_LICENSE_KEYS}
        activeThreats={security.activeThreats}
        activeNewThreats={security.activeNewThreats}
        onDismiss={() => setModalVisible(false)}
      />
    </PaperProvider>
  );
}
