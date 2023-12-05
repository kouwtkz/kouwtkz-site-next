import { charaList, charaObject } from "./getCharaData";
import CharaData from "./CharaData";
import React from "react";
import { getImageItem } from "../media/MediaImageData.mjs";

const CharaDataMake = () => {
  charaList.forEach((chara) => {
    if (!chara.media) chara.media = {};
    if (typeof(chara.icon) === "string" && chara.icon !== "") {
      chara.media.icon = getImageItem({
          filter: { albumName: "charaIcon", pathMatch: chara.icon },
        }) || null;
    }
  });
  return <CharaData charaObject={charaObject} />;
};

export default CharaDataMake;