/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { User } from '../users/schemas/user.schema';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard) // <-- Guard dùng chiến lược 'local' - xác thực bằng email và password
  @Post('login')
  async login(@Request() req: { user: User }): Promise<any> {
    return await this.authService.login(req.user); // req.user là user đã được xác thực
  }
}
