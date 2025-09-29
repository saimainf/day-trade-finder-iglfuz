
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { Button } from '@/components/button';
import { mockTrades } from '@/data/mockTrades';
import { appleGreen, appleRed, appleBlue } from '@/constants/Colors';

export default function TradeDetailsScreen() {
  const { tradeId } = useLocalSearchParams<{ tradeId: string }>();
  const trade = mockTrades.find(t => t.id === tradeId);

  if (!trade) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Trade not found</Text>
        <Button onPress={() => router.back()}>Go Back</Button>
      </View>
    );
  }

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
    <>
      <Stack.Screen
        options={{
          title: trade.symbol,
          headerBackTitle: 'Back',
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.symbolContainer}>
            <Text style={styles.symbol}>{trade.symbol}</Text>
            <Text style={styles.companyName}>{trade.companyName}</Text>
            <Text style={styles.sector}>{trade.sector} • {trade.marketCap}</Text>
          </View>
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>Confidence</Text>
            <Text style={[styles.confidenceScore, { color: getConfidenceColor(trade.confidenceScore) }]}>
              {trade.confidenceScore}/10
            </Text>
          </View>
        </View>

        {/* Price Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Analysis</Text>
          <View style={styles.priceGrid}>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Current Price</Text>
              <Text style={styles.priceValue}>${trade.currentPrice.toFixed(2)}</Text>
            </View>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Buy Price</Text>
              <Text style={[styles.priceValue, { color: appleBlue }]}>
                ${trade.recommendedBuyPrice.toFixed(2)}
              </Text>
            </View>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Target Price</Text>
              <Text style={[styles.priceValue, { color: appleGreen }]}>
                ${trade.targetSellPrice.toFixed(2)}
              </Text>
            </View>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Stop Loss</Text>
              <Text style={[styles.priceValue, { color: appleRed }]}>
                ${trade.stopLoss.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Profit Potential */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profit Potential</Text>
          <View style={styles.profitContainer}>
            <View style={styles.profitItem}>
              <Text style={styles.profitLabel}>Expected Profit</Text>
              <Text style={[styles.profitValue, { color: appleGreen }]}>
                ${trade.potentialProfit.toFixed(2)}
              </Text>
            </View>
            <View style={styles.profitItem}>
              <Text style={styles.profitLabel}>Profit Percentage</Text>
              <Text style={[styles.profitValue, { color: appleGreen }]}>
                +{trade.potentialProfitPercent.toFixed(2)}%
              </Text>
            </View>
            <View style={styles.profitItem}>
              <Text style={styles.profitLabel}>Timeframe</Text>
              <Text style={styles.profitValue}>{trade.timeframe}</Text>
            </View>
            <View style={styles.profitItem}>
              <Text style={styles.profitLabel}>Risk Level</Text>
              <Text style={[styles.profitValue, { color: getRiskColor(trade.analysis.riskLevel) }]}>
                {trade.analysis.riskLevel.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Technical Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technical Indicators</Text>
          <View style={styles.indicatorsContainer}>
            {trade.analysis.technicalIndicators.map((indicator, index) => (
              <View key={index} style={styles.indicator}>
                <IconSymbol name="checkmark.circle.fill" color={appleGreen} size={16} />
                <Text style={styles.indicatorText}>{indicator}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Market Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Market Analysis</Text>
          <View style={styles.analysisGrid}>
            <View style={styles.analysisItem}>
              <Text style={styles.analysisLabel}>News Sentiment</Text>
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
                <Text style={[styles.analysisValue, { textTransform: 'capitalize' }]}>
                  {trade.analysis.newssentiment}
                </Text>
              </View>
            </View>
            <View style={styles.analysisItem}>
              <Text style={styles.analysisLabel}>Market Trend</Text>
              <Text style={[styles.analysisValue, { textTransform: 'capitalize' }]}>
                {trade.analysis.marketTrend}
              </Text>
            </View>
            <View style={styles.analysisItem}>
              <Text style={styles.analysisLabel}>Volume</Text>
              <Text style={styles.analysisValue}>
                {(trade.volume / 1000000).toFixed(1)}M
              </Text>
            </View>
          </View>
        </View>

        {/* Key Factors */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Factors</Text>
          <View style={styles.factorsContainer}>
            {trade.analysis.keyFactors.map((factor, index) => (
              <View key={index} style={styles.factor}>
                <View style={styles.factorBullet} />
                <Text style={styles.factorText}>{factor}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <Button
            variant="primary"
            style={styles.actionButton}
            onPress={() => {
              console.log('Adding to watchlist:', trade.symbol);
              // In a real app, this would add to watchlist
            }}
          >
            Add to Watchlist
          </Button>
          <Button
            variant="outline"
            style={styles.actionButton}
            onPress={() => {
              console.log('Sharing trade:', trade.symbol);
              // In a real app, this would share the trade
            }}
          >
            Share Trade
          </Button>
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️ This is not financial advice. Always do your own research and consider your risk tolerance before making any trades.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  symbolContainer: {
    flex: 1,
  },
  symbol: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 18,
    color: '#666',
    marginBottom: 4,
  },
  sector: {
    fontSize: 14,
    color: '#999',
  },
  confidenceContainer: {
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  confidenceScore: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  priceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  priceItem: {
    width: '48%',
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profitContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  profitItem: {
    width: '48%',
    marginBottom: 16,
  },
  profitLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  profitValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  indicatorsContainer: {
    gap: 12,
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  analysisGrid: {
    gap: 16,
  },
  analysisItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  analysisLabel: {
    fontSize: 16,
    color: '#666',
  },
  analysisValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sentimentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  factorsContainer: {
    gap: 12,
  },
  factor: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  factorBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: appleBlue,
    marginTop: 8,
    marginRight: 12,
  },
  factorText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    flex: 1,
  },
  actionContainer: {
    padding: 20,
    gap: 12,
  },
  actionButton: {
    width: '100%',
  },
  disclaimer: {
    padding: 20,
    paddingTop: 0,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
