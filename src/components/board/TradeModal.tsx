import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Text, useWindowDimensions, Pressable, ScrollView, TextInput } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInUp, SlideOutDown } from 'react-native-reanimated';
import { FontAwesome5 } from '@expo/vector-icons';
import { Property } from '../../types/property';
import { Player } from '../../types/player';
import { GameState } from '../../types/game';
import * as Haptics from 'expo-haptics';
import { canTradeProperty } from '../../game-engine/tradeEngine';

interface TradeModalProps {
  game: GameState;
  currentPlayer: Player;
  onClose: () => void;
  onPropose: (toId: string, offerProperties: string[], offerMoney: number, offerJailCards: number, requestProperties: string[], requestMoney: number, requestJailCards: number) => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({ game, currentPlayer, onClose, onPropose }) => {
  const { width, height } = useWindowDimensions();
  const [targetPlayerId, setTargetPlayerId] = useState<string | null>(null);
  
  const [offerProps, setOfferProps] = useState<Set<string>>(new Set());
  const [requestProps, setRequestProps] = useState<Set<string>>(new Set());
  
  const [offerMoney, setOfferMoney] = useState<string>('0');
  const [requestMoney, setRequestMoney] = useState<string>('0');
  
  const [offerJailCards, setOfferJailCards] = useState<number>(0);
  const [requestJailCards, setRequestJailCards] = useState<number>(0);

  const otherPlayers = game.players.filter(p => p.id !== currentPlayer.id);
  const targetPlayer = otherPlayers.find(p => p.id === targetPlayerId);

  const myTradeableProps = useMemo(() => {
    return Object.values(game.properties).filter(p => p.ownerId === currentPlayer.id && canTradeProperty(game, p.id));
  }, [game, currentPlayer.id]);

  const targetTradeableProps = useMemo(() => {
    if (!targetPlayerId) return [];
    return Object.values(game.properties).filter(p => p.ownerId === targetPlayerId && canTradeProperty(game, p.id));
  }, [game, targetPlayerId]);

  const toggleSet = (set: Set<string>, id: string) => {
    const newSet = new Set(set);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    return newSet;
  };

  const handlePropose = () => {
    if (!targetPlayerId) return;
    const oMoney = Math.min(parseInt(offerMoney) || 0, currentPlayer.money);
    const rMoney = Math.min(parseInt(requestMoney) || 0, targetPlayer?.money || 0);
    onPropose(targetPlayerId, Array.from(offerProps), oMoney, offerJailCards, Array.from(requestProps), rMoney, requestJailCards);
    onClose();
  };

  if (!targetPlayerId) {
    return (
      <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} style={styles.overlay}>
        <Animated.View entering={SlideInUp.duration(300)} exiting={SlideOutDown.duration(200)} style={[styles.modalBase, { width: width * 0.8, maxHeight: height * 0.7 }]}>
          <View style={styles.modalWrapper}>
            <View style={styles.modalHeader}>
              <Text style={styles.headerTitle}>SELECT TRADER</Text>
              <Pressable onPress={onClose} style={styles.closeBtn}>
                <FontAwesome5 name="times" size={24} color="#FFF" />
              </Pressable>
            </View>
            <ScrollView style={styles.innerContent} contentContainerStyle={{ padding: 8 }}>
              {otherPlayers.map(p => (
                <Pressable key={p.id} style={styles.playerBtn} onPress={() => { Haptics.selectionAsync(); setTargetPlayerId(p.id); }}>
                  <Text style={styles.playerName}>{p.name}</Text>
                  <Text style={styles.playerMoney}>₹{p.money}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Animated.View>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} style={styles.overlay}>
      <Animated.View entering={SlideInUp.duration(300)} exiting={SlideOutDown.duration(200)} style={[styles.modalBase, { width: width * 0.95, maxHeight: height * 0.9 }]}>
        <View style={styles.modalWrapper}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setTargetPlayerId(null)} style={styles.backBtn}>
              <FontAwesome5 name="arrow-left" size={20} color="#FFF" />
            </Pressable>
            <Text style={styles.headerTitle}>PROPOSE TRADE</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <FontAwesome5 name="times" size={24} color="#FFF" />
            </Pressable>
          </View>

          <View style={[styles.innerContent, { flexDirection: 'row', gap: 8, backgroundColor: 'transparent', borderWidth: 0, padding: 0 }]}>
            {/* Left Column: Your Offer */}
            <View style={styles.tradeCol}>
              <Text style={styles.colHeader}>YOUR OFFER</Text>
              <Text style={styles.balText}>Bal: ₹{currentPlayer.money}</Text>
              
              <View style={styles.moneyInputBox}>
                <Text style={styles.rupee}>₹</Text>
                <TextInput 
                  style={styles.moneyInput}
                  keyboardType="number-pad"
                  value={offerMoney}
                  onChangeText={t => setOfferMoney(t.replace(/[^0-9]/g, ''))}
                  placeholder="0"
                />
              </View>

              {currentPlayer.getOutOfJailCards > 0 && (
                <View style={styles.jailCardContainer}>
                  <Text style={styles.jailCardLabel}>Jail Cards: {currentPlayer.getOutOfJailCards}</Text>
                  <View style={styles.jailCardControls}>
                    <Pressable onPress={() => { Haptics.selectionAsync(); setOfferJailCards(Math.max(0, offerJailCards - 1)); }} style={styles.qtyBtn}><Text style={styles.qtyBtnText}>-</Text></Pressable>
                    <Text style={styles.qtyText}>{offerJailCards}</Text>
                    <Pressable onPress={() => { Haptics.selectionAsync(); setOfferJailCards(Math.min(currentPlayer.getOutOfJailCards, offerJailCards + 1)); }} style={styles.qtyBtn}><Text style={styles.qtyBtnText}>+</Text></Pressable>
                  </View>
                </View>
              )}

              <ScrollView style={styles.propsList}>
                {myTradeableProps.map(p => {
                  const selected = offerProps.has(p.id);
                  return (
                    <Pressable key={p.id} style={[styles.propItem, selected && styles.propItemSelected]} onPress={() => { Haptics.selectionAsync(); setOfferProps(toggleSet(offerProps, p.id)); }}>
                      <Text style={[styles.propText, selected && styles.propTextSelected]} numberOfLines={1}>{p.name}</Text>
                    </Pressable>
                  )
                })}
                {myTradeableProps.length === 0 && <Text style={styles.emptyText}>No tradeable properties</Text>}
              </ScrollView>
            </View>

            {/* Right Column: Their Offer */}
            <View style={styles.tradeCol}>
              <Text style={styles.colHeader}>WANT FROM {targetPlayer?.name.split(' ')[0]?.toUpperCase()}</Text>
              <Text style={styles.balText}>Bal: ₹{targetPlayer?.money}</Text>
              
              <View style={styles.moneyInputBox}>
                <Text style={styles.rupee}>₹</Text>
                <TextInput 
                  style={styles.moneyInput}
                  keyboardType="number-pad"
                  value={requestMoney}
                  onChangeText={t => setRequestMoney(t.replace(/[^0-9]/g, ''))}
                  placeholder="0"
                />
              </View>

              {targetPlayer && targetPlayer.getOutOfJailCards > 0 && (
                <View style={styles.jailCardContainer}>
                  <Text style={styles.jailCardLabel}>Jail Cards: {targetPlayer.getOutOfJailCards}</Text>
                  <View style={styles.jailCardControls}>
                    <Pressable onPress={() => { Haptics.selectionAsync(); setRequestJailCards(Math.max(0, requestJailCards - 1)); }} style={styles.qtyBtn}><Text style={styles.qtyBtnText}>-</Text></Pressable>
                    <Text style={styles.qtyText}>{requestJailCards}</Text>
                    <Pressable onPress={() => { Haptics.selectionAsync(); setRequestJailCards(Math.min(targetPlayer.getOutOfJailCards, requestJailCards + 1)); }} style={styles.qtyBtn}><Text style={styles.qtyBtnText}>+</Text></Pressable>
                  </View>
                </View>
              )}

              <ScrollView style={styles.propsList}>
                {targetTradeableProps.map(p => {
                  const selected = requestProps.has(p.id);
                  return (
                    <Pressable key={p.id} style={[styles.propItem, selected && styles.propItemSelected]} onPress={() => { Haptics.selectionAsync(); setRequestProps(toggleSet(requestProps, p.id)); }}>
                      <Text style={[styles.propText, selected && styles.propTextSelected]} numberOfLines={1}>{p.name}</Text>
                    </Pressable>
                  )
                })}
                {targetTradeableProps.length === 0 && <Text style={styles.emptyText}>No tradeable properties</Text>}
              </ScrollView>
            </View>
          </View>

          <Pressable style={styles.proposeBtn} onPress={handlePropose}>
            <Text style={styles.proposeBtnText}>SEND TRADE OFFER</Text>
          </Pressable>

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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
    letterSpacing: 1,
  },
  closeBtn: { padding: 4 },
  backBtn: { padding: 4 },
  innerContent: {
    backgroundColor: '#FFF4D2',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(200, 150, 50, 0.3)',
  },
  playerBtn: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  playerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  playerMoney: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10B981',
  },
  tradeCol: {
    flex: 1,
    backgroundColor: '#FFF4D2',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E8B661',
    padding: 8,
  },
  colHeader: {
    fontSize: 11,
    fontWeight: '900',
    color: '#8B5A2B',
    textAlign: 'center',
    marginBottom: 2,
  },
  balText: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  moneyInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  rupee: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10B981',
  },
  moneyInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  propsList: {
    flex: 1,
  },
  propItem: {
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 4,
    marginBottom: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  propItemSelected: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  propText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  propTextSelected: {
    color: '#047857',
  },
  emptyText: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 12,
  },
  proposeBtn: {
    backgroundColor: '#10B981',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    borderBottomWidth: 4,
    borderColor: '#047857',
  },
  proposeBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  jailCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  jailCardLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#334155',
  },
  jailCardControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyBtn: {
    backgroundColor: '#E2E8F0',
    width: 24,
    height: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#334155',
  },
  qtyText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1E293B',
    minWidth: 12,
    textAlign: 'center',
  },
});
