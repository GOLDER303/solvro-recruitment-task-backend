import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class IngredientService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllIngredients(): Promise<IngredientDTO[]> {
    return await this.prisma.ingredient.findMany();
  }

  async getIngredientById(ingredientId: number): Promise<IngredientDTO> {
    return await this.prisma.ingredient.findUnique({
      where: { id: ingredientId },
    });
  }
}
