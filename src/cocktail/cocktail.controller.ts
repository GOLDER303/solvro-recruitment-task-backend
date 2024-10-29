import {
  Controller,
  Get,
  Param
} from "@nestjs/common";
import { CocktailService } from "./cocktail.service";

@Controller("cocktail")
export class CocktailController {
  constructor(private readonly cocktailService: CocktailService) {}

  @Get()
  async getAllCocktail() {
    return this.cocktailService.getAllCocktails();
  }

  @Get(":id")
  async getCocktail(@Param("id") cocktailId: string) {
    return this.cocktailService.getCocktailById(+cocktailId);
  }
}
