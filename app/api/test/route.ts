import { NextResponse } from "next/server"
import { exec } from "child_process"

const command = new Promise((callback) => {
  exec("pwd; ls", (err, stdout, stderr) => {
    if (err) callback(err);
    console.log(stdout);
    callback(stdout);
  })
})

export async function GET(req: Request) {
  return NextResponse.json(await command);
}