
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Stack, router } from 'expo-router';
import { WatchlistCard } from '@/components/WatchlistCard';
import { IconSymbol } from '@/components/IconSymbol';
import { useWatchlist } from '@/hooks/useWatchlist';
import { WatchlistItem } from '@/types/Trade';

export default function WatchlistScreen() {
  const { watchlist, loading, removeFromWatchlist } = useWatchlist();

  const renderWatchlistItem = ({ item }: { item: WatchlistItem }) => (
    <WatchlistCard
      item={item}
      onRemove={() => removeFromWatchlist(item.id)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <IconSymbol name="heart" color="#666" size={48} />
      <Text style={styles.emptyTitle}>No Watchlist Items</Text>
      <Text style={styles.emptySubtitle}>
        Add trades to your watchlist to track them here
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <Text style={styles.headerTitle}>Your Watchlist</Text>
      <Text style={styles.headerSubtitle}>
        Track your favorite trading opportunities
      </Text>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Watchlist',
          headerBackTitle: 'Back',
        }}
      />
      <View style={styles.container}>
        <FlatList
          data={watchlist}
          renderItem={renderWatchlistItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={!loading ? renderEmptyState : null}
          contentContainerStyle={watchlist.length === 0 ? styles.emptyContainer : styles.listContainer}
          showsVerticalScrollIndicator={false}
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
});
