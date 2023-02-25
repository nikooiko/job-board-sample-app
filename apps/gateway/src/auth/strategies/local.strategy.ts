import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { SvcUsersService } from '@app/extra/svc-users/services/svc-users.service';
import { AccessTokenDataDto } from '../dto/access-token-data.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: SvcUsersService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<AccessTokenDataDto> {
    const user = await this.usersService.validateCredentials({
      email,
      password,
    });
    return {
      id: user.id,
    };
  }
}
