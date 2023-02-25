import { dtoTestCase } from '@app/testing/dto/dto-test-case';
import { IsAppEmail } from '@app/core/api/decorators/is-app-email.decorator';
import { IsOptional } from 'class-validator';

class IsAppEmailDto {
  @IsOptional()
  @IsAppEmail()
  readonly email?: string;
}

describe('IsAppEmail', () => {
  dtoTestCase(
    IsAppEmailDto,
    'should pass when value is missing',
    {},
    { expectedOutput: {} },
  );
  dtoTestCase(
    IsAppEmailDto,
    'should pass when value is an email',
    { email: 'valid@email.com' },
    { expectedOutput: { email: 'valid@email.com' } },
  );
  dtoTestCase(
    IsAppEmailDto,
    'should pass and lowercase when value is an email',
    { email: 'valId@emAil.com' },
    { expectedOutput: { email: 'valid@email.com' } },
  );
  dtoTestCase(
    IsAppEmailDto,
    'should throw error when value is not a string',
    { email: NaN },
    {
      expectedErrors: [{ field: 'email', errorType: 'isEmail' }],
    },
  );
  dtoTestCase(
    IsAppEmailDto,
    'should throw error when value is not a valid email',
    { email: 'something-else' },
    {
      expectedErrors: [{ field: 'email', errorType: 'isEmail' }],
    },
  );
});
