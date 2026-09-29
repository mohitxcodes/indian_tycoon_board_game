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
    player.money += 200;
    newState.eventFeed = [`${player.name} passed GO and collected ₹200`, ...newState.eventFeed];
    newState.lastSalaryEvent = {
      playerId: player.id,
      amount: 200,
      timestamp: Date.now(),
    };
  }

  newState.players[playerIndex] = player;

  // Check the tile the player landed on
  const tile = state.board[player.position];

  // ── Tax Tiles ──────────────────────────────────
  if (tile.type === 'tax' && tile.taxAmount) {
    player.money -= tile.taxAmount;
    newState.players[playerIndex] = player;
    newState.eventFeed = [`${player.name} paid ₹${tile.taxAmount} ${tile.name}`, ...newState.eventFeed];
  }

  // ── Go To Jail ─────────────────────────────────
  // Don't move to jail immediately — let the UI animate landing on "Go to Jail" first
  if (tile.type === 'goto_jail') {
    newState.pendingJail = true;
    newState.players[playerIndex] = player;
    newState.eventFeed = [`${player.name} landed on GO TO JAIL! 🚔`, ...newState.eventFeed];
    return newState; // Skip rent check
  }

  // ── Property Rent ──────────────────────────────
  if (tile.propertyId) {
    const property = state.properties[tile.propertyId];
    if (property && property.ownerId && property.ownerId !== playerId && !property.isMortgaged) {
      const ownerIndex = newState.players.findIndex(p => p.id === property.ownerId);
      if (ownerIndex !== -1) {
        const owner = { ...newState.players[ownerIndex] };
        let rent = 0;

        if (property.group === 'Station') {
          const ownedStations = Object.values(state.properties).filter(
            p => p.group === 'Station' && p.ownerId === owner.id
          ).length;
          rent = 25 * Math.pow(2, Math.max(0, ownedStations - 1));
        } else if (property.group === 'Utility') {
          const ownedUtilities = Object.values(state.properties).filter(
            p => p.group === 'Utility' && p.ownerId === owner.id
          ).length;
          const multiplier = ownedUtilities === 2 ? 10 : 4;
          rent = steps * multiplier;
        } else {
          rent = property.baseRent * (property.level > 0 ? Math.pow(2, property.level) : 1);
        }
        
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

// ── Jail: Roll for freedom (doubles = escape) ────
export const rollForJail = (state: GameState, playerId: string): GameState => {
  const newState = { ...state, players: [...state.players] };
  const playerIndex = newState.players.findIndex(p => p.id === playerId);
  if (playerIndex === -1) return state;

  const player = { ...newState.players[playerIndex] };
  if (!player.isInJail) return state;

  const [d1, d2] = rollDice();
  newState.lastDiceRoll = [d1, d2];
  player.jailTurns += 1;

  if (d1 === d2) {
    // Doubles! Player is free
    player.isInJail = false;
    player.jailTurns = 0;
    newState.players[playerIndex] = player;
    newState.eventFeed = [`${player.name} rolled doubles (${d1}-${d2}) and escaped JAIL! 🎉`, ...newState.eventFeed];
    // Now move them by the dice total
    return movePlayer(newState, playerId, d1 + d2);
  }

  if (player.jailTurns >= 3) {
    // 3rd failed attempt — forced to pay ₹75 and move
    player.money -= 75;
    player.isInJail = false;
    player.jailTurns = 0;
    newState.players[playerIndex] = player;
    newState.eventFeed = [`${player.name} failed 3 times. Paid ₹75 fine to leave JAIL 💸`, ...newState.eventFeed];
    return movePlayer(newState, playerId, d1 + d2);
  }

  // Failed to roll doubles
  newState.players[playerIndex] = player;
  newState.eventFeed = [`${player.name} rolled ${d1}-${d2}. No doubles! Still in JAIL (Attempt ${player.jailTurns}/3) 🔒`, ...newState.eventFeed];
  return newState;
};

// ── Jail: Pay fine to get out immediately ────────
export const payJailFine = (state: GameState, playerId: string): GameState => {
  const newState = { ...state, players: [...state.players] };
  const playerIndex = newState.players.findIndex(p => p.id === playerId);
  if (playerIndex === -1) return state;

  const player = { ...newState.players[playerIndex] };
  if (!player.isInJail) return state;

  player.money -= 75;
  player.isInJail = false;
  player.jailTurns = 0;
  newState.players[playerIndex] = player;
  newState.eventFeed = [`${player.name} paid ₹75 fine to leave JAIL 💰`, ...newState.eventFeed];
  return newState;
};

// ── Send player to jail (second step of Go-to-Jail animation) ──
export const sendToJail = (state: GameState, playerId: string): GameState => {
  const newState = { ...state, players: [...state.players], pendingJail: false };
  const playerIndex = newState.players.findIndex(p => p.id === playerId);
  if (playerIndex === -1) return state;

  const player = { ...newState.players[playerIndex] };
  player.position = 10; // Jail tile position
  player.isInJail = true;
  player.jailTurns = 0;
  newState.players[playerIndex] = player;
  newState.eventFeed = [`${player.name} is now IN JAIL! 🔒`, ...newState.eventFeed];
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
