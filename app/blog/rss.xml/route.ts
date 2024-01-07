import generateRss from "./generateRss";

export async function GET() {
  return new Response(generateRss(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
