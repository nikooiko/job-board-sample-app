import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { APP_OWNER_ID_HEADER } from '@app/extra/ownership/constants/app-owner-id-header.constant';

export function ApiAppOwnerIdHeader() {
  return applyDecorators(
    ApiHeader({
      name: APP_OWNER_ID_HEADER,
      description:
        'This header must contain the ID of the user who owns the resource',
    }),
  );
}
