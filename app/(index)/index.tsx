
import { Stack, router } from "expo-router";
import { appleBlue, appleGreen } from "@/constants/Colors";
import { Trade } from "@/types/Trade";
import { TradeCard } from "@/components/TradeCard";
import { DataDisclaimer } from "@/components/DataDisclaimer";
import { IconSymbol } from "@/components/IconSymbol";
import { useTrades } from "@/hooks/useTrades";
import React from "react";
import { FlatList, StyleSheet, View, Text, RefreshControl, Pressable, ActivityIndicator } from "react-native";

const ICON_COLOR = '#007AFF';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  content: {
    flex: 1,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#dc3545',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: appleBlue,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  tradeItem: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  disclaimer: {
    margin: 16,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: appleGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
  },
  liveText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default function HomeScreen() {
  const { trades, loading, refreshing, error, refreshTrades, toggleWatchlist } = useTrades();

  const handleTradePress = (trade: Trade) => {
    router.push({
      pathname: '/trade-details',
      params: { tradeId: trade.id }
    });
  };

  const renderTrade = ({ item }: { item: Trade }) => (
    <View style={styles.tradeItem}>
      <TradeCard
        trade={item}
        onPress={() => handleTradePress(item)}
        onToggleWatchlist={() => toggleWatchlist(item.id)}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <IconSymbol name="chart.line.uptrend.xyaxis" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No Trading Opportunities</Text>
      <Text style={styles.emptySubtitle}>
        We're analyzing the market for profitable day trading opportunities. 
        Pull down to refresh and check for new recommendations.
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={appleBlue} />
      <Text style={styles.loadingText}>Analyzing market data...</Text>
      <Text style={[styles.loadingText, { fontSize: 14, color: '#999' }]}>
        Fetching real-time stock prices and generating recommendations
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <IconSymbol name="wifi.slash" size={48} color="#dc3545" />
      <Text style={styles.errorTitle}>Connection Error</Text>
      <Text style={styles.errorText}>
        {error || 'Unable to fetch market data. Please check your internet connection and try again.'}
      </Text>
      <Pressable style={styles.retryButton} onPress={refreshTrades}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </Pressable>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerTitle}>Day Trades</Text>
        <Text style={styles.headerSubtitle}>
          {trades.length > 0 ? `${trades.length} opportunities found` : 'Real-time market analysis'}
        </Text>
      </View>
      <View style={styles.headerRight}>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
        {renderHeaderRight()}
      </View>
    </View>
  );

  const renderHeaderRight = () => (
    <Pressable onPress={() => router.push('/watchlist')}>
      <IconSymbol name="heart.fill" size={24} color={ICON_COLOR} />
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        {renderHeader()}
        {renderLoadingState()}
      </View>
    );
  }

  if (error && trades.length === 0) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        {renderHeader()}
        {renderErrorState()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {renderHeader()}
      
      <View style={styles.content}>
        <FlatList
          data={trades}
          renderItem={renderTrade}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyState}
          ListHeaderComponent={() => (
            <View style={styles.disclaimer}>
              <DataDisclaimer />
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshTrades}
              tintColor={appleBlue}
              title="Updating market data..."
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={trades.length === 0 ? { flex: 1 } : undefined}
        />
      </View>
    </View>
  );
}
