
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconSymbol } from './IconSymbol';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffeaa7',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 4,
  },
  text: {
    fontSize: 12,
    color: '#856404',
    lineHeight: 16,
  },
  highlight: {
    fontWeight: '600',
  },
});

export const DataDisclaimer: React.FC = () => {
  return (
    <View style={styles.container}>
      <IconSymbol name="info.circle.fill" size={20} color="#856404" />
      <View style={styles.textContainer}>
        <Text style={styles.title}>Real Market Data</Text>
        <Text style={styles.text}>
          This app uses <Text style={styles.highlight}>real-time stock market data</Text> to generate trading recommendations. 
          Prices update automatically every few minutes. {'\n\n'}
          <Text style={styles.highlight}>⚠️ Investment Risk:</Text> All trading involves risk. 
          These are algorithmic suggestions, not financial advice. Always do your own research and never invest more than you can afford to lose.
        </Text>
      </View>
    </View>
  );
};
