import { IsOptional } from 'class-validator';
import { IsGreaterThan } from './is-greater-than.decorator';
import { dtoTestCase } from '@app/testing/dto/dto-test-case';

class GreaterThanDto {
  @IsOptional()
  readonly minValue?: number;

  @IsGreaterThan('minValue')
  @IsOptional()
  readonly greaterValue?: number;
}

describe('IsGreaterThan', () => {
  dtoTestCase(
    GreaterThanDto,
    'should pass when value is missing',
    {},
    { expectedOutput: {} },
  );
  dtoTestCase(
    GreaterThanDto,
    'should pass when related value is missing',
    { greaterValue: 10 },
    { expectedOutput: { greaterValue: 10 } },
  );
  dtoTestCase(
    GreaterThanDto,
    'should pass when related value is null',
    { minValue: null, greaterValue: 10 },
    { expectedOutput: { minValue: null, greaterValue: 10 } },
  );
  dtoTestCase(
    GreaterThanDto,
    'should pass when given value is not a number',
    { greaterValue: 'not a number' },
    { expectedOutput: { greaterValue: NaN } },
  );
  dtoTestCase(
    GreaterThanDto,
    'should pass when value is greater than related one',
    { minValue: 5, greaterValue: 10 },
    { expectedOutput: { minValue: 5, greaterValue: 10 } },
  );
  dtoTestCase(
    GreaterThanDto,
    'should throw error when value is lower than the related one',
    { minValue: 3, greaterValue: 2 },
    {
      expectedErrors: [{ field: 'greaterValue', errorType: 'isGreaterThan' }],
    },
  );
});
