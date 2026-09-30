import React from 'react';
import { View, StyleSheet, Text, useWindowDimensions, Pressable, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInUp, SlideOutDown } from 'react-native-reanimated';
import { FontAwesome5 } from '@expo/vector-icons';
import { GameState, TradeOffer } from '../../types/game';
import * as Haptics from 'expo-haptics';

interface TradeReviewModalProps {
  game: GameState;
  trade: TradeOffer;
  onAccept: () => void;
  onReject: () => void;
}

export const TradeReviewModal: React.FC<TradeReviewModalProps> = ({ game, trade, onAccept, onReject }) => {
  const { width, height } = useWindowDimensions();
  
  const fromPlayer = game.players.find(p => p.id === trade.fromId);
  const toPlayer = game.players.find(p => p.id === trade.toId);

  if (!fromPlayer || !toPlayer) return null;

  return (
    <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} style={styles.overlay}>
      <Animated.View entering={SlideInUp.duration(300)} exiting={SlideOutDown.duration(200)} style={[styles.modalBase, { width: width * 0.95, maxHeight: height * 0.9 }]}>
        <View style={styles.modalWrapper}>
          <View style={styles.modalHeader}>
            <Text style={styles.headerTitle}>TRADE OFFER</Text>
          </View>

          <View style={styles.announcement}>
            <Text style={styles.announceText}>
              <Text style={{color: '#10B981'}}>{fromPlayer.name}</Text> wants to trade with <Text style={{color: '#3B82F6'}}>{toPlayer.name}</Text>
            </Text>
          </View>

          <View style={[styles.innerContent, { flexDirection: 'row', gap: 8, backgroundColor: 'transparent', borderWidth: 0, padding: 0 }]}>
            {/* Left Column: What ToPlayer gets (Offer) */}
            <View style={styles.tradeCol}>
              <Text style={styles.colHeader}>YOU WILL RECEIVE</Text>
              <ScrollView style={styles.propsList}>
                {trade.offerMoney > 0 && (
                  <View style={styles.moneyItem}>
                    <Text style={styles.moneyText}>+ ₹{trade.offerMoney}</Text>
                  </View>
                )}
                {trade.offerJailCards > 0 && (
                  <View style={styles.propItem}>
                    <Text style={styles.propText} numberOfLines={1}>{trade.offerJailCards}x Get Out of Jail Free</Text>
                  </View>
                )}
                {trade.offerProperties.map(pId => (
                  <View key={pId} style={styles.propItem}>
                    <Text style={styles.propText} numberOfLines={1}>{game.properties[pId].name}</Text>
                  </View>
                ))}
                {trade.offerMoney === 0 && trade.offerJailCards === 0 && trade.offerProperties.length === 0 && (
                  <Text style={styles.emptyText}>Nothing</Text>
                )}
              </ScrollView>
            </View>

            {/* Right Column: What ToPlayer gives (Request) */}
            <View style={styles.tradeCol}>
              <Text style={styles.colHeader}>YOU WILL GIVE</Text>
              <ScrollView style={styles.propsList}>
                {trade.requestMoney > 0 && (
                  <View style={styles.moneyItemRed}>
                    <Text style={styles.moneyTextRed}>- ₹{trade.requestMoney}</Text>
                  </View>
                )}
                {trade.requestJailCards > 0 && (
                  <View style={styles.propItemRed}>
                    <Text style={styles.propTextRed} numberOfLines={1}>{trade.requestJailCards}x Get Out of Jail Free</Text>
                  </View>
                )}
                {trade.requestProperties.map(pId => (
                  <View key={pId} style={styles.propItemRed}>
                    <Text style={styles.propTextRed} numberOfLines={1}>{game.properties[pId].name}</Text>
                  </View>
                ))}
                {trade.requestMoney === 0 && trade.requestJailCards === 0 && trade.requestProperties.length === 0 && (
                  <Text style={styles.emptyText}>Nothing</Text>
                )}
              </ScrollView>
            </View>
          </View>

          <View style={styles.actionRow}>
            <Pressable 
              style={[styles.btn, styles.rejectBtn]} 
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onReject(); }}
            >
              <Text style={styles.btnText}>REJECT</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.btn, styles.acceptBtn]} 
              onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); onAccept(); }}
            >
              <Text style={styles.btnText}>ACCEPT</Text>
            </Pressable>
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 250,
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
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
    letterSpacing: 1,
  },
  announcement: {
    backgroundColor: '#FFF4D2',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8B661',
  },
  announceText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
    textAlign: 'center',
  },
  innerContent: {
    backgroundColor: '#FFF4D2',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(200, 150, 50, 0.3)',
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
    marginBottom: 8,
  },
  propsList: {
    maxHeight: 250,
  },
  moneyItem: {
    backgroundColor: '#ECFDF5',
    padding: 8,
    borderRadius: 4,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#10B981',
    alignItems: 'center',
  },
  moneyText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#047857',
  },
  moneyItemRed: {
    backgroundColor: '#FEF2F2',
    padding: 8,
    borderRadius: 4,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#EF4444',
    alignItems: 'center',
  },
  moneyTextRed: {
    fontSize: 14,
    fontWeight: '900',
    color: '#B91C1C',
  },
  propItem: {
    backgroundColor: '#ECFDF5',
    padding: 8,
    borderRadius: 4,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  propText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
    textAlign: 'center',
  },
  propItemRed: {
    backgroundColor: '#FEF2F2',
    padding: 8,
    borderRadius: 4,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  propTextRed: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B91C1C',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 12,
  },
  btn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderBottomWidth: 4,
  },
  rejectBtn: {
    backgroundColor: '#EF4444',
    borderColor: '#B91C1C',
  },
  acceptBtn: {
    backgroundColor: '#10B981',
    borderColor: '#047857',
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  }
});
