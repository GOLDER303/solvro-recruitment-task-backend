import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async cleanDatabase() {
    await Promise.all([
      this.cocktail.deleteMany({}),
      this.ingredient.deleteMany({}),
      this.cocktailIngredient.deleteMany({}),
    ]);
  }
}
