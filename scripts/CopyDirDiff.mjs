// @ts-check

import { mkdirSync, readdirSync, copyFileSync, statSync, rmSync, rmdirSync } from "fs";
import { basename, resolve } from "path";
const cwd = resolve(`${process.cwd()}/${process.env.ROOT || ""}`);

/**
 * @param {string} from
 * @param {string} to
 * @param {import("./CopyDirDiffType").CopyDirOptions} options
 * @returns 
 */
export default function CopyDirDiff(from, to, { identical = false, withDir = true, force = false }) {
  from = from.replace(/[\\/]+/g, "/").replace(/\/$/, "");
  to = (withDir ? to + "/" + basename(from) : to).replace(/[\\/]+/g, "/");
  try { mkdirSync(to, { recursive: true }) } catch { }
  const alreadyDirents = readdirSync(to, { recursive: true, withFileTypes: true })
    .map(dirent => ({ path: resolve(`${dirent.path}/${dirent.name}`), isFile: dirent.isFile() }));
  /** @type {{path: string, isFile: boolean}[]} */
  const outputDirents = [];
  const cwdFrom = resolve(`${cwd}/${from}`);
  readdirSync(cwdFrom, { recursive: true, withFileTypes: true }).forEach(dirent => {
    const cutPath = dirent.path.replace(cwd, "").replace(/[\\/]+/g, "/").replace(/^\//, "");
    const itemFrom = resolve(`${dirent.path}/${dirent.name}`);
    const itemTo = resolve(`${to}/${cutPath.replace(/[\\/]+/g, "/").replace(from, "")}/${dirent.name}`);
    if (identical) outputDirents.push({ path: itemTo, isFile: dirent.isFile() });
    if (dirent.isDirectory()) {
      if (alreadyDirents.every(dirent => dirent.path !== itemTo)) mkdirSync(itemTo);
    } else {
      if (force || alreadyDirents.every(dirent => dirent.path !== itemTo)) {
        copyFileSync(itemFrom, itemTo)
      } else {
        const mtimeFrom = new Date(statSync(itemFrom).mtime);
        const mtimeTo = new Date(statSync(itemTo).mtime);
        if (mtimeFrom.getTime() > mtimeTo.getTime()) copyFileSync(itemFrom, itemTo)
      }
    }
  })
  if (identical) {
    const notfoundList = alreadyDirents.filter(dirent => outputDirents.every(_dirent => dirent.path !== _dirent.path));
    notfoundList.reverse().forEach(dirent => {
      if (dirent.isFile) rmSync(dirent.path);
      else rmdirSync(dirent.path);
    })
  }
}
