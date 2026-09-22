import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Player } from '../../types/player';
import { AnimatedToken } from './AnimatedToken';

const PLAYER_COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B'];

interface TokenOverlayProps {
  players: Player[];
  boardSize: number;
  cornerSize: number;
  sideTileLength: number;
  currentPlayerIndex: number;
  onPlayerAnimationComplete?: () => void;
}

export const TokenOverlay: React.FC<TokenOverlayProps> = ({
  players,
  boardSize,
  cornerSize,
  sideTileLength,
  currentPlayerIndex,
  onPlayerAnimationComplete,
}) => {
  return (
    <View style={[styles.overlay, { width: boardSize, height: boardSize }]} pointerEvents="none">
      {players
        .filter((p) => !p.isBankrupt)
        .map((player, index) => (
          <AnimatedToken
            key={player.id}
            position={player.position}
            color={PLAYER_COLORS[index % PLAYER_COLORS.length]}
            playerIndex={index}
            boardSize={boardSize}
            cornerSize={cornerSize}
            sideTileLength={sideTileLength}
            onAnimationComplete={index === currentPlayerIndex ? onPlayerAnimationComplete : undefined}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 50,
  },
});
