import { GetStateText } from "@/app/context/start/GetStateText.mjs";

const isStatic = process.env.OUTPUT_MODE === "export";
export const dynamic = isStatic ? "auto" : "force-dynamic";

export async function GET() {
  return new Response(GetStateText(), {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

