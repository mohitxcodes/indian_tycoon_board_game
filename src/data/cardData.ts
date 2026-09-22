import { EventCard } from '../types/cards';

export const mockEventCards: EventCard[] = [
  {
    id: "card-1",
    title: "Festival Bonus",
    description: "Your business received extra festive sales. Collect ₹500.",
    actionType: "collect_money",
    amount: 500,
  },
  {
    id: "card-2",
    title: "Market Boom",
    description: "Commercial properties earn bonus rent this round. Collect ₹1000.",
    actionType: "collect_money",
    amount: 1000,
  },
  {
    id: "card-3",
    title: "Business Trip",
    description: "Move to the nearest transport hub.",
    actionType: "move_nearest",
    targetType: "transport",
  },
  {
    id: "card-4",
    title: "Tax Assessment",
    description: "Pay property tax. Pay ₹800.",
    actionType: "pay_money",
    amount: 800,
  },
  {
    id: "card-5",
    title: "Startup Investment",
    description: "Your recent startup investment paid off. Collect ₹1500.",
    actionType: "collect_money",
    amount: 1500,
  },
];
