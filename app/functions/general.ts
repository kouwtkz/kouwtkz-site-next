export const rootPath = process.cwd();

export function setPath(path: string) {
  return path.replace(/^@/, rootPath);
}

export function getUrlFromPath(path: string) {
  if (path.startsWith('@')) {
    path = path.slice(1);
  } else if (path.startsWith(rootPath)) {
    path = path.replace(rootPath, '');
  } else {
    return path;
  }
  return path.replace(/^\/public/, '');
}

export const currentDate = new Date();
