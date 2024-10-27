import { Test } from "@nestjs/testing";
import { CocktailModule } from "src/cocktail/cocktail.module";
import { CocktailService } from "src/cocktail/cocktail.service";
import { CocktailCreateDTO } from "src/cocktail/dtos/cocktail-create.dto";
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

  it.todo("should delete a cocktail");
  it.todo("should patch (update) a cocktail");
  it.todo("should return a cocktail");
});
