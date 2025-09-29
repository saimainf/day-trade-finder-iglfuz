
import { Stack, router } from "expo-router";
import { appleBlue, appleGreen } from "@/constants/Colors";
import { Trade } from "@/types/Trade";
import { TradeCard } from "@/components/TradeCard";
import { DataDisclaimer } from "@/components/DataDisclaimer";
import React from "react";
import { IconSymbol } from "@/components/IconSymbol";
import { useTrades } from "@/hooks/useTrades";
import { FlatList, StyleSheet, View, Text, RefreshControl, Pressable } from "react-native";

const ICON_COLOR = '#007AFF';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tradeCard: {
    marginBottom: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 16,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
});

export default function HomeScreen() {
  const { trades, loading, refreshing, refreshTrades, toggleWatchlist } = useTrades();

  const handleTradePress = (trade: Trade) => {
    console.log('Trade pressed:', trade.symbol);
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
      style={styles.tradeCard}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <IconSymbol name="chart.line.uptrend.xyaxis" size={64} color="#ccc" />
      <Text style={styles.emptyText}>No trades available</Text>
      <Text style={styles.emptySubtext}>
        Pull down to refresh and check for new trading opportunities
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Day Trade Opportunities</Text>
      <Text style={styles.subtitle}>
        AI-powered trade recommendations with real-time analysis
      </Text>
      <DataDisclaimer />
      <Text style={styles.lastUpdated}>
        Last updated: {new Date().toLocaleTimeString()}
      </Text>
    </View>
  );

  const renderHeaderRight = () => (
    <View style={styles.headerRight}>
      <Pressable
        style={styles.headerButton}
        onPress={() => router.push('/watchlist')}
      >
        <IconSymbol name="heart.fill" size={24} color={ICON_COLOR} />
      </Pressable>
    </View>
  );

  const renderHeaderLeft = () => (
    <Pressable onPress={refreshTrades}>
      <IconSymbol name="arrow.clockwise" size={24} color={ICON_COLOR} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Trade Scanner",
          headerRight: renderHeaderRight,
          headerLeft: renderHeaderLeft,
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      
      <FlatList
        data={trades}
        renderItem={renderTrade}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        contentContainerStyle={trades.length === 0 ? { flex: 1 } : styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshTrades}
            tintColor={appleBlue}
            colors={[appleBlue]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
