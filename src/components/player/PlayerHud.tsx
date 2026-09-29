import React from 'react';
import { View, StyleSheet, Text, useWindowDimensions, Image, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { useEffect, useRef, useState } from 'react';
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
  onPlayerPress: (player: Player) => void;
}

const PlayerCard: React.FC<{
  player: Player;
  index: number;
  isActive: boolean;
  onPress: () => void;
}> = ({ player, index, isActive, onPress }) => {
  const style = PLAYER_STYLES[index % PLAYER_STYLES.length];
  const avatarUrl = getAvatarUrl(player.name);

  const prevMoneyRef = useRef(player.money);
  const [moneyDiff, setMoneyDiff] = useState<number | null>(null);
  const [diffKey, setDiffKey] = useState(0);

  useEffect(() => {
    if (player.money !== prevMoneyRef.current) {
      const diff = player.money - prevMoneyRef.current;
      prevMoneyRef.current = player.money;
      
      setMoneyDiff(diff);
      setDiffKey(prev => prev + 1);

      const timer = setTimeout(() => {
        setMoneyDiff(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [player.money]);

  return (
    <Pressable onPress={onPress} style={[
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
            
            {moneyDiff !== null && (
              <Animated.Text
                key={diffKey}
                entering={FadeInDown.duration(400).springify()}
                exiting={FadeOutUp.duration(300)}
                style={[
                  styles.floatingDiff,
                  { color: moneyDiff > 0 ? '#10B981' : '#EF4444' }
                ]}
              >
                {moneyDiff > 0 ? '+' : '-'}₹{Math.abs(moneyDiff)}
              </Animated.Text>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export const PlayerHud: React.FC<PlayerHudProps> = ({ players, currentPlayerIndex, onPlayerPress }) => {
  const { width } = useWindowDimensions();
  const hudWidth = width - 16;

  return (
    <View style={[styles.container, { width: hudWidth }]}>
      <View style={styles.row}>
        {players[0] && <PlayerCard player={players[0]} index={0} isActive={0 === currentPlayerIndex} onPress={() => onPlayerPress(players[0])} />}
        {players[1] && <PlayerCard player={players[1]} index={1} isActive={1 === currentPlayerIndex} onPress={() => onPlayerPress(players[1])} />}
      </View>

      {(players.length > 2) && (
        <View style={styles.row}>
          {players[2] && <PlayerCard player={players[2]} index={2} isActive={2 === currentPlayerIndex} onPress={() => onPlayerPress(players[2])} />}
          {players[3] && <PlayerCard player={players[3]} index={3} isActive={3 === currentPlayerIndex} onPress={() => onPlayerPress(players[3])} />}
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
  floatingDiff: {
    position: 'absolute',
    right: -2,
    top: -18,
    fontSize: 14,
    fontWeight: '900',
    textShadowColor: 'rgba(255,255,255,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    zIndex: 10,
  },
});
