/**
 * Dashboard Screen - Main wallet overview
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  useColorScheme,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Decimal } from 'decimal.js';

// Components
import TrustScoreWidget from '../components/TrustScoreWidget';
import QuickActionButton from '../components/QuickActionButton';
import TransactionList from '../components/TransactionList';
import PortfolioChart from '../components/PortfolioChart';
import DeFiPositions from '../components/DeFiPositions';

// Services
import { WalletService } from '../services/WalletService';
import { TrustService } from '../services/TrustService';
import { PriceService } from '../services/PriceService';

// Redux
import { RootState } from '../store';
import { updateBalance, updateTrustScore, updateTransactions } from '../store/walletSlice';

// Types
import { Transaction, TrustScore } from '@zippycoin/shared';

const { width } = Dimensions.get('window');

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isDarkMode = useColorScheme() === 'dark';
  
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [usdBalance, setUsdBalance] = useState('0.00');
  const [priceChange24h, setPriceChange24h] = useState(0);

  // Redux state
  const { balance, trustScore, transactions, currentAccount } = useSelector(
    (state: RootState) => state.wallet
  );

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        loadBalance(),
        loadTrustScore(),
        loadTransactions(),
        loadPriceData(),
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      Alert.alert('Error', 'Failed to load wallet data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadBalance = async () => {
    try {
      const walletBalance = await WalletService.getBalance();
      dispatch(updateBalance(walletBalance.toString()));
    } catch (error) {
      console.error('Failed to load balance:', error);
    }
  };

  const loadTrustScore = async () => {
    try {
      const score = await TrustService.getTrustScore();
      dispatch(updateTrustScore(score));
    } catch (error) {
      console.error('Failed to load trust score:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      const txHistory = await WalletService.getTransactionHistory(10);
      dispatch(updateTransactions(txHistory));
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  const loadPriceData = async () => {
    try {
      const priceData = await PriceService.getCurrentPrice();
      const balanceDecimal = new Decimal(balance || '0');
      const usdValue = balanceDecimal.mul(priceData.price);
      setUsdBalance(usdValue.toFixed(2));
      setPriceChange24h(priceData.change24h);
    } catch (error) {
      console.error('Failed to load price data:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  }, []);

  const handleSendPress = () => {
    navigation.navigate('Send' as never);
  };

  const handleReceivePress = () => {
    navigation.navigate('Receive' as never);
  };

  const handleTrustPress = () => {
    navigation.navigate('Trust' as never);
  };

  const handleDeFiPress = () => {
    navigation.navigate('DeFi' as never);
  };

  const handleTransactionPress = (transaction: Transaction) => {
    // Navigate to transaction details
    navigation.navigate('TransactionDetails' as never, { 
      transactionId: transaction.id 
    } as never);
  };

  const handleViewAllTransactions = () => {
    navigation.navigate('TransactionHistory' as never);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.accountInfo}>
          <Text style={[styles.accountLabel, { color: isDarkMode ? '#8E8E93' : '#6D6D70' }]}>
            {currentAccount?.name || 'Account 1'}
          </Text>
          <Text style={[styles.accountAddress, { color: isDarkMode ? '#8E8E93' : '#6D6D70' }]}>
            {currentAccount?.address 
              ? `${currentAccount.address.substring(0, 10)}...${currentAccount.address.substring(currentAccount.address.length - 6)}`
              : 'Loading...'
            }
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings' as never)}
        >
          <Icon 
            name="settings" 
            size={24} 
            color={isDarkMode ? '#FFFFFF' : '#000000'} 
          />
        </TouchableOpacity>
      </View>

      <LinearGradient
        colors={isDarkMode ? ['#1C1C1E', '#2C2C2E'] : ['#007AFF', '#5AC8FA']}
        style={styles.balanceCard}
      >
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>
            {balance ? new Decimal(balance).toFixed(4) : '0.0000'} ZPC
          </Text>
          <View style={styles.usdBalanceContainer}>
            <Text style={styles.usdBalance}>
              ${usdBalance}
            </Text>
            <View style={[
              styles.priceChangeContainer,
              { backgroundColor: priceChange24h >= 0 ? '#34C759' : '#FF3B30' }
            ]}>
              <Icon 
                name={priceChange24h >= 0 ? 'trending-up' : 'trending-down'} 
                size={12} 
                color="#FFFFFF" 
              />
              <Text style={styles.priceChangeText}>
                {Math.abs(priceChange24h).toFixed(2)}%
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
        Quick Actions
      </Text>
      <View style={styles.quickActions}>
        <QuickActionButton
          icon="send"
          label="Send"
          onPress={handleSendPress}
          isDarkMode={isDarkMode}
        />
        <QuickActionButton
          icon="qr-code-scanner"
          label="Receive"
          onPress={handleReceivePress}
          isDarkMode={isDarkMode}
        />
        <QuickActionButton
          icon="verified-user"
          label="Trust"
          onPress={handleTrustPress}
          isDarkMode={isDarkMode}
        />
        <QuickActionButton
          icon="trending-up"
          label="DeFi"
          onPress={handleDeFiPress}
          isDarkMode={isDarkMode}
        />
      </View>
    </View>
  );

  const renderTrustSection = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
        Trust Score
      </Text>
      <TrustScoreWidget 
        trustScore={trustScore} 
        isDarkMode={isDarkMode}
        onPress={handleTrustPress}
      />
    </View>
  );

  const renderPortfolioSection = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
        Portfolio Performance
      </Text>
      <PortfolioChart isDarkMode={isDarkMode} />
    </View>
  );

  const renderDeFiSection = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
        DeFi Positions
      </Text>
      <DeFiPositions isDarkMode={isDarkMode} onPress={handleDeFiPress} />
    </View>
  );

  const renderRecentTransactions = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
          Recent Transactions
        </Text>
        <TouchableOpacity onPress={handleViewAllTransactions}>
          <Text style={styles.viewAllButton}>View All</Text>
        </TouchableOpacity>
      </View>
      <TransactionList
        transactions={transactions.slice(0, 5)}
        onTransactionPress={handleTransactionPress}
        isDarkMode={isDarkMode}
      />
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDarkMode ? '#000000' : '#F2F2F7' }]}>
        <Text style={[styles.loadingText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDarkMode ? '#000000' : '#F2F2F7' }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={isDarkMode ? '#FFFFFF' : '#000000'}
        />
      }
    >
      {renderHeader()}
      {renderQuickActions()}
      {renderTrustSection()}
      {renderPortfolioSection()}
      {renderDeFiSection()}
      {renderRecentTransactions()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  accountInfo: {
    flex: 1,
  },
  accountLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  accountAddress: {
    fontSize: 14,
    marginTop: 2,
  },
  settingsButton: {
    padding: 8,
  },
  balanceCard: {
    borderRadius: 16,
    padding: 24,
  },
  balanceContainer: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  usdBalanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usdBalance: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
    marginRight: 8,
  },
  priceChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceChangeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 2,
  },
  quickActionsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  viewAllButton: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DashboardScreen; 