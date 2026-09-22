export interface Player {
  id: string;
  name: string;
  avatar: string;
  money: number;
  position: number;
  isBankrupt: boolean;
  isInJail: boolean;
  jailTurns: number;
  getOutOfJailCards: number;
}
