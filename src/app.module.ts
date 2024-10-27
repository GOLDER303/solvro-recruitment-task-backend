import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CocktailModule } from "./cocktail/cocktail.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [CocktailModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
