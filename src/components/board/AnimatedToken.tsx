import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { FontAwesome5 } from '@expo/vector-icons';
import { TOTAL_TILES, TILES_PER_SIDE } from '../../data/boardData';

interface AnimatedTokenProps {
  position: number;        // Current tile index (0-39)
  color: string;           // Player color
  playerIndex: number;     // 0-3 for offset
  boardSize: number;       // Total board pixel size
  cornerSize: number;      // Corner tile pixel size
  sideTileLength: number;  // Regular tile pixel size
  onAnimationComplete?: () => void;
}

/**
 * Convert a tile position (0-39) to pixel coordinates on the board.
 *
 * Board layout (40 tiles):
 *   Bottom row: positions 0-10 (right to left visually because reversed)
 *   Left col:   positions 11-19 (bottom to top visually because reversed)
 *   Top row:    positions 20-30 (left to right)
 *   Right col:  positions 31-39 (top to bottom)
 *
 * Pixel origin (0,0) = top-left of the board View.
 */
function getTileCenter(
  position: number,
  boardSize: number,
  cornerSize: number,
  sideTileLength: number,
  playerIndex: number,
): { x: number; y: number } {
  const pos = ((position % TOTAL_TILES) + TOTAL_TILES) % TOTAL_TILES;

  let x = 0;
  let y = 0;

  if (pos <= 10) {
    // ── Bottom row: 0 (GO, bottom-right corner) → 10 (JAIL, bottom-left corner) ──
    // Visually rendered right-to-left (reversed), so position 0 is at the RIGHT.
    const fromRight = pos; // 0 = rightmost corner
    if (fromRight === 0) {
      // Bottom-right corner
      x = boardSize - cornerSize / 2;
      y = boardSize - cornerSize / 2;
    } else if (fromRight === 10) {
      // Bottom-left corner (JAIL)
      x = cornerSize / 2;
      y = boardSize - cornerSize / 2;
    } else {
      // Side tiles: go from right to left
      x = boardSize - cornerSize - (fromRight - 0.5) * sideTileLength;
      y = boardSize - cornerSize / 2;
    }
  } else if (pos <= 19) {
    // ── Left column: 11-19 (bottom to top visually reversed) ──
    const fromBottom = pos - 11; // 0 = closest to bottom-left corner
    // Visually reversed: index 0 is at the TOP of the left column
    // Actually rendered reversed, so index 0 renders at top
    // Position 11 is closest to JAIL (bottom), position 19 is closest to FREE PARKING (top)
    x = cornerSize / 2;
    y = boardSize - cornerSize - (fromBottom + 0.5) * sideTileLength;
  } else if (pos <= 30) {
    // ── Top row: 20-30 (left to right) ──
    const fromLeft = pos - 20;
    if (fromLeft === 0) {
      // Top-left corner (FREE PARKING)
      x = cornerSize / 2;
      y = cornerSize / 2;
    } else if (fromLeft === 10) {
      // Top-right corner (GO TO JAIL)
      x = boardSize - cornerSize / 2;
      y = cornerSize / 2;
    } else {
      x = cornerSize + (fromLeft - 0.5) * sideTileLength;
      y = cornerSize / 2;
    }
  } else {
    // ── Right column: 31-39 (top to bottom) ──
    const fromTop = pos - 31;
    x = boardSize - cornerSize / 2;
    y = cornerSize + (fromTop + 0.5) * sideTileLength;
  }

  // Offset slightly based on playerIndex so pawns don't overlap
  const offsets = [
    { dx: -5, dy: -4 },
    { dx: 5, dy: -4 },
    { dx: -5, dy: 6 },
    { dx: 5, dy: 6 },
  ];
  const offset = offsets[playerIndex % 4];
  x += offset.dx;
  y += offset.dy;

  return { x, y };
}

export const AnimatedToken: React.FC<AnimatedTokenProps> = ({
  position,
  color,
  playerIndex,
  boardSize,
  cornerSize,
  sideTileLength,
  onAnimationComplete,
}) => {
  const prevPosition = useRef(position);

  // Animated pixel coordinates
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  // Bounce scale effect
  const scaleY = useSharedValue(1);

  // Initialize position on mount
  useEffect(() => {
    const { x, y } = getTileCenter(position, boardSize, cornerSize, sideTileLength, playerIndex);
    translateX.value = x;
    translateY.value = y;
    prevPosition.current = position;
  }, [boardSize]); // Only on mount / board resize

  // Animate step-by-step when position changes
  useEffect(() => {
    const from = prevPosition.current;
    const to = position;
    if (from === to) return;

    // Calculate steps going forward (handles wrapping past GO)
    let steps = to - from;
    if (steps < 0) steps += TOTAL_TILES; // Wrap around

    const STEP_DURATION = 180; // ms per tile hop
    const BOUNCE_DURATION = 80;

    // Build a chain: move to each intermediate tile one by one
    const animateStep = (step: number) => {
      const intermediatePos = (from + step) % TOTAL_TILES;
      const { x, y } = getTileCenter(intermediatePos, boardSize, cornerSize, sideTileLength, playerIndex);
      const isLastStep = step === steps;

      translateX.value = withTiming(x, {
        duration: STEP_DURATION,
        easing: Easing.out(Easing.quad),
      });

      translateY.value = withTiming(y, {
        duration: STEP_DURATION,
        easing: Easing.out(Easing.quad),
      });

      // Bounce: squash on landing, then spring back
      scaleY.value = withSequence(
        withTiming(1, { duration: STEP_DURATION * 0.6 }), // Moving phase
        withTiming(0.7, { duration: BOUNCE_DURATION, easing: Easing.out(Easing.quad) }), // Squash
        withTiming(1.15, { duration: BOUNCE_DURATION, easing: Easing.out(Easing.quad) }), // Stretch
        withTiming(1, { duration: BOUNCE_DURATION, easing: Easing.inOut(Easing.ease) }), // Settle
      );

      if (!isLastStep) {
        setTimeout(() => {
          animateStep(step + 1);
        }, STEP_DURATION + BOUNCE_DURATION);
      } else {
        // Final landing: notify completion
        if (onAnimationComplete) {
          setTimeout(() => {
            onAnimationComplete();
          }, STEP_DURATION + BOUNCE_DURATION * 3);
        }
      }
    };

    // Start the chain from step 1 (first intermediate tile)
    animateStep(1);
    prevPosition.current = to;
  }, [position]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value - 12 }, // center the 24px icon
      { translateY: translateY.value - 20 }, // offset so pawn base is on the tile center
      { scaleY: scaleY.value },
    ],
  }));

  return (
    <Animated.View style={[styles.tokenContainer, animatedStyle]}>
      <FontAwesome5
        name="chess-pawn"
        solid
        size={22}
        color={color}
        style={styles.pawnIcon}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tokenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 24,
    height: 24,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pawnIcon: {
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 3 },
    textShadowRadius: 3,
  },
});
