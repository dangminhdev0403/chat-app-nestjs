import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserResponseDto } from '../../users/dto/users.dto.response';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' }); // dùng email thay vì username
  }
  async validate(email: string, password: string): Promise<UserResponseDto> {
    Logger.log(`LocalStrategy.validate: email1=${email}`);
    const userDB = await this.authService.validateUser(email, password);

    const user: UserResponseDto = new UserResponseDto(
      userDB.name,
      userDB.email,
    );
    Logger.log(`LocalStrategy.validate success: user=${JSON.stringify(user)}`);

    return user; // trả về email để sử dụng trong AuthService.login
  }
}
