import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IngredientCreateDTO } from "./dto/ingredient-create.dto ";
import { IngredientPatchDTO } from "./dto/ingredient-patch.dto";
import { IngredientQueryDTO } from "./dto/ingredient-query.dto";

@Injectable()
export class IngredientService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllIngredients(
    ingredientQueryDTO: IngredientQueryDTO = {},
  ): Promise<IngredientDTO[]> {
    const where: any = {
      ...(ingredientQueryDTO.hasAlcohol && {
        hasAlcohol: ingredientQueryDTO.hasAlcohol === "true",
      }),
    };

    const orderBy: any = {};
    if (ingredientQueryDTO.sortBy) {
      orderBy[ingredientQueryDTO.sortBy] =
        ingredientQueryDTO.order === "desc" ? "desc" : "asc";
    }

    return await this.prisma.ingredient.findMany({ where, orderBy });
  }

  async getIngredientById(ingredientId: number): Promise<IngredientDTO> {
    return await this.prisma.ingredient.findUniqueOrThrow({
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
