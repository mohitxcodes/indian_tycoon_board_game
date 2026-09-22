import { create } from 'zustand';
import { GameState } from '../types/game';
import { mockPlayers } from '../data/playerData';
import { mockBoard, mockProperties } from '../data/boardData';
import { mockEventCards } from '../data/cardData';
import * as Engine from '../game-engine/gameEngine';

interface GameStore {
  game: GameState | null;
  initGame: () => void;
  rollDice: () => void;
  buyProperty: (propertyId: string) => void;
  endTurn: () => void;
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

  rollDice: () => {
    const { game } = get();
    if (!game) return;

    const [dice1, dice2] = Engine.rollDice();
    const totalSteps = dice1 + dice2;
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
  }
}));
