
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Trade } from '@/types/Trade';
import { IconSymbol } from './IconSymbol';
import { appleGreen, appleRed, appleBlue } from '@/constants/Colors';

interface TradeCardProps {
  trade: Trade;
  onPress: () => void;
  onToggleWatchlist: () => void;
}

export const TradeCard: React.FC<TradeCardProps> = ({
  trade,
  onPress,
  onToggleWatchlist
}) => {
  const getConfidenceColor = (score: number) => {
    if (score >= 8) return appleGreen;
    if (score >= 6) return '#FF9500';
    return appleRed;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return appleGreen;
      case 'medium': return '#FF9500';
      case 'high': return appleRed;
      default: return '#666';
    }
  };

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.symbolContainer}>
          <Text style={styles.symbol}>{trade.symbol}</Text>
          <Text style={styles.companyName}>{trade.companyName}</Text>
        </View>
        <Pressable
          style={styles.watchlistButton}
          onPress={onToggleWatchlist}
        >
          <IconSymbol
            name={trade.isWatchlisted ? "heart.fill" : "heart"}
            color={trade.isWatchlisted ? appleRed : '#666'}
            size={20}
          />
        </Pressable>
      </View>

      <View style={styles.priceContainer}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Current</Text>
          <Text style={styles.currentPrice}>${trade.currentPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Buy at</Text>
          <Text style={styles.buyPrice}>${trade.recommendedBuyPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Target</Text>
          <Text style={[styles.targetPrice, { color: appleGreen }]}>
            ${trade.targetSellPrice.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Profit</Text>
          <Text style={[styles.metricValue, { color: appleGreen }]}>
            +{trade.potentialProfitPercent.toFixed(1)}%
          </Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Confidence</Text>
          <Text style={[styles.metricValue, { color: getConfidenceColor(trade.confidenceScore) }]}>
            {trade.confidenceScore}/10
          </Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Risk</Text>
          <Text style={[styles.metricValue, { color: getRiskColor(trade.analysis.riskLevel) }]}>
            {trade.analysis.riskLevel.toUpperCase()}
          </Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Timeframe</Text>
          <Text style={styles.metricValue}>{trade.timeframe}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.sentimentContainer}>
          <IconSymbol
            name={
              trade.analysis.newssentiment === 'positive' ? 'arrow.up.circle.fill' :
              trade.analysis.newssentiment === 'negative' ? 'arrow.down.circle.fill' :
              'minus.circle.fill'
            }
            color={
              trade.analysis.newssentiment === 'positive' ? appleGreen :
              trade.analysis.newssentiment === 'negative' ? appleRed :
              '#666'
            }
            size={16}
          />
          <Text style={styles.sentimentText}>
            {trade.analysis.newssentiment} sentiment
          </Text>
        </View>
        <Text style={styles.timestamp}>
          {new Date(trade.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
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
  watchlistButton: {
    padding: 4,
  },
  priceContainer: {
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  buyPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: appleBlue,
  },
  targetPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  metric: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  sentimentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sentimentText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
});
