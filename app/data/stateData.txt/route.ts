import GetStateText from "../State/GetStateText.mjs";

export async function GET() {
  return new Response(GetStateText(), {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

