import { GameState } from '../types/game';
import { mockBoard, mockProperties } from '../data/boardData';

export const rollDice = (): [number, number] => {
  return [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1
  ];
};

export const movePlayer = (state: GameState, playerId: string, steps: number): GameState => {
  const newState = { ...state, players: [...state.players] };
  const playerIndex = newState.players.findIndex(p => p.id === playerId);
  if (playerIndex === -1) return state;

  const player = { ...newState.players[playerIndex] };
  const previousPosition = player.position;
  player.position = (player.position + steps) % mockBoard.length;
  
  // Pass Go
  if (player.position < previousPosition) {
    player.money += 2000;
    newState.eventFeed = [`${player.name} passed GO and collected ₹2000`, ...newState.eventFeed];
  }

  newState.players[playerIndex] = player;
  return newState;
};

export const buyProperty = (state: GameState, playerId: string, propertyId: string): GameState => {
  const property = state.properties[propertyId];
  if (!property || property.ownerId) return state;

  const newState = { ...state, players: [...state.players], properties: { ...state.properties } };
  const playerIndex = newState.players.findIndex(p => p.id === playerId);
  const player = { ...newState.players[playerIndex] };

  if (player.money >= property.price) {
    player.money -= property.price;
    newState.properties[propertyId] = { ...property, ownerId: playerId };
    newState.players[playerIndex] = player;
    newState.eventFeed = [`${player.name} bought ${property.name}`, ...newState.eventFeed];
  }

  return newState;
};

export const payRent = (state: GameState, fromPlayerId: string, toPlayerId: string, amount: number): GameState => {
  const newState = { ...state, players: [...state.players] };
  const fromIndex = newState.players.findIndex(p => p.id === fromPlayerId);
  const toIndex = newState.players.findIndex(p => p.id === toPlayerId);

  if (fromIndex !== -1 && toIndex !== -1) {
    const fromPlayer = { ...newState.players[fromIndex] };
    const toPlayer = { ...newState.players[toIndex] };

    fromPlayer.money -= amount;
    toPlayer.money += amount;

    newState.players[fromIndex] = fromPlayer;
    newState.players[toIndex] = toPlayer;
    newState.eventFeed = [`${fromPlayer.name} paid ₹${amount} rent to ${toPlayer.name}`, ...newState.eventFeed];
  }

  return newState;
};

export const endTurn = (state: GameState): GameState => {
  const newState = { ...state };
  newState.currentPlayerIndex = (newState.currentPlayerIndex + 1) % newState.players.length;
  if (newState.currentPlayerIndex === 0) {
    newState.round += 1;
  }
  return newState;
};
