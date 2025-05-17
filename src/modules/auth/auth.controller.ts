/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserResponseDto } from '../users/dto/users.dto.response';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard) // <-- Guard dùng chiến lược 'local' - xác thực bằng email và password
  @Post('login')
  @HttpCode(200) // trả về mã 200 OK
  async login(@Request() req: { user: UserResponseDto }): Promise<object> {
    return await this.authService.login(req.user); // req.user là user đã được xác thực
  }

  @Get('profile')
  getProfile(@Request() req: { user: UserResponseDto }) {
    return req.user;
  }
}
