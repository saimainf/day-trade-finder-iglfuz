
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TechnicalIndicator } from '@/types/Analytics';
import { IconSymbol } from './IconSymbol';
import { appleGreen, appleRed, appleBlue } from '@/constants/Colors';

interface TechnicalIndicatorCardProps {
  indicator: TechnicalIndicator;
}

export const TechnicalIndicatorCard: React.FC<TechnicalIndicatorCardProps> = ({
  indicator
}) => {
  const getSignalColor = (signal: TechnicalIndicator['signal']) => {
    switch (signal) {
      case 'buy': return appleGreen;
      case 'sell': return appleRed;
      default: return '#666';
    }
  };

  const getSignalIcon = (signal: TechnicalIndicator['signal']) => {
    switch (signal) {
      case 'buy': return 'arrow.up.circle.fill';
      case 'sell': return 'arrow.down.circle.fill';
      default: return 'minus.circle.fill';
    }
  };

  const formatValue = (value: number, name: string) => {
    if (name.includes('Volume')) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (name.includes('RSI')) {
      return value.toFixed(1);
    }
    if (name.includes('Price') || name.includes('MA')) {
      return `$${value.toFixed(2)}`;
    }
    return value.toFixed(2);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{indicator.name}</Text>
          <Text style={styles.value}>{formatValue(indicator.value, indicator.name)}</Text>
        </View>
        <View style={styles.signalContainer}>
          <IconSymbol
            name={getSignalIcon(indicator.signal)}
            color={getSignalColor(indicator.signal)}
            size={24}
          />
          <Text style={[styles.signal, { color: getSignalColor(indicator.signal) }]}>
            {indicator.signal.toUpperCase()}
          </Text>
        </View>
      </View>
      <Text style={styles.description}>{indicator.description}</Text>
    </View>
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
    alignItems: 'center',
    marginBottom: 8,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: '#666',
  },
  signalContainer: {
    alignItems: 'center',
    gap: 4,
  },
  signal: {
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
