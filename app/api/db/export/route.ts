import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "development") {
    const table = request.nextUrl.searchParams.get("table");
    switch (table?.toLocaleLowerCase()) {
      case "post":
        return NextResponse.json(await prisma.post.findMany());
      case "user":
        return NextResponse.json(await prisma.user.findMany());
      case "userremember":
        return NextResponse.json(await prisma.userRemember.findMany());
    }
  }
  return NextResponse.json("")
}
