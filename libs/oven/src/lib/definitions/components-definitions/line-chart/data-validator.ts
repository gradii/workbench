import { validate } from 'jsonschema';
import dataSchema from './data-schema.json';
import { NotValidError } from '../../../workflow/data/exception';

export function dataValidator(data) {
  if (!data) {
    return true;
  }

  const result = validate(data, dataSchema);
  if (!result.valid) {
    throw new NotValidError('Chart data is not valid');
  }
  return result.valid;
}
