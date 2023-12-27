import { NextResponse } from "next/server"

import { charaList, charaObject } from "@/app/character/getCharaData";
import { getImageItem } from "../../media/image/MediaImageData.mjs";

export async function GET() {
  charaList.forEach((chara) => {
    if (!chara.media) chara.media = {};
    if (typeof(chara.icon) === "string" && chara.icon !== "") {
      chara.media.icon = getImageItem({
          filter: { albumName: "charaIcon", pathMatch: chara.icon },
        }) || null;
    }
  });
  return NextResponse.json(charaObject);
}
