import { GetStateText } from "@/app/context/start/GetStateText.mjs";

import isStatic from "@/app/context/system/isStatic.mjs";
export const dynamic = isStatic ? "auto" : "force-dynamic";

export async function GET() {
  return new Response(GetStateText(), {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

