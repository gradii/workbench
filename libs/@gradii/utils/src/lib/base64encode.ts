
function utf8Encode(str) {
  var encoded = '';
  for (var index = 0; index < str.length; index++) {
    var codePoint = str.charCodeAt(index);
    // decode surrogate
    // see https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
    if (codePoint >= 0xd800 && codePoint <= 0xdbff && str.length > (index + 1)) {
      var low = str.charCodeAt(index + 1);
      if (low >= 0xdc00 && low <= 0xdfff) {
        index++;
        codePoint = ((codePoint - 0xd800) << 10) + low - 0xdc00 + 0x10000;
      }
    }
    if (codePoint <= 0x7f) {
      encoded += String.fromCharCode(codePoint);
    } else if (codePoint <= 0x7ff) {
      encoded += String.fromCharCode(((codePoint >> 6) & 0x1F) | 0xc0, (codePoint & 0x3f) | 0x80);
    } else if (codePoint <= 0xffff) {
      encoded += String.fromCharCode((codePoint >> 12) | 0xe0, ((codePoint >> 6) & 0x3f) | 0x80, (codePoint & 0x3f) | 0x80);
    } else if (codePoint <= 0x1fffff) {
      encoded += String.fromCharCode(((codePoint >> 18) & 0x07) | 0xf0, ((codePoint >> 12) & 0x3f) | 0x80, ((codePoint >> 6) & 0x3f) | 0x80, (codePoint & 0x3f) | 0x80);
    }
  }
  return encoded;
}

var B64_DIGITS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function toBase64Digit(value) {
  if (value < 0 || value >= 64) {
    throw new Error('Can only encode value in the range [0, 63]');
  }
  return B64_DIGITS[value];
}

export function toBase64String(value) {
  let b64 = '';
  value = utf8Encode(value);
  for (var i = 0; i < value.length;) {
    var i1 = value.charCodeAt(i++);
    var i2 = value.charCodeAt(i++);
    var i3 = value.charCodeAt(i++);
    b64 += toBase64Digit(i1 >> 2);
    b64 += toBase64Digit(((i1 & 3) << 4) | (isNaN(i2) ? 0 : i2 >> 4));
    b64 += isNaN(i2) ? '=' : toBase64Digit(((i2 & 15) << 2) | (i3 >> 6));
    b64 += isNaN(i2) || isNaN(i3) ? '=' : toBase64Digit(i3 & 63);
  }
  return b64;
}
