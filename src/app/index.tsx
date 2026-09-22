import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  FadeIn,
  SlideInDown,
  SlideInUp,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme } from '../constants/theme';
import { GameMenuCard } from '../components/home/GameMenuCard';

// ─── Floating emoji config ───────────────────────────────────
const FLOATING_ITEMS = [
  { emoji: '🎲', size: 32, x: '8%', y: '12%', delay: 200,  dur: 3200, range: 12 },
  { emoji: '🏠', size: 26, x: '80%', y: '8%',  delay: 600,  dur: 3800, range: 10 },
  { emoji: '💰', size: 28, x: '70%', y: '22%', delay: 400,  dur: 3400, range: 14 },
  { emoji: '🚂', size: 24, x: '12%', y: '26%', delay: 800,  dur: 4000, range: 8  },
  { emoji: '🏗️', size: 22, x: '88%', y: '35%', delay: 1000, dur: 3600, range: 11 },
  { emoji: '💎', size: 20, x: '5%',  y: '40%', delay: 500,  dur: 3000, range: 9  },
  { emoji: '🪙', size: 24, x: '92%', y: '52%', delay: 300,  dur: 3500, range: 13 },
  { emoji: '🎯', size: 22, x: '6%',  y: '58%', delay: 700,  dur: 4200, range: 10 },
] as const;

// ─── Floating emoji component ────────────────────────────────
function FloatingEmoji({ emoji, size, delay, dur, range }: {
  emoji: string;
  size: number;
  delay: number;
  dur: number;
  range: number;
}) {
  const ty = useSharedValue(0);
  const tx = useSharedValue(0);
  const rot = useSharedValue(0);
  const s = useSharedValue(0);

  useEffect(() => {
    s.value = withDelay(delay, withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.4)) }));
    ty.value = withDelay(delay, withRepeat(withSequence(
      withTiming(-range, { duration: dur, easing: Easing.inOut(Easing.ease) }),
      withTiming(range,  { duration: dur, easing: Easing.inOut(Easing.ease) }),
    ), -1, true));
    tx.value = withDelay(delay + 400, withRepeat(withSequence(
      withTiming(range * 0.35, { duration: dur * 1.2, easing: Easing.inOut(Easing.ease) }),
      withTiming(-range * 0.35, { duration: dur * 1.2, easing: Easing.inOut(Easing.ease) }),
    ), -1, true));
    rot.value = withDelay(delay, withRepeat(withSequence(
      withTiming(12, { duration: dur * 1.4, easing: Easing.inOut(Easing.ease) }),
      withTiming(-12, { duration: dur * 1.4, easing: Easing.inOut(Easing.ease) }),
    ), -1, true));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: ty.value },
      { translateX: tx.value },
      { rotate: `${rot.value}deg` },
      { scale: s.value },
    ],
    opacity: s.value * 0.7,
  }));

  return (
    <Animated.View style={style}>
      <Text style={{ fontSize: size }}>{emoji}</Text>
    </Animated.View>
  );
}

