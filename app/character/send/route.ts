import { NextRequest } from "next/server";
import isStatic from "@/app/components/System/isStatic.mjs";
const isServerMode = !(isStatic && process.env.NODE_ENV === "production")
import { resolve } from "path";
import { mkdirSync, renameSync, unlinkSync } from "fs";
import { getCharaObjectFromYaml, setCharaObjectToYaml } from "../CharaDataFunction.mjs";
import { CharaType } from "../CharaType";
const cwd = `${process.cwd()}/${process.env.ROOT || ""}`;

export async function GET() {
  return new Response("");
}

export async function POST(req: NextRequest) {
  if (!isServerMode) return new Response("サーバーモード限定です", { status: 403 });
  const charaObject = getCharaObjectFromYaml(false);
  const formData = await req.formData();
  const target = formData.get("target")?.toString();
  if (target) formData.delete("target");
  const charaCheck = target && target in charaObject;
  const chara = charaCheck ? charaObject[target] : {} as CharaType;
  formData.forEach((value, key) => {
    chara[key] = value;
  })
  if (!charaCheck) charaObject[chara.id] = chara;
  setCharaObjectToYaml(charaObject);
  return new Response("");
}
