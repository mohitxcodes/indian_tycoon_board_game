import { create } from 'zustand';
import { GameState } from '../types/game';
import { mockPlayers } from '../data/playerData';
import { mockBoard, mockProperties } from '../data/boardData';
import { mockEventCards } from '../data/cardData';
import * as Engine from '../game-engine/gameEngine';
import * as PropertyEngine from '../game-engine/propertyEngine';
import * as BuildingEngine from '../game-engine/buildingEngine';

interface GameStore {
  game: GameState | null;
  initGame: () => void;
  rollDice: (forcedSteps?: number) => void;
  buyProperty: (propertyId: string) => void;
  endTurn: () => void;
  startAuction: (propertyId: string) => void;
  placeBid: (playerId: string, amount: number) => void;
  withdrawAuction: (playerId: string) => void;
  rollForJail: () => void;
  payJailFine: () => void;
  sendToJail: () => void;
  mortgageProperty: (propertyId: string) => void;
  redeemProperty: (propertyId: string) => void;
  buildHouse: (propertyId: string) => void;
  buildHotel: (propertyId: string) => void;
  sellBuilding: (propertyId: string) => void;
}

const getInitialState = (): GameState => ({
  id: "game-1",
  status: "playing",
  players: mockPlayers,
  currentPlayerIndex: 0,
  properties: mockProperties,
  board: mockBoard,
  round: 1,
  turnCount: 0,
  eventCards: mockEventCards,
  eventFeed: ["Game started"],
});

export const useGameStore = create<GameStore>((set, get) => ({
  game: null,

  initGame: () => set({ game: getInitialState() }),

  rollDice: (forcedSteps?: number) => {
    const { game } = get();
    if (!game) return;

    let dice1, dice2, totalSteps;
    if (forcedSteps !== undefined) {
      dice1 = Math.min(6, Math.max(1, Math.floor(forcedSteps / 2)));
      dice2 = forcedSteps - dice1;
      totalSteps = forcedSteps;
    } else {
      [dice1, dice2] = Engine.rollDice();
      totalSteps = dice1 + dice2;
    }
    const currentPlayer = game.players[game.currentPlayerIndex];

    let newState: GameState = { ...game, lastDiceRoll: [dice1, dice2] as [number, number] };
    newState = Engine.movePlayer(newState, currentPlayer.id, totalSteps);

    set({ game: newState });
  },

  buyProperty: (propertyId: string) => {
    const { game } = get();
    if (!game) return;

    const currentPlayer = game.players[game.currentPlayerIndex];
    const newState = Engine.buyProperty(game, currentPlayer.id, propertyId);
    
    set({ game: newState });
  },

  endTurn: () => {
    const { game } = get();
    if (!game) return;

    const newState = Engine.endTurn(game);
    set({ game: newState });
  },

  startAuction: (propertyId: string) => {
    const { game } = get();
    if (!game) return;
    set({ game: Engine.startAuction(game, propertyId) });
  },

  placeBid: (playerId: string, amount: number) => {
    const { game } = get();
    if (!game) return;
    set({ game: Engine.placeBid(game, playerId, amount) });
  },

  withdrawAuction: (playerId: string) => {
    const { game } = get();
    if (!game) return;
    set({ game: Engine.withdrawAuction(game, playerId) });
  },

  rollForJail: () => {
    const { game } = get();
    if (!game) return;
    const currentPlayer = game.players[game.currentPlayerIndex];
    set({ game: Engine.rollForJail(game, currentPlayer.id) });
  },

  payJailFine: () => {
    const { game } = get();
    if (!game) return;
    const currentPlayer = game.players[game.currentPlayerIndex];
    set({ game: Engine.payJailFine(game, currentPlayer.id) });
  },

  sendToJail: () => {
    const { game } = get();
    if (!game) return;
    const currentPlayer = game.players[game.currentPlayerIndex];
    set({ game: Engine.sendToJail(game, currentPlayer.id) });
  },

  mortgageProperty: (propertyId: string) => {
    const { game } = get();
    if (!game) return;
    const currentPlayer = game.players[game.currentPlayerIndex];
    set({ game: PropertyEngine.mortgageProperty(game, currentPlayer.id, propertyId) });
  },

  redeemProperty: (propertyId: string) => {
    const { game } = get();
    if (!game) return;
    const currentPlayer = game.players[game.currentPlayerIndex];
    set({ game: PropertyEngine.redeemProperty(game, currentPlayer.id, propertyId) });
  },

  buildHouse: (propertyId: string) => {
    const { game } = get();
    if (!game) return;
    const currentPlayer = game.players[game.currentPlayerIndex];
    set({ game: BuildingEngine.buildHouse(game, currentPlayer.id, propertyId) });
  },

  buildHotel: (propertyId: string) => {
    const { game } = get();
    if (!game) return;
    const currentPlayer = game.players[game.currentPlayerIndex];
    set({ game: BuildingEngine.buildHotel(game, currentPlayer.id, propertyId) });
  },

  sellBuilding: (propertyId: string) => {
    const { game } = get();
    if (!game) return;
    const currentPlayer = game.players[game.currentPlayerIndex];
    set({ game: BuildingEngine.sellBuilding(game, currentPlayer.id, propertyId) });
  },
}));
