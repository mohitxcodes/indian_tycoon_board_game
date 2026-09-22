import React from 'react';
import { View, StyleSheet, Text, useWindowDimensions } from 'react-native';
import { BoardTile as IBoardTile, Property } from '../../types/property';
import { Player } from '../../types/player';
import { BoardTile } from './BoardTile';
import { TokenOverlay } from './TokenOverlay';
import { TILES_PER_SIDE } from '../../data/boardData';

interface GameBoardProps {
  boardData: IBoardTile[];
  properties: Record<string, Property>;
  players: Player[];
  currentPlayerIndex: number;
  onPlayerAnimationComplete?: () => void;
  onTilePress?: (propertyId: string) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  boardData,
  properties,
  players,
  currentPlayerIndex,
  onPlayerAnimationComplete,
  onTilePress,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  // Board takes full width minus a small padding
  const boardSize = screenWidth - 8; 

  // In a 40 tile board, there are 11 tiles per edge (including corners).
  // The corners take up space on both axes.
  // Increased cornerSize makes the tiles bigger and the center smaller
  const cornerSize = boardSize * 0.155;
  const sideTileCount = TILES_PER_SIDE - 2; // 9 side tiles
  const sideTileLength = (boardSize - cornerSize * 2) / sideTileCount;

  // Split board into 4 edges based on Monopoly logic
  // Bottom: 0-10 (11 tiles)
  // Left: 11-19 (9 tiles)
  // Top: 20-30 (11 tiles)
  // Right: 31-39 (9 tiles)
  
  const bottomRow = boardData.slice(0, 11);
  const leftCol   = boardData.slice(11, 20);
  const topRow    = boardData.slice(20, 31);
  const rightCol  = boardData.slice(31, 40);

