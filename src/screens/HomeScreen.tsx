import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Text, Surface, Button, Divider } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuthStore } from '../store/useAuthStore';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const transactions = [
  { id: '1', name: 'Netflix Subscription', date: 'Nov 05, 2026', amount: '-$15.99', icon: '🎬', type: 'debit' },
  { id: '2', name: 'Salary Deposit', date: 'Nov 01, 2026', amount: '+$4,250.00', icon: '💼', type: 'credit' },
  { id: '3', name: 'Amazon Purchase', date: 'Oct 30, 2026', amount: '-$89.95', icon: '🛒', type: 'debit' },
  { id: '4', name: 'Transfer from John', date: 'Oct 28, 2026', amount: '+$200.00', icon: '👤', type: 'credit' },
  { id: '5', name: 'Utility Bill', date: 'Oct 25, 2026', amount: '-$124.50', icon: '⚡', type: 'debit' },
];

const quickActions = [
  { icon: '↗', label: 'Transfer' },
  { icon: '📄', label: 'Pay Bill' },
  { icon: '↙', label: 'Deposit' },
  { icon: '•••', label: 'More' },
];

export default function HomeScreen({ navigation }: Props) {
  const { username, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  const displayName = username || 'Guest';
  const firstName = displayName.split(' ')[0];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingText}>Good Morning,</Text>
          <Text style={styles.nameText}>{firstName} 👋</Text>
        </View>
        <TouchableOpacity style={styles.avatarContainer} onPress={handleLogout}>
          <Text style={styles.avatarText}>
            {firstName.charAt(0).toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Balance Card */}
        <Surface style={styles.balanceCard} elevation={5}>
          <View style={styles.balanceCardHeader}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>● VISA</Text>
              </View>
            </View>
          </View>
          <Text style={styles.balanceAmount}>$24,563.80</Text>
          <View style={styles.accountRow}>
            <Text style={styles.accountNumber}>•••• •••• •••• 4821</Text>
            <Text style={styles.accountType}>Checking</Text>
          </View>
          <View style={styles.balanceStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Income</Text>
              <Text style={styles.statValuePositive}>+$4,450.00</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Expenses</Text>
              <Text style={styles.statValueNegative}>-$1,230.44</Text>
            </View>
          </View>
        </Surface>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            {quickActions.map(action => (
              <TouchableOpacity key={action.label} style={styles.quickActionItem}>
                <View style={styles.quickActionIcon}>
                  <Text style={styles.quickActionIconText}>{action.icon}</Text>
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Savings Card */}
        <Surface style={styles.savingsCard} elevation={2}>
          <View style={styles.savingsLeft}>
            <Text style={styles.savingsLabel}>Savings Account</Text>
            <Text style={styles.savingsAmount}>$8,220.00</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '68%' }]} />
            </View>
            <Text style={styles.savingsGoal}>68% of $12,000 goal</Text>
          </View>
          <View style={styles.savingsRight}>
            <Text style={styles.savingsIcon}>🏦</Text>
          </View>
        </Surface>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <Surface style={styles.transactionCard} elevation={1}>
            {transactions.map((tx, index) => (
              <View key={tx.id}>
                <View style={styles.transactionRow}>
                  <View style={styles.txIconContainer}>
                    <Text style={styles.txIcon}>{tx.icon}</Text>
                  </View>
                  <View style={styles.txDetails}>
                    <Text style={styles.txName}>{tx.name}</Text>
                    <Text style={styles.txDate}>{tx.date}</Text>
                  </View>
                  <Text
                    style={[
                      styles.txAmount,
                      tx.type === 'credit'
                        ? styles.txAmountCredit
                        : styles.txAmountDebit,
                    ]}>
                    {tx.amount}
                  </Text>
                </View>
                {index < transactions.length - 1 && (
                  <Divider style={styles.txDivider} />
                )}
              </View>
            ))}
          </Surface>
        </View>

        {/* Sign Out */}
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.signOutButton}
          textColor={colors.primary}
          icon="logout">
          Sign Out
        </Button>
      </ScrollView>
    </View>
  );
}

const colors = {
  primary: '#0A2463',
  primaryLight: '#1A3A8F',
  accent: '#FFB800',
  background: '#F0F3FA',
  card: '#FFFFFF',
  textPrimary: '#0A2463',
  textSecondary: '#6B7A99',
  credit: '#00A86B',
  debit: '#E63946',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 24,
  },
  greetingText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 14,
  },
  nameText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 2,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  balanceCard: {
    marginHorizontal: 20,
    marginTop: -4,
    borderRadius: 20,
    padding: 24,
    backgroundColor: colors.primaryLight,
  },
  balanceCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 14,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  accountNumber: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    letterSpacing: 2,
  },
  accountType: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  balanceStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 4,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginBottom: 4,
  },
  statValuePositive: {
    color: '#5DFFA0',
    fontSize: 16,
    fontWeight: '700',
  },
  statValueNegative: {
    color: '#FF8080',
    fontSize: 16,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 14,
  },
  seeAll: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionIconText: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: '700',
  },
  quickActionLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  savingsCard: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 20,
    padding: 20,
    backgroundColor: '#FFF8E6',
    flexDirection: 'row',
    alignItems: 'center',
  },
  savingsLeft: {
    flex: 1,
  },
  savingsRight: {
    paddingLeft: 16,
  },
  savingsIcon: {
    fontSize: 40,
  },
  savingsLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 6,
  },
  savingsAmount: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F0E0B0',
    borderRadius: 3,
    marginBottom: 6,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  savingsGoal: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  transactionCard: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  txIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0F3FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  txIcon: {
    fontSize: 20,
  },
  txDetails: {
    flex: 1,
  },
  txName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  txDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
  txAmountCredit: {
    color: colors.credit,
  },
  txAmountDebit: {
    color: colors.debit,
  },
  txDivider: {
    marginHorizontal: 16,
    backgroundColor: '#F0F3FA',
  },
  signOutButton: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 12,
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
});
