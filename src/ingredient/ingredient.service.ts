import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IngredientCreateDTO } from "./dto/ingredient-create.dto ";
import { IngredientPatchDTO } from "./dto/ingredient-patch.dto";

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

  async createIngredient(
    ingredientCreateDTO: IngredientCreateDTO & { image?: Express.Multer.File },
  ): Promise<IngredientDTO> {
    return await this.prisma.ingredient.create({
      data: {
        name: ingredientCreateDTO.name,
        description: ingredientCreateDTO.description,
        isAlcohol:
          ingredientCreateDTO.isAlcoholString === "true" ? true : false,
        image: ingredientCreateDTO.image.filename,
      },
    });
  }

  async deleteIngredientById(ingredientId: number) {
    await this.prisma.ingredient.delete({ where: { id: ingredientId } });
  }

  async patchIngredient(
    ingredientId: number,
    ingredientPatchDTO: IngredientPatchDTO,
  ) {
    return await this.prisma.ingredient.update({
      where: { id: ingredientId },
      data: {
        name: ingredientPatchDTO.name,
        description: ingredientPatchDTO.description,
        isAlcohol: ingredientPatchDTO.isAlcohol,
        image: ingredientPatchDTO.image,
      },
    });
  }
}
