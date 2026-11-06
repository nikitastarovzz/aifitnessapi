/** Types for src/lib/stackCard.mjs. */
export const STACK_CARD_MAX_PRODUCTS: number;
export const STACK_CARD_MAX_DEADLINES: number;
export type StackCardModel = { products: string[]; more: number; deadlines: string[]; ahead: number; text: string };
export function stackCardModel(o: {
  products: string[];
  deadlines: { title: string; target: string; exact: boolean; who: string[] }[];
  today: string;
}): StackCardModel;