  return (
    <View style={[styles.board, { width: boardSize, height: boardSize }]}>
      {/* ── TOP ROW (Left to Right) ── */}
      <View style={styles.row}>
        {topRow.map((tile, i) => {
          const isCorner = i === 0 || i === topRow.length - 1;
          return (
            <BoardTile
              key={tile.id}
              tile={tile}
              property={tile.propertyId ? properties[tile.propertyId] : undefined}
              width={isCorner ? cornerSize : sideTileLength}
              height={cornerSize}
              orientation={isCorner ? 'corner' : 'top'}
              onPress={() => {
                if (tile.propertyId) onTilePress?.(tile.propertyId);
              }}
            />
          );
        })}
      </View>

      {/* ── MIDDLE SECTION ── */}
      <View style={styles.middleSection}>
        {/* Left column (Top to Bottom -> reversed indices) */}
        <View style={styles.col}>
          {[...leftCol].reverse().map((tile) => (
            <BoardTile
              key={tile.id}
              tile={tile}
              property={tile.propertyId ? properties[tile.propertyId] : undefined}
              width={cornerSize}
              height={sideTileLength}
              orientation="left"
              onPress={() => {
                if (tile.propertyId) onTilePress?.(tile.propertyId);
              }}
            />
          ))}
        </View>

        {/* Center area (Green field) */}
        <View style={styles.center}>
          {/* Top Left Card (Community Chest) */}
          <View style={[styles.cardPlaceholder, styles.cardCommunity]}>
            <View style={styles.cardCommunityInner}>
              <Text style={styles.cardIcon}>📦</Text>
              <Text style={styles.cardText}>COMMUNITY{'\n'}CHEST</Text>
            </View>
          </View>
          
          {/* Bottom Right Card (Chance) */}
          <View style={[styles.cardPlaceholder, styles.cardChance]}>
            <View style={styles.cardChanceInner}>
              <Text style={styles.cardIcon}>📢</Text>
              <Text style={styles.cardText}>CHANCE</Text>
            </View>
          </View>

          {/* Diagonal text */}
          <View style={styles.centerTextContainer}>
            <Text style={styles.centerTitleSmall}>INDIAN</Text>
            <Text style={styles.centerTitleBig}>TYCOON</Text>
          </View>
          
          {/* Little trees as seen in the image */}
          <View style={[styles.tree, { top: '35%', left: '40%' }]}><Text style={styles.treeIcon}>🌳</Text></View>
          <View style={[styles.tree, { top: '45%', left: '30%' }]}><Text style={styles.treeIcon}>🌳</Text></View>
          <View style={[styles.tree, { bottom: '30%', left: '35%' }]}><Text style={styles.treeIcon}>🌳</Text></View>
          <View style={[styles.tree, { bottom: '40%', right: '35%' }]}><Text style={styles.treeIcon}>🌳</Text></View>
          <View style={[styles.tree, { top: '30%', right: '25%' }]}><Text style={styles.treeIcon}>🌳</Text></View>
        </View>

        {/* Right column (Top to Bottom) */}
        <View style={styles.col}>
          {rightCol.map((tile) => (
            <BoardTile
              key={tile.id}
              tile={tile}
              property={tile.propertyId ? properties[tile.propertyId] : undefined}
              width={cornerSize}
              height={sideTileLength}
              orientation="right"
              onPress={() => {
                if (tile.propertyId) onTilePress?.(tile.propertyId);
              }}
            />
          ))}
        </View>
      </View>

      {/* ── BOTTOM ROW (Right to Left -> reversed indices) ── */}
      <View style={styles.row}>
        {[...bottomRow].reverse().map((tile, i) => {
          const isCorner = i === 0 || i === bottomRow.length - 1;
          return (
            <BoardTile
              key={tile.id}
              tile={tile}
              property={tile.propertyId ? properties[tile.propertyId] : undefined}
              width={isCorner ? cornerSize : sideTileLength}
              height={cornerSize}
              orientation={isCorner ? 'corner' : 'bottom'}
              onPress={() => {
                if (tile.propertyId) onTilePress?.(tile.propertyId);
              }}
            />
          );
        })}
      </View>

      {/* ── Animated Player Tokens Overlay ── */}
      <TokenOverlay
        players={players}
        boardSize={boardSize}
        cornerSize={cornerSize}
        sideTileLength={sideTileLength}
        currentPlayerIndex={currentPlayerIndex}
        onPlayerAnimationComplete={onPlayerAnimationComplete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    backgroundColor: '#000000',
    borderWidth: 0.5,
    borderColor: '#333',
  },
  row: {
    flexDirection: 'row',
  },
  middleSection: {
    flex: 1,
    flexDirection: 'row',
  },
  col: {
    flexDirection: 'column',
  },
  center: {
    flex: 1,
    backgroundColor: '#6CC218', // Bright green field color
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#4A9A0F',
    // Slight shadow to give depth inside the board
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 4,
  },
  centerTextContainer: {
    position: 'absolute',
    transform: [{ rotate: '-45deg' }],
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTitleSmall: {
    fontSize: 24,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.25)',
    letterSpacing: 4,
    marginBottom: -8,
  },
  centerTitleBig: {
    fontSize: 56,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.25)',
    letterSpacing: 2,
  },
  cardPlaceholder: {
    position: 'absolute',
    width: '38%',
    height: '24%',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    padding: 4,
    opacity: 0.6, // Low opacity as requested
  },
  cardCommunity: {
    top: '12%',
    left: '12%',
    transform: [{ rotate: '-45deg' }],
  },
  cardCommunityInner: {
    flex: 1,
    width: '100%',
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardChance: {
    bottom: '12%',
    right: '12%',
    transform: [{ rotate: '-45deg' }],
  },
  cardChanceInner: {
    flex: 1,
    width: '100%',
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  cardText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 10,
    textAlign: 'center',
  },
  tree: {
    position: 'absolute',
    zIndex: 5,
  },
  treeIcon: {
    fontSize: 18,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 2,
  }
});
