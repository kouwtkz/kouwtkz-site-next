import RunProcess from '@/scripts/RunProcess.mjs';
export async function MediaUpdate() {
  return await RunProcess("node -r dotenv/config ./MediaScripts/MediaUpdate.mjs")
}
