import { NextResponse } from "next/server"
import { exec } from "child_process"
import { isStatic } from "@/app/functions/general";

async function doCommand() {
  return await new Promise((callback) => {
    const cmds = ["OUTPUT_MODE=export npm run build", "rsync -au -e ssh --size-only --delete ./out/dist/ rs:~/mysite_next_static/dist/"]
    exec(cmds[1], (err, stdout, stderr) => {
      console.log(stdout, err);
      if (err) callback(err);
      callback(stdout);
    })
  })
}

export async function GET(req: Request) {
  if (!isStatic && /\?/.test(req.url)) {
    doCommand();
  }
  return NextResponse.json("");
}