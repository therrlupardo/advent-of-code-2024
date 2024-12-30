export const BORDER = '#';
export const EMPTY = '.';
export const CURRENT = 'S';
export const END = 'E';
export const VISITED = 'X';
export type Cell =
  | typeof BORDER
  | typeof EMPTY
  | typeof CURRENT
  | typeof END
  | typeof VISITED;
export type Direction = 'right' | 'left' | 'up' | 'down';

export interface Point {
  x: number;
  y: number;
}

export interface DirectionPoint extends Point {
  turned: boolean;
}

export type MoveType = 'change_position' | 'change_direction';

export type Path = { foundEnd: boolean; moves: MoveType[] };
