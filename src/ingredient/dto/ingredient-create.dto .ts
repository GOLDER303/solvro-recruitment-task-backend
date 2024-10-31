import { IsNotEmpty, IsString } from "class-validator";

export class IngredientCreateDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  isAlcoholString: string;
}
