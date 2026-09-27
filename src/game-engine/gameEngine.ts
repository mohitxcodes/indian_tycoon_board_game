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
  player.position = (player.position + steps) % state.board.length;
  
  // Pass Go
  if (player.position < previousPosition) {
    player.money += 2000;
    newState.eventFeed = [`${player.name} passed GO and collected ₹2000`, ...newState.eventFeed];
  }

  newState.players[playerIndex] = player;

  // Check for property rent
  const tile = state.board[player.position];
  if (tile.propertyId) {
    const property = state.properties[tile.propertyId];
    if (property && property.ownerId && property.ownerId !== playerId && !property.isMortgaged) {
      const ownerIndex = newState.players.findIndex(p => p.id === property.ownerId);
      if (ownerIndex !== -1) {
        const owner = { ...newState.players[ownerIndex] };
        
        const rent = property.baseRent * (property.level > 0 ? Math.pow(2, property.level) : 1);
        
        player.money -= rent;
        owner.money += rent;
        
        newState.players[playerIndex] = player;
        newState.players[ownerIndex] = owner;
        newState.eventFeed = [`${player.name} paid ₹${rent} rent to ${owner.name} at ${property.name}`, ...newState.eventFeed];
        newState.lastPayment = {
          fromId: player.id,
          toId: owner.id,
          amount: rent,
          timestamp: Date.now(),
        };
      }
    }
  }

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

export const startAuction = (state: GameState, propertyId: string): GameState => {
  const property = state.properties[propertyId];
  if (!property || property.ownerId) return state;

  return {
    ...state,
    status: "auction",
    auction: {
      propertyId,
      currentBid: 0, // Starting at 0, or could be 10 depending on rules
      activeBidders: state.players.filter(p => !p.isBankrupt).map(p => p.id),
      turnIndex: 0,
    }
  };
};

export const placeBid = (state: GameState, playerId: string, amount: number): GameState => {
  if (state.status !== "auction" || !state.auction) return state;
  const { auction } = state;
  
  const currentBidderId = auction.activeBidders[auction.turnIndex];
  if (currentBidderId !== playerId) return state;

  const player = state.players.find(p => p.id === playerId);
  if (!player || player.money < amount || amount <= auction.currentBid) return state;

  const nextTurnIndex = (auction.turnIndex + 1) % auction.activeBidders.length;

  const newState = {
    ...state,
    auction: {
      ...auction,
      currentBid: amount,
      highestBidderId: playerId,
      turnIndex: nextTurnIndex,
    }
  };

  return checkAuctionWinner(newState);
};

export const withdrawAuction = (state: GameState, playerId: string): GameState => {
  if (state.status !== "auction" || !state.auction) return state;
  const { auction } = state;

  const currentBidderId = auction.activeBidders[auction.turnIndex];
  if (currentBidderId !== playerId) return state;

  const newActiveBidders = auction.activeBidders.filter(id => id !== playerId);
  const nextTurnIndex = newActiveBidders.length > 0 ? auction.turnIndex % newActiveBidders.length : 0;

  const newState = {
    ...state,
    auction: {
      ...auction,
      activeBidders: newActiveBidders,
      turnIndex: nextTurnIndex
    }
  };

  return checkAuctionWinner(newState);
};

const checkAuctionWinner = (state: GameState): GameState => {
  if (!state.auction) return state;
  const { auction } = state;

  if (auction.activeBidders.length === 0) {
    return {
      ...state,
      status: "playing",
      auction: undefined,
      eventFeed: [`Auction for ${state.properties[auction.propertyId].name} ended with no winner`, ...state.eventFeed]
    };
  }

  if (auction.activeBidders.length === 1 && auction.highestBidderId === auction.activeBidders[0]) {
    const winnerId = auction.highestBidderId;
    const newState = { ...state, players: [...state.players], properties: { ...state.properties } };
    
    const winnerIndex = newState.players.findIndex(p => p.id === winnerId);
    if (winnerIndex !== -1) {
      newState.players[winnerIndex] = {
        ...newState.players[winnerIndex],
        money: newState.players[winnerIndex].money - auction.currentBid
      };
      newState.properties[auction.propertyId] = {
        ...newState.properties[auction.propertyId],
        ownerId: winnerId
      };
      newState.eventFeed = [`${newState.players[winnerIndex].name} won the auction for ${newState.properties[auction.propertyId].name} for ₹${auction.currentBid}`, ...newState.eventFeed];
    }
    
    newState.status = "playing";
    newState.auction = undefined;
    return newState;
  }

  return state;
};
