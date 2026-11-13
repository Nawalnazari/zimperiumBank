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

type Variant = 'WARNING' | 'BLOCK';

interface Props {
  visible: boolean;
  variant: Variant;
  threats: ZDefendThreat[];
  onDismiss: () => void;
}

const variantConfig = {
  WARNING: {
    accent: '#FF8C00',
    accentLight: '#FFF3CD',
    icon: '⚠️',
    title: 'Security Warning',
    subtitle: 'Threats have been detected on this device.',
    dismissLabel: 'Acknowledge',
  },
  BLOCK: {
    accent: '#E63946',
    accentLight: '#FFE5E5',
    icon: '🚫',
    title: 'Access Blocked',
    subtitle: 'Critical threats are preventing secure access.',
    dismissLabel: 'Dismiss',
  },
};

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
          <Text style={styles.metaText}>{threat.vector}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>ID {threat.internalThreatID}</Text>
        </View>
        {!!threat.localizedAlertText && (
          <Text style={styles.threatDetail} numberOfLines={3}>
            {threat.localizedAlertText}
          </Text>
        )}
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

export default function LinkedLabelModal({
  visible,
  variant,
  threats,
  onDismiss,
}: Props) {
  const config = variantConfig[variant];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View
            style={[styles.header, { backgroundColor: config.accent }]}>
            <Text style={styles.headerIcon}>{config.icon}</Text>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>{config.title}</Text>
              <Text style={styles.headerSubtitle}>{config.subtitle}</Text>
            </View>
          </View>

          {/* Threat count badge */}
          <View style={[styles.countRow, { borderColor: config.accent }]}>
            <View style={[styles.countBadge, { backgroundColor: config.accentLight }]}>
              <Text style={[styles.countText, { color: config.accent }]}>
                {threats.length} threat{threats.length !== 1 ? 's' : ''} detected
              </Text>
            </View>
          </View>

          {/* Threat list */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            {threats.length === 0 ? (
              <Text style={styles.noThreatsText}>No threat details available.</Text>
            ) : (
              threats.map(threat => (
                <ThreatRow key={threat.UUID} threat={threat} />
              ))
            )}
          </ScrollView>

          {/* Dismiss */}
          <TouchableOpacity
            style={[styles.dismissButton, { backgroundColor: config.accent }]}
            onPress={onDismiss}
            activeOpacity={0.85}>
            <Text style={styles.dismissText}>{config.dismissLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 24 : 20,
    paddingBottom: 20,
    gap: 14,
  },
  headerIcon: {
    fontSize: 32,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
  },
  countRow: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#F0F3FA',
  },
  countBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  countText: {
    fontSize: 13,
    fontWeight: '700',
  },
  scrollView: {
    maxHeight: 400,
  },
  scrollContent: {
    padding: 16,
    gap: 10,
  },
  noThreatsText: {
    color: '#6B7A99',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
  threatRow: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FC',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
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
    color: '#0A2463',
    marginBottom: 5,
  },
  threatMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 6,
  },
  severityTag: {
    fontSize: 11,
    fontWeight: '700',
  },
  metaDot: {
    color: '#6B7A99',
    fontSize: 11,
  },
  metaText: {
    fontSize: 11,
    color: '#6B7A99',
    fontWeight: '500',
  },
  threatDetail: {
    fontSize: 12,
    color: '#6B7A99',
    lineHeight: 17,
    marginTop: 2,
  },
  dismissButton: {
    margin: 16,
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
