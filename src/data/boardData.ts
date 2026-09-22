import { BoardTile, Property } from '../types/property';

// ─── Group colors for tile headers ───────────────────────────
export const GROUP_COLORS: Record<string, string> = {
  'Brown': '#8B4513',
  'Light Blue': '#87CEEB',
  'Pink': '#FF69B4',
  'Orange': '#FFA500',
  'Red': '#FF0000',
  'Yellow': '#FFFF00',
  'Green': '#008000',
  'Dark Blue': '#00008B',
};

// ─── Properties ───────────────────
export const mockProperties: Record<string, Property> = {
  // Brown
  "p1":  { id: "p1",  name: "Guwahati", group: "Brown", price: 60,  baseRent: 2,  upgradeCost: 50,  level: 0, isMortgaged: false },
  "p2":  { id: "p2",  name: "Bhubaneswar", group: "Brown", price: 60,  baseRent: 4,  upgradeCost: 50,  level: 0, isMortgaged: false },

  // Light Blue
  "p3":  { id: "p3",  name: "Panaji", group: "Light Blue", price: 100, baseRent: 6,  upgradeCost: 50,  level: 0, isMortgaged: false },
  "p4":  { id: "p4",  name: "Agra", group: "Light Blue", price: 100, baseRent: 6,  upgradeCost: 50,  level: 0, isMortgaged: false },
  "p5":  { id: "p5",  name: "Vadodara", group: "Light Blue", price: 120, baseRent: 8,  upgradeCost: 50,  level: 0, isMortgaged: false },

  // Pink
  "p6":  { id: "p6",  name: "Ludhiana", group: "Pink", price: 140, baseRent: 10, upgradeCost: 100, level: 0, isMortgaged: false },
  "p7":  { id: "p7",  name: "Patna", group: "Pink", price: 140, baseRent: 10, upgradeCost: 100, level: 0, isMortgaged: false },
  "p8":  { id: "p8",  name: "Bhopal", group: "Pink", price: 160, baseRent: 12, upgradeCost: 100, level: 0, isMortgaged: false },

  // Orange
  "p9":  { id: "p9",  name: "Indore", group: "Orange", price: 180, baseRent: 14, upgradeCost: 100, level: 0, isMortgaged: false },
  "p10": { id: "p10", name: "Nagpur", group: "Orange", price: 180, baseRent: 14, upgradeCost: 100, level: 0, isMortgaged: false },
  "p11": { id: "p11", name: "Kochi", group: "Orange", price: 200, baseRent: 16, upgradeCost: 100, level: 0, isMortgaged: false },

  // Red
  "p12": { id: "p12", name: "Lucknow", group: "Red", price: 220, baseRent: 18, upgradeCost: 150, level: 0, isMortgaged: false },
  "p13": { id: "p13", name: "Chandigarh", group: "Red", price: 220, baseRent: 18, upgradeCost: 150, level: 0, isMortgaged: false },
  "p14": { id: "p14", name: "Jaipur", group: "Red", price: 240, baseRent: 20, upgradeCost: 150, level: 0, isMortgaged: false },

  // Yellow
  "p15": { id: "p15", name: "Pune", group: "Yellow", price: 260, baseRent: 22, upgradeCost: 150, level: 0, isMortgaged: false },
  "p16": { id: "p16", name: "Hyderabad", group: "Yellow", price: 260, baseRent: 22, upgradeCost: 150, level: 0, isMortgaged: false },
  "p17": { id: "p17", name: "Ahmedabad", group: "Yellow", price: 280, baseRent: 24, upgradeCost: 150, level: 0, isMortgaged: false },

  // Green
  "p18": { id: "p18", name: "Kolkata", group: "Green", price: 300, baseRent: 26, upgradeCost: 200, level: 0, isMortgaged: false },
  "p19": { id: "p19", name: "Chennai", group: "Green", price: 300, baseRent: 26, upgradeCost: 200, level: 0, isMortgaged: false },
  "p20": { id: "p20", name: "Bengaluru", group: "Green", price: 320, baseRent: 28, upgradeCost: 200, level: 0, isMortgaged: false },

  // Dark Blue
  "p21": { id: "p21", name: "Delhi", group: "Dark Blue", price: 350, baseRent: 35, upgradeCost: 200, level: 0, isMortgaged: false },
  "p22": { id: "p22", name: "Mumbai", group: "Dark Blue", price: 400, baseRent: 50, upgradeCost: 200, level: 0, isMortgaged: false },
};

