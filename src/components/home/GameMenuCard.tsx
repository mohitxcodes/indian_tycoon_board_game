import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme } from '../../constants/theme';

interface GameMenuCardProps {
  title: string;
  subtitle: string;
  icon: string;
  gradientStart: string;
  gradientEnd: string;
  onPress: () => void;
  delay?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const GameMenuCard: React.FC<GameMenuCardProps> = ({
  title,
  subtitle,
  icon,
  gradientStart,
  gradientEnd,
  onPress,
  delay = 0,
}) => {
  const scale = useSharedValue(0);
  const pressScale = useSharedValue(1);
  const shimmer = useSharedValue(0);
  const iconBounce = useSharedValue(0);

  useEffect(() => {
    // Entry animation
    scale.value = withDelay(
      delay,
      withSpring(1, { damping: 12, stiffness: 100 })
    );

    // Icon bounce loop
    iconBounce.value = withDelay(
      delay + 300,
      withRepeat(
        withSequence(
          withTiming(-6, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );

    // Shimmer effect
    shimmer.value = withDelay(
      delay + 500,
      withRepeat(
        withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value * pressScale.value },
    ],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: iconBounce.value },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: shimmer.value * 0.3,
  }));

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    pressScale.value = withSpring(0.93, { damping: 10, stiffness: 400 });
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, { damping: 10, stiffness: 400 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.card, containerStyle]}
    >
      {/* Background */}
      <View style={[styles.cardBg, { backgroundColor: gradientStart }]}>
        {/* Shimmer overlay */}
        <Animated.View style={[styles.shimmer, glowStyle]} />

        {/* Icon */}
        <Animated.View style={[styles.iconContainer, iconStyle]}>
          <Text style={styles.iconText}>{icon}</Text>
        </Animated.View>

        {/* Text */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {/* Arrow indicator */}
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>›</Text>
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginBottom: theme.spacing.md,
    borderRadius: theme.radius.xl,
    ...theme.shadows.lg,
  },
  cardBg: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
  },
  shimmer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: theme.radius.xl,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  iconText: {
    fontSize: 28,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
