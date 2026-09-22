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

interface PropertyModalProps {
  property: Property;
  onBuy: () => void;
  onAuction: () => void;
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
      onPressIn={() => {
        scale.value = withSpring(0.95);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[styles.buttonContainer, { backgroundColor: shadowColor }, animStyle]}
    >
      <View style={[styles.buttonInner, { backgroundColor: color }]}>
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </AnimatedPressable>
  );
};

export const PropertyModal: React.FC<PropertyModalProps> = ({ property, onBuy, onAuction }) => {
  const { width } = useWindowDimensions();
  const modalWidth = Math.min(width * 0.85, 340);
  const groupColor = GROUP_COLORS[property.group] ?? '#999';

  return (
    <View style={styles.overlay}>
      <Animated.View
        entering={ZoomIn.duration(400).springify()}
        exiting={FadeOut.duration(200)}
        style={[styles.modalBase, { width: modalWidth }]}
      >
        {/* The Dark Theme Background */}
        <View style={styles.modalWrapper}>
          <View style={styles.modalHeader}>
            <Text style={styles.headerTitle}>FOR SALE</Text>
          </View>
          
          <View style={styles.innerContent}>
            {/* Left side: Property Details Card */}
            <View style={[styles.propertyCard, { borderColor: groupColor }]}>
              <View style={[styles.cardHeader, { backgroundColor: groupColor }]}>
                <Text style={styles.propertyName} numberOfLines={2}>{property.name}</Text>
              </View>
              <View style={styles.rentSection}>
                <Text style={styles.rentTitle}>RENT ₹ {property.baseRent}</Text>
                <Text style={styles.rentSubText}>Rent is doubled on owning all unimproved sites in the group.</Text>
                
                {/* Mock data for stations/houses based on reference image */}
                <View style={styles.rentDetailRow}>
                  <Text style={styles.rentDetailIconText}>🏠</Text>
                  <Text style={styles.rentDetailValue}>₹ {property.baseRent * 5}</Text>
                </View>
                <View style={styles.rentDetailRow}>
                  <Text style={styles.rentDetailIconText}>🏠🏠</Text>
                  <Text style={styles.rentDetailValue}>₹ {property.baseRent * 15}</Text>
                </View>
                <View style={styles.rentDetailRow}>
                  <Text style={styles.rentDetailIconText}>🏠🏠🏠</Text>
                  <Text style={styles.rentDetailValue}>₹ {property.baseRent * 45}</Text>
                </View>
                <View style={styles.rentDetailRow}>
                  <Text style={styles.rentDetailIconText}>🏠🏠🏠🏠</Text>
                  <Text style={styles.rentDetailValue}>₹ {property.baseRent * 62}</Text>
                </View>
                <View style={styles.rentDetailRow}>
                  <Text style={styles.rentDetailIconText}>🏨</Text>
                  <Text style={styles.rentDetailValue}>₹ {property.baseRent * 75}</Text>
                </View>

                <View style={styles.mortgageSection}>
                  <Text style={styles.mortgageText}>Construction ₹ 100 each</Text>
                  <Text style={styles.mortgageText}>Mortgage Value ₹ {Math.floor(property.price / 2)}</Text>
                </View>
              </View>
            </View>

            {/* Right side: Price and Action Buttons */}
            <View style={styles.actionsColumn}>
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>FOR</Text>
                <Text style={styles.priceValue}>₹ {property.price}</Text>
              </View>

              <View style={styles.buttonsWrapper}>
                <Button3D 
                  title="BUY" 
                  color="#10B981" 
                  shadowColor="#047857" 
                  onPress={onBuy} 
                />
                <Button3D 
                  title="AUCTION" 
                  color="#EF4444" 
                  shadowColor="#B91C1C" 
                  onPress={onAuction} 
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
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modalBase: {
    backgroundColor: '#C85A17', // Darker orange for the 3D bottom shadow
    borderRadius: 16,
    paddingBottom: 8, // 3D effect depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  modalWrapper: {
    backgroundColor: '#FF7F27', // Bright orange frame
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFA050',
    padding: 12,
    paddingTop: 16,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
    letterSpacing: 1,
  },
  innerContent: {
    backgroundColor: '#FFF4D2', // Warm cream/yellow background inside the frame
    borderRadius: 12,
    flexDirection: 'row',
    padding: 12,
    gap: 16,
    // Slight inner shadow effect
    borderWidth: 1,
    borderColor: 'rgba(200, 150, 50, 0.3)',
  },
  
  // Left: Property Card
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
    marginBottom: 3,
  },
  rentDetailIconText: {
    fontSize: 12,
    letterSpacing: -2, // Brings house emojis closer together
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

  // Right: Actions
  actionsColumn: {
    flex: 0.7, // Take up remaining space
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
    gap: 4,
  },
  priceLabel: {
    color: '#006400',
    fontSize: 14,
    fontWeight: '900',
  },
  priceValue: {
    color: '#006400', // Match Action Bar Green
    fontSize: 22,
    fontWeight: '900',
  },
  buttonsWrapper: {
    width: '100%',
    gap: 8, // Compact gap between buttons
  },
  
  // 3D Buttons
  buttonContainer: {
    borderRadius: 6,
    paddingBottom: 4, // 3D depth
    width: '100%',
  },
  buttonInner: {
    borderRadius: 6,
    paddingVertical: 8, // Compact button
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    letterSpacing: 1,
  },
});
