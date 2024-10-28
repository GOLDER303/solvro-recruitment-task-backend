import { Test } from "@nestjs/testing";
import { IngredientModule } from "src/ingredient/ingredient.module";
import { IngredientService } from "src/ingredient/ingredient.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { PrismaService } from "src/prisma/prisma.service";

describe("Ingredient Service Integration", () => {
  let prisma: PrismaService;
  let ingredientService: IngredientService;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [IngredientModule, PrismaModule],
    }).compile();

    prisma = testingModule.get(PrismaService);
    ingredientService = testingModule.get(IngredientService);
  });

  beforeEach(async () => {
    await prisma.cleanDatabase();
  });

  it("should return all ingredients", async () => {
    await prisma.ingredient.createMany({
      data: [
        {
          name: "Ingredient 1",
          description: "Ingredient 1 description",
          isAlcohol: true,
          image: "ingredient_1_image.png",
        },
        {
          name: "Ingredient 2",
          description: "Ingredient 2 description",
          isAlcohol: false,
          image: "ingredient_2_image.png",
        },
        {
          name: "Ingredient 3",
          description: "Ingredient 3 description",
          isAlcohol: true,
          image: "ingredient_3_image.png",
        },
      ],
    });

    const expectedIngredientsDTOs = [
      {
        id: expect.any(Number),
        name: "Ingredient 1",
        description: "Ingredient 1 description",
        isAlcohol: true,
        image: "ingredient_1_image.png",
      },
      {
        id: expect.any(Number),
        name: "Ingredient 2",
        description: "Ingredient 2 description",
        isAlcohol: false,
        image: "ingredient_2_image.png",
      },
      {
        id: expect.any(Number),
        name: "Ingredient 3",
        description: "Ingredient 3 description",
        isAlcohol: true,
        image: "ingredient_3_image.png",
      },
    ];

    const ingredientsDTOs = await ingredientService.getAllIngredients();

    expect(ingredientsDTOs).toEqual(expectedIngredientsDTOs);
  });
});
