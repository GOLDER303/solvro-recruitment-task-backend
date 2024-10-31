import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { multerOptions } from "src/config/multer-options";
import { CocktailService } from "./cocktail.service";
import { CocktailCreateDTO } from "./dtos/cocktail-create.dto";
import { CocktailPatchDTO } from "./dtos/cocktail-patch.dto";

@Controller("cocktail")
export class CocktailController {
  constructor(private readonly cocktailService: CocktailService) {}

  @Get()
  async getAllCocktail() {
    return this.cocktailService.getAllCocktails();
  }

  @Get(":id")
  async getCocktail(@Param("id") cocktailId: string) {
    return this.cocktailService.getCocktailById(+cocktailId);
  }

  @Post()
  @UseInterceptors(FileInterceptor("image", multerOptions))
  async createIngredient(
    @Body() ingredientCreateDTO: CocktailCreateDTO,
    @Res() res: Response,
  ) {
    const createdCocktail =
      await this.cocktailService.createCocktail(ingredientCreateDTO);

    res.setHeader("Location", `/cocktail/${createdCocktail.id}`);

    return res.status(201).send();
  }

  @Delete(":id")
  async deleteCocktail(@Param("id") cocktailId: string) {
    await this.cocktailService.deleteCocktailById(+cocktailId);
  }

  @Patch(":id")
  async patchCocktail(
    @Param("id") cocktailId: string,
    @Body() cocktailPatchDTO: CocktailPatchDTO,
  ) {
    return this.cocktailService.patchCocktail(+cocktailId, cocktailPatchDTO);
  }
}
