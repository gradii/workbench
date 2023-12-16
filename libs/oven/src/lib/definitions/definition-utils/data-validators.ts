import { NotValidError } from '../../workflow/data/exception';

export function stringValidator(data: any): boolean {
  if (!data) {
    return true;
  }

  const type = typeof data;
  if (type === 'string' || type === 'number' || type === 'boolean') {
    return true;
  }

  throw new NotValidError('String data is not valid');
}
