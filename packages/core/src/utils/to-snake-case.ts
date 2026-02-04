export const toSnakeCase = (str: string): string =>
  str
    .trim()
    .replace(/[\s-]+/g, "_")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .replace(/([a-z\d])([A-Z])/g, "$1_$2")
    .toLocaleLowerCase();
