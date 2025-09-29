
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconSymbol } from './IconSymbol';

interface DataDisclaimerProps {
  style?: any;
}

export const DataDisclaimer: React.FC<DataDisclaimerProps> = ({ style }) => {
  return (
    <View style={[styles.container, style]}>
      <IconSymbol 
        name="info.circle" 
        size={16} 
        color="#666" 
        style={styles.icon}
      />
      <Text style={styles.text}>
        Simulated market data for demonstration purposes only
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginVertical: 8,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
});
