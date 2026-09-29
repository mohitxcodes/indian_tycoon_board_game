import React, { useMemo } from 'react';
import { View, StyleSheet, Text, ScrollView, useWindowDimensions, Pressable, Image } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { Player } from '../../types/player';
import { Property, PropertyLevel } from '../../types/property';
import { GROUP_COLORS } from '../../data/boardData';

interface PlayerProfileModalProps {
  player: Player;
  properties: Record<string, Property>;
  onClose: () => void;
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({ player, properties, onClose }) => {
  const { width, height } = useWindowDimensions();

  const { ownedProperties, netWorth, stats } = useMemo(() => {
    const owned = Object.values(properties).filter(p => p.ownerId === player.id);
    
    let totalPropValue = 0;
    let totalBuildingValue = 0;
    let stations = 0;
    let utilities = 0;
    let propsCount = 0;

    const grouped: Record<string, Property[]> = {};

    owned.forEach(p => {
      totalPropValue += p.price;
      if (!p.isMortgaged && p.level > 0) {
        totalBuildingValue += p.upgradeCost * p.level;
      }
      
      if (p.group === 'Station') stations++;
      else if (p.group === 'Utility') utilities++;
      else propsCount++;

      if (!grouped[p.group]) grouped[p.group] = [];
      grouped[p.group].push(p);
    });

    const netWorthCalc = player.money + totalPropValue + totalBuildingValue;

    return {
      ownedProperties: grouped,
      netWorth: netWorthCalc,
      stats: { properties: propsCount, stations, utilities }
    };
  }, [player, properties]);

  const avatarUrl = `https://api.dicebear.com/7.x/adventurer/png?seed=${player.name}&backgroundColor=b6e3f4&radius=50&size=100`;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={styles.overlay}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      
      <Animated.View
        entering={SlideInDown.duration(400).springify()}
        exiting={SlideOutDown.duration(300)}
        style={[styles.modalContent, { width: Math.min(width * 0.95, 400), maxHeight: height * 0.85 }]}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.playerName}>{player.name}</Text>
            <Text style={styles.netWorth}>Net Worth: ₹{netWorth.toLocaleString('en-IN')}</Text>
          </View>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Cash</Text>
            <Text style={styles.statValue}>₹{player.money.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Props</Text>
            <Text style={styles.statValue}>{stats.properties}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Stations</Text>
            <Text style={styles.statValue}>{stats.stations}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Utils</Text>
            <Text style={styles.statValue}>{stats.utilities}</Text>
          </View>
        </View>

        <View style={styles.propertiesContainer}>
          <Text style={styles.sectionTitle}>OWNED PROPERTIES</Text>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            {Object.keys(ownedProperties).length === 0 ? (
              <Text style={styles.emptyText}>No properties owned yet.</Text>
            ) : (
              Object.entries(ownedProperties).map(([group, props]) => {
                const groupColor = GROUP_COLORS[group] || '#475569';
                return (
                  <View key={group} style={styles.groupCard}>
                    <View style={[styles.groupHeader, { backgroundColor: groupColor }]}>
                      <Text style={styles.groupTitle}>{group.toUpperCase()} GROUP</Text>
                    </View>
                    <View style={styles.propList}>
                      {props.map(p => (
                        <View key={p.id} style={styles.propItem}>
                          <View style={styles.propInfo}>
                            <Text style={styles.propName}>{p.name}</Text>
                            <Text style={styles.propPrice}>₹{p.price}</Text>
                          </View>
                          <View style={styles.propStatus}>
                            {p.isMortgaged ? (
                              <Text style={styles.mortgagedBadge}>MORTGAGED</Text>
                            ) : p.level > 0 ? (
                              <Text style={styles.buildingIcons}>
                                {p.level === 5 ? '🏨' : Array(p.level).fill('🏠').join('')}
                              </Text>
                            ) : (
                              <Text style={styles.rentText}>
                                Rent: ₹{p.baseRent * (p.level > 0 ? Math.pow(2, p.level) : 1)}
                              </Text>
                            )}
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 200,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: '#334155',
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#b6e3f4',
    borderWidth: 2,
    borderColor: '#38BDF8',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  playerName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  netWorth: {
    fontSize: 14,
    fontWeight: '700',
    color: '#38BDF8',
    marginTop: 4,
  },
  closeButton: {
    padding: 8,
    backgroundColor: '#1E293B',
    borderRadius: 20,
  },
  closeText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  propertiesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#64748B',
    marginBottom: 12,
    marginTop: 8,
    letterSpacing: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    gap: 12,
  },
  emptyText: {
    color: '#64748B',
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
  },
  groupCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  groupHeader: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  groupTitle: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  propList: {
    padding: 8,
    gap: 8,
  },
  propItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 8,
  },
  propInfo: {
    flex: 1,
  },
  propName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  propPrice: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  propStatus: {
    alignItems: 'flex-end',
  },
  rentText: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '700',
  },
  mortgagedBadge: {
    backgroundColor: '#7F1D1D',
    color: '#FCA5A5',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  buildingIcons: {
    fontSize: 14,
  }
});
