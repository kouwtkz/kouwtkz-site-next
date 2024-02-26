// @ts-check
import { execSync } from "child_process";

/**
 * @typedef { import("./gitType.d").reducedGitItemType } reducedGitItemType
 */

export function getGitLog() {
  try {
    const gitLog = execSync('git log --first-parent main --no-merges --pretty=format:"%ad__,%s" --date=format:"%Y/%m/%d %H:%M:%S"')
    const gitLogList = gitLog.toString().split("\n").map(v => v.split("__,"))
      .map(([date, message]) => ({ date: new Date(date), message }))
      .map(({ date, message }) => ({ ymd: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`, date, message }));
    /** @type { reducedGitItemType[] } */
    const gitLogReduced = [];
    gitLogList.forEach(({ ymd, message }) => {
      const found = gitLogReduced.find(a => a.date === ymd);
      if (found) {
        if (found.messages.every(m => m !== message)) found.messages.push(message);
      }
      else gitLogReduced.push({ date: ymd, messages: [message] });
    });
    gitLogReduced.forEach(log => {
      log.messages.sort((a, b) => b.length < 8 ? -1 : 0)
    })
    return gitLogReduced;
  } catch (e) {
    console.log(e);
    return null;
  }
}