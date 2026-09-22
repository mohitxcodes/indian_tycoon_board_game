import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInDown,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { GameBoard } from '../../components/board/Board';
import { DiceFace } from '../../components/dice/Dice';
import { PlayerHud } from '../../components/player/PlayerHud';
import { ActionBar } from '../../components/board/ActionBar';
import { PropertyModal } from '../../components/board/PropertyModal';
import { TileInfoModal } from '../../components/board/TileInfoModal';
import { useGameStore } from '../../store/gameStore';
import { theme } from '../../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function GameScreen() {
  const { gameId } = useLocalSearchParams();
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();

  const game = useGameStore((s) => s.game);
  const initGame = useGameStore((s) => s.initGame);
  const rollDiceAction = useGameStore((s) => s.rollDice);
  const buyPropertyAction = useGameStore((s) => s.buyProperty);
  const endTurnAction = useGameStore((s) => s.endTurn);

  const [isRolling, setIsRolling] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [declinedPropertyId, setDeclinedPropertyId] = useState<string | null>(null);
  const [inspectedPropertyId, setInspectedPropertyId] = useState<string | null>(null);

  // Dice glow animation
  const diceGlow = useSharedValue(0);
  const rollBtnScale = useSharedValue(1);

  useEffect(() => {
    if (!game) {
      initGame();
    }
  }, [game, initGame]);

  // Pulse the roll button when it's your turn
  useEffect(() => {
    if (!hasRolled && !isRolling) {
      diceGlow.value = withDelay(
        500,
        withSequence(
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        )
      );
    }
  }, [hasRolled, isRolling]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: diceGlow.value,
  }));

  const rollBtnAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rollBtnScale.value }],
  }));

  const handleRollDice = useCallback(() => {
    if (isRolling || hasRolled) return;
    setIsRolling(true);
    setIsAnimating(true); // Start animation lock
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    setTimeout(() => {
      setIsRolling(false);
      setHasRolled(true);
      rollDiceAction();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 900);
  }, [isRolling, hasRolled, rollDiceAction]);

  const handleAnimationComplete = useCallback(() => {
    setIsAnimating(false);
  }, []);

  const handleEndTurn = useCallback(() => {
    endTurnAction();
    setHasRolled(false);
    setDeclinedPropertyId(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [endTurnAction]);

  if (!game) {
    return (
      <View style={styles.loadingScreen}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.loadingEmoji}>🎲</Text>
        <Text style={styles.loadingText}>Setting up the board...</Text>
      </View>
    );
  }

  const currentPlayer = game.players[game.currentPlayerIndex];
  const isMyTurn = currentPlayer.id === 'player-1';
  const dice1 = game.lastDiceRoll ? game.lastDiceRoll[0] : 1;
  const dice2 = game.lastDiceRoll ? game.lastDiceRoll[1] : 1;

  // Check if current tile is a buyable property
  const currentTile = game.board[currentPlayer.position];
  const currentProperty = currentTile?.propertyId ? game.properties[currentTile.propertyId] : undefined;
  
  // They can buy if they rolled, it's their turn, property is unowned, they can afford it, and they haven't declined it yet
  const canBuy = hasRolled && !isAnimating && isMyTurn && currentProperty && !currentProperty.ownerId && currentPlayer.money >= currentProperty.price;
  const showPropertyModal = canBuy && declinedPropertyId !== currentProperty?.id;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />

      {/* ── Player HUD (top) ─────────────────────── */}
      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <View style={styles.topSafeArea} />
        <PlayerHud players={game.players} currentPlayerIndex={game.currentPlayerIndex} />
      </Animated.View>

      {/* ── Board ─────────────────────────────────── */}
      <Animated.View
        entering={FadeIn.delay(100).duration(600)}
        style={styles.boardWrapper}
      >
        <GameBoard
          boardData={game.board}
          properties={game.properties}
          players={game.players}
          currentPlayerIndex={game.currentPlayerIndex}
          onPlayerAnimationComplete={handleAnimationComplete}
          onTilePress={(propertyId) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setInspectedPropertyId(propertyId);
          }}
        />
      </Animated.View>

      {/* ── Action Bar ────────────────────────────── */}
      <Animated.View entering={FadeIn.delay(400).duration(400)}>
        <ActionBar
          onMenu={() => router.back()}
          onBuild={() => {}}
          onSell={() => {}}
          onTrade={() => {}}
          onMortgage={() => {}}
          onRedeem={() => {}}
        />
      </Animated.View>

      {/* ── Dice + Roll Section (bottom) ──────────── */}
      <Animated.View
        entering={SlideInDown.delay(300).duration(500).springify()}
        style={styles.bottomSection}
      >
        {/* Dice display */}
        <View style={styles.diceRow}>
          <DiceFace value={dice1} size={52} isRolling={isRolling} />
          <View style={{ width: 12 }} />
          <DiceFace value={dice2} size={52} isRolling={isRolling} />
        </View>

        {/* Roll / End Turn / Buy buttons */}
        <View style={styles.ctaRow}>
          {!hasRolled && isMyTurn && (
            <AnimatedPressable
              onPress={handleRollDice}
              onPressIn={() => { rollBtnScale.value = withSpring(0.92); }}
              onPressOut={() => { rollBtnScale.value = withSpring(1); }}
              style={[styles.rollButton, rollBtnAnimStyle]}
            >
              <Animated.View style={[styles.rollGlow, glowStyle]} />
              <Text style={styles.rollButtonText}>
                {isRolling ? '🎲 Rolling...' : '🎲 Roll the Dice'}
              </Text>
            </AnimatedPressable>
          )}

          {/* Note: the old buy button is removed. It is now handled by the PropertyModal overlay */}

          {hasRolled && isMyTurn && !showPropertyModal && (
            <AnimatedPressable
              onPress={handleEndTurn}
              style={styles.endTurnButton}
            >
              <Text style={styles.endTurnText}>End Turn →</Text>
            </AnimatedPressable>
          )}

          {!isMyTurn && (
            <View style={styles.waitingBadge}>
              <Text style={styles.waitingText}>⏳ {currentPlayer.name}'s turn...</Text>
            </View>
          )}
        </View>

        {/* Event feed */}
        {game.eventFeed.length > 0 && (
          <View style={styles.eventFeed}>
            <Text style={styles.eventText} numberOfLines={1}>
              📢 {game.eventFeed[0]}
            </Text>
          </View>
        )}
      </Animated.View>

      {/* ── Overlay Modals ──────────────────────── */}
      {showPropertyModal && currentProperty && (
        <PropertyModal
          property={currentProperty}
          onBuy={() => {
            buyPropertyAction(currentProperty.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }}
          onAuction={() => {
            // For now, Auction just skips buying the property
            setDeclinedPropertyId(currentProperty.id);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        />
      )}

      {/* ── Tile Info Modal (read-only inspection) ── */}
      {inspectedPropertyId && !showPropertyModal && (
        <TileInfoModal
          property={game.properties[inspectedPropertyId]}
          onClose={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setInspectedPropertyId(null);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  topSafeArea: {
    height: 50,
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: '#0A1628',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
  },

  boardWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  bottomSection: {
    paddingBottom: 36,
    paddingTop: 8,
    backgroundColor: 'rgba(11,29,58,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },

  diceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },

  ctaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },

  rollButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  rollGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
  },
  rollButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  buyButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  buyButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },

  endTurnButton: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  endTurnText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '700',
  },

  waitingBadge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  waitingText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontWeight: '600',
  },

  eventFeed: {
    marginTop: 6,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  eventText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '500',
  },
});
