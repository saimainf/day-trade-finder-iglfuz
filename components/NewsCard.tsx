
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MarketNews } from '@/types/Analytics';
import { IconSymbol } from './IconSymbol';
import { appleGreen, appleRed, appleBlue } from '@/constants/Colors';

interface NewsCardProps {
  news: MarketNews;
  onPress?: () => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  news,
  onPress
}) => {
  const getSentimentColor = (sentiment: MarketNews['sentiment']) => {
    switch (sentiment) {
      case 'positive': return appleGreen;
      case 'negative': return appleRed;
      default: return '#666';
    }
  };

  const getSentimentIcon = (sentiment: MarketNews['sentiment']) => {
    switch (sentiment) {
      case 'positive': return 'arrow.up.circle.fill';
      case 'negative': return 'arrow.down.circle.fill';
      default: return 'minus.circle.fill';
    }
  };

  const getCategoryColor = (category: MarketNews['category']) => {
    switch (category) {
      case 'earnings': return appleBlue;
      case 'merger': return '#FF9500';
      case 'regulatory': return appleRed;
      case 'analyst': return '#AF52DE';
      default: return '#666';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.sourceContainer}>
          <Text style={styles.source}>{news.source}</Text>
          <Text style={styles.time}>{formatTimeAgo(news.publishedAt)}</Text>
        </View>
        <View style={styles.indicators}>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(news.category) + '20' }]}>
            <Text style={[styles.categoryText, { color: getCategoryColor(news.category) }]}>
              {news.category.toUpperCase()}
            </Text>
          </View>
          <IconSymbol
            name={getSentimentIcon(news.sentiment)}
            color={getSentimentColor(news.sentiment)}
            size={16}
          />
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>{news.title}</Text>
      <Text style={styles.summary} numberOfLines={3}>{news.summary}</Text>

      {news.relatedSymbols.length > 0 && (
        <View style={styles.symbolsContainer}>
          <Text style={styles.symbolsLabel}>Related:</Text>
          <View style={styles.symbols}>
            {news.relatedSymbols.slice(0, 4).map((symbol, index) => (
              <View key={symbol} style={styles.symbolBadge}>
                <Text style={styles.symbolText}>{symbol}</Text>
              </View>
            ))}
            {news.relatedSymbols.length > 4 && (
              <Text style={styles.moreSymbols}>+{news.relatedSymbols.length - 4}</Text>
            )}
          </View>
        </View>
      )}
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
    marginBottom: 8,
  },
  sourceContainer: {
    flex: 1,
  },
  source: {
    fontSize: 12,
    fontWeight: '600',
    color: appleBlue,
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    lineHeight: 22,
    marginBottom: 8,
  },
  summary: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  symbolsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  symbolsLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  symbols: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  symbolBadge: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  symbolText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  moreSymbols: {
    fontSize: 12,
    color: '#666',
  },
});
