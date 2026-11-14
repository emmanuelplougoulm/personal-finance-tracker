import { INestApplication, ValidationPipe } from '@nestjs/common';

// Shared between main.ts and the e2e tests so both run the same pipeline.
export function setupApp(app: INestApplication): INestApplication {
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  return app;
}
