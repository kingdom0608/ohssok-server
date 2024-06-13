import { getMetadataArgsStorage, ObjectType, RelationOptions } from 'typeorm';
import type { RelationMetadataArgs } from 'typeorm/metadata-args/RelationMetadataArgs';

/** Source: https://github.com/typeorm/typeorm/blob/master/src/decorator/relations/OneToOne.ts */
/** Override options.createForeignKeyConstraints to false. */
export function OneToOne<T>(
  typeFunctionOrTarget: string | ((type?: any) => ObjectType<T>),
  inverseSideOrOptions?: string | ((object: T) => any) | RelationOptions,
  options?: RelationOptions,
): PropertyDecorator {
  // normalize parameters
  let inverseSideProperty: string | ((object: T) => any);
  if (typeof inverseSideOrOptions === 'object') {
    options = <RelationOptions>inverseSideOrOptions;
  } else {
    inverseSideProperty = <string | ((object: T) => any)>inverseSideOrOptions;
  }

  return function (object: Object, propertyName: string) {
    if (!options) options = {} as RelationOptions;

    // now try to determine it its lazy relation
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
      relationType: 'one-to-one',
      type: typeFunctionOrTarget,
      inverseSideProperty: inverseSideProperty,
      options: options,
    } as RelationMetadataArgs);
  };
}
