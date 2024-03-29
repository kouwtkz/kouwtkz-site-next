// @ts-check

import isStatic from "../app/context/system/isStatic.mjs";
if (!isStatic) process.exit();

import { GetMediaImageAlbums, UpdateImageYaml } from "../mediaScripts/YamlImageFunctions.mjs";
import { fromto } from "./UpdateOption.mjs";
await UpdateImageYaml({ ...fromto });

const cwd = `${process.cwd()}/${process.env.ROOT || ""}`;
const outputDir = process.env.DIST_DIR || "out";
const publicDir = "public";

import CopyDirDiff from "../scripts/CopyDirDiff.mjs";
CopyDirDiff(`${publicDir}/_media`, outputDir, { identical: true })
CopyDirDiff(`${publicDir}/sound`, outputDir, { identical: true })
CopyDirDiff(`${publicDir}/embed`, outputDir, { identical: true })

import { GetStateText, GetUpdateDef } from "../app/context/start/GetStateText.mjs";
import { resolve } from "path";
import { writeFileSync } from "fs";

import { getCharaObjectFromYaml } from "../app/character/CharaDataFunction.mjs";
import { MarkdownDataObject } from "../app/context/md/MarkdownData.mjs";
import { getSiteData } from "../app/context/site/SiteData.mjs";
import { soundAlbum } from "../app/sound/MediaSoundData.mjs";
import { getPostsFromYaml } from "../app/blog/posts.json/postDataFunction.mjs";
import getPosts from "../app/blog/functions/getPosts.mjs";
import { GenerateRss, GetPostsRssOption } from "../app/blog/functions/GeneratePosts.mjs";
import { getGitLog } from "../app/context/git/log.mjs";

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

writeJsonOut("character", getCharaObjectFromYaml());
writeJsonOut("md", MarkdownDataObject("client"));
writeJsonOut("image", await GetMediaImageAlbums({ ...fromto, readSize: true, filter: { archive: false } }));
writeJsonOut("site", getSiteData());
writeJsonOut("sound", soundAlbum);
writeJsonOut("git", getGitLog());

const rawPosts = getPostsFromYaml();
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
