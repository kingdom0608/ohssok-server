import { Transform, TransformFnParams } from 'class-transformer';
import {
  isEnum,
  isString,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function TrimString() {
  return Transform((params: TransformFnParams) => {
    if (params.value) {
      return params.value.trim();
    }
    return params.value;
  });
}

export function IsEnumString<T>(
  targetEnum: T,
  targetEnumName: string,
  validationOptions?: ValidationOptions,
) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'IsEnumStringDecorator',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean =>
          isString(value) && isEnum(value, targetEnum),
        defaultMessage: (validationArguments?: ValidationArguments): string =>
          `${validationArguments.property} 는 ${targetEnumName} 타입이 아닙니다.`,
      },
    });
  };
}

export function IsEnumArrayString<T>(
  targetEnum: T,
  targetEnumName: string,
  validationOptions?: ValidationOptions,
) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'IsEnumArrayStringDecorator',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean =>
          isString(value) &&
          value
            .split(',')
            .reduce((acc, prev) => isEnum(prev, targetEnum) && acc, true),
        defaultMessage: (validationArguments?: ValidationArguments): string =>
          `${validationArguments.property} 는 ${targetEnumName} 타입이 아닙니다.`,
      },
    });
  };
}
