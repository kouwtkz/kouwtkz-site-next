import { NextRequest, NextResponse } from "next/server";

// 投稿
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const form = Object.fromEntries(formData.entries());
  return NextResponse.json(["POST", form]);
}

// 更新
export async function PATCH(request: NextRequest) {
  const formData = await request.formData();
  const form = Object.fromEntries(formData.entries());
  return NextResponse.json(["PATCH", form]);
}

// 削除
export async function DELETE(request: NextRequest) {
  const data = await request.json();
  return NextResponse.json(["DELETE", data]);
}
