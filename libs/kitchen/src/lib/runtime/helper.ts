export type Constructor<T> = new(...args: any[]) => T;

export function escapeHtml(text: string): string {
  const escapedText: {[k: string]: string} = {
    '&': '&a;',
    '"': '&q;',
    '\'': '&s;',
    '<': '&l;',
    '>': '&g;',
  };
  return text.replace(/[&"'<>]/g, s => escapedText[s]);
}


export function unescapeHtml(text: string): string {
  const unescapedText: {[k: string]: string} = {
    '&a;': '&',
    '&q;': '"',
    '&s;': '\'',
    '&l;': '<',
    '&g;': '>',
  };
  return text.replace(/&[^;]+;/g, s => unescapedText[s]);
}