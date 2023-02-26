import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiAppForbiddenResponse } from '@app/core/error-handling/decorators/api-app-forbidden-response.decorator';
import { HasOwnerIdGuard } from '@app/extra/ownership/guards/has-owner-id.guard';

/**
 * Applies guard that checks whether owner ID header is present and valid.
 */
export function OwnerIdGuard() {
  return applyDecorators(ApiAppForbiddenResponse(), UseGuards(HasOwnerIdGuard));
}
