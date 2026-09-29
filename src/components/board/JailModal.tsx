import React from 'react';
import { View, StyleSheet, Text, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
import { Player } from '../../types/player';
import { Button3D } from '../ui/Button3D';

interface JailModalProps {
  player: Player;
  onRollForFreedom: () => void;
  onPayFine: () => void;
}

export const JailModal: React.FC<JailModalProps> = ({ player, onRollForFreedom, onPayFine }) => {
  const { width } = useWindowDimensions();
  const modalWidth = Math.min(width * 0.85, 340);

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={styles.overlay}
    >
      <Animated.View
        entering={ZoomIn.duration(400).springify()}
        exiting={FadeOut.duration(200)}
        style={[styles.modalBase, { width: modalWidth }]}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.modalHeader}>
            <Text style={styles.headerEmoji}>🔒</Text>
            <Text style={styles.headerTitle}>IN JAIL</Text>
          </View>

          <View style={styles.innerContent}>
            <View style={styles.infoBox}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.jailInfo}>
                Attempt {player.jailTurns + 1} of 3
              </Text>
              <Text style={styles.jailDesc}>
                Roll doubles to escape for free, or pay ₹75 fine to get out now.
              </Text>
              {player.jailTurns >= 2 && (
                <View style={styles.warningBox}>
                  <Text style={styles.warningText}>
                    ⚠️ Last attempt! If you fail, ₹75 will be auto-deducted.
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>BALANCE</Text>
              <Text style={styles.balanceValue}>₹ {player.money.toLocaleString('en-IN')}</Text>
            </View>

            <View style={styles.actionRow}>
              <View style={{ flex: 1 }}>
                <Button3D
                  title="🎲 ROLL"
                  color="#3B82F6"
                  shadowColor="#1E40AF"
                  onPress={onRollForFreedom}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button3D
                  title="💰 PAY ₹75"
                  color="#10B981"
                  shadowColor="#047857"
                  onPress={onPayFine}
                  disabled={player.money < 75}
                />
              </View>
            </View>
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
  modalBase: {
    backgroundColor: '#4A1D96', // Deep purple shadow
    borderRadius: 16,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  modalWrapper: {
    backgroundColor: '#7C3AED', // Vibrant purple
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#A78BFA',
    padding: 12,
    paddingTop: 16,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  headerEmoji: {
    fontSize: 36,
    marginBottom: 4,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
    letterSpacing: 2,
  },
  innerContent: {
    backgroundColor: '#F5F3FF', // Light purple tint
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.2)',
  },
  infoBox: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  playerName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 4,
  },
  jailInfo: {
    fontSize: 14,
    fontWeight: '800',
    color: '#7C3AED',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  jailDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  warningBox: {
    marginTop: 10,
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  warningText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
    textAlign: 'center',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#10B981',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
    marginTop: 4,
  },
});
