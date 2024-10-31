import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Response } from "express";

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "An unexpected database error occurred.";

    console.error(exception.stack);

    switch (exception.code) {
      case "P2002":
        status = HttpStatus.CONFLICT;
        message = "A record with this unique field already exists.";
        break;
      case "P2025":
        status = HttpStatus.NOT_FOUND;
        message = "The record you tried to access does not exist.";
        break;
      case "P2003":
        status = HttpStatus.BAD_REQUEST;
        message = "Invalid reference for the foreign key constraint.";
        break;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      error: "PrismaClientKnownRequestError",
    });
  }
}
