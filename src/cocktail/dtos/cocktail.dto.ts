export type CocktailDTO = {
  id: number;
  name: string;
  category: string;
  instructions: string;
  ingredients: {
    name: string;
    description: string;
    isAlcohol: boolean;
    imageUrl?: string;
    quantity: string;
  }[];
};
