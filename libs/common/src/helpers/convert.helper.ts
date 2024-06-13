import * as dateFns from 'date-fns';

export function convertDateToISOFormat(date: Date) {
  return dateFns.format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
}
