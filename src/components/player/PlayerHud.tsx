import React from 'react';
import { View, StyleSheet, Text, useWindowDimensions, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Player } from '../../types/player';

// Matching board tile style colors
const PLAYER_STYLES = [
  { color: '#EF4444', shadow: '#B91C1C' }, // Red
  { color: '#3B82F6', shadow: '#1D4ED8' }, // Blue
  { color: '#10B981', shadow: '#047857' }, // Green
  { color: '#F59E0B', shadow: '#B45309' }, // Amber
];

// Animated person-style avatars that fill the circle
const getAvatarUrl = (name: string) =>
  `https://api.dicebear.com/7.x/adventurer/png?seed=${name}&backgroundColor=b6e3f4&radius=50&size=80`;

interface PlayerHudProps {
  players: Player[];
  currentPlayerIndex: number;
}

const PlayerCard: React.FC<{
  player: Player;
  index: number;
  isActive: boolean;
}> = ({ player, index, isActive }) => {
  const style = PLAYER_STYLES[index % PLAYER_STYLES.length];
  const avatarUrl = getAvatarUrl(player.name);

  return (
    <View style={[
      styles.card3dBase,
      { backgroundColor: isActive ? style.shadow : '#B0B0B0' }, // 3D shadow layer
      isActive && { paddingBottom: 0, marginTop: 4 }, // Press-down effect when active
    ]}>
      <View style={[
        styles.cardFace,
        { backgroundColor: '#E5E7EB' }, // Board tile grey
        isActive && { borderWidth: 2.5, borderColor: style.color },
      ]}>
        {/* Avatar */}
        <View style={[styles.avatarCircle, { borderColor: style.color }]}>
          <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
        </View>

        {/* Info */}
        <View style={styles.infoSection}>
          {/* Name badge with player color */}
          <View style={[styles.nameBadge, { backgroundColor: style.color }]}>
            <Text style={styles.nameText} numberOfLines={1}>{player.name}</Text>
          </View>

          {/* Money row with green cash icon */}
          <View style={styles.moneyRow}>
            <FontAwesome5 name="money-bill-wave" size={11} color="#10B981" style={{ marginRight: 4 }} />
            <Text style={styles.moneyText}>₹ {player.money.toLocaleString('en-IN')}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export const PlayerHud: React.FC<PlayerHudProps> = ({ players, currentPlayerIndex }) => {
  const { width } = useWindowDimensions();
  const hudWidth = width - 16;

  return (
    <View style={[styles.container, { width: hudWidth }]}>
      <View style={styles.row}>
        {players[0] && <PlayerCard player={players[0]} index={0} isActive={0 === currentPlayerIndex} />}
        {players[1] && <PlayerCard player={players[1]} index={1} isActive={1 === currentPlayerIndex} />}
      </View>

      {(players.length > 2) && (
        <View style={styles.row}>
          {players[2] && <PlayerCard player={players[2]} index={2} isActive={2 === currentPlayerIndex} />}
          {players[3] && <PlayerCard player={players[3]} index={3} isActive={3 === currentPlayerIndex} />}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
  },
  // 3D depth container
  card3dBase: {
    flex: 1,
    borderRadius: 8,
    paddingBottom: 4, // 3D depth
  },
  cardFace: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 5,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: '#b6e3f4',
  },
  avatarImage: {
    width: 36,
    height: 36,
    resizeMode: 'cover',
  },
  infoSection: {
    flex: 1,
    marginLeft: 6,
    justifyContent: 'center',
  },
  nameBadge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  nameText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  moneyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moneyText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1E293B',
  },
});
