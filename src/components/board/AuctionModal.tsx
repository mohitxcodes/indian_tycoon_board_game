import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, useWindowDimensions, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import { AuctionState } from '../../types/game';
import { Player } from '../../types/player';
import { Property } from '../../types/property';
import { Button3D } from '../ui/Button3D';
import { GROUP_COLORS } from '../../data/boardData';

interface AuctionModalProps {
  auction: AuctionState;
  players: Player[];
  property: Property;
  onBid: (playerId: string, amount: number) => void;
  onWithdraw: (playerId: string) => void;
}

export const AuctionModal: React.FC<AuctionModalProps> = ({ auction, players, property, onBid, onWithdraw }) => {
  const { width } = useWindowDimensions();
  const groupColor = GROUP_COLORS[property.group] ?? '#999';
  const modalWidth = Math.min(width * 0.95, 380);
  const currentBidderId = auction.activeBidders[auction.turnIndex];
  const currentBidder = players.find(p => p.id === currentBidderId);
  const highestBidder = auction.highestBidderId ? players.find(p => p.id === auction.highestBidderId) : null;
  
  const minBid = auction.currentBid + 1;
  const [bidAmount, setBidAmount] = useState(minBid);
  
  useEffect(() => {
    // When turn changes or current bid changes, reset to minBid
    setBidAmount(auction.currentBid + 1);
  }, [auction.turnIndex, auction.currentBid]);

  if (!currentBidder) return null;

  const maxBid = currentBidder.money;
  const canBid = bidAmount >= minBid && bidAmount <= maxBid;

  const handleBid = () => {
    if (canBid) {
      onBid(currentBidderId, bidAmount);
    }
  };

  const handleWithdraw = () => {
    onWithdraw(currentBidderId);
  };

  const handlePlusOne = () => {
    setBidAmount(minBid);
  };

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={styles.overlay}
    >
      <Animated.View
        entering={ZoomIn.duration(400).springify()}
        exiting={FadeOut.duration(200)}
        style={[styles.modalBase, { width: modalWidth }]}
      >
          <View style={styles.modalWrapper}>
            <View style={styles.modalHeader}>
              <Text style={styles.headerTitle}>AUCTION</Text>
            </View>
            
            <View style={styles.innerContent}>
              
              {/* Left side: Property Details Card */}
              <View style={[styles.propertyCard, { borderColor: groupColor }]}>
                <View style={[styles.cardHeader, { backgroundColor: groupColor }]}>
                  <Text style={styles.propertyName} numberOfLines={2}>{property.name}</Text>
                </View>
                <View style={styles.rentSection}>
                  <Text style={styles.rentTitle}>RENT ₹ {property.baseRent}</Text>
                  
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
                    <Text style={styles.mortgageText}>Construction ₹ 100</Text>
                    <Text style={styles.mortgageText}>Mortgage ₹ {Math.floor(property.price / 2)}</Text>
                  </View>
                </View>
              </View>

              {/* Right side: Auction Controls */}
              <View style={styles.auctionControls}>
                <View style={styles.statusBox}>
                  <Text style={styles.currentBidLabel}>Highest Bid</Text>
                  <Text style={styles.currentBidText}>₹ {auction.currentBid}</Text>
                  {highestBidder ? (
                    <Text style={styles.highestBidderText}>by {highestBidder.name}</Text>
                  ) : (
                    <Text style={styles.highestBidderText}>No bids yet</Text>
                  )}
                </View>
                
                <View style={styles.turnSection}>
                  <View style={styles.turnHeader}>
                    <Text style={styles.turnLabel}>YOUR TURN:</Text>
                    <Text style={styles.availableMoney}>Bal: ₹{currentBidder.money}</Text>
                  </View>
                  <View style={styles.turnPlayerBox}>
                    <Text style={styles.turnPlayerName}>{currentBidder.name}</Text>
                  </View>
                </View>

                {maxBid >= minBid ? (
                  <View style={styles.sliderContainer}>
                    <View style={styles.sliderHeader}>
                      <Text style={styles.sliderLabel}>Bid:</Text>
                      <Text style={styles.sliderValue}>₹ {Math.floor(bidAmount)}</Text>
                    </View>
                    
                    <Slider
                      style={styles.slider}
                      minimumValue={minBid}
                      maximumValue={maxBid}
                      value={bidAmount}
                      onValueChange={(val) => setBidAmount(Math.floor(val))}
                      step={1}
                      minimumTrackTintColor="#10B981"
                      maximumTrackTintColor="#CBD5E1"
                      thumbTintColor="#10B981"
                    />
                    
                    <View style={styles.sliderPresets}>
                      <TouchableOpacity onPress={handlePlusOne} style={styles.presetButton}>
                        <Text style={styles.presetText}>+1 (₹{minBid})</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setBidAmount(maxBid)} style={styles.presetButton}>
                        <Text style={styles.presetText}>ALL IN</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>Insufficient funds.</Text>
                  </View>
                )}

                <View style={styles.actionRow}>
                  <View style={{ flex: 1 }}>
                    <Button3D 
                      title="FOLD" 
                      color="#EF4444" 
                      shadowColor="#B91C1C" 
                      onPress={handleWithdraw} 
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button3D 
                      title="BID" 
                      color="#10B981" 
                      shadowColor="#047857" 
                      onPress={handleBid} 
                      disabled={!canBid}
                    />
                  </View>
                </View>
              </View>
            </View>
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
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
    backgroundColor: '#FFF4D2',
    borderRadius: 12,
    padding: 8,
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(200, 150, 50, 0.3)',
  },
  propertyCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 2, 
    alignItems: 'center',
    overflow: 'hidden',
  },
  cardHeader: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    marginBottom: 4,
  },
  propertyName: {
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
    color: '#FFF',
    textTransform: 'uppercase',
  },
  rentSection: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 4,
    paddingHorizontal: 4,
  },
  rentTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#333',
    marginBottom: 2,
  },
  rentDetailRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 1,
  },
  rentDetailIconText: {
    fontSize: 8,
    letterSpacing: -1,
  },
  rentDetailValue: {
    fontSize: 9,
    fontWeight: '900',
    color: '#333',
  },
  mortgageSection: {
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    width: '100%',
    paddingTop: 2,
    alignItems: 'center',
  },
  mortgageText: {
    fontSize: 7,
    fontWeight: '700',
    color: '#888',
    marginBottom: 1,
  },
  auctionControls: {
    flex: 1.2,
    justifyContent: 'space-between',
    gap: 6,
  },
  statusBox: {
    backgroundColor: '#FFFFFF',
    padding: 6,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  currentBidLabel: {
    fontSize: 9,
    color: '#64748B',
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  currentBidText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#10B981',
    marginVertical: 2,
  },
  highestBidderText: {
    fontSize: 9,
    color: '#F59E0B',
    fontWeight: '700',
  },
  turnSection: {
    width: '100%',
  },
  turnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  turnLabel: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '800',
  },
  availableMoney: {
    fontSize: 9,
    fontWeight: '700',
    color: '#047857',
  },
  turnPlayerBox: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    padding: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  turnPlayerName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },
  sliderContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  sliderLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  sliderValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#10B981',
  },
  slider: {
    width: '100%',
    height: 24,
  },
  sliderPresets: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  presetButton: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presetText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
  },
  errorBox: {
    padding: 6,
    backgroundColor: '#FEE2E2',
    borderRadius: 6,
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 6,
    marginTop: 2,
  },
});
