import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiAppBadRequestResponse } from '@app/core/error-handling/decorators/api-app-bad-request-response.decorator';
import { ApiAppNotFoundResponse } from '@app/core/error-handling/decorators/api-app-not-found-response.decorator';
import { UsersService } from '../services/users.service';
import { UserDto } from '@app/extra/svc-users/dto/user.dto';
import { CreateUserDto } from '@app/extra/svc-users/dto/create-user.dto';
import { UserCredentialsDto } from '@app/extra/svc-users/dto/user-credentials.dto';
import { ApiAppUnauthorizedResponse } from '@app/core/error-handling/decorators/api-app-unauthorized-response.decorator';
import { UUIDParam } from '@app/core/api/decorators/uuid-param.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Creates a new user',
  })
  @ApiCreatedResponse({ type: UserDto })
  @ApiAppBadRequestResponse()
  create(@Body() data: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(data);
  }

  @Post('validate-credentials')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Validates user's credentials",
  })
  @ApiOkResponse({ type: UserDto })
  @ApiAppUnauthorizedResponse()
  @ApiAppBadRequestResponse()
  validateCredentials(@Body() data: UserCredentialsDto): Promise<UserDto> {
    return this.usersService.validateCredentials(data);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Returns the corresponding user',
  })
  @ApiOkResponse({ type: UserDto })
  @ApiAppNotFoundResponse()
  findOne(@UUIDParam() id: string): Promise<UserDto> {
    return this.usersService.findOne({ id });
  }
}
