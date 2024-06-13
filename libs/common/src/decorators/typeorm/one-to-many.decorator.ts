import { getMetadataArgsStorage, ObjectType, RelationOptions } from 'typeorm';
import type { RelationMetadataArgs } from 'typeorm/metadata-args/RelationMetadataArgs';

/** Source: https://github.com/typeorm/typeorm/blob/master/src/decorator/relations/OneToMany.ts */
/** Override options.createForeignKeyConstraints to false. */
export function OneToMany<T>(
  typeFunctionOrTarget: string | ((type?: any) => ObjectType<T>),
  inverseSide: string | ((object: T) => any),
  options?: RelationOptions,
): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    if (!options) options = {} as RelationOptions;

    // Now try to determine if it is a lazy relation.
    let isLazy = options && options.lazy === true;
    if (!isLazy && Reflect && (Reflect as any).getMetadata) {
      // automatic determination
      const reflectedType = (Reflect as any).getMetadata(
        'design:type',
        object,
        propertyName,
      );
      if (
        reflectedType &&
        typeof reflectedType.name === 'string' &&
        reflectedType.name.toLowerCase() === 'promise'
      )
        isLazy = true;
    }
    options.createForeignKeyConstraints = false; // MODIFIED

    getMetadataArgsStorage().relations.push({
      target: object.constructor,
      propertyName: propertyName,
      // propertyType: reflectedType,
      isLazy: isLazy,
      relationType: 'one-to-many',
      type: typeFunctionOrTarget,
      inverseSideProperty: inverseSide,
      options: options,
    } as RelationMetadataArgs);
  };
}
