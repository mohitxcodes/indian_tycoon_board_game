import { Player } from './player';
import { Property, BoardTile } from './property';
import { EventCard } from './cards';

export interface PaymentEvent {
  fromId: string;
  toId: string;
  amount: number;
  timestamp: number;
}

export type GameStatus = "lobby" | "playing" | "auction" | "trading" | "finished";

export interface AuctionState {
  propertyId: string;
  currentBid: number;
  highestBidderId?: string;
  activeBidders: string[]; // List of player IDs still in the auction
  turnIndex: number; // Index within activeBidders
}

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
  lastPayment?: PaymentEvent;
  lastSalaryEvent?: { playerId: string; amount: number; timestamp: number };
  auction?: AuctionState;
  pendingJail?: boolean; // True when player landed on "Go to Jail" but hasn't been moved to jail yet
}
