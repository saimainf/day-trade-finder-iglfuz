
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { portfolioService } from '@/services/portfolioService';
import { realStockDataService } from '@/services/realStockDataService';
import { TradingAccount, Order } from '@/types/Portfolio';
import { IconSymbol } from '@/components/IconSymbol';
import { appleGreen, appleRed, appleBlue } from '@/constants/Colors';

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
  accountInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  accountItem: {
    alignItems: 'center',
    flex: 1,
  },
  accountLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  accountValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  orderTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  orderTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    alignItems: 'center',
  },
  orderTypeButtonActive: {
    backgroundColor: appleBlue,
    borderColor: appleBlue,
  },
  orderTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  orderTypeTextActive: {
    color: 'white',
  },
  tradeTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  tradeTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  buyButton: {
    borderColor: appleGreen,
    backgroundColor: 'white',
  },
  buyButtonActive: {
    backgroundColor: appleGreen,
  },
  sellButton: {
    borderColor: appleRed,
    backgroundColor: 'white',
  },
  sellButtonActive: {
    backgroundColor: appleRed,
  },
  tradeTypeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buyText: {
    color: appleGreen,
  },
  buyTextActive: {
    color: 'white',
  },
  sellText: {
    color: appleRed,
  },
  sellTextActive: {
    color: 'white',
  },
  estimateContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  estimateTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  estimateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  estimateLabel: {
    fontSize: 14,
    color: '#666',
  },
  estimateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  quickActionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  warningContainer: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
    flex: 1,
  },
});

