import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  withRepeat,
  withSequence,
  FadeIn,
  FadeInDown,
  FadeInUp,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const MOCK_PLAYERS = [
  { name: 'Mohit',  emoji: '😎', ready: true },
  { name: 'Riya',   emoji: '💃', ready: true },
  { name: 'Arjun',  emoji: '🧑‍💻', ready: false },
  { name: 'Aarav',  emoji: '🎯', ready: false },
];

export default function CreateRoomScreen() {
  const router = useRouter();
  const [players, setPlayers] = useState(MOCK_PLAYERS.slice(0, 1));
  const [roomCode] = useState('IND' + Math.floor(1000 + Math.random() * 9000));

  const pulseScale = useSharedValue(1);

  useEffect(() => {
    // Simulate players joining
    const timers = MOCK_PLAYERS.slice(1).map((p, i) =>
      setTimeout(() => {
        setPlayers((prev) => [...prev, MOCK_PLAYERS[i + 1]]);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, 1500 * (i + 1))
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // Pulse the start button
  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1, true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const handleStartGame = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.replace('/game/room-1' as never);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <View style={styles.topSafe} />

      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>GAME ROOM</Text>
        <View style={{ width: 60 }} />
      </Animated.View>

      {/* Room Code */}
      <Animated.View entering={FadeIn.delay(300).duration(600)} style={styles.codeSection}>
        <Text style={styles.codeLabel}>ROOM CODE</Text>
        <View style={styles.codeBox}>
          {roomCode.split('').map((char, i) => (
            <View key={i} style={styles.codeLetter}>
              <Text style={styles.codeChar}>{char}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.shareHint}>Share this code with friends to join</Text>
      </Animated.View>

      {/* Players list */}
      <View style={styles.playersSection}>
        <Text style={styles.sectionTitle}>PLAYERS ({players.length}/4)</Text>
        {players.map((p, i) => (
          <Animated.View
            key={p.name}
            entering={FadeInDown.delay(i * 200).duration(400).springify()}
            style={styles.playerRow}
          >
            <View style={styles.playerAvatar}>
              <Text style={styles.playerEmoji}>{p.emoji}</Text>
            </View>
            <Text style={styles.playerName}>{p.name}</Text>
            <View style={[styles.readyBadge, p.ready && styles.readyBadgeActive]}>
              <Text style={[styles.readyText, p.ready && styles.readyTextActive]}>
                {p.ready ? '✓ Ready' : 'Joining...'}
              </Text>
            </View>
          </Animated.View>
        ))}
        {players.length < 4 && (
          <View style={styles.waitingSlot}>
            <Text style={styles.waitingSlotText}>⏳ Waiting for players...</Text>
          </View>
        )}
      </View>

      {/* Settings */}
      <Animated.View entering={FadeInUp.delay(600).duration(400)} style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>GAME SETTINGS</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Starting Cash</Text>
          <Text style={styles.settingValue}>₹15,000</Text>
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Mode</Text>
          <Text style={styles.settingValue}>Standard</Text>
        </View>
      </Animated.View>

      {/* Start Button */}
      <View style={styles.bottomSection}>
        <AnimatedPressable
          onPress={handleStartGame}
          style={[styles.startButton, pulseStyle]}
        >
          <Text style={styles.startButtonText}>🎲 START GAME</Text>
        </AnimatedPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  topSafe: { height: 50 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 60,
  },
  backText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
  },

  codeSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  codeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 3,
    marginBottom: 10,
  },
  codeBox: {
    flexDirection: 'row',
    gap: 6,
  },
  codeLetter: {
    width: 44,
    height: 52,
    borderRadius: 10,
    backgroundColor: 'rgba(255,153,51,0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,153,51,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeChar: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FF9933',
  },
  shareHint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    marginTop: 10,
  },

  playersSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 2,
    marginBottom: 10,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  playerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerEmoji: {
    fontSize: 20,
  },
  playerName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  readyBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  readyBadgeActive: {
    backgroundColor: 'rgba(16,185,129,0.2)',
  },
  readyText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
  },
  readyTextActive: {
    color: '#10B981',
  },
  waitingSlot: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderStyle: 'dashed',
    paddingVertical: 16,
    alignItems: 'center',
  },
  waitingSlotText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.2)',
  },

  settingsSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  settingLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  settingValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 44,
  },
  startButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
