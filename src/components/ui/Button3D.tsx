import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Button3DProps {
  title: string;
  color: string;
  shadowColor: string;
  onPress: () => void;
  disabled?: boolean;
}

export const Button3D: React.FC<Button3DProps> = ({ title, color, shadowColor, onPress, disabled }) => {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.6 : 1,
  }));

  return (
    <AnimatedPressable
      onPress={() => {
        if (!disabled) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onPress();
        }
      }}
      onPressIn={() => {
        if (!disabled) scale.value = withSpring(0.95);
      }}
      onPressOut={() => {
        if (!disabled) scale.value = withSpring(1);
      }}
      style={[styles.buttonContainer, { backgroundColor: shadowColor }, animStyle]}
      disabled={disabled}
    >
      <View style={[styles.buttonInner, { backgroundColor: color }]}>
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 6,
    paddingBottom: 4, // 3D depth
    width: '100%',
  },
  buttonInner: {
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
