
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { PortfolioPosition } from '@/types/Portfolio';
import { IconSymbol } from './IconSymbol';
import { appleGreen, appleRed, appleBlue } from '@/constants/Colors';

interface PortfolioCardProps {
  position: PortfolioPosition;
  onPress: () => void;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({
  position,
  onPress
}) => {
  const isPositive = position.unrealizedPnL >= 0;

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.symbolContainer}>
          <Text style={styles.symbol}>{position.symbol}</Text>
          <Text style={styles.companyName}>{position.companyName}</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={styles.totalValue}>${position.totalValue.toFixed(2)}</Text>
          <View style={styles.changeContainer}>
            <IconSymbol
              name={isPositive ? "arrow.up" : "arrow.down"}
              color={isPositive ? appleGreen : appleRed}
              size={12}
            />
            <Text style={[styles.change, { color: isPositive ? appleGreen : appleRed }]}>
              {isPositive ? '+' : ''}${position.unrealizedPnL.toFixed(2)} ({isPositive ? '+' : ''}{position.unrealizedPnLPercent.toFixed(2)}%)
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Shares</Text>
          <Text style={styles.detailValue}>{position.quantity}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Avg Cost</Text>
          <Text style={styles.detailValue}>${position.averageBuyPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Current</Text>
          <Text style={styles.detailValue}>${position.currentPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Sector</Text>
          <Text style={styles.detailValue}>{position.sector}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  symbolContainer: {
    flex: 1,
  },
  symbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  companyName: {
    fontSize: 14,
    color: '#666',
  },
  valueContainer: {
    alignItems: 'flex-end',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  change: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
