import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTDecoded } from '../../../utils/response/response';
import { UserResponseDto } from '../../users/dto/users.dto.response';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    } as {
      jwtFromRequest: (req: any) => string | null;
      ignoreExpiration: boolean;
      secretOrKey: string;
    });
  }

  async validate(payload: JWTDecoded): Promise<UserResponseDto> {
    Logger.log(`JwtStrategy.validate jwt success: ${JSON.stringify(payload)}`);
    const userDB = await this.authService.validateUserJWTDecoded(payload.email);
    const user: UserResponseDto = new UserResponseDto(
      userDB.name,
      userDB.email,
    );
    Logger.log(`Save user to request: user=${JSON.stringify(user)}`);
    return user;
  }
}
