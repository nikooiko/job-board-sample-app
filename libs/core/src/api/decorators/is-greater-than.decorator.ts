import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { applyDecorators } from '@nestjs/common';

export function IsGreaterThan(
  relatedProp: string,
  options?: ValidationOptions,
) {
  return applyDecorators(function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isGreaterThan',
      target: object.constructor,
      propertyName,
      constraints: [relatedProp],
      options,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof value !== 'number' ||
            typeof relatedValue !== 'number' ||
            value >= relatedValue
          );
        },
        defaultMessage() {
          return '$property should be larger than $constraint1';
        },
      },
    });
  });
}
