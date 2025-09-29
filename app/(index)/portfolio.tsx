
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { portfolioService } from '@/services/portfolioService';
import { PortfolioSummary, PortfolioPosition } from '@/types/Portfolio';
import { PortfolioCard } from '@/components/PortfolioCard';
import { IconSymbol } from '@/components/IconSymbol';
import { appleGreen, appleRed, appleBlue } from '@/constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  portfolioValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  portfolioChange: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  sectionAction: {
    fontSize: 14,
    color: appleBlue,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  startTradingButton: {
    backgroundColor: appleBlue,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  startTradingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  positionItem: {
    marginVertical: 4,
  },
});

export default function PortfolioScreen() {
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    initializePortfolio();
  }, []);

  const initializePortfolio = async () => {
    try {
      await portfolioService.initializeDemoPortfolio();
      await loadPortfolio();
    } catch (error) {
      console.error('Error initializing portfolio:', error);
      setLoading(false);
    }
  };

  const loadPortfolio = async () => {
    try {
      console.log('Loading portfolio summary...');
      const summary = await portfolioService.getPortfolioSummary();
      setPortfolioSummary(summary);
    } catch (error) {
      console.error('Error loading portfolio:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPortfolio();
  };

  const handlePositionPress = (position: PortfolioPosition) => {
    router.push({
      pathname: '/position-details',
      params: { positionId: position.id }
    });
  };

  const renderPortfolioHeader = () => {
    if (!portfolioSummary) return null;

    const isPositive = portfolioSummary.totalPnL >= 0;

    return (
      <View style={styles.header}>
        <Text style={styles.portfolioValue}>
          ${portfolioSummary.totalValue.toFixed(2)}
        </Text>
        <Text style={[styles.portfolioChange, { color: isPositive ? appleGreen : appleRed }]}>
          {isPositive ? '+' : ''}${portfolioSummary.totalPnL.toFixed(2)} ({isPositive ? '+' : ''}{portfolioSummary.totalPnLPercent.toFixed(2)}%)
        </Text>

        <View style={styles.metricsContainer}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Day Change</Text>
            <Text style={[styles.metricValue, { 
              color: portfolioSummary.dayChange >= 0 ? appleGreen : appleRed 
            }]}>
              {portfolioSummary.dayChange >= 0 ? '+' : ''}${portfolioSummary.dayChange.toFixed(2)}
            </Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Total Cost</Text>
            <Text style={styles.metricValue}>${portfolioSummary.totalCost.toFixed(2)}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Positions</Text>
            <Text style={styles.metricValue}>{portfolioSummary.positions.length}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <IconSymbol name="chart.pie" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>Start Building Your Portfolio</Text>
      <Text style={styles.emptySubtitle}>
        Begin trading to build your investment portfolio. Explore our trading recommendations to get started.
      </Text>
      <Pressable style={styles.startTradingButton} onPress={() => router.push('/')}>
        <Text style={styles.startTradingText}>View Trading Opportunities</Text>
      </Pressable>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={appleBlue} />
          <Text style={styles.loadingText}>Loading portfolio...</Text>
        </View>
      </View>
    );
  }

  if (!portfolioSummary || portfolioSummary.positions.length === 0) {
    return (
      <View style={styles.container}>
        {renderPortfolioHeader()}
        {renderEmptyState()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={appleBlue}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderPortfolioHeader()}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Holdings</Text>
          <Pressable onPress={() => router.push('/analytics')}>
            <Text style={styles.sectionAction}>View Analytics</Text>
          </Pressable>
        </View>

        {portfolioSummary.positions.map((position) => (
          <View key={position.id} style={styles.positionItem}>
            <PortfolioCard
              position={position}
              onPress={() => handlePositionPress(position)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
