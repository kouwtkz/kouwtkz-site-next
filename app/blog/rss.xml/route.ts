import { MakeRss } from "../functions/GeneratePosts.mjs";

export async function GET() {
  return new Response(MakeRss(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
