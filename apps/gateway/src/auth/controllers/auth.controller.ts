import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ConfigType } from '@nestjs/config';
import { ApiAppUnauthorizedResponse } from '@app/core/error-handling/decorators/api-app-unauthorized-response.decorator';
import { ApiAppBadRequestResponse } from '@app/core/error-handling/decorators/api-app-bad-request-response.decorator';
import { Response } from 'express';
import authConfig from '../config/auth.config';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';
import { AuthUser } from '../decorators/auth-user.decorator';
import { AUTH_COOKIE_NAME } from '../constants/auth-cookie-name.constant';
import { AuthGuard } from '../decorators/auth-guard.decorator';
import { AccessTokenDataDto } from '../dto/access-token-data.dto';
import { CreateUserDto } from '@app/extra/svc-users/dto/create-user.dto';
import { UserCredentialsDto } from '@app/extra/svc-users/dto/user-credentials.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(authConfig.KEY)
    public readonly config: ConfigType<typeof authConfig>,
    private authService: AuthService,
  ) {}

  @Post('register')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Registers user.',
  })
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiCreatedResponse()
  @ApiAppBadRequestResponse()
  async register(
    @Body() data: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.register(data);
    this.authService.setCookie(res, accessToken);
  }

  @Post('login')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Authenticates the user.',
  })
  @ApiBody({
    description: 'Credentials',
    type: UserCredentialsDto,
  })
  @ApiNoContentResponse()
  @ApiAppUnauthorizedResponse()
  @ApiAppBadRequestResponse()
  @UseGuards(LocalAuthGuard)
  async login(
    @AuthUser() user: AccessTokenDataDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.login(user);
    this.authService.setCookie(res, accessToken);
  }

  @Post('logout')
  @HttpCode(204)
  @ApiOperation({
    summary: "Ends user's session.",
  })
  @ApiNoContentResponse()
  @AuthGuard()
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(AUTH_COOKIE_NAME);
  }
}
