export interface Room {
  id: string;
  name: string;
  maxPlayers: number;
  players: number;
}
export interface MyRoom extends Omit<Room, "players"> {
  players: Player[];
}
export interface Player {
  id: string;
  name: string;
  hand?: number;
  profile: string;
}
export interface CardInterface {
  value: string;
  color: string;
}
export interface gamestateinterface {
  name: string;
  players: Player[];
  hand: CardInterface[];
  discard: CardInterface;
  myId: string;
  turn: number;
  openTaki: boolean;
  // myTurn: boolean;
}
export interface GameOverInterface {
  result: string | null;
  winner: string | null;
}
