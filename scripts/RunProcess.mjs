// @ts-check

import { promisify } from 'util';
import childProcess from "child_process";
const exec = promisify(childProcess.exec);

/** @param { string } cmd  */
export default async function RunProcess(cmd) {
  const { stdout, stderr } = await exec(cmd);
  if (stderr) { console.error(stderr); return stderr; }
  else { console.log(stdout); return stdout; }
}
