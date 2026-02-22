import path from "path";

export const normalizePath = (p: string): string => {
  if (p === "") return "";
  return path.normalize(p).replace(/\\/g, "/");
};
