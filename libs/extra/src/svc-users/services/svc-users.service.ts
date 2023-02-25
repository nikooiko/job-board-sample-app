import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import svcUsersConfig from '../config/svc-users.config';
import { UserDto } from '@app/extra/svc-users/dto/user.dto';
import { CreateUserDto } from '@app/extra/svc-users/dto/create-user.dto';
import { UserCredentialsDto } from '@app/extra/svc-users/dto/user-credentials.dto';
import { wrapSvcRequest } from '@app/core/api/utils/wrap-svc-request.util';

@Injectable()
export class SvcUsersService {
  public apiUrl: string;

  constructor(
    @Inject(svcUsersConfig.KEY)
    private readonly config: ConfigType<typeof svcUsersConfig>,
    private readonly httpService: HttpService,
  ) {
    this.apiUrl = `${config.rootUrl}/private/api/v1/users-svc/users`;
  }

  create(data: CreateUserDto): Promise<UserDto> {
    return wrapSvcRequest<UserDto>(
      this.httpService.post<UserDto>(this.apiUrl, data),
    );
  }

  findOne(id: string): Promise<UserDto> {
    return wrapSvcRequest<UserDto>(
      this.httpService.get(`${this.apiUrl}/${id}`),
    );
  }

  validateCredentials(data: UserCredentialsDto): Promise<UserDto> {
    return wrapSvcRequest<UserDto>(
      this.httpService.post<UserDto>(
        `${this.apiUrl}/validate-credentials`,
        data,
      ),
    );
  }
}
