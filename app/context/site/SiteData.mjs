import { parse } from "yaml";
import { readFileSync } from "fs";

/**
 * @typedef { import("./SiteDataType.d").SiteDataType } SiteDataType
 * @typedef { import("./SiteDataType.d").SiteAuthorType } SiteAuthorType
 * @typedef { import("./SiteDataType.d").SiteMenuItemType } SiteMenuItemType
 * @typedef { import("./SiteDataType.d").SiteSnsItemType } SiteSnsItemType
 */

const cwd = `${process.cwd()}/${process.env.ROOT || ""}`;
const dataDir = process.env.DATA_DIR || "";

/** @returns { SiteDataType } */
export function getSiteData() {
  /** @type any */
  let rawData = {}
  try {
    rawData = parse(readFileSync(`${cwd}/${dataDir}/site.yaml`, "utf8"));
  } catch (e) {
    console.error(e);
    rawData = { title: "title", description: "description", short: { description: "short" }, author: { since: 2023 } }
  }
  return rawData;
}

const site = getSiteData();

export { site };