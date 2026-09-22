import { Player } from './player';
import { Property, BoardTile } from './property';
import { EventCard } from './cards';

export type GameStatus = "lobby" | "playing" | "auction" | "trading" | "finished";

export interface GameState {
  id: string;
  status: GameStatus;
  players: Player[];
  currentPlayerIndex: number;
  properties: Record<string, Property>;
  board: BoardTile[];
  round: number;
  turnCount: number;
  eventCards: EventCard[];
  eventFeed: string[];
  lastDiceRoll?: [number, number];
  winnerId?: string;
}
