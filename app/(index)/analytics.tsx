
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { analyticsService } from '@/services/analyticsService';
import { TechnicalIndicator, MarketNews, MarketSentiment } from '@/types/Analytics';
import { TechnicalIndicatorCard } from '@/components/TechnicalIndicatorCard';
import { NewsCard } from '@/components/NewsCard';
import { IconSymbol } from '@/components/IconSymbol';
import { appleGreen, appleRed, appleBlue } from '@/constants/Colors';

const { width } = Dimensions.get('window');

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
  symbolInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
  },
  symbolInputText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: appleBlue,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: appleBlue,
  },
  content: {
    flex: 1,
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
    marginBottom: 16,
  },
  sentimentContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sentimentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sentimentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sentimentScore: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sentimentBars: {
    gap: 8,
  },
  sentimentBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sentimentLabel: {
    fontSize: 14,
    color: '#666',
    width: 60,
  },
  sentimentBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#e1e5e9',
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  sentimentBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  sentimentPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    width: 40,
    textAlign: 'right',
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
  symbolButton: {
    backgroundColor: appleBlue,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 16,
  },
  symbolButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  indicatorItem: {
    marginVertical: 4,
  },
  newsItem: {
    marginVertical: 4,
  },
});

type TabType = 'indicators' | 'sentiment' | 'news';

export default function AnalyticsScreen() {
  const { symbol: paramSymbol } = useLocalSearchParams<{ symbol?: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('indicators');
  const [symbol, setSymbol] = useState(paramSymbol || 'AAPL');
  const [indicators, setIndicators] = useState<TechnicalIndicator[]>([]);
  const [sentiment, setSentiment] = useState<MarketSentiment | null>(null);
  const [news, setNews] = useState<MarketNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [symbol, activeTab]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      console.log(`Loading analytics for ${symbol}, tab: ${activeTab}`);
      
      switch (activeTab) {
        case 'indicators':
          const indicatorsData = await analyticsService.getTechnicalIndicators(symbol);
          setIndicators(indicatorsData);
          break;
        case 'sentiment':
          const sentimentData = await analyticsService.getMarketSentiment(symbol);
          setSentiment(sentimentData);
          break;
        case 'news':
          const newsData = await analyticsService.getMarketNews([symbol]);
          setNews(newsData);
          break;
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTechnicalIndicators = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={appleBlue} />
          <Text style={styles.loadingText}>Loading technical indicators...</Text>
        </View>
      );
    }

    if (indicators.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <IconSymbol name="chart.line.uptrend.xyaxis" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No Technical Data</Text>
          <Text style={styles.emptySubtitle}>
            Technical indicators are not available for this symbol at the moment.
          </Text>
        </View>
      );
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {indicators.map((indicator, index) => (
          <View key={index} style={styles.indicatorItem}>
            <TechnicalIndicatorCard indicator={indicator} />
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderSentiment = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={appleBlue} />
          <Text style={styles.loadingText}>Loading market sentiment...</Text>
        </View>
      );
    }

    if (!sentiment) {
      return (
        <View style={styles.emptyContainer}>
          <IconSymbol name="heart.text.square" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No Sentiment Data</Text>
          <Text style={styles.emptySubtitle}>
            Market sentiment data is not available for this symbol.
          </Text>
        </View>
      );
    }

    const getSentimentColor = (score: number) => {
      if (score > 0.2) return appleGreen;
      if (score < -0.2) return appleRed;
      return '#666';
    };

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sentimentContainer}>
            <View style={styles.sentimentHeader}>
              <Text style={styles.sentimentTitle}>Overall Sentiment</Text>
              <Text style={[
                styles.sentimentScore,
                { color: getSentimentColor(sentiment.sentimentScore) }
              ]}>
                {sentiment.sentimentScore > 0 ? '+' : ''}{(sentiment.sentimentScore * 100).toFixed(1)}%
              </Text>
            </View>
            
            <View style={styles.sentimentBars}>
              <View style={styles.sentimentBar}>
                <Text style={styles.sentimentLabel}>Bullish</Text>
                <View style={styles.sentimentBarContainer}>
                  <View style={[
                    styles.sentimentBarFill,
                    { 
                      backgroundColor: appleGreen,
                      width: `${sentiment.bullishPercent}%`
                    }
                  ]} />
                </View>
                <Text style={styles.sentimentPercent}>{sentiment.bullishPercent.toFixed(0)}%</Text>
              </View>
              
              <View style={styles.sentimentBar}>
                <Text style={styles.sentimentLabel}>Bearish</Text>
                <View style={styles.sentimentBarContainer}>
                  <View style={[
                    styles.sentimentBarFill,
                    { 
                      backgroundColor: appleRed,
                      width: `${sentiment.bearishPercent}%`
                    }
                  ]} />
                </View>
                <Text style={styles.sentimentPercent}>{sentiment.bearishPercent.toFixed(0)}%</Text>
              </View>
              
              <View style={styles.sentimentBar}>
                <Text style={styles.sentimentLabel}>Neutral</Text>
                <View style={styles.sentimentBarContainer}>
                  <View style={[
                    styles.sentimentBarFill,
                    { 
                      backgroundColor: '#666',
                      width: `${sentiment.neutralPercent}%`
                    }
                  ]} />
                </View>
                <Text style={styles.sentimentPercent}>{sentiment.neutralPercent.toFixed(0)}%</Text>
              </View>
            </View>
          </View>

          <View style={styles.sentimentContainer}>
            <Text style={styles.sentimentTitle}>Community Data</Text>
            <View style={styles.sentimentBar}>
              <Text style={styles.sentimentLabel}>Total Votes</Text>
              <Text style={styles.sentimentPercent}>{sentiment.totalVotes.toLocaleString()}</Text>
            </View>
            <View style={styles.sentimentBar}>
              <Text style={styles.sentimentLabel}>Social Mentions</Text>
              <Text style={styles.sentimentPercent}>{sentiment.socialMentions.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderNews = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={appleBlue} />
          <Text style={styles.loadingText}>Loading market news...</Text>
        </View>
      );
    }

    if (news.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <IconSymbol name="newspaper" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No Recent News</Text>
          <Text style={styles.emptySubtitle}>
            No recent news articles found for this symbol.
          </Text>
        </View>
      );
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {news.map((article) => (
          <View key={article.id} style={styles.newsItem}>
            <NewsCard news={article} />
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'indicators':
        return renderTechnicalIndicators();
      case 'sentiment':
        return renderSentiment();
      case 'news':
        return renderNews();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <Text style={styles.headerSubtitle}>Technical analysis and market insights</Text>
        
        <Pressable style={styles.symbolInput}>
          <IconSymbol name="magnifyingglass" size={16} color="#666" />
          <Text style={styles.symbolInputText}>{symbol}</Text>
        </Pressable>
      </View>

      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'indicators' && styles.activeTab]}
          onPress={() => setActiveTab('indicators')}
        >
          <Text style={[styles.tabText, activeTab === 'indicators' && styles.activeTabText]}>
            Technical
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'sentiment' && styles.activeTab]}
          onPress={() => setActiveTab('sentiment')}
        >
          <Text style={[styles.tabText, activeTab === 'sentiment' && styles.activeTabText]}>
            Sentiment
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'news' && styles.activeTab]}
          onPress={() => setActiveTab('news')}
        >
          <Text style={[styles.tabText, activeTab === 'news' && styles.activeTabText]}>
            News
          </Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        {renderContent()}
      </View>
    </View>
  );
}
