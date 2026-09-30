import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Text, useWindowDimensions, Pressable, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInUp, SlideOutDown } from 'react-native-reanimated';
import { FontAwesome5 } from '@expo/vector-icons';
import { Property } from '../../types/property';
import { Player } from '../../types/player';
import { GameState } from '../../types/game';
import * as Haptics from 'expo-haptics';
import { canBuildHouse, canBuildHotel, canSellBuilding } from '../../game-engine/buildingEngine';
import { canMortgage } from '../../game-engine/propertyEngine';

export type ManagerMode = 'BUILD' | 'SELL' | 'MORTGAGE' | 'REDEEM';

interface PropertyManagerModalProps {
  game: GameState;
  player: Player;
  properties: Record<string, Property>;
  initialMode: ManagerMode;
  allowedTabs: ManagerMode[];
  onClose: () => void;
  onAction: (mode: ManagerMode, propertyId: string) => void;
}

export const PropertyManagerModal: React.FC<PropertyManagerModalProps> = ({
  game,
  player,
  properties,
  initialMode,
  allowedTabs,
  onClose,
  onAction,
}) => {
  const { width, height } = useWindowDimensions();
  const [mode, setMode] = useState<ManagerMode>(initialMode);

  // Get properties owned by the player
  const myProperties = useMemo(() => {
    return Object.values(properties).filter(p => p.ownerId === player.id);
  }, [properties, player.id]);

  // Filter properties based on the current mode using the game engine rules
  const filteredProperties = useMemo(() => {
    return myProperties.filter(p => {
      if (mode === 'MORTGAGE') return canMortgage(game, p.id);
      if (mode === 'REDEEM') return p.isMortgaged; // Custom redeem logic handles costs
      if (mode === 'BUILD') return canBuildHouse(game, player.id, p.id) || canBuildHotel(game, player.id, p.id);
      if (mode === 'SELL') return canSellBuilding(game, player.id, p.id);
      return false;
    });
  }, [myProperties, mode, game, player.id]);

  const modalTitle = allowedTabs.includes('BUILD') ? 'CONSTRUCTION' : 'FINANCE';

  const renderBuildings = (level: number) => {
    if (level === 5) return '🏨';
    return Array(level).fill('🏠').join('');
  };

  const getActionText = (mode: ManagerMode, property: Property) => {
    if (mode === 'BUILD') {
      const isHotel = property.level === 4;
      return `${isHotel ? 'Build Hotel' : 'Build House'} (₹${property.upgradeCost})`;
    }
    if (mode === 'SELL') {
      const isHotel = property.level === 5;
      return `Sell ${isHotel ? 'Hotel' : 'House'} (₹${property.upgradeCost / 2})`;
    }
    if (mode === 'MORTGAGE') {
      return `Mortgage (₹${property.price / 2})`;
    }
    if (mode === 'REDEEM') {
      const mortgageValue = property.price / 2;
      const redemptionCost = mortgageValue + Math.ceil(mortgageValue * 0.10);
      return `Redeem (₹${redemptionCost})`;
    }
    return mode;
  };

  return (
    <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} style={styles.overlay}>
      <Animated.View entering={SlideInUp.duration(300)} exiting={SlideOutDown.duration(200)} style={[styles.modalBase, { width: width * 0.9, maxHeight: height * 0.85 }]}>
        <View style={styles.modalWrapper}>
          <View style={styles.modalHeader}>
            <Text style={styles.headerTitle}>{modalTitle}</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <FontAwesome5 name="times" size={24} color="#FFF" />
            </Pressable>
          </View>

          <View style={styles.innerContent}>
            <View style={styles.tabsContainer}>
              {allowedTabs.map((tab) => (
                <Pressable
                  key={tab}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setMode(tab);
                  }}
                  style={[styles.tab, mode === tab && styles.activeTab]}
                >
                  <Text style={[styles.tabText, mode === tab && styles.activeTabText]}>{tab}</Text>
                </Pressable>
              ))}
            </View>

            <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
              {filteredProperties.length === 0 ? (
                <Text style={styles.emptyText}>No properties available for {mode}.</Text>
              ) : (
                filteredProperties.map(property => (
                  <View key={property.id} style={styles.propertyCard}>
                    <View style={styles.propertyInfo}>
                      <Text style={styles.propertyName}>{property.name}</Text>
                      {property.level > 0 && <Text style={styles.propertyLevel}>{renderBuildings(property.level)}</Text>}
                      {property.isMortgaged && <Text style={styles.propertyMortgaged}>(Mortgaged)</Text>}
                    </View>
                    <Pressable
                      style={[styles.actionBtn, mode === 'SELL' || mode === 'MORTGAGE' ? styles.actionBtnRed : styles.actionBtnGreen]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        onAction(mode, property.id);
                      }}
                    >
                      <Text style={styles.actionBtnText}>
                        {getActionText(mode, property)}
                      </Text>
                    </Pressable>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
  },
  modalBase: {
    backgroundColor: '#C85A17', // Match PropertyModal Bottom shadow
    borderRadius: 16,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  modalWrapper: {
    backgroundColor: '#FF7F27',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFA050',
    padding: 12,
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
    letterSpacing: 1,
  },
  innerContent: {
    backgroundColor: '#FFF4D2',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(200, 150, 50, 0.3)',
  },
  closeBtn: {
    padding: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FF7F27',
    backgroundColor: 'rgba(255, 127, 39, 0.1)',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#8B5A2B', // Brownish
  },
  activeTabText: {
    color: '#D35400', // Darker orange
  },
  listContainer: {
    maxHeight: 400,
  },
  listContent: {
    paddingBottom: 8,
    gap: 8,
  },
  emptyText: {
    color: '#8B5A2B', 
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  propertyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', 
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E2E8F0', 
  },
  propertyInfo: {
    flex: 1,
  },
  propertyName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1E293B', 
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  propertyLevel: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '800',
  },
  propertyMortgaged: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '800',
  },
  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    marginLeft: 12,
    borderBottomWidth: 3, // 3D effect
  },
  actionBtnGreen: {
    backgroundColor: '#10B981',
    borderColor: '#047857',
  },
  actionBtnRed: {
    backgroundColor: '#EF4444',
    borderColor: '#B91C1C',
  },
  actionBtnText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 10,
    textTransform: 'uppercase',
  },
});
