
import React from "react";
import { Stack, router } from "expo-router";
import { FlatList, StyleSheet, View, Text, RefreshControl, Pressable } from "react-native";
import { TradeCard } from "@/components/TradeCard";
import { IconSymbol } from "@/components/IconSymbol";
import { useTrades } from "@/hooks/useTrades";
import { appleBlue, appleGreen } from "@/constants/Colors";
import { Trade } from "@/types/Trade";

const ICON_COLOR = "#007AFF";

export default function HomeScreen() {
  const { trades, loading, refreshing, refreshTrades, toggleWatchlist } = useTrades();

  const handleTradePress = (trade: Trade) => {
    console.log('Opening trade details for:', trade.symbol);
    router.push({
      pathname: '/trade-details',
      params: { tradeId: trade.id }
    });
  };

  const renderTrade = ({ item }: { item: Trade }) => (
    <TradeCard
      trade={item}
      onPress={() => handleTradePress(item)}
      onToggleWatchlist={() => toggleWatchlist(item.id)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <IconSymbol name="chart.line.uptrend.xyaxis" color="#666" size={48} />
      <Text style={styles.emptyTitle}>No Trades Available</Text>
      <Text style={styles.emptySubtitle}>
        Pull to refresh to check for new trading opportunities
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <Text style={styles.headerTitle}>Day Trade Opportunities</Text>
      <Text style={styles.headerSubtitle}>
        AI-powered research finds the best trades for maximum profit
      </Text>
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{trades.length}</Text>
          <Text style={styles.statLabel}>Active Trades</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: appleGreen }]}>
            {trades.filter(t => t.confidenceScore >= 8).length}
          </Text>
          <Text style={styles.statLabel}>High Confidence</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: appleBlue }]}>
            {trades.filter(t => t.isWatchlisted).length}
          </Text>
          <Text style={styles.statLabel}>Watchlisted</Text>
        </View>
      </View>
    </View>
  );

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => {
        console.log("Opening watchlist");
        router.push('/watchlist');
      }}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="heart.fill" color={ICON_COLOR} />
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <Pressable
      onPress={() => {
        console.log("Opening settings");
        router.push('/settings');
      }}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="gear" color={ICON_COLOR} />
    </Pressable>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "TradeScout",
          headerRight: renderHeaderRight,
          headerLeft: renderHeaderLeft,
        }}
      />
      <View style={styles.container}>
        <FlatList
          data={trades}
          renderItem={renderTrade}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={!loading ? renderEmptyState : null}
          contentContainerStyle={trades.length === 0 ? styles.emptyContainer : styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshTrades}
              tintColor={appleBlue}
            />
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerSection: {
    padding: 20,
    paddingBottom: 16,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  headerButtonContainer: {
    padding: 6,
  },
});
