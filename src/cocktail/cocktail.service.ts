import { Injectable, NotFoundException } from "@nestjs/common";
import { CocktailDTO } from "src/cocktail/dtos/cocktail.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { CocktailCreateDTO } from "./dtos/cocktail-create.dto";
import { CocktailPatchDTO } from "./dtos/cocktail-patch.dto";
import { CocktailQueryDTO } from "./dtos/cocktail-query.dto";

@Injectable()
export class CocktailService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCocktails(
    cocktailQueryDTO?: CocktailQueryDTO,
  ): Promise<CocktailDTO[]> {
    const where: any = {
      ...(cocktailQueryDTO.category && {
        category: cocktailQueryDTO.category,
      }),
      ...(cocktailQueryDTO.hasAlcohol !== undefined && {
        ingredients:
          cocktailQueryDTO.hasAlcohol === "true"
            ? {
                some: {
                  ingredient: {
                    isAlcohol: true,
                  },
                },
              }
            : {
                none: {
                  ingredient: {
                    isAlcohol: true,
                  },
                },
              },
      }),
    };

    const orderBy: any = {};
    if (cocktailQueryDTO.sortBy) {
      orderBy[cocktailQueryDTO.sortBy] =
        cocktailQueryDTO.order === "desc" ? "desc" : "asc";
    }

    const cocktails = await this.prisma.cocktail.findMany({
      include: {
        ingredients: {
          include: {
            ingredient: {
              select: {
                name: true,
                description: true,
                isAlcohol: true,
                image: true,
              },
            },
          },
        },
      },
      where,
      orderBy,
    });

    const cocktailsDTOs: CocktailDTO[] = cocktails.map((cocktail) => ({
      ...cocktail,
      ingredients: cocktail.ingredients.map(({ ingredient, quantity }) => ({
        ...ingredient,
        quantity,
      })),
    }));

    return cocktailsDTOs;
  }

  async getCocktailById(cocktailId: number): Promise<CocktailDTO> {
    const cocktail = await this.prisma.cocktail.findUnique({
      where: { id: cocktailId },
      include: {
        ingredients: {
          include: {
            ingredient: {
              select: {
                name: true,
                description: true,
                isAlcohol: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!cocktail) {
      throw new NotFoundException(
        `Cocktail with id ${cocktailId} does not exist`,
      );
    }

    const cocktailDTO: CocktailDTO = {
      ...cocktail,
      ingredients: cocktail.ingredients.map(({ ingredient, quantity }) => ({
        ...ingredient,
        quantity,
      })),
    };

    return cocktailDTO;
  }

  async createCocktail(
    cocktailCreateDTO: CocktailCreateDTO,
  ): Promise<CocktailDTO> {
    const createdCocktail = await this.prisma.cocktail.create({
      data: {
        name: cocktailCreateDTO.name,
        category: cocktailCreateDTO.category,
        instructions: cocktailCreateDTO.instructions,
        ingredients: {
          create: cocktailCreateDTO.ingredients.map(
            ({ ingredientId, quantity }) => ({
              ingredient: { connect: { id: ingredientId } },
              quantity,
            }),
          ),
        },
      },
      include: {
        ingredients: {
          include: {
            ingredient: {
              select: {
                name: true,
                description: true,
                isAlcohol: true,
                image: true,
              },
            },
          },
        },
      },
    });

    const createdCocktailDTO: CocktailDTO = {
      ...createdCocktail,
      ingredients: createdCocktail.ingredients.map(
        ({ ingredient, quantity }) => ({ ...ingredient, quantity }),
      ),
    };

    return createdCocktailDTO;
  }

  async deleteCocktailById(cocktailId: number): Promise<void> {
    await this.prisma.cocktail.delete({ where: { id: cocktailId } });
  }

  async patchCocktail(
    cocktailId: number,
    cocktailPatchDTO: CocktailPatchDTO,
  ): Promise<CocktailDTO> {
    const { ingredients, ...cocktailUpdates } = cocktailPatchDTO;

    if (ingredients) {
      await this.prisma.cocktailIngredient.deleteMany({
        where: { cocktailId: cocktailId },
      });
    }

    const patchedCocktail = await this.prisma.cocktail.update({
      where: { id: cocktailId },
      data: {
        ...cocktailUpdates,
        ingredients: ingredients
          ? {
              create: ingredients.map(({ ingredientId, quantity }) => ({
                ingredient: { connect: { id: ingredientId } },
                quantity,
              })),
            }
          : undefined,
      },
      include: {
        ingredients: {
          include: {
            ingredient: {
              select: {
                name: true,
                description: true,
                isAlcohol: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!patchedCocktail) {
      throw new NotFoundException(
        `Cocktail with id ${cocktailId} does not exist`,
      );
    }

    const patchedCocktailDTO: CocktailDTO = {
      ...patchedCocktail,
      ingredients: patchedCocktail.ingredients.map(
        ({ ingredient, quantity }) => ({ ...ingredient, quantity }),
      ),
    };

    return patchedCocktailDTO;
  }
}
