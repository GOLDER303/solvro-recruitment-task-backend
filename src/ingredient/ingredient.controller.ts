import {
  Controller,
  Get,
  Param
} from "@nestjs/common";
import { IngredientService } from "./ingredient.service";

@Controller("ingredient")
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Get()
  async getAllIngredient() {
    return this.ingredientService.getAllIngredients();
  }

  @Get(":id")
  async getIngredient(@Param("id") ingredientId: string) {
    return this.ingredientService.getIngredientById(+ingredientId);
  }
}
