import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, useWindowDimensions, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import { AuctionState } from '../../types/game';
import { Player } from '../../types/player';
import { Property } from '../../types/property';
import { Button3D } from '../ui/Button3D';

interface AuctionModalProps {
  auction: AuctionState;
  players: Player[];
  property: Property;
  onBid: (playerId: string, amount: number) => void;
  onWithdraw: (playerId: string) => void;
}

export const AuctionModal: React.FC<AuctionModalProps> = ({ auction, players, property, onBid, onWithdraw }) => {
  const { width } = useWindowDimensions();
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
        style={[styles.modalBase, { width: Math.min(width * 0.9, 360) }]}
      >
          <View style={styles.modalWrapper}>
            <View style={styles.modalHeader}>
              <Text style={styles.headerTitle}>AUCTION</Text>
              <Text style={styles.propertyName}>{property.name}</Text>
            </View>
            
            <View style={styles.innerContent}>
              
              <View style={styles.statusBox}>
                <Text style={styles.currentBidLabel}>Current Highest Bid</Text>
                <Text style={styles.currentBidText}>₹ {auction.currentBid.toLocaleString('en-IN')}</Text>
                {highestBidder ? (
                  <Text style={styles.highestBidderText}>by {highestBidder.name}</Text>
                ) : (
                  <Text style={styles.highestBidderText}>No bids yet</Text>
                )}
              </View>
              
              <View style={styles.turnSection}>
                <View style={styles.turnHeader}>
                  <Text style={styles.turnLabel}>CURRENT TURN:</Text>
                  <Text style={styles.availableMoney}>Balance: ₹{currentBidder.money.toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.turnPlayerBox}>
                  <Text style={styles.turnPlayerName}>{currentBidder.name}</Text>
                </View>
              </View>

              {maxBid >= minBid ? (
                <View style={styles.sliderContainer}>
                  <View style={styles.sliderHeader}>
                    <Text style={styles.sliderLabel}>Your Bid:</Text>
                    <Text style={styles.sliderValue}>₹ {Math.floor(bidAmount).toLocaleString('en-IN')}</Text>
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
                      <Text style={styles.presetText}>+1 (₹ {minBid})</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setBidAmount(maxBid)} style={styles.presetButton}>
                      <Text style={styles.presetText}>ALL IN</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>You don't have enough money to bid.</Text>
                </View>
              )}

              <View style={styles.actionRow}>
                <View style={{ flex: 1 }}>
                  <Button3D 
                    title="WITHDRAW" 
                    color="#EF4444" 
                    shadowColor="#B91C1C" 
                    onPress={handleWithdraw} 
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Button3D 
                    title="PLACE BID" 
                    color="#10B981" 
                    shadowColor="#047857" 
                    onPress={handleBid} 
                    disabled={!canBid}
                  />
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
    ...StyleSheet.absoluteFillObject,
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
  propertyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    textTransform: 'uppercase',
  },
  innerContent: {
    backgroundColor: '#FFF4D2',
    borderRadius: 12,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(200, 150, 50, 0.3)',
  },
  statusBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  currentBidLabel: {
    fontSize: 12,
    color: '#64748B',
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  currentBidText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#10B981',
    marginVertical: 4,
  },
  highestBidderText: {
    fontSize: 14,
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
    marginBottom: 6,
  },
  turnLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '800',
  },
  availableMoney: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
  },
  turnPlayerBox: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  turnPlayerName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  sliderContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  sliderValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#10B981',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderPresets: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  presetButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presetText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  errorBox: {
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
    marginTop: 8,
  },
});
