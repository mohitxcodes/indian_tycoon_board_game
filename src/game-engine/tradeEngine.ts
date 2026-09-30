import { GameState, TradeOffer } from '../types/game';

export const canTradeProperty = (state: GameState, propertyId: string): boolean => {
  const property = state.properties[propertyId];
  if (!property) return false;
  
  // A property can only be traded if NO properties in its color group have buildings.
  // Mortgaged properties CAN be traded.
  const groupProps = Object.values(state.properties).filter(p => p.group === property.group);
  const hasBuildings = groupProps.some(p => p.level > 0);
  
  return !hasBuildings;
};

export const proposeTrade = (state: GameState, offer: TradeOffer): GameState => {
  return { ...state, pendingTrade: offer };
};

export const acceptTrade = (state: GameState): GameState => {
  if (!state.pendingTrade) return state;

  const newState = { ...state, players: [...state.players], properties: { ...state.properties } };
  const trade = state.pendingTrade;

  const fromIndex = newState.players.findIndex(p => p.id === trade.fromId);
  const toIndex = newState.players.findIndex(p => p.id === trade.toId);

  const fromPlayer = { ...newState.players[fromIndex] };
  const toPlayer = { ...newState.players[toIndex] };

  // Exchange money and cards
  fromPlayer.money = fromPlayer.money - trade.offerMoney + trade.requestMoney;
  toPlayer.money = toPlayer.money + trade.offerMoney - trade.requestMoney;
  
  fromPlayer.getOutOfJailCards = fromPlayer.getOutOfJailCards - trade.offerJailCards + trade.requestJailCards;
  toPlayer.getOutOfJailCards = toPlayer.getOutOfJailCards + trade.offerJailCards - trade.requestJailCards;

  newState.players[fromIndex] = fromPlayer;
  newState.players[toIndex] = toPlayer;

  // Exchange properties
  trade.offerProperties.forEach(propId => {
    newState.properties[propId] = { ...newState.properties[propId], ownerId: toPlayer.id };
  });

  trade.requestProperties.forEach(propId => {
    newState.properties[propId] = { ...newState.properties[propId], ownerId: fromPlayer.id };
  });

  newState.pendingTrade = undefined;
  newState.eventFeed = [`Trade completed between ${fromPlayer.name} and ${toPlayer.name}`, ...newState.eventFeed];

  return newState;
};

export const rejectTrade = (state: GameState): GameState => {
  if (!state.pendingTrade) return state;
  const newState = { ...state, pendingTrade: undefined };
  
  const fromPlayer = state.players.find(p => p.id === state.pendingTrade!.fromId);
  const toPlayer = state.players.find(p => p.id === state.pendingTrade!.toId);
  
  if (fromPlayer && toPlayer) {
    newState.eventFeed = [`${toPlayer.name} rejected the trade offer from ${fromPlayer.name}`, ...newState.eventFeed];
  }
  return newState;
};
