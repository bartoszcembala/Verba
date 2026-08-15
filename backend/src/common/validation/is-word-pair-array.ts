import { registerDecorator, type ValidationArguments, type ValidationOptions } from "class-validator";

export function IsWordPairArray(validationOptions?: ValidationOptions): PropertyDecorator {
  return (target, propertyKey) => {
    registerDecorator({
      name: "isWordPairArray",
      target: target.constructor,
      propertyName: propertyKey.toString(),
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          return Array.isArray(value) && value.every(
            (pair) => Array.isArray(pair)
              && pair.length === 2
              && pair.every((entry) => typeof entry === "string" && entry.trim().length > 0 && entry.length <= 240),
          );
        },
        defaultMessage({ property }: ValidationArguments): string {
          return `${property} must contain two-item string pairs`;
        },
      },
    });
  };
}
