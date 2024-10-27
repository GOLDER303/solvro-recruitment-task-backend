import { Module } from "@nestjs/common";
import { CocktailService } from "./cocktail.service";
import { CocktailController } from "./cocktail.controller";

@Module({
  providers: [CocktailService],
  controllers: [CocktailController],
})
export class CocktailModule {}
