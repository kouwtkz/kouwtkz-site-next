// @ts-check

import CopyDirDiff from "./CopyDirDiff.mjs";
import { UpdateImageYaml } from "./YamlImageFunctions.mjs";

// yamlを管理するメディアディレクトリ
UpdateImageYaml({ from: "_data/_media", to: "_media" });

// 音楽ファイルのコピー
CopyDirDiff("_data/sound", "public", {identical: true})
