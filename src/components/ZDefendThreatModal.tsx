import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { ZDefendThreat, ZThreatSeverity } from 'zdefend';

interface Props {
  visible: boolean;
  loginStatus: string;
  scanProgress: number;
  licenseKey?: string;
  hasMultipleLicenseKeys: boolean;
  activeThreats: ZDefendThreat[];
  activeNewThreats: ZDefendThreat[];
  onDismiss: () => void;
}

function severityColor(severity: ZThreatSeverity): string {
  switch (severity) {
    case ZThreatSeverity.CRITICAL:
      return '#E63946';
    case ZThreatSeverity.IMPORTANT:
      return '#FF8C00';
    case ZThreatSeverity.LOW:
      return '#FFB800';
    default:
      return '#6B7A99';
  }
}

function vectorLabel(vector: string): string {
  switch (vector) {
    case 'DEVICE':
      return 'Device';
    case 'NETWORK':
      return 'Network';
    case 'APP':
      return 'App';
    case 'WEB':
      return 'Web';
    case 'TRACKER':
      return 'Tracker';
    default:
      return vector;
  }
}

function ThreatRow({ threat }: { threat: ZDefendThreat }) {
  const color = severityColor(threat.severity);
  return (
    <View style={styles.threatRow}>
      <View style={[styles.severityBar, { backgroundColor: color }]} />
      <View style={styles.threatContent}>
        <Text style={styles.threatName}>
          {threat.localizedName || threat.internalName}
        </Text>
        <View style={styles.threatMeta}>
          <Text style={[styles.severityTag, { color }]}>{threat.severity}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>{vectorLabel(threat.vector)}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>ID {threat.internalThreatID}</Text>
        </View>
        {!!threat.appName && (
          <Text style={styles.threatDetail}>App: {threat.appName}</Text>
        )}
        {!!threat.packageName && (
          <Text style={styles.threatDetail}>Package: {threat.packageName}</Text>
        )}
      </View>
    </View>
  );
}

export default function ZDefendThreatModal({
  visible,
  loginStatus,
  scanProgress,
  licenseKey,
  hasMultipleLicenseKeys,
  activeThreats,
  activeNewThreats,
  onDismiss,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerIcon}>🛡</Text>
            <Text style={styles.headerTitle}>Security Alert</Text>
            <View style={styles.threatCountBadge}>
              <Text style={styles.threatCountText}>
                {activeThreats.length} threat
                {activeThreats.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>

          {/* SDK Info */}
          <View style={styles.infoGrid}>
            <View style={styles.infoCell}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={styles.infoValue}>{loginStatus}</Text>
            </View>
            <View style={styles.infoCell}>
              <Text style={styles.infoLabel}>Scan</Text>
              <Text style={styles.infoValue}>{scanProgress}%</Text>
            </View>
            {hasMultipleLicenseKeys && !!licenseKey && (
              <View style={[styles.infoCell, styles.infoCellFull]}>
                <Text style={styles.infoLabel}>License Key</Text>
                <Text style={styles.infoValue}>{licenseKey}</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <ScrollView
            style={styles.threatList}
            showsVerticalScrollIndicator={false}
          >
            {/* New Threats */}
            {activeNewThreats.length > 0 && (
              <View>
                <View style={styles.sectionHeader}>
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                  <Text style={styles.sectionTitle}>
                    Active Threats ({activeNewThreats.length})
                  </Text>
                </View>
                {activeNewThreats.map(t => (
                  <ThreatRow key={t.UUID} threat={t} />
                ))}
              </View>
            )}

            {/* All Active Threats (excluding duplicates already shown above) */}
            {activeThreats.filter(
              t => !activeNewThreats.some(n => n.UUID === t.UUID),
            ).length > 0 && (
              <View
                style={
                  activeNewThreats.length > 0
                    ? styles.sectionSpacing
                    : undefined
                }
              >
                <Text style={styles.sectionTitle}>
                  Active Threats (
                  {
                    activeThreats.filter(
                      t => !activeNewThreats.some(n => n.UUID === t.UUID),
                    ).length
                  }
                  )
                </Text>
                {activeThreats
                  .filter(t => !activeNewThreats.some(n => n.UUID === t.UUID))
                  .map(t => (
                    <ThreatRow key={t.UUID} threat={t} />
                  ))}
              </View>
            )}
          </ScrollView>

          {/* Dismiss */}
          <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const colors = {
  primary: '#0A2463',
  primaryLight: '#1A3A8F',
  accent: '#FFB800',
  danger: '#E63946',
  surface: '#FFFFFF',
  bg: '#F0F3FA',
  textSecondary: '#6B7A99',
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10,36,99,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 10,
  },
  headerIcon: {
    fontSize: 24,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  threatCountBadge: {
    backgroundColor: colors.danger,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  threatCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
  },
  infoCell: {
    backgroundColor: colors.bg,
    borderRadius: 10,
    padding: 10,
    minWidth: '45%',
    flex: 1,
  },
  infoCellFull: {
    flexBasis: '100%',
    flex: 0,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '700',
  },
  infoValueMono: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  divider: {
    height: 1,
    backgroundColor: colors.bg,
    marginHorizontal: 20,
    marginVertical: 14,
  },
  threatList: {
    paddingHorizontal: 16,
    maxHeight: 320,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  newBadge: {
    backgroundColor: colors.danger,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 10,
  },
  sectionSpacing: {
    marginTop: 16,
  },
  threatRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  severityBar: {
    width: 4,
  },
  threatContent: {
    flex: 1,
    padding: 12,
  },
  threatName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 5,
  },
  threatMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  severityTag: {
    fontSize: 11,
    fontWeight: '700',
  },
  metaDot: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  metaText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  threatDetail: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },
  dismissButton: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  dismissText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
