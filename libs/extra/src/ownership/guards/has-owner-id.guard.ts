import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { APP_OWNER_ID_HEADER } from '@app/extra/ownership/constants/app-owner-id-header.constant';
import { AppForbiddenException } from '@app/core/error-handling/exceptions/app-forbidden.exception';

@Injectable()
export class HasOwnerIdGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const ownerId = req.headers[APP_OWNER_ID_HEADER];
    if (!ownerId || typeof ownerId !== 'string') {
      throw new AppForbiddenException(
        'Owner ID is required',
        'owner_id_required',
      );
    }
    req.ownerId = ownerId;
    return true;
  }
}
