import { parse } from "yaml";
import { readFileSync } from "fs";

/**
 * @typedef { import("./SiteDataType.d.js").SiteProps } SiteProps
 * @typedef { import("./SiteDataType.d.js").SiteAuthorProps } SiteAuthorProps
 * @typedef { import("./SiteDataType.d.js").SiteMenuProps } SiteMenuProps
 * @typedef { import("./SiteDataType.d.js").SiteSnsProps } SiteSnsProps
 */

const projectRoot = process.cwd(), dataDir = process.env.DATA_DIR || '';

/** @type any */
let rawData = {}
try {
  rawData = parse(readFileSync(`${projectRoot}/${dataDir}/site.yaml`, "utf8"));
} catch {
  rawData = { title: "title", description: "description", short: { description: "short" }, author: { since: 2023 } }
}

/** @type SiteProps */
const site = rawData;

export { site };