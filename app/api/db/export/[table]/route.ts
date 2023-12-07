import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma";

export async function GET(request: Request, { params }: {
  params: { [key: string]: string };
}) {
  if (process.env.NODE_ENV === "development") {
    switch (params.table.toLocaleLowerCase()) {
      case "post":
        return NextResponse.json(await prisma.post.findMany());
      case "user":
        return NextResponse.json(await prisma.user.findMany());
      case "userremember":
        return NextResponse.json(await prisma.userRemember.findMany());
    }
  } else {
    return NextResponse.json("")
  }
}