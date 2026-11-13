import React, { useEffect, useRef, useState } from 'react';
import Config from 'react-native-config';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import ZDefendThreatModal from './src/components/ZDefendThreatModal';
import LinkedLabelModal from './src/components/LinkedLabelModal';
import {
  ZDefend,
  ZDeviceStatus,
  ZDefendThreat,
  ZDefendLicenseKeyNames,
  ZDefendLicenseKey,
  LinkedFunctionEvent,
  ZLinkedFunctionRegistration,
} from 'zdefend';

const LINKED_FUNCTION_LABELS = ['WARNING', 'BLOCK'];

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
  blockThreats: ZDefendThreat[];
  warningThreats: ZDefendThreat[];
}

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [security, setSecurity] = useState<SecurityState>({
    loginStatus: '',
    scanProgress: 0,
    activeThreats: [],
    activeNewThreats: [],
    licenseKey: '',
    blockThreats: [],
    warningThreats: [],
  });
  const linkedRegistrars = useRef<ZLinkedFunctionRegistration[]>([]);

  const licenseKeyName = Config.APP_ENV ?? 'No License Key Avalaible';
  const selectedKey = ZDefendLicenseKeyNames.fromString(licenseKeyName);
  console.log(
    '[zDefend] Available license keys:',
    JSON.stringify(LICENSE_KEYS),
  );
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

    function mergeThreats(
      existing: ZDefendThreat[],
      incoming: ZDefendThreat[],
    ): ZDefendThreat[] {
      const seen = new Set(existing.map(t => t.UUID));
      return [...existing, ...incoming.filter(t => !seen.has(t.UUID))];
    }

    function linkedFunc(linkedEvent: LinkedFunctionEvent) {
      console.log('[zDefend] LinkedFunction fired:', linkedEvent.label);
      const incoming = linkedEvent.relatedThreats ?? [];

      if (linkedEvent.label === 'BLOCK') {
        setSecurity(prev => ({
          ...prev,
          blockThreats: mergeThreats(prev.blockThreats, incoming),
        }));
      } else if (linkedEvent.label === 'WARNING') {
        setSecurity(prev => ({
          ...prev,
          warningThreats: mergeThreats(prev.warningThreats, incoming),
        }));
      } else {
        setModalVisible(true);
      }
    }

    function mitigateLinkedFunc(linkedEvent: LinkedFunctionEvent) {
      console.log('[zDefend] MitigatedLinkedFunction:', linkedEvent.label);
    }

    function setupLinkedFunction() {
      for (const label of LINKED_FUNCTION_LABELS) {
        const reg = ZDefend.registerLinkedFunctionV2(
          label,
          linkedFunc,
          mitigateLinkedFunc,
        );
        if (reg != null) linkedRegistrars.current.push(reg);
      }
    }

    setupLinkedFunction();

    return () => {
      registration.deregister();
      for (const reg of linkedRegistrars.current) {
        ZDefend.removeLinkedFunction(reg);
      }
      linkedRegistrars.current = [];
    };
  }, []);

  const hasBlock = security.blockThreats.length > 0;
  const hasWarning = security.warningThreats.length > 0;

  return (
    <PaperProvider theme={theme}>
      <AppNavigator />

      {/* Normal threat modal — hidden when BLOCK or WARNING is active */}
      <ZDefendThreatModal
        visible={modalVisible && !hasBlock && !hasWarning}
        loginStatus={security.loginStatus}
        scanProgress={security.scanProgress}
        licenseKey={security.licenseKey}
        hasMultipleLicenseKeys={HAS_MULTIPLE_LICENSE_KEYS}
        activeThreats={security.activeThreats}
        activeNewThreats={security.activeNewThreats}
        onDismiss={() => setModalVisible(false)}
      />

      {/* WARNING modal — shown only when no BLOCK is active */}
      <LinkedLabelModal
        visible={hasWarning && !hasBlock}
        variant="WARNING"
        threats={security.warningThreats}
        onDismiss={() =>
          setSecurity(prev => ({ ...prev, warningThreats: [] }))
        }
      />

      {/* BLOCK modal — highest priority, shown over WARNING */}
      <LinkedLabelModal
        visible={hasBlock}
        variant="BLOCK"
        threats={security.blockThreats}
        onDismiss={() =>
          setSecurity(prev => ({ ...prev, blockThreats: [] }))
        }
      />
    </PaperProvider>
  );
}
