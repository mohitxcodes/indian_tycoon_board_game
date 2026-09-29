import React, { useEffect } from 'react';
import { View, StyleSheet, Text, useWindowDimensions } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideOutUp,
  withSpring,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { FontAwesome5 } from '@expo/vector-icons';
import { Player } from '../../types/player';

interface SalaryModalProps {
  player: Player;
  amount: number;
  onComplete: () => void;
}

export const SalaryModal: React.FC<SalaryModalProps> = ({ player, amount, onComplete }) => {
  const { width } = useWindowDimensions();

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500); // 2.5 seconds
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={styles.overlay}
    >
      <Animated.View
        entering={SlideInUp.duration(500).springify().damping(12)}
        exiting={SlideOutUp.duration(400)}
        style={[styles.modal, { width: width * 0.85 }]}
      >
        <Text style={styles.title}>PASSED GO!</Text>
        
        <View style={styles.billContainer}>
          <View style={styles.billOuter}>
            <View style={styles.billInner}>
              <Text style={styles.billTitle}>SALARY</Text>
              <Text style={styles.billAmount}>₹ {amount.toLocaleString('en-IN')}</Text>
            </View>
          </View>
          
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>{player.name}</Text>
            <Text style={styles.playerSub}>Collected Salary</Text>
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modal: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: '#10B981', // Bright green
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 25,
    elevation: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#10B981',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 2,
    textShadowColor: 'rgba(16, 185, 129, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  billContainer: {
    alignItems: 'center',
    width: '100%',
  },
  billOuter: {
    width: '100%',
    backgroundColor: '#064E3B',
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#047857',
    marginBottom: 20,
  },
  billInner: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#34D399',
    borderStyle: 'dashed',
  },
  billTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#064E3B',
    letterSpacing: 4,
    marginBottom: 4,
  },
  billAmount: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
  },
  playerInfo: {
    alignItems: 'center',
  },
  playerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  playerSub: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
  },
});
