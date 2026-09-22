export type PropertyLevel = 0 | 1 | 2 | 3;

export interface Property {
  id: string;
  name: string;
  group: string; // The color/category group (e.g. Metro Cities)
  price: number;
  baseRent: number;
  upgradeCost: number;
  level: PropertyLevel;
  ownerId?: string;
  isMortgaged: boolean;
}

export type TileType =
  | "property"
  | "transport"
  | "tax"
  | "event"
  | "bonus"
  | "rest"
  | "start"
  | "jail"
  | "goto_jail";

export interface BoardTile {
  id: string;
  name: string;
  type: TileType;
  position: number;
  propertyId?: string; // Reference to property data if it's a property
  taxAmount?: number;  // If it's a tax tile
}
