import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { BoardTile as IBoardTile, Property } from '../../types/property';
import { GROUP_COLORS } from '../../data/boardData';

export type TileOrientation = 'bottom' | 'left' | 'top' | 'right' | 'corner';

interface BoardTileProps {
  tile: IBoardTile;
  property?: Property;
  ownerColor?: string;
  width: number;
  height: number;
  orientation: TileOrientation;
  onPress?: () => void;
}

const TILE_ICONS: Record<string, string> = {
  start: 'GO',
  jail: '⛓️',
  rest: '🚗', // Free parking
  goto_jail: '🚔',
  event: '❓', // Chance/Chest
  transport: '🚂',
  utility: '💡',
};

export const BoardTile: React.FC<BoardTileProps> = ({
  tile,
  property,
  ownerColor,
  width,
  height,
  orientation,
  onPress,
}) => {
  const isCorner = orientation === 'corner';
  const groupColor = property ? (GROUP_COLORS[property.group] ?? '#999') : undefined;

  // Determine where the color strip goes
  const stripPosition = (() => {
    switch (orientation) {
      case 'bottom': return 'top';
      case 'top':    return 'bottom';
      case 'left':   return 'right';
      case 'right':  return 'left';
      default:       return 'top';
    }
  })();

  const isTopBottom = orientation === 'top' || orientation === 'bottom';
  const textRotation = orientation === 'bottom' ? '90deg' : orientation === 'top' ? '-90deg' : '0deg';

  const renderPropertyTile = () => (
    <View style={[styles.tileInner, { width, height }]}>
      {/* Color strip */}
      {groupColor && (
        <View
          style={[
            styles.colorStrip,
            stripPosition === 'top' && { top: 0, left: 0, right: 0, height: height * 0.25 },
            stripPosition === 'bottom' && { bottom: 0, left: 0, right: 0, height: height * 0.25 },
            stripPosition === 'left' && { left: 0, top: 0, bottom: 0, width: width * 0.25 },
            stripPosition === 'right' && { right: 0, top: 0, bottom: 0, width: width * 0.25 },
            { backgroundColor: groupColor },
          ]}
        />
      )}
      {/* Owner strip */}
      {ownerColor && (
        <View
          style={[
            styles.ownerStrip,
            stripPosition === 'top' && { bottom: 0, left: 0, right: 0, height: 4 },
            stripPosition === 'bottom' && { top: 0, left: 0, right: 0, height: 4 },
            stripPosition === 'left' && { right: 0, top: 0, bottom: 0, width: 4 },
            stripPosition === 'right' && { left: 0, top: 0, bottom: 0, width: 4 },
            { backgroundColor: ownerColor },
          ]}
        />
      )}
      {/* Content */}
      <View style={[styles.tileContent, 
        stripPosition === 'top' && { paddingTop: height * 0.25 },
        stripPosition === 'bottom' && { paddingBottom: height * 0.25 },
        stripPosition === 'left' && { paddingLeft: width * 0.25 },
        stripPosition === 'right' && { paddingRight: width * 0.25 },
      ]}>
        <View style={[
          styles.rotatedContent,
          isTopBottom && {
            width: height * 0.75, // Height of available area becomes width
            height: width,        // Width of available area becomes height
            transform: [{ rotate: textRotation }]
          }
        ]}>
          <Text style={[styles.tilePrice, { fontSize: Math.max(7, Math.min(width, height) * 0.22) }]}>
            ₹{property?.price}
          </Text>
          <Text
            style={[styles.tileName, { fontSize: Math.max(6, Math.min(width, height) * 0.16) }]}
            numberOfLines={2}
          >
            {tile.name}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderSpecialTile = () => (
    <View style={[styles.tileInner, styles.specialTile, { width, height }]}>
      {/* Owner strip for special tiles (like transport/utility) */}
      {ownerColor && (
        <View
          style={[
            styles.ownerStrip,
            stripPosition === 'top' && { bottom: 0, left: 0, right: 0, height: 4 },
            stripPosition === 'bottom' && { top: 0, left: 0, right: 0, height: 4 },
            stripPosition === 'left' && { right: 0, top: 0, bottom: 0, width: 4 },
            stripPosition === 'right' && { left: 0, top: 0, bottom: 0, width: 4 },
            { backgroundColor: ownerColor },
          ]}
        />
      )}
      <View style={[
        styles.rotatedContent,
        isTopBottom && {
          width: height,
          height: width,
          transform: [{ rotate: textRotation }]
        }
      ]}>
        <Text style={[styles.specialName, { fontSize: Math.max(7, Math.min(width, height) * 0.18) }]}>
          {tile.name}
        </Text>
        {tile.type === 'tax' && tile.taxAmount && (
          <Text style={[styles.tilePrice, { fontSize: Math.max(7, Math.min(width, height) * 0.18) }]}>
            PAY ₹{tile.taxAmount}
          </Text>
        )}
        {tile.type === 'utility' ? (
          <Text style={[styles.specialIcon, { fontSize: Math.max(12, Math.min(width, height) * 0.3) }]}>
            {tile.name === 'WATER' ? '💧' : '💡'}
          </Text>
        ) : TILE_ICONS[tile.type] ? (
          <Text style={[styles.specialIcon, { fontSize: Math.max(12, Math.min(width, height) * 0.3) }]}>
            {TILE_ICONS[tile.type]}
          </Text>
        ) : null}
      </View>
    </View>
  );

  const renderCornerTile = () => (
    <View style={[styles.tileInner, styles.cornerTile, { width, height }]}>
      <Text style={[styles.specialIcon, { fontSize: Math.max(14, Math.min(width, height) * 0.35) }]}>
        {TILE_ICONS[tile.type] ?? ''}
      </Text>
      <Text style={[styles.cornerName, { fontSize: Math.max(8, Math.min(width, height) * 0.18) }]}>
        {tile.name}
      </Text>
    </View>
  );

  return (
    <Pressable onPress={onPress} style={[styles.tile, { width, height }]}>
      {isCorner
        ? renderCornerTile()
        : tile.type === 'property'
          ? renderPropertyTile()
          : renderSpecialTile()}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tile: {
    borderWidth: 0.5,
    borderColor: '#333',
    overflow: 'hidden',
  },
  tileInner: {
    flex: 1,
    backgroundColor: '#E5E7EB', // Light grey/white like the board in image
  },
  specialTile: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  cornerTile: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  colorStrip: {
    position: 'absolute',
    zIndex: 1,
    borderWidth: 0.5,
    borderColor: '#333',
  },
  ownerStrip: {
    position: 'absolute',
    zIndex: 3,
  },
  tileContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  rotatedContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingHorizontal: 2,
  },
  tileName: {
    color: '#000',
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 10,
    marginTop: 1,
    textTransform: 'uppercase',
  },
  tilePrice: {
    color: '#000',
    fontWeight: '900',
    textAlign: 'center',
  },
  specialIcon: {
    textAlign: 'center',
    marginTop: 2,
  },
  specialName: {
    color: '#000',
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  cornerName: {
    color: '#000',
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginTop: 2,
  },
});
