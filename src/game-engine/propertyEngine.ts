import { GameState } from '../types/game';

export const isCompleteColorGroup = (state: GameState, playerId: string, group: string): boolean => {
  const allInGroup = Object.values(state.properties).filter(p => p.group === group);
  if (allInGroup.length === 0) return false;
  return allInGroup.every(p => p.ownerId === playerId);
};

export const canMortgage = (state: GameState, propertyId: string): boolean => {
  const property = state.properties[propertyId];
  if (!property || property.isMortgaged) return false;
  
  // Cannot mortgage if there are any buildings in this color group
  const groupProps = Object.values(state.properties).filter(p => p.group === property.group);
  const hasBuildings = groupProps.some(p => p.level > 0);
  
  return !hasBuildings;
};

export const mortgageProperty = (state: GameState, playerId: string, propertyId: string): GameState => {
  const property = state.properties[propertyId];
  if (!property || property.ownerId !== playerId || !canMortgage(state, propertyId)) return state;

  const newState = { ...state, players: [...state.players], properties: { ...state.properties } };
  const playerIndex = newState.players.findIndex(p => p.id === playerId);
  const player = { ...newState.players[playerIndex] };

  const mortgageValue = property.price / 2; // Assuming mortgage value is half the price
  player.money += mortgageValue;
  
  newState.properties[propertyId] = { ...property, isMortgaged: true };
  newState.players[playerIndex] = player;
  newState.eventFeed = [`${player.name} mortgaged ${property.name} for ₹${mortgageValue}`, ...newState.eventFeed];

  return newState;
};

export const redeemProperty = (state: GameState, playerId: string, propertyId: string): GameState => {
  const property = state.properties[propertyId];
  if (!property || property.ownerId !== playerId || !property.isMortgaged) return state;

  const newState = { ...state, players: [...state.players], properties: { ...state.properties } };
  const playerIndex = newState.players.findIndex(p => p.id === playerId);
  const player = { ...newState.players[playerIndex] };

  const mortgageValue = property.price / 2;
  const redemptionCost = mortgageValue + Math.ceil(mortgageValue * 0.10); // 10% interest

  if (player.money >= redemptionCost) {
    player.money -= redemptionCost;
    newState.properties[propertyId] = { ...property, isMortgaged: false };
    newState.players[playerIndex] = player;
    newState.eventFeed = [`${player.name} redeemed ${property.name} for ₹${redemptionCost}`, ...newState.eventFeed];
  }

  return newState;
};
