import { NextRequest, NextResponse } from "next/server";
import isStatic from "@/app/components/System/isStatic.mjs";
const isServerMode = !(isStatic && process.env.NODE_ENV === "production")
import { getCharaObjectFromYaml, setCharaObjectToYaml } from "../CharaDataFunction.mjs";
import { GetYamlImageList, UpdateImageYaml } from "@/mediaScripts/YamlImageFunctions.mjs";
import { fromto } from "@/mediaScripts/UpdateOption.mjs";
import { CharaType } from "../CharaType";

export async function GET() {
  return new Response("");
}

export async function POST(req: NextRequest) {
  const res = { message: "", update: { chara: false, image: false } };
  if (!isServerMode) {
    res.message = "サーバーモード限定です";
    return NextResponse.json(res, { status: 403 });
  }
  const charaList = Object.entries(getCharaObjectFromYaml(false));
  const formData = await req.formData();
  const target = formData.get("target")?.toString();
  if (target) formData.delete("target");
  const id = formData.get("id")?.toString();
  if (target) formData.delete("id");
  const charaIndex = target ? charaList.findIndex(([key]) => key === target) : -1;
  const chara = charaIndex >= 0 ? charaList[charaIndex][1] : {} as CharaType;
  const formArray: { key: string, value: string | string[] }[] = [];
  formData.forEach((value, key) => {
    value = value.toString();
    if (key.endsWith("[]")) {
      const _key = key.slice(0, -2);
      const found = formArray.find(({ key }) => key === _key);
      if (found) {
        if (Array.isArray(found.value)) found.value.push(value);
        else found.value = [found.value, value];
      } else formArray.push({ key: _key, value: [value] });
    } else {
      formArray.push({ key, value })
    }
    return formArray;
  })
  formArray.forEach(({ key, value }) => {
    if (value !== "") {
      chara[key] = value;
    } else {
      delete chara[key];
    }
  })
  if (id) {
    if (charaIndex >= 0) {
      charaList[charaIndex][0] = id;
      const yamls = await GetYamlImageList({ ...fromto, readImage: false, filter: { listup: true } });
      const symls = yamls.filter(({ data }) => data.list?.some(({ tags }) => tags?.some(t => t === target)))
      symls.forEach(({ data }) => data.list?.forEach(({ tags }) => {
        if (tags) {
          const i = tags.findIndex(t => t === target);
          if (i >= 0) tags[i] = id;
        }
      }))
      res.update.image = true;
      await UpdateImageYaml({ yamls: symls, deleteImage: false, ...fromto })
    }
    else charaList.push([id, chara]);
  }
  setCharaObjectToYaml(Object.fromEntries(charaList));
  res.update.chara = true;
  res.message = "更新に成功しました";
  return NextResponse.json(res);
}
