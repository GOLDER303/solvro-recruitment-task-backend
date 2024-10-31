import { IsIn, IsOptional, IsString } from "class-validator";

export class CocktailQueryDTO {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  @IsIn(["true", "false"])
  hasAlcohol?: string;

  @IsOptional()
  @IsIn(["category", "name"])
  sortBy?: string;

  @IsOptional()
  @IsIn(["asc", "desc"])
  order?: "asc" | "desc";
}
