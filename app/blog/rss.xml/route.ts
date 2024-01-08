import isStatic from "@/app/components/System/isStatic.mjs";
export const dynamic = isStatic ? "auto" : "force-dynamic";

import { MakeRss } from "../functions/GeneratePosts.mjs";

export async function GET() {
  return new Response(MakeRss(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
