import { parse } from "yaml";
import { readFileSync } from "fs";

/**
 * @typedef { import("./SiteDataType.d.js").SiteDataType } SiteDataType
 * @typedef { import("./SiteDataType.d.js").SiteAuthorType } SiteAuthorType
 * @typedef { import("./SiteDataType.d.js").SiteMenuItemType } SiteMenuItemType
 * @typedef { import("./SiteDataType.d.js").SiteSnsItemType } SiteSnsItemType
 */

const cwd = `${process.cwd()}/${process.env.ROOT || ""}`;
const dataDir = process.env.DATA_DIR || "";

/** @type any */
let rawData = {}
try {
  rawData = parse(readFileSync(`${cwd}/${dataDir}/site.yaml`, "utf8"));
} catch (e) {
  console.error(e);
  rawData = { title: "title", description: "description", short: { description: "short" }, author: { since: 2023 } }
}


/** @type SiteDataType */
const site = rawData;

export { site };