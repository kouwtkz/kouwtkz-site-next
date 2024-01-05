import GetStateText from "@/app/context/update/GetStateText.mjs";

export async function GET() {
  return new Response(GetStateText(), {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

