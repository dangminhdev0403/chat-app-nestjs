import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './modules/auth/passport/jwt-auth.guard';
import { ResponseInterceptor } from './utils/response/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global ValidationPipe (lọc, ép kiểu và kiểm tra DTO)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global Interceptor (tuỳ chỉnh response format)
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global Guard: JwtAuthGuard
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // Enable CORS (nếu frontend khác domain)
  app.enableCors();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 Server is running at http://localhost:${port}`);
}
bootstrap().catch((error) => {
  Logger.error('Ứng dụng không thể khởi động:', error);
  process.exit(1);
});