// ─── Main Home Screen ────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  // Title pulse
  const titleScale = useSharedValue(1);
  const subtitleOpacity = useSharedValue(0);
  const diceRotation = useSharedValue(0);

  useEffect(() => {
    // Pulsing title glow
    titleScale.value = withDelay(400, withRepeat(
      withSequence(
        withTiming(1.03, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ), -1, true
    ));

    // Subtitle fade in
    subtitleOpacity.value = withDelay(800, withTiming(1, { duration: 1000 }));

    // Dice icon rotation (center)
    diceRotation.value = withDelay(600, withRepeat(
      withSequence(
        withTiming(15, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(-15, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ), -1, true
    ));
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const diceStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${diceRotation.value}deg` }],
  }));

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />

      {/* ── Background ─────────────────────────────────────── */}
      <View style={styles.bgGradientTop} />
      <View style={styles.bgGradientBottom} />
      {/* Grid overlay pattern */}
      <View style={styles.gridOverlay}>
        {Array.from({ length: 8 }).map((_, i) => (
          <View key={`h-${i}`} style={[styles.gridLineH, { top: `${(i + 1) * 12}%` }]} />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={`v-${i}`} style={[styles.gridLineV, { left: `${(i + 1) * 16.6}%` }]} />
        ))}
      </View>

      {/* ── Floating emojis ────────────────────────────────── */}
      <View style={styles.floatingLayer} pointerEvents="none">
        {FLOATING_ITEMS.map((item, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: item.x as unknown as number,
              top: item.y as unknown as number,
            }}
          >
            <FloatingEmoji
              emoji={item.emoji}
              size={item.size}
              delay={item.delay}
              dur={item.dur}
              range={item.range}
            />
          </View>
        ))}
      </View>

      {/* ── Top bar: avatar + settings ─────────────────────── */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(600)}
        style={styles.topBar}
      >
        <Pressable
          style={styles.avatarButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/profile');
          }}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>😎</Text>
          </View>
          <Text style={styles.avatarName}>Mohit</Text>
        </Pressable>

        <Pressable
          style={styles.settingsButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </Pressable>
      </Animated.View>

      {/* ── Hero Title Section ─────────────────────────────── */}
      <View style={styles.heroSection}>
        <Animated.View entering={FadeInUp.delay(100).duration(800).springify()} style={titleStyle}>
          <Text style={styles.titleIndian}>INDIAN</Text>
          <Text style={styles.titleTycoon}>TYCOON</Text>
        </Animated.View>

        <Animated.View style={subtitleStyle}>
          <Text style={styles.tagline}>Buy · Trade · Build · Become the Tycoon</Text>
        </Animated.View>

        {/* Central dice icon */}
        <Animated.View style={[styles.heroDice, diceStyle]}>
          <Text style={styles.heroDiceEmoji}>🎲</Text>
        </Animated.View>
      </View>

      {/* ── Menu Cards ─────────────────────────────────────── */}
      <View style={styles.menuSection}>
        <GameMenuCard
          title="CREATE ROOM"
          subtitle="Host a new game room"
          icon="🏠"
          gradientStart="#FF6B35"
          gradientEnd="#FF9933"
          delay={400}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/lobby/create' as never);
          }}
        />
        <GameMenuCard
          title="JOIN ROOM"
          subtitle="Enter a room code to join"
          icon="🎯"
          gradientStart="#1A49B8"
          gradientEnd="#3B6DE0"
          delay={600}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/lobby/join' as never);
          }}
        />
      </View>

      {/* ── Bottom branding ────────────────────────────────── */}
      <Animated.View
        entering={FadeIn.delay(1200).duration(800)}
        style={styles.bottomBar}
      >
        <Text style={styles.versionText}>v1.0.0  ·  Made in India 🇮🇳</Text>
      </Animated.View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0A1628',
  },

  // Background layers
  bgGradientTop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0B1D3A',
  },
  bgGradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(26, 73, 184, 0.08)',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFill,
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },

  // Floating layer
  floatingLayer: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    zIndex: 10,
  },
  avatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  avatarName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 22,
  },

  // Hero section
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    paddingBottom: 20,
  },
  titleIndian: {
    fontSize: 52,
    fontWeight: '900',
    color: '#FF9933',
    textAlign: 'center',
    letterSpacing: 6,
    textShadowColor: 'rgba(255, 153, 51, 0.4)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  titleTycoon: {
    fontSize: 60,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 8,
    marginTop: -8,
    textShadowColor: 'rgba(255, 255, 255, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    letterSpacing: 2,
    marginTop: 12,
  },
  heroDice: {
    marginTop: 24,
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 153, 51, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 153, 51, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroDiceEmoji: {
    fontSize: 32,
  },

  // Menu section
  menuSection: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    zIndex: 10,
  },

  // Bottom bar
  bottomBar: {
    paddingBottom: 40,
    alignItems: 'center',
    zIndex: 10,
  },
  versionText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.3)',
    letterSpacing: 1,
  },
});
