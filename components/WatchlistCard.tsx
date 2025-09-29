
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { WatchlistItem } from '@/types/Trade';
import { IconSymbol } from './IconSymbol';
import { appleGreen, appleRed } from '@/constants/Colors';

interface WatchlistCardProps {
  item: WatchlistItem;
  onRemove: () => void;
}

export const WatchlistCard: React.FC<WatchlistCardProps> = ({
  item,
  onRemove
}) => {
  const isPositive = item.priceChange >= 0;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.symbolContainer}>
          <Text style={styles.symbol}>{item.symbol}</Text>
          <Text style={styles.companyName}>{item.companyName}</Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${item.currentPrice.toFixed(2)}</Text>
          <View style={styles.changeContainer}>
            <IconSymbol
              name={isPositive ? "arrow.up" : "arrow.down"}
              color={isPositive ? appleGreen : appleRed}
              size={12}
            />
            <Text style={[styles.change, { color: isPositive ? appleGreen : appleRed }]}>
              {isPositive ? '+' : ''}{item.priceChange.toFixed(2)} ({isPositive ? '+' : ''}{item.priceChangePercent.toFixed(2)}%)
            </Text>
          </View>
        </View>
      </View>
      
      <Pressable style={styles.removeButton} onPress={onRemove}>
        <IconSymbol name="xmark.circle.fill" color="#666" size={20} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  symbolContainer: {
    flex: 1,
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  companyName: {
    fontSize: 12,
    color: '#666',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  change: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 2,
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
});
