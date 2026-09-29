import React, { useEffect } from 'react';
import { View, StyleSheet, Text, useWindowDimensions } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideOutUp,
  withSequence,
  withDelay,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import { FontAwesome5 } from '@expo/vector-icons';
import { Player } from '../../types/player';

interface PaymentModalProps {
  fromPlayer: Player;
  toPlayer: Player;
  amount: number;
  onComplete: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ fromPlayer, toPlayer, amount, onComplete }) => {
  const { width } = useWindowDimensions();

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500); // Wait 2.5 seconds before calling onComplete which will unmount it
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={styles.overlay}
    >
      <Animated.View
        entering={SlideInUp.duration(400).springify()}
        exiting={SlideOutUp.duration(400)}
        style={[styles.modal, { width: width * 0.85 }]}
      >
        <Text style={styles.title}>Rent Paid!</Text>
        
        <View style={styles.transactionRow}>
          <View style={styles.playerCol}>
            <Text style={styles.playerName} numberOfLines={1}>{fromPlayer.name}</Text>
            <Text style={styles.playerRole}>Tenant</Text>
          </View>
          
          <View style={styles.amountCol}>
            <FontAwesome5 name="arrow-right" size={16} color="#10B981" />
            <Text style={styles.amountText}>₹ {amount.toLocaleString('en-IN')}</Text>
          </View>
          
          <View style={styles.playerCol}>
            <Text style={styles.playerName} numberOfLines={1}>{toPlayer.name}</Text>
            <Text style={styles.playerRole}>Owner</Text>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modal: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F8FAFC',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  playerCol: {
    flex: 1,
    alignItems: 'center',
  },
  playerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  playerRole: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
  },
  amountCol: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#10B981',
    marginTop: 8,
  },
});
