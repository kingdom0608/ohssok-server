import { ColumnOptions, Column } from 'typeorm';
import { convertDateToISOFormat } from '@app/common/helpers';

const commonConfiguration = (): ColumnOptions => ({
  type: 'datetime',
  precision: 6,
  transformer: {
    from: (value) =>
      value instanceof Date ? convertDateToISOFormat(value) : value,
    to: (value) => value,
  },
});

export function CreateDateColumn(options?: ColumnOptions): PropertyDecorator {
  const columnOptions: ColumnOptions = {
    ...options,
    ...commonConfiguration(),
    default: () => 'CURRENT_TIMESTAMP(6)',
  };
  return Column(columnOptions);
}

export function UpdateDateColumn(options?: ColumnOptions): PropertyDecorator {
  const columnOptions: ColumnOptions = {
    ...options,
    ...commonConfiguration(),
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    nullable: true,
  };
  return Column(columnOptions);
}

export function DateColumn(options?: ColumnOptions): PropertyDecorator {
  const columnOptions: ColumnOptions = {
    ...options,
    ...commonConfiguration(),
  };
  return Column(columnOptions);
}
