import { Test } from "@nestjs/testing";
import { IngredientCreateDTO } from "src/ingredient/dto/ingredient-create.dto ";
import { IngredientPatchDTO } from "src/ingredient/dto/ingredient-patch.dto";
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

  it("should return an ingredient", async () => {
    const ingredient = await prisma.ingredient.create({
      data: {
        name: "Ingredient 1",
        description: "Ingredient 1 description",
        isAlcohol: true,
        image: "ingredient_1_image.png",
      },
    });

    const expectedIngredientsDTOs = {
      id: expect.any(Number),
      name: "Ingredient 1",
      description: "Ingredient 1 description",
      isAlcohol: true,
      image: "ingredient_1_image.png",
    };

    const ingredientsDTOs = await ingredientService.getIngredientById(
      ingredient.id,
    );

    expect(ingredientsDTOs).toEqual(expectedIngredientsDTOs);
  });

  it("should create an ingredient", async () => {
    const ingredientCreateDTO: IngredientCreateDTO & {
      image: Express.Multer.File;
    } = {
      name: "Ingredient 1",
      description: "Ingredient 1 description",
      isAlcoholString: "false",
      image: {
        filename: "ingredient_1_image.png",
        fieldname: "image",
        originalname: "gin.png",
        encoding: "7bit",
        mimetype: "image/png",
        size: 5000,
        buffer: Buffer.from(""),
        destination: "uploads/images",
        path: "uploads/images/gin.png",
        stream: null,
      },
    };

    const createdIngredient =
      await ingredientService.createIngredient(ingredientCreateDTO);

    const databaseIngredient = await prisma.ingredient.findUnique({
      where: { id: createdIngredient.id },
    });

    expect(createdIngredient).toEqual(databaseIngredient);
    expect(createdIngredient.name).toEqual(ingredientCreateDTO.name);
    expect(createdIngredient.description).toEqual(
      ingredientCreateDTO.description,
    );
    expect(createdIngredient.isAlcohol).toEqual(
      ingredientCreateDTO.isAlcoholString === "false" ? false : true,
    );
  });

  it("should delete an ingredient", async () => {
    const ingredient = await prisma.ingredient.create({
      data: {
        name: "Ingredient 1",
        description: "Ingredient 1 description",
        isAlcohol: true,
        image: "ingredient_1_image.png",
      },
    });

    await ingredientService.deleteIngredientById(ingredient.id);

    expect(
      await prisma.ingredient.findUnique({ where: { id: ingredient.id } }),
    ).toBe(null);
  });

  it("should patch (update) an ingredient", async () => {
    const createdIngredient = await prisma.ingredient.create({
      data: {
        name: "Ingredient 1",
        description: "Ingredient 1 description",
        isAlcohol: true,
        image: "ingredient_1_image.png",
      },
    });

    const ingredientPatchDTO: IngredientPatchDTO = {
      name: "Test name 2",
      description: "Test description 2",
      isAlcohol: false,
      image: "ingredient_2_image.png",
    };

    await ingredientService.patchIngredient(
      createdIngredient.id,
      ingredientPatchDTO,
    );

    const ingredient = await prisma.ingredient.findUnique({
      where: { id: createdIngredient.id },
    });

    expect(ingredient).toEqual({
      id: expect.any(Number),
      ...ingredientPatchDTO,
    });
  });
});