export const TILES_PER_SIDE = 11;
export const TOTAL_TILES = 40;

export const mockBoard: BoardTile[] = [
  // ── Bottom row: right→left (0-10) ───
  { id: "t0",  name: "GO", type: "start", position: 0 },
  { id: "t1",  name: "Guwahati", type: "property", position: 1, propertyId: "p1" },
  { id: "t2",  name: "CHEST", type: "event", position: 2 },
  { id: "t3",  name: "Bhubaneswar", type: "property", position: 3, propertyId: "p2" },
  { id: "t4",  name: "INCOME TAX", type: "tax", position: 4, taxAmount: 200 },
  { id: "t5",  name: "STATION", type: "transport", position: 5 },
  { id: "t6",  name: "Panaji", type: "property", position: 6, propertyId: "p3" },
  { id: "t7",  name: "CHANCE", type: "event", position: 7 },
  { id: "t8",  name: "Agra", type: "property", position: 8, propertyId: "p4" },
  { id: "t9",  name: "Vadodara", type: "property", position: 9, propertyId: "p5" },
  { id: "t10", name: "JAIL", type: "jail", position: 10 },

  // ── Left column: bottom→top (11-19) ───
  { id: "t11", name: "Ludhiana", type: "property", position: 11, propertyId: "p6" },
  { id: "t12", name: "ELECTRIC", type: "tax", position: 12, taxAmount: 150 },
  { id: "t13", name: "Patna", type: "property", position: 13, propertyId: "p7" },
  { id: "t14", name: "Bhopal", type: "property", position: 14, propertyId: "p8" },
  { id: "t15", name: "STATION", type: "transport", position: 15 },
  { id: "t16", name: "Indore", type: "property", position: 16, propertyId: "p9" },
  { id: "t17", name: "CHEST", type: "event", position: 17 },
  { id: "t18", name: "Nagpur", type: "property", position: 18, propertyId: "p10" },
  { id: "t19", name: "Kochi", type: "property", position: 19, propertyId: "p11" },

  // ── Top row: left→right (20-30) ───
  { id: "t20", name: "FREE PARKING", type: "rest", position: 20 },
  { id: "t21", name: "Lucknow", type: "property", position: 21, propertyId: "p12" },
  { id: "t22", name: "CHANCE", type: "event", position: 22 },
  { id: "t23", name: "Chandigarh", type: "property", position: 23, propertyId: "p13" },
  { id: "t24", name: "Jaipur", type: "property", position: 24, propertyId: "p14" },
  { id: "t25", name: "STATION", type: "transport", position: 25 },
  { id: "t26", name: "Pune", type: "property", position: 26, propertyId: "p15" },
  { id: "t27", name: "Hyderabad", type: "property", position: 27, propertyId: "p16" },
  { id: "t28", name: "WATER", type: "tax", position: 28, taxAmount: 150 },
  { id: "t29", name: "Ahmedabad", type: "property", position: 29, propertyId: "p17" },
  { id: "t30", name: "GO TO JAIL", type: "goto_jail", position: 30 },

  // ── Right column: top→bottom (31-39) ───
  { id: "t31", name: "Kolkata", type: "property", position: 31, propertyId: "p18" },
  { id: "t32", name: "Chennai", type: "property", position: 32, propertyId: "p19" },
  { id: "t33", name: "CHEST", type: "event", position: 33 },
  { id: "t34", name: "Bengaluru", type: "property", position: 34, propertyId: "p20" },
  { id: "t35", name: "STATION", type: "transport", position: 35 },
  { id: "t36", name: "CHANCE", type: "event", position: 36 },
  { id: "t37", name: "Delhi", type: "property", position: 37, propertyId: "p21" },
  { id: "t38", name: "SUPER TAX", type: "tax", position: 38, taxAmount: 100 },
  { id: "t39", name: "Mumbai", type: "property", position: 39, propertyId: "p22" },
];
