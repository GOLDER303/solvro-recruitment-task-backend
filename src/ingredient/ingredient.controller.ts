import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { multerOptions } from "src/config/multer-options";
import { IngredientCreateDTO } from "./dto/ingredient-create.dto ";
import { IngredientService } from "./ingredient.service";
import { IngredientPatchDTO } from "./dto/ingredient-patch.dto";

@Controller("ingredient")
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Get()
  async getAllIngredient() {
    return this.ingredientService.getAllIngredients();
  }

  @Get(":id")
  async getIngredient(@Param("id") ingredientId: string) {
    return this.ingredientService.getIngredientById(+ingredientId);
  }

  @Post()
  @UseInterceptors(FileInterceptor("image", multerOptions))
  async createIngredient(
    @UploadedFile() image: Express.Multer.File,
    @Body() ingredientCreateDTO: IngredientCreateDTO,
    @Res() res: Response,
  ) {
    const createdIngredient = await this.ingredientService.createIngredient({
      ...ingredientCreateDTO,
      image,
    });

    res.setHeader("Location", `/ingredient/${createdIngredient.id}`);

    return res.status(201).send();
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteIngredient(@Param("id") ingredientId: string) {
    await this.ingredientService.deleteIngredientById(+ingredientId);
  }

  @Patch(":id")
  async patchIngredient(
    @Param("id") ingredientId: string,
    @Body() ingredientPatchDTO: IngredientPatchDTO,
  ) {
    return await this.ingredientService.patchIngredient(
      +ingredientId,
      ingredientPatchDTO,
    );
  }
}
