import React from 'react';
import { View, StyleSheet, Text, Pressable, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface ActionBarProps {
  onBuild: () => void;
  onSell: () => void;
  onTrade: () => void;
  onMortgage: () => void;
  onRedeem: () => void;
  onMenu: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ActionButton: React.FC<{
  label: string;
  color: string;
  shadowColor: string;
  onPress: () => void;
}> = ({ label, color, shadowColor, onPress }) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }
    ],
  }));

  return (
    <AnimatedPressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      onPressIn={() => {
        scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
        translateY.value = withSpring(2, { damping: 15, stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 400 });
        translateY.value = withSpring(0, { damping: 15, stiffness: 400 });
      }}
      style={[
        styles.actionBtnContainer,
        { backgroundColor: shadowColor },
        animStyle
      ]}
    >
      <View style={[styles.actionBtnInner, { backgroundColor: color }]}>
        <Text style={styles.actionLabel} numberOfLines={1} adjustsFontSizeToFit>{label}</Text>
      </View>
    </AnimatedPressable>
  );
};

export const ActionBar: React.FC<ActionBarProps> = ({
  onBuild,
  onSell,
  onTrade,
  onMortgage,
  onRedeem,
  onMenu,
}) => {
  const { width } = useWindowDimensions();
  // 6 buttons, gap of 4, padding 8 on each side
  const btnWidth = (width - 16 - (5 * 4)) / 6;

  return (
    <View style={styles.container}>
      <View style={{ width: btnWidth }}>
        <ActionButton label="MENU" color="#3B82F6" shadowColor="#1D4ED8" onPress={onMenu} />
      </View>
      <View style={{ width: btnWidth }}>
        <ActionButton label="BUILD" color="#10B981" shadowColor="#047857" onPress={onBuild} />
      </View>
      <View style={{ width: btnWidth }}>
        <ActionButton label="SELL" color="#10B981" shadowColor="#047857" onPress={onSell} />
      </View>
      <View style={{ width: btnWidth }}>
        <ActionButton label="MORTGAGE" color="#10B981" shadowColor="#047857" onPress={onMortgage} />
      </View>
      <View style={{ width: btnWidth }}>
        <ActionButton label="REDEEM" color="#10B981" shadowColor="#047857" onPress={onRedeem} />
      </View>
      <View style={{ width: btnWidth }}>
        <ActionButton label="TRADE" color="#EF4444" shadowColor="#B91C1C" onPress={onTrade} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 8,
    width: '100%',
  },
  actionBtnContainer: {
    borderRadius: 6,
    paddingBottom: 4, // This creates the 3D depth effect
  },
  actionBtnInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    height: 34,
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
