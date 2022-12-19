/**
 * Column definition packet "Field detail" flag value
 * @see https://mariadb.com/kb/en/library/resultset/#field-detail-flag
 */

export enum FieldDetail {

  //field cannot be null
  NOT_NULL = 1,

  //field is a primary key
  PRIMARY_KEY = 2,

  //field is unique
  UNIQUE_KEY = 4,

  //field is in a multiple key
  MULTIPLE_KEY = 8,

  //is this field a Blob
  BLOB = 1 << 4,

  //	is this field unsigned
  UNSIGNED = 1 << 5,

  //is this field a zerofill
  ZEROFILL_FLAG = 1 << 6,

  //whether this field has a binary collation
  BINARY_COLLATION = 1 << 7,

  //Field is an enumeration
  ENUM = 1 << 8,

  //field auto-increment
  AUTO_INCREMENT = 1 << 9,

  //field is a timestamp value
  TIMESTAMP = 1 << 10,

  //field is a SET
  SET = 1 << 11,

  //field doesn't have default value
  NO_DEFAULT_VALUE_FLAG = 1 << 12,

  //field is set to NOW on UPDATE
  ON_UPDATE_NOW_FLAG = 1 << 13,

  //field is num
  NUM_FLAG = 1 << 14,
}

//	field cannot be null
export const NOT_NULL = 1;
//	field is a primary key
export const PRIMARY_KEY = 2;
//field is unique
export const UNIQUE_KEY = 4;
//field is in a multiple key
export const MULTIPLE_KEY = 8;
//is this field a Blob
export const BLOB = 1 << 4;
//	is this field unsigned
export const UNSIGNED = 1 << 5;
//is this field a zerofill
export const ZEROFILL_FLAG = 1 << 6;
//whether this field has a binary collation
export const BINARY_COLLATION = 1 << 7;
//Field is an enumeration
export const ENUM = 1 << 8;
//field auto-increment
export const AUTO_INCREMENT = 1 << 9;
//field is a timestamp value
export const TIMESTAMP = 1 << 10;
//field is a SET
export const SET = 1 << 11;
//field doesn't have default value
export const NO_DEFAULT_VALUE_FLAG = 1 << 12;
//field is set to NOW on UPDATE
export const ON_UPDATE_NOW_FLAG = 1 << 13;
//field is num
export const NUM_FLAG = 1 << 14;
