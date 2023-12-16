// Return object value by checking deep path splitted by dots (`first.second.third`)
export function getDeepValue(object: any, path: string): any {
  const pathParts = path.split('.');
  let result = object;
  for (const part of pathParts) {
    if (!result) {
      return null;
    }
    result = result[part];
  }
  return result;
}

// make deep copy with new value
export function extendDeepValue(object: any, path: string, value: any) {
  const copy = JSON.parse(JSON.stringify(object));

  const pathParts = path.split('.');
  const lastPart = pathParts.pop();

  let result = copy;
  for (const part of pathParts) {
    if (!result[part]) {
      result[part] = {};
    }
    result = result[part];
  }
  result[lastPart] = value;

  return copy;
}
