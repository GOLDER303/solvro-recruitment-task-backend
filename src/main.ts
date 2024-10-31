import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { PrismaClientExceptionFilter } from "./prisma/prisma.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new PrismaClientExceptionFilter());

  await app.listen(3000);
}
bootstrap();
