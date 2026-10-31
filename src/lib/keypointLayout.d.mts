export const VIEW_W: number;
export const VIEW_H: number;
export const LAYOUT: Record<string, [number, number]>;
export const FIGURE: {
  head: { cx: number; cy: number; rx: number; ry: number };
  torso: string;
  limbs: string[];
  feet: string[];
  hands: { cx: number; cy: number; r: number }[];
};
