// @ts-check
import CopyDirDiff from "../scripts/CopyDirDiff.mjs";
import { UpdateImageYaml } from "./YamlImageFunctions.mjs";
import { fromto } from "./UpdateOption.mjs";

// yamlを管理するメディアディレクトリ
UpdateImageYaml({ ...fromto });

// 音楽ファイルのコピー
CopyDirDiff("_data/sound", "public", { identical: true, ignore: "_data.yaml" })

console.log("メディアの更新しました");