export default function TradingScreen() {
  const [account, setAccount] = useState<TradingAccount | null>(null);
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAccount();
  }, []);

  useEffect(() => {
    if (symbol.length >= 2) {
      fetchCurrentPrice();
    }
  }, [symbol]);

  const loadAccount = async () => {
    const accountData = await portfolioService.getTradingAccount();
    setAccount(accountData);
  };

  const fetchCurrentPrice = async () => {
    try {
      const quote = await realStockDataService.getStockQuote(symbol.toUpperCase());
      if (quote) {
        setCurrentPrice(quote.price);
        if (orderType === 'market') {
          setPrice(quote.price.toFixed(2));
        }
      }
    } catch (error) {
      console.error('Error fetching price:', error);
    }
  };

  const calculateEstimate = () => {
    const qty = parseInt(quantity) || 0;
    const prc = parseFloat(price) || 0;
    const total = qty * prc;
    const commission = 0; // Free trading
    
    return {
      quantity: qty,
      price: prc,
      total,
      commission,
      netTotal: total + commission
    };
  };

  const canSubmitOrder = () => {
    const estimate = calculateEstimate();
    if (!symbol || !quantity || !price || estimate.quantity <= 0 || estimate.price <= 0) {
      return false;
    }
    
    if (tradeType === 'buy' && account) {
      return estimate.netTotal <= account.buyingPower;
    }
    
    return true;
  };

  const submitOrder = async () => {
    if (!canSubmitOrder() || !account) return;

    setLoading(true);
    try {
      const estimate = calculateEstimate();
      
      const order: Omit<Order, 'id' | 'createdAt' | 'status'> = {
        symbol: symbol.toUpperCase(),
        companyName: `${symbol.toUpperCase()} Corp.`, // In real app, fetch company name
        type: tradeType,
        orderType,
        quantity: estimate.quantity,
        price: orderType === 'limit' ? estimate.price : undefined
      };

      await portfolioService.placeOrder(order);
      
      Alert.alert(
        'Order Placed',
        `Your ${tradeType} order for ${estimate.quantity} shares of ${symbol.toUpperCase()} has been placed.`,
        [
          {
            text: 'View Orders',
            onPress: () => router.push('/orders')
          },
          {
            text: 'OK',
            style: 'default'
          }
        ]
      );

      // Reset form
      setSymbol('');
      setQuantity('');
      setPrice('');
      setCurrentPrice(null);
      
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const estimate = calculateEstimate();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Account Info */}
        {account && (
          <View style={styles.header}>
            <View style={styles.accountInfo}>
              <View style={styles.accountItem}>
                <Text style={styles.accountLabel}>Buying Power</Text>
                <Text style={styles.accountValue}>${account.buyingPower.toFixed(2)}</Text>
              </View>
              <View style={styles.accountItem}>
                <Text style={styles.accountLabel}>Portfolio Value</Text>
                <Text style={styles.accountValue}>${account.portfolioValue.toFixed(2)}</Text>
              </View>
              <View style={styles.accountItem}>
                <Text style={styles.accountLabel}>Day Trades</Text>
                <Text style={styles.accountValue}>{account.dayTradesRemaining}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Order Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Place Order</Text>

          {/* Trade Type */}
          <View style={styles.tradeTypeContainer}>
            <Pressable
              style={[
                styles.tradeTypeButton,
                styles.buyButton,
                tradeType === 'buy' && styles.buyButtonActive
              ]}
              onPress={() => setTradeType('buy')}
            >
              <Text style={[
                styles.tradeTypeText,
                styles.buyText,
                tradeType === 'buy' && styles.buyTextActive
              ]}>
                BUY
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.tradeTypeButton,
                styles.sellButton,
                tradeType === 'sell' && styles.sellButtonActive
              ]}
              onPress={() => setTradeType('sell')}
            >
              <Text style={[
                styles.tradeTypeText,
                styles.sellText,
                tradeType === 'sell' && styles.sellTextActive
              ]}>
                SELL
              </Text>
            </Pressable>
          </View>

          {/* Symbol Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Symbol</Text>
            <TextInput
              style={styles.textInput}
              value={symbol}
              onChangeText={setSymbol}
              placeholder="e.g., AAPL"
              autoCapitalize="characters"
              maxLength={5}
            />
            {currentPrice && (
              <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                Current Price: ${currentPrice.toFixed(2)}
              </Text>
            )}
          </View>

          {/* Order Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Order Type</Text>
            <View style={styles.orderTypeContainer}>
              <Pressable
                style={[
                  styles.orderTypeButton,
                  orderType === 'market' && styles.orderTypeButtonActive
                ]}
                onPress={() => {
                  setOrderType('market');
                  if (currentPrice) {
                    setPrice(currentPrice.toFixed(2));
                  }
                }}
              >
                <Text style={[
                  styles.orderTypeText,
                  orderType === 'market' && styles.orderTypeTextActive
                ]}>
                  Market
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.orderTypeButton,
                  orderType === 'limit' && styles.orderTypeButtonActive
                ]}
                onPress={() => setOrderType('limit')}
              >
                <Text style={[
                  styles.orderTypeText,
                  orderType === 'limit' && styles.orderTypeTextActive
                ]}>
                  Limit
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Quantity Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Quantity</Text>
            <TextInput
              style={styles.textInput}
              value={quantity}
              onChangeText={setQuantity}
              placeholder="Number of shares"
              keyboardType="numeric"
            />
            <View style={styles.quickActions}>
              <Pressable style={styles.quickActionButton} onPress={() => setQuantity('1')}>
                <Text style={styles.quickActionText}>1</Text>
              </Pressable>
              <Pressable style={styles.quickActionButton} onPress={() => setQuantity('10')}>
                <Text style={styles.quickActionText}>10</Text>
              </Pressable>
              <Pressable style={styles.quickActionButton} onPress={() => setQuantity('100')}>
                <Text style={styles.quickActionText}>100</Text>
              </Pressable>
            </View>
          </View>

          {/* Price Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              {orderType === 'market' ? 'Estimated Price' : 'Limit Price'}
            </Text>
            <TextInput
              style={[styles.textInput, orderType === 'market' && { backgroundColor: '#f8f9fa' }]}
              value={price}
              onChangeText={setPrice}
              placeholder="Price per share"
              keyboardType="decimal-pad"
              editable={orderType === 'limit'}
            />
          </View>

          {/* Order Estimate */}
          {estimate.quantity > 0 && estimate.price > 0 && (
            <View style={styles.estimateContainer}>
              <Text style={styles.estimateTitle}>Order Estimate</Text>
              <View style={styles.estimateRow}>
                <Text style={styles.estimateLabel}>Shares</Text>
                <Text style={styles.estimateValue}>{estimate.quantity}</Text>
              </View>
              <View style={styles.estimateRow}>
                <Text style={styles.estimateLabel}>Price</Text>
                <Text style={styles.estimateValue}>${estimate.price.toFixed(2)}</Text>
              </View>
              <View style={styles.estimateRow}>
                <Text style={styles.estimateLabel}>Commission</Text>
                <Text style={styles.estimateValue}>${estimate.commission.toFixed(2)}</Text>
              </View>
              <View style={styles.estimateRow}>
                <Text style={styles.estimateLabel}>Total</Text>
                <Text style={[styles.estimateValue, { fontWeight: 'bold' }]}>
                  ${estimate.netTotal.toFixed(2)}
                </Text>
              </View>
            </View>
          )}

          {/* Warnings */}
          {tradeType === 'buy' && account && estimate.netTotal > account.buyingPower && (
            <View style={styles.warningContainer}>
              <IconSymbol name="exclamationmark.triangle.fill" size={16} color="#856404" />
              <Text style={styles.warningText}>
                Insufficient buying power. You need ${(estimate.netTotal - account.buyingPower).toFixed(2)} more.
              </Text>
            </View>
          )}

          {/* Submit Button */}
          <Pressable
            style={[
              styles.submitButton,
              { backgroundColor: tradeType === 'buy' ? appleGreen : appleRed },
              !canSubmitOrder() && styles.submitButtonDisabled
            ]}
            onPress={submitOrder}
            disabled={!canSubmitOrder() || loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Placing Order...' : `${tradeType.toUpperCase()} ${symbol.toUpperCase()}`}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
