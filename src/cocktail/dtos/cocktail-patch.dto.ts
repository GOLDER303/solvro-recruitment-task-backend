export type CocktailPatchDTO = {
  name?: string;
  category?: string;
  instructions?: string;
  ingredients?: { ingredientId: number; quantity: string }[];
};
