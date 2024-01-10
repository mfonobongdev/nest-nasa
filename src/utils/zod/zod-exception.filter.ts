import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError)
export class ZodExceptionFilter<T extends ZodError> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = 400;

    const formatedErrors: string[] = [];

    for (const error of exception.errors) {
      formatedErrors.push(
        `Field: ${error.path[0]} - Message: ${error.message}`,
      );
    }

    response.status(status).json({
      errors: formatedErrors,
      message: 'Validation Failed',
      statusCode: status,
    });
  }
}
