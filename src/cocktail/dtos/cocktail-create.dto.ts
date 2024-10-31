import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from "class-validator";

class CreateCocktailDTOIngredient {
  @IsInt()
  ingredientId: number;

  @IsString()
  quantity: string;
}

export class CocktailCreateDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  instructions: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCocktailDTOIngredient)
  ingredients: { ingredientId: number; quantity: string }[];
}
