// @ts-check

const ROOT = process.env.ROOT || "";
import RunProcess from '../scripts/RunProcess.mjs';
export async function MediaUpdate() {
  const cd = ROOT ? `cd ${ROOT} && ` : "";
  return RunProcess(cd + "node -r dotenv/config ./mediaScripts/MediaUpdate.mjs", true)
}
