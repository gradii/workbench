import { Header } from '../models/route.model';

export const CORSHeaders: Header[] = [
  { key: 'Access-Control-Allow-Origin', value: '*' },
  {
    key: 'Access-Control-Allow-Methods',
    value: 'GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS'
  },
  {
    key: 'Access-Control-Allow-Headers',
    value:
      'Content-Type, Origin, Accept, Authorization, Content-Length, X-Requested-With'
  }
];

export const BINARY_BODY = '#######BINARY-CONTENT#######';

export const MimeTypesWithTemplating = [
  'application/json',
  'text/html',
  'text/css',
  'text/csv',
  'application/javascript',
  'application/typescript',
  'text/plain',
  'application/xhtml+xml',
  'application/xml'
];
