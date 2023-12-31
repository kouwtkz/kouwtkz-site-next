// @ts-check

import isStatic from "../app/components/System/isStatic.mjs";
if (!isStatic) process.exit();

import { MediaUpdate } from "./MediaUpdateModule.mjs"
await MediaUpdate();

const cwd = `${process.cwd()}/${process.env.ROOT || ""}`;
const outputDir = process.env.DIST_DIR || "out";
const publicDir = "public";

import CopyDirDiff from "../scripts/CopyDirDiff.mjs";
CopyDirDiff(`${publicDir}/_media`, outputDir, {identical: true})
CopyDirDiff(`${publicDir}/sound`, outputDir, {identical: true})

import { GetStateText, GetUpdateDef } from "../app/context/update/GetStateText.mjs";
import { resolve } from "path";
import { writeFileSync } from "fs";

import { charaObject } from "../app/character/getCharaData.mjs";
import { GetEmbed } from "../app/context/embed/GetEmbed.mjs"
import { GetMediaImageAlbums } from "../mediaScripts/YamlImageFunctions.mjs";
import { site } from "../app/site/SiteData.mjs";
import { soundAlbum } from "../app/sound/MediaSoundData.mjs";
import { getPostsFromJson } from "../app/blog/posts.json/fromJson.mjs";
import getPosts from "../app/blog/functions/getPosts.mjs";
import { GenerateRss, GetPostsRssOption } from "../app/blog/functions/GeneratePosts.mjs";

const updateDef = GetUpdateDef();
/** @type { Map<string, string> } */
const jsonOutPathMap = new Map(Object.entries(updateDef).map(v => [v[0], v[1] ? resolve(`${cwd}/${outputDir}/${v[1].json}`) : ""]));
/**
 * @param { string } key
 * @param { object } obj
 */
function writeJsonOut(key, obj) {
  const jsonOutPath = jsonOutPathMap.get(key);
  const jsonStr = JSON.stringify(obj);
  if (jsonOutPath) writeFileSync(jsonOutPath, jsonStr)
}

console.log("簡易ビルド中…");

writeJsonOut("character", charaObject);
writeJsonOut("embed", GetEmbed());
writeJsonOut("image", GetMediaImageAlbums({ from: "_data/_media", to: "_media", filter: { archive: false } }));
writeJsonOut("site", site);
writeJsonOut("sound", soundAlbum);

const rawPosts = getPostsFromJson();
const { posts } = getPosts({ posts: rawPosts, common: isStatic })
writeJsonOut("posts", posts);

const rssOutPath = "blog/rss.xml"
const rssOutFullPath = resolve(`${cwd}/${outputDir}/${rssOutPath}`)
const rssText = GenerateRss(GetPostsRssOption(rawPosts));
writeFileSync(rssOutFullPath, rssText)

const updateDefOutPath = "data/update.txt"
const updateDefOutFullPath = resolve(`${cwd}/${outputDir}/${updateDefOutPath}`)
const updateDefText = GetStateText(updateDef);
writeFileSync(updateDefOutFullPath, updateDefText)

console.log("簡易ビルドしました");
