import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CocktailCreateDTO } from "./dtos/cocktail-create.dto";
import { CocktailDTO } from "./dtos/cocktail.dto";

@Injectable()
export class CocktailService {
  constructor(private readonly prisma: PrismaService) {}

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
}
