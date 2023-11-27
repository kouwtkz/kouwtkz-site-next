export const rootPath = process.cwd();

export function setPath(path: string) {
  return path.replace(/^@/, rootPath);
}
