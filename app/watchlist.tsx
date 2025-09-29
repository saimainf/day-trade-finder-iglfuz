
import { IconSymbol } from '@/components/IconSymbol';
import React from 'react';
import { useWatchlist } from '@/hooks/useWatchlist';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { Stack, router } from 'expo-router';
import { WatchlistCard } from '@/components/WatchlistCard';
import { WatchlistItem } from '@/types/Trade';
import { appleBlue, appleGreen } from '@/constants/Colors';

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
  watchlistItem: {
    marginHorizontal: 16,
    marginVertical: 6,
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

export default function WatchlistScreen() {
  const { watchlist, loading, error, removeFromWatchlist, refreshWatchlist } = useWatchlist();

  const renderWatchlistItem = ({ item }: { item: WatchlistItem }) => (
    <View style={styles.watchlistItem}>
      <WatchlistCard
        item={item}
        onRemove={() => removeFromWatchlist(item.id)}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <IconSymbol name="heart" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>Your Watchlist is Empty</Text>
      <Text style={styles.emptySubtitle}>
        Add stocks to your watchlist from the main screen to track their real-time prices and performance.
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={appleBlue} />
      <Text style={styles.loadingText}>Loading watchlist...</Text>
      <Text style={[styles.loadingText, { fontSize: 14, color: '#999' }]}>
        Fetching real-time prices
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <IconSymbol name="wifi.slash" size={48} color="#dc3545" />
      <Text style={styles.errorTitle}>Connection Error</Text>
      <Text style={styles.errorText}>
        {error || 'Unable to fetch watchlist data. Please check your internet connection and try again.'}
      </Text>
      <Pressable style={styles.retryButton} onPress={refreshWatchlist}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </Pressable>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerTitle}>Watchlist</Text>
        <Text style={styles.headerSubtitle}>
          {watchlist.length > 0 ? `${watchlist.length} stocks tracked` : 'Real-time price tracking'}
        </Text>
      </View>
      <View style={styles.liveIndicator}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>LIVE</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{
            title: 'Watchlist',
            headerShown: false,
          }} 
        />
        {renderHeader()}
        {renderLoadingState()}
      </View>
    );
  }

  if (error && watchlist.length === 0) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{
            title: 'Watchlist',
            headerShown: false,
          }} 
        />
        {renderHeader()}
        {renderErrorState()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Watchlist',
          headerShown: false,
        }} 
      />
      {renderHeader()}
      
      <View style={styles.content}>
        <FlatList
          data={watchlist}
          renderItem={renderWatchlistItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={watchlist.length === 0 ? { flex: 1 } : { paddingVertical: 8 }}
        />
      </View>
    </View>
  );
}
