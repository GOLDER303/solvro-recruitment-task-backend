import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { multerOptions } from "src/config/multer-options";
import { CocktailService } from "./cocktail.service";
import { CocktailCreateDTO } from "./dtos/cocktail-create.dto";

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
    this.cocktailService.deleteCocktailById(+cocktailId);
  }
}
