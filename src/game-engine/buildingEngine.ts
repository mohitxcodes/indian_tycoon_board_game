import { GameState } from '../types/game';
import { isCompleteColorGroup } from './propertyEngine';

export const canBuildHouse = (state: GameState, playerId: string, propertyId: string): boolean => {
  const property = state.properties[propertyId];
  if (!property || property.ownerId !== playerId) return false;
  
  if (property.group === 'Station' || property.group === 'Utility') return false;
  
  // Must own complete color group
  if (!isCompleteColorGroup(state, playerId, property.group)) return false;
  
  // Cannot build if any property in group is mortgaged
  const groupProps = Object.values(state.properties).filter(p => p.group === property.group);
  if (groupProps.some(p => p.isMortgaged)) return false;

  // Cannot have more than 4 houses (level 4), 5 means hotel
  if (property.level >= 4) return false;

  // Even build rule: cannot build if this property has more buildings than any other in the group
  const minLevelInGroup = Math.min(...groupProps.map(p => p.level));
  if (property.level > minLevelInGroup) return false;

  const player = state.players.find(p => p.id === playerId);
  if (!player || player.money < property.upgradeCost) return false;

  // TODO: Check bank inventory for houses

  return true;
};

export const canBuildHotel = (state: GameState, playerId: string, propertyId: string): boolean => {
  const property = state.properties[propertyId];
  if (!property || property.ownerId !== playerId) return false;
  
  // Must have 4 houses
  if (property.level !== 4) return false;

  // Even build rule applies to hotels as well (all other properties in group must have at least 4 houses)
  const groupProps = Object.values(state.properties).filter(p => p.group === property.group);
  if (groupProps.some(p => p.level < 4)) return false;

  const player = state.players.find(p => p.id === playerId);
  if (!player || player.money < property.upgradeCost) return false;

  // TODO: Check bank inventory for hotels

  return true;
};

export const canSellBuilding = (state: GameState, playerId: string, propertyId: string): boolean => {
  const property = state.properties[propertyId];
  if (!property || property.ownerId !== playerId || property.level === 0) return false;

  // Even sell rule: cannot sell if this property has fewer buildings than any other in the group
  const groupProps = Object.values(state.properties).filter(p => p.group === property.group);
  const maxLevelInGroup = Math.max(...groupProps.map(p => p.level));
  if (property.level < maxLevelInGroup) return false;

  return true;
};

export const buildHouse = (state: GameState, playerId: string, propertyId: string): GameState => {
  if (!canBuildHouse(state, playerId, propertyId)) return state;

  const newState = { ...state, players: [...state.players], properties: { ...state.properties } };
  const playerIndex = newState.players.findIndex(p => p.id === playerId);
  const player = { ...newState.players[playerIndex] };
  const property = { ...newState.properties[propertyId] };

  player.money -= property.upgradeCost;
  property.level = (property.level + 1) as any;

  newState.players[playerIndex] = player;
  newState.properties[propertyId] = property;
  newState.eventFeed = [`${player.name} built a house on ${property.name} for ₹${property.upgradeCost}`, ...newState.eventFeed];

  return newState;
};

export const buildHotel = (state: GameState, playerId: string, propertyId: string): GameState => {
  if (!canBuildHotel(state, playerId, propertyId)) return state;

  const newState = { ...state, players: [...state.players], properties: { ...state.properties } };
  const playerIndex = newState.players.findIndex(p => p.id === playerId);
  const player = { ...newState.players[playerIndex] };
  const property = { ...newState.properties[propertyId] };

  player.money -= property.upgradeCost;
  property.level = 5; // 5 means hotel

  newState.players[playerIndex] = player;
  newState.properties[propertyId] = property;
  newState.eventFeed = [`${player.name} built a hotel on ${property.name} for ₹${property.upgradeCost}`, ...newState.eventFeed];

  return newState;
};

export const sellBuilding = (state: GameState, playerId: string, propertyId: string): GameState => {
  if (!canSellBuilding(state, playerId, propertyId)) return state;

  const newState = { ...state, players: [...state.players], properties: { ...state.properties } };
  const playerIndex = newState.players.findIndex(p => p.id === playerId);
  const player = { ...newState.players[playerIndex] };
  const property = { ...newState.properties[propertyId] };

  const resaleValue = property.upgradeCost / 2;
  player.money += resaleValue;
  property.level = (property.level - 1) as any;

  const buildingName = property.level === 4 ? 'hotel' : 'house'; // because it was 5 before

  newState.players[playerIndex] = player;
  newState.properties[propertyId] = property;
  newState.eventFeed = [`${player.name} sold a ${buildingName} from ${property.name} for ₹${resaleValue}`, ...newState.eventFeed];

  return newState;
};
