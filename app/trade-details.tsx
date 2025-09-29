
import { Button } from '@/components/button';
import { IconSymbol } from '@/components/IconSymbol';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { appleGreen, appleRed, appleBlue } from '@/constants/Colors';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Trade } from '@/types/Trade';
import { realStockDataService } from '@/services/realStockDataService';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  symbol: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  companyName: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 12,
    gap: 12,
  },
  currentPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  priceChange: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  recommendationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  recommendationItem: {
    flex: 1,
    alignItems: 'center',
  },
  recommendationLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  recommendationValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  profitContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  profitTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  profitValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profitPercent: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  confidenceLabel: {
    fontSize: 14,
    color: '#666',
  },
  confidenceScore: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  analysisItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  analysisText: {
    fontSize: 14,
    color: '#1a1a1a',
    flex: 1,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  riskText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
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
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e1e5e9',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: appleBlue,
  },
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default function TradeDetailsScreen() {
  const { tradeId } = useLocalSearchParams<{ tradeId: string }>();
  const [trade, setTrade] = useState<Trade | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTradeDetails();
  }, [tradeId]);

  const loadTradeDetails = async () => {
    if (!tradeId) {
      setError('Trade ID not provided');
      setLoading(false);
      return;
    }

    try {
      setError(null);
      console.log('Loading trade details for:', tradeId);
      
      // In a real app, you'd fetch the specific trade from your backend
      // For now, we'll generate fresh data for the symbol
      const trades = await realStockDataService.generateTradingRecommendations();
      const foundTrade = trades.find(t => t.id === tradeId);
      
      if (foundTrade) {
        setTrade(foundTrade);
      } else {
        // If trade not found, create a sample trade for demonstration
        const sampleTrade: Trade = {
          id: tradeId,
          symbol: 'AAPL',
          companyName: 'Apple Inc.',
          currentPrice: 185.25,
          recommendedBuyPrice: 184.50,
          targetSellPrice: 192.00,
          stopLoss: 180.00,
          confidenceScore: 8.5,
          potentialProfit: 6.75,
          potentialProfitPercent: 3.64,
          timeframe: '1-3 days',
          volume: 45678900,
          marketCap: '$2.85T',
          sector: 'Technology',
          analysis: {
            technicalIndicators: ['RSI Oversold', 'MACD Bullish Cross', 'Support at $184'],
            newssentiment: 'positive',
            marketTrend: 'bullish',
            riskLevel: 'low',
            keyFactors: [
              'Strong Q4 earnings beat expectations',
              'iPhone 15 sales momentum',
              'Services revenue growth',
              'Technical bounce from support level'
            ]
          },
          timestamp: new Date(),
          isWatchlisted: false
        };
        setTrade(sampleTrade);
      }
    } catch (error) {
      console.error('Error loading trade details:', error);
      setError('Failed to load trade details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (score: number): string => {
    if (score >= 8) return appleGreen;
    if (score >= 6) return '#ffa500';
    return appleRed;
  };

  const getRiskColor = (risk: string): string => {
    switch (risk) {
      case 'low': return appleGreen;
      case 'medium': return '#ffa500';
      case 'high': return appleRed;
      default: return '#666';
    }
  };

  const getProfitColor = (profit: number): string => {
    return profit > 0 ? appleGreen : appleRed;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Trade Details' }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={appleBlue} />
          <Text style={styles.loadingText}>Loading trade details...</Text>
        </View>
      </View>
    );
  }

  if (error || !trade) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Trade Details' }} />
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle" size={48} color="#dc3545" />
          <Text style={styles.errorTitle}>Error Loading Trade</Text>
          <Text style={styles.errorText}>
            {error || 'Trade details could not be loaded.'}
          </Text>
          <Pressable style={styles.retryButton} onPress={loadTradeDetails}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: trade.symbol,
          headerBackTitle: 'Back'
        }} 
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.symbol}>{trade.symbol}</Text>
          <Text style={styles.companyName}>{trade.companyName}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>${trade.currentPrice.toFixed(2)}</Text>
            <Text style={[
              styles.priceChange,
              { color: getProfitColor(trade.potentialProfit) }
            ]}>
              {trade.potentialProfit > 0 ? '+' : ''}${trade.potentialProfit.toFixed(2)} 
              ({trade.potentialProfitPercent > 0 ? '+' : ''}{trade.potentialProfitPercent.toFixed(2)}%)
            </Text>
          </View>
        </View>

        {/* Trading Recommendation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trading Recommendation</Text>
          <View style={styles.recommendationContainer}>
            <View style={styles.recommendationItem}>
              <Text style={styles.recommendationLabel}>BUY AT</Text>
              <Text style={[styles.recommendationValue, { color: appleBlue }]}>
                ${trade.recommendedBuyPrice.toFixed(2)}
              </Text>
            </View>
            <View style={styles.recommendationItem}>
              <Text style={styles.recommendationLabel}>SELL AT</Text>
              <Text style={[styles.recommendationValue, { color: appleGreen }]}>
                ${trade.targetSellPrice.toFixed(2)}
              </Text>
            </View>
            <View style={styles.recommendationItem}>
              <Text style={styles.recommendationLabel}>STOP LOSS</Text>
              <Text style={[styles.recommendationValue, { color: appleRed }]}>
                ${trade.stopLoss.toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.profitContainer}>
            <Text style={styles.profitTitle}>Potential Profit</Text>
            <Text style={[styles.profitValue, { color: getProfitColor(trade.potentialProfit) }]}>
              ${trade.potentialProfit.toFixed(2)}
            </Text>
            <Text style={[styles.profitPercent, { color: getProfitColor(trade.potentialProfit) }]}>
              {trade.potentialProfitPercent.toFixed(2)}% return
            </Text>
          </View>

          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>Confidence Score</Text>
            <Text style={[styles.confidenceScore, { color: getConfidenceColor(trade.confidenceScore) }]}>
              {trade.confidenceScore}/10
            </Text>
          </View>
        </View>

        {/* Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analysis</Text>
          
          <View style={styles.analysisItem}>
            <IconSymbol name="clock" size={16} color="#666" />
            <Text style={styles.analysisText}>Timeframe: {trade.timeframe}</Text>
          </View>

          <View style={styles.analysisItem}>
            <IconSymbol name="chart.bar" size={16} color="#666" />
            <Text style={styles.analysisText}>Volume: {(trade.volume / 1000000).toFixed(1)}M</Text>
          </View>

          <View style={styles.analysisItem}>
            <IconSymbol name="building.2" size={16} color="#666" />
            <Text style={styles.analysisText}>Market Cap: {trade.marketCap}</Text>
          </View>

          <View style={styles.analysisItem}>
            <IconSymbol name="tag" size={16} color="#666" />
            <Text style={styles.analysisText}>Sector: {trade.sector}</Text>
          </View>

          <View style={styles.analysisItem}>
            <IconSymbol name="exclamationmark.shield" size={16} color={getRiskColor(trade.analysis.riskLevel)} />
            <Text style={styles.analysisText}>Risk Level:</Text>
            <View style={[styles.riskBadge, { backgroundColor: getRiskColor(trade.analysis.riskLevel) + '20' }]}>
              <Text style={[styles.riskText, { color: getRiskColor(trade.analysis.riskLevel) }]}>
                {trade.analysis.riskLevel}
              </Text>
            </View>
          </View>
        </View>

        {/* Technical Indicators */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technical Indicators</Text>
          {trade.analysis.technicalIndicators.map((indicator, index) => (
            <View key={index} style={styles.analysisItem}>
              <IconSymbol name="chart.line.uptrend.xyaxis" size={16} color={appleBlue} />
              <Text style={styles.analysisText}>{indicator}</Text>
            </View>
          ))}
        </View>

        {/* Key Factors */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Factors</Text>
          {trade.analysis.keyFactors.map((factor, index) => (
            <View key={index} style={styles.analysisItem}>
              <IconSymbol name="checkmark.circle" size={16} color={appleGreen} />
              <Text style={styles.analysisText}>{factor}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Pressable style={[styles.actionButton, styles.secondaryButton]} onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>Back to Trades</Text>
        </Pressable>
        <Pressable style={[styles.actionButton, styles.primaryButton]}>
          <Text style={styles.primaryButtonText}>Add to Watchlist</Text>
        </Pressable>
      </View>
    </View>
  );
}
