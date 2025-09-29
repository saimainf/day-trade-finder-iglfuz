
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Order } from '@/types/Portfolio';
import { IconSymbol } from './IconSymbol';
import { appleGreen, appleRed, appleBlue } from '@/constants/Colors';

interface OrderCardProps {
  order: Order;
  onCancel?: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onCancel
}) => {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'filled': return appleGreen;
      case 'cancelled': return '#666';
      case 'rejected': return appleRed;
      default: return appleBlue;
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'filled': return 'checkmark.circle.fill';
      case 'cancelled': return 'xmark.circle.fill';
      case 'rejected': return 'exclamationmark.triangle.fill';
      default: return 'clock.fill';
    }
  };

  const getTypeColor = (type: Order['type']) => {
    return type === 'buy' ? appleGreen : appleRed;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.symbolContainer}>
          <Text style={styles.symbol}>{order.symbol}</Text>
          <Text style={styles.companyName}>{order.companyName}</Text>
        </View>
        <View style={styles.statusContainer}>
          <IconSymbol
            name={getStatusIcon(order.status)}
            color={getStatusColor(order.status)}
            size={20}
          />
          <Text style={[styles.status, { color: getStatusColor(order.status) }]}>
            {order.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Type</Text>
          <Text style={[styles.detailValue, { color: getTypeColor(order.type) }]}>
            {order.type.toUpperCase()} {order.orderType.toUpperCase()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Quantity</Text>
          <Text style={styles.detailValue}>{order.quantity} shares</Text>
        </View>
        {order.price && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Price</Text>
            <Text style={styles.detailValue}>${order.price.toFixed(2)}</Text>
          </View>
        )}
        {order.filledPrice && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Filled Price</Text>
            <Text style={styles.detailValue}>${order.filledPrice.toFixed(2)}</Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Created</Text>
          <Text style={styles.detailValue}>
            {new Date(order.createdAt).toLocaleString()}
          </Text>
        </View>
      </View>

      {order.status === 'pending' && onCancel && (
        <Pressable style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel Order</Text>
        </Pressable>
      )}
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
    alignItems: 'flex-start',
    marginBottom: 12,
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
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  cancelButton: {
    backgroundColor: appleRed,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
