import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CocktailModule } from "./cocktail/cocktail.module";
import { PrismaModule } from "./prisma/prisma.module";
import { IngredientModule } from './ingredient/ingredient.module';

@Module({
  imports: [CocktailModule, PrismaModule, IngredientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
