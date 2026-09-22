export type CardActionType = 
  | "collect_money"
  | "pay_money"
  | "move_to"
  | "move_nearest"
  | "get_out_of_jail";

export interface EventCard {
  id: string;
  title: string;
  description: string;
  actionType: CardActionType;
  amount?: number;       // For money actions
  targetSpace?: number;  // For move_to actions
  targetType?: string;   // For move_nearest actions (e.g. "transport")
}
