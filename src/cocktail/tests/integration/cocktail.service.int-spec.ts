import { Test } from "@nestjs/testing";
import { CocktailModule } from "src/cocktail/cocktail.module";
import { CocktailService } from "src/cocktail/cocktail.service";
import { CocktailCreateDTO } from "src/cocktail/dtos/cocktail-create.dto";
import { CocktailPatchDTO } from "src/cocktail/dtos/cocktail-patch.dto";
import { CocktailDTO } from "src/cocktail/dtos/cocktail.dto";
import { PrismaModule } from "src/prisma/prisma.module";
import { PrismaService } from "src/prisma/prisma.service";

describe("Cocktail Service Integration", () => {
  let prisma: PrismaService;
  let cocktailService: CocktailService;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [CocktailModule, PrismaModule],
    }).compile();

    prisma = testingModule.get(PrismaService);
    cocktailService = testingModule.get(CocktailService);
  });

  beforeEach(async () => {
    await prisma.cleanDatabase();
  });

  it("should create a cocktail", async () => {
    const cocktailCreateDTO: CocktailCreateDTO = {
      name: "Test name",
      category: "Test category",
      instructions: "Test instructions",
      ingredients: [],
    };

    const createdCocktail =
      await cocktailService.createCocktail(cocktailCreateDTO);

    const databaseCocktail = await prisma.cocktail.findFirst();

    expect(createdCocktail.name).toEqual(cocktailCreateDTO.name);
    expect(createdCocktail.category).toEqual(cocktailCreateDTO.category);
    expect(createdCocktail.instructions).toEqual(
      cocktailCreateDTO.instructions,
    );

    expect(typeof createdCocktail.id).toBe("number");
    expect(createdCocktail.name).toEqual(databaseCocktail.name);
    expect(createdCocktail.category).toEqual(databaseCocktail.category);
    expect(createdCocktail.instructions).toEqual(databaseCocktail.instructions);
  });

  it("should return a cocktail", async () => {
    const createdCocktail = await prisma.cocktail.create({
      data: {
        name: "Test name 1",
        category: "Test category 1",
        instructions: "Test instructions 1",
      },
    });

    const ingredient = await prisma.ingredient.create({
      data: {
        name: "Test name 1",
        description: "Test description 1",
        isAlcohol: true,
      },
    });

    await prisma.cocktailIngredient.create({
      data: {
        quantity: "1 glass",
        cocktailId: createdCocktail.id,
        ingredientId: ingredient.id,
      },
    });

    const cocktailDTO = await cocktailService.getCocktailById(
      createdCocktail.id,
    );

    const expectedDTO: CocktailDTO = {
      id: createdCocktail.id,
      name: "Test name 1",
      category: "Test category 1",
      instructions: "Test instructions 1",
      image: null,
      ingredients: [
        {
          name: "Test name 1",
          description: "Test description 1",
          isAlcohol: true,
          quantity: "1 glass",
          image: null,
        },
      ],
    };

    expect(cocktailDTO).toEqual(expectedDTO);
  });

  it("should delete a cocktail", async () => {
    const createdCocktail = await prisma.cocktail.create({
      data: {
        name: "Test name 1",
        category: "Test category 1",
        instructions: "Test instructions 1",
      },
    });

    await cocktailService.deleteCocktailById(createdCocktail.id);

    expect(
      await prisma.cocktail.findUnique({ where: { id: createdCocktail.id } }),
    ).toBe(null);
  });

  it("should patch (update) a cocktail", async () => {
    const createdCocktail = await prisma.cocktail.create({
      data: {
        name: "Test name 1",
        category: "Test category 1",
        instructions: "Test instructions 1",
      },
    });

    const ingredient1 = await prisma.ingredient.create({
      data: {
        name: "Test name 1",
        description: "Test description 1",
        isAlcohol: true,
      },
    });

    const ingredient2 = await prisma.ingredient.create({
      data: {
        name: "Test name 2",
        description: "Test description 2",
        isAlcohol: false,
      },
    });

    await prisma.cocktailIngredient.create({
      data: {
        quantity: "1 glass",
        cocktailId: createdCocktail.id,
        ingredientId: ingredient1.id,
      },
    });

    const cocktailPatchDTO: CocktailPatchDTO = {
      name: "Patched cocktail 1",
      category: "Patched category 1",
      instructions: "Patched instructions 1",
      ingredients: [{ ingredientId: ingredient2.id, quantity: "2 glasses" }],
    };

    const cocktailDTO = await cocktailService.patchCocktail(
      createdCocktail.id,
      cocktailPatchDTO,
    );

    const expectedDTO: CocktailDTO = {
      id: createdCocktail.id,
      name: "Patched cocktail 1",
      category: "Patched category 1",
      instructions: "Patched instructions 1",
      image: null,
      ingredients: [
        {
          name: "Test name 2",
          description: "Test description 2",
          isAlcohol: false,
          quantity: "2 glasses",
          image: null,
        },
      ],
    };

    expect(cocktailDTO).toEqual(expectedDTO);
  });
});
