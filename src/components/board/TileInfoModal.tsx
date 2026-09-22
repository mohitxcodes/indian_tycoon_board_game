import React from 'react';
import { View, StyleSheet, Text, Pressable, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  ZoomIn,
  FadeOut,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Property } from '../../types/property';
import { GROUP_COLORS } from '../../data/boardData';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TileInfoModalProps {
  property: Property;
  onClose: () => void;
}

const Button3D: React.FC<{
  title: string;
  color: string;
  shadowColor: string;
  onPress: () => void;
}> = ({ title, color, shadowColor, onPress }) => {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      onPressIn={() => { scale.value = withSpring(0.95); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      style={[styles.buttonContainer, { backgroundColor: shadowColor }, animStyle]}
    >
      <View style={[styles.buttonInner, { backgroundColor: color }]}>
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </AnimatedPressable>
  );
};

export const TileInfoModal: React.FC<TileInfoModalProps> = ({ property, onClose }) => {
  const { width } = useWindowDimensions();
  const modalWidth = Math.min(width * 0.85, 340);
  const groupColor = GROUP_COLORS[property.group] ?? '#999';
  const isSpecialGroup = property.group === 'Station' || property.group === 'Utility';

  return (
    <View style={styles.overlay}>
      <Animated.View
        entering={ZoomIn.duration(400).springify()}
        exiting={FadeOut.duration(200)}
        style={[styles.modalBase, { width: modalWidth }]}
      >
        <View style={styles.modalWrapper}>
          {/* Inner cream content area */}
          <View style={styles.innerContent}>
            {/* Property Details Card */}
            <View style={[styles.propertyCard, { borderColor: isSpecialGroup ? '#CCC' : groupColor }]}>
              <View style={[styles.cardHeader, { backgroundColor: isSpecialGroup ? '#FFF' : groupColor }]}>
                <Text style={[styles.propertyName, isSpecialGroup && { color: '#000' }]} numberOfLines={2}>
                  {property.name}
                </Text>
              </View>
              <View style={styles.rentSection}>
                {property.group === 'Station' ? (
                  <>
                    <Text style={styles.rentTitle}>RENT ₹ {property.baseRent}</Text>
                    <View style={styles.rentDetailRow}>
                      <Text style={styles.rentDetailIconText}>2 stations</Text>
                      <Text style={styles.rentDetailValue}>₹ {property.baseRent * 2}</Text>
                    </View>
                    <View style={styles.rentDetailRow}>
                      <Text style={styles.rentDetailIconText}>3 stations</Text>
                      <Text style={styles.rentDetailValue}>₹ {property.baseRent * 4}</Text>
                    </View>
                    <View style={styles.rentDetailRow}>
                      <Text style={styles.rentDetailIconText}>4 stations</Text>
                      <Text style={styles.rentDetailValue}>₹ {property.baseRent * 8}</Text>
                    </View>
                    <View style={[styles.mortgageSection, { marginTop: 16 }]}>
                      <Text style={styles.mortgageText}>Mortgage Value - ₹ {Math.floor(property.price / 2)}</Text>
                    </View>
                  </>
                ) : property.group === 'Utility' ? (
                  <>
                    <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, alignItems: 'center' }}>
                      <Text style={styles.utilityText}>
                        If one "Utility" is owned, rent is 4 times amount shown on dice.
                      </Text>
                      <Text style={[styles.utilityText, { marginTop: 8 }]}>
                        If both "Utilities" are owned, rent is 10 times amount shown on dice.
                      </Text>
                      <Text style={styles.utilityWatermarkIcon}>
                        {property.name === 'Water Works' ? '💧' : '💡'}
                      </Text>
                    </View>
                    <View style={[styles.mortgageSection, { marginTop: 16 }]}>
                      <Text style={styles.mortgageText}>Mortgage Value - ₹ {Math.floor(property.price / 2)}</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.rentTitle}>RENT ₹ {property.baseRent}</Text>
                    <Text style={styles.rentSubText}>Rent is doubled on owning all unimproved sites in the group.</Text>

                    <View style={styles.rentDetailRow}>
                      <Text style={styles.rentDetailIconHouse}>🏠</Text>
                      <Text style={styles.rentDetailValue}>₹ {property.baseRent * 5}</Text>
                    </View>
                    <View style={styles.rentDetailRow}>
                      <Text style={styles.rentDetailIconHouse}>🏠🏠</Text>
                      <Text style={styles.rentDetailValue}>₹ {property.baseRent * 15}</Text>
                    </View>
                    <View style={styles.rentDetailRow}>
                      <Text style={styles.rentDetailIconHouse}>🏠🏠🏠</Text>
                      <Text style={styles.rentDetailValue}>₹ {property.baseRent * 45}</Text>
                    </View>
                    <View style={styles.rentDetailRow}>
                      <Text style={styles.rentDetailIconHouse}>🏠🏠🏠🏠</Text>
                      <Text style={styles.rentDetailValue}>₹ {property.baseRent * 62}</Text>
                    </View>
                    <View style={styles.rentDetailRow}>
                      <Text style={styles.rentDetailIconHouse}>🏨</Text>
                      <Text style={styles.rentDetailValue}>₹ {property.baseRent * 75}</Text>
                    </View>

                    <View style={styles.mortgageSection}>
                      <Text style={styles.mortgageText}>Construction ₹ {property.upgradeCost} each</Text>
                      <Text style={styles.mortgageText}>Mortgage Value - ₹ {Math.floor(property.price / 2)}</Text>
                    </View>
                  </>
                )}
              </View>
            </View>

            {/* Right side: Price info + Close */}
            <View style={styles.actionsColumn}>
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>PRICE</Text>
                <Text style={styles.priceValue}>₹ {property.price}</Text>
              </View>

              {property.ownerId && (
                <View style={styles.ownedBadge}>
                  <Text style={styles.ownedText}>OWNED</Text>
                </View>
              )}

              <View style={styles.buttonsWrapper}>
                <Button3D
                  title="CLOSE"
                  color="#10B981"
                  shadowColor="#047857"
                  onPress={onClose}
                />
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modalBase: {
    backgroundColor: '#C85A17',
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
  innerContent: {
    backgroundColor: '#FFF4D2',
    borderRadius: 12,
    flexDirection: 'row',
    padding: 12,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(200, 150, 50, 0.3)',
  },

  // Property Card
  propertyCard: {
    flex: 1.3,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 3,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardHeader: {
    paddingVertical: 10,
    paddingHorizontal: 4,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    marginBottom: 6,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
    color: '#FFF',
    textTransform: 'uppercase',
  },
  rentSection: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  rentTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#333',
    marginBottom: 2,
  },
  rentSubText: {
    fontSize: 7,
    textAlign: 'center',
    color: '#666',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  rentDetailRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 5,
  },
  rentDetailIconText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
  },
  rentDetailIconHouse: {
    fontSize: 12,
    letterSpacing: -2,
  },
  utilityText: {
    fontSize: 11,
    color: '#444',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 16,
  },
  utilityWatermarkIcon: {
    fontSize: 48,
    opacity: 0.1,
    position: 'absolute',
    alignSelf: 'center',
    top: 20,
  },
  rentDetailValue: {
    fontSize: 12,
    fontWeight: '900',
    color: '#333',
  },
  mortgageSection: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    width: '100%',
    paddingTop: 6,
    alignItems: 'center',
  },
  mortgageText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#888',
    marginBottom: 2,
  },

  // Right side
  actionsColumn: {
    flex: 0.7,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 10,
  },
  priceLabel: {
    color: '#888',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  priceValue: {
    color: '#006400',
    fontSize: 22,
    fontWeight: '900',
  },
  ownedBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 12,
  },
  ownedText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  buttonsWrapper: {
    width: '100%',
    gap: 8,
  },

  // 3D Button
  buttonContainer: {
    borderRadius: 6,
    paddingBottom: 4,
    width: '100%',
  },
  buttonInner: {
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    letterSpacing: 1,
  },
});
