import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'; // nhớ cài: npm install bcryptjs
import { UserResponseDto } from '../users/dto/users.dto.response';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/service/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.getUserByEmail(email);
    const isTrue: boolean = await bcrypt.compare(password, user.password);
    if (user && isTrue) {
      return user; // không trả mật khẩu
    }
    return null;
  }

  async login(user: UserResponseDto): Promise<object> {
    const payload: { email: string; name: string } = {
      name: user.name,
      email: user.email,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return {
      accessToken,
      user: {
        payload,
      },
    };
  }
}
