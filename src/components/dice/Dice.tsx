import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';

interface DiceFaceProps {
  value: number;
  size: number;
  isRolling: boolean;
}

// Dot positions for each face value (row, col on a 3x3 grid)
const DOT_POSITIONS: Record<number, Array<[number, number]>> = {
  1: [[1, 1]],
  2: [[0, 2], [2, 0]],
  3: [[0, 2], [1, 1], [2, 0]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
};

export const DiceFace: React.FC<DiceFaceProps> = ({ value, size, isRolling }) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isRolling) {
      rotation.value = withRepeat(
        withSequence(
          withTiming(-15, { duration: 80, easing: Easing.linear }),
          withTiming(15, { duration: 80, easing: Easing.linear }),
        ),
        -1,
        true
      );
      scale.value = withRepeat(
        withSequence(
          withTiming(0.85, { duration: 100 }),
          withTiming(1.1, { duration: 100 }),
        ),
        -1,
        true
      );
    } else {
      rotation.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(1, { duration: 200 });
    }
  }, [isRolling]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  const dotSize = size * 0.18;
  const padding = size * 0.18;
  const gap = (size - padding * 2 - dotSize) / 2;

  const positions = DOT_POSITIONS[value] ?? DOT_POSITIONS[1];

  return (
    <Animated.View style={[styles.dice, { width: size, height: size, borderRadius: size * 0.18 }, animatedStyle]}>
      {isRolling ? (
        <Text style={[styles.rollingText, { fontSize: size * 0.4 }]}>?</Text>
      ) : (
        <View style={[styles.dotGrid, { padding }]}>
          {positions.map(([row, col], i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  width: dotSize,
                  height: dotSize,
                  borderRadius: dotSize / 2,
                  position: 'absolute',
                  top: padding + row * gap,
                  left: padding + col * gap,
                },
              ]}
            />
          ))}
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  dice: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  dotGrid: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  dot: {
    backgroundColor: '#0B1D3A',
  },
  rollingText: {
    fontWeight: '900',
    color: '#0B1D3A',
  },
});
