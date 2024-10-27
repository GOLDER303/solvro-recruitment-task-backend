export type CocktailDTO = {
  id: number;
  name: string;
  category: string;
  instructions: string;
  image?: string;
  ingredients: {
    name: string;
    description: string;
    isAlcohol: boolean;
    image?: string;
    quantity: string;
  }[];
};
