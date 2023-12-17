import { parse } from "yaml";
import { readFileSync } from "fs";

/**
 * @typedef {{
 * title: string
 * description: string
 * short: { description: string }
 * image: string
 * author: SiteAuthorProps
 * manifest: any
 * enableEmoji?: boolean
 * enableRobotsTXT?: boolean
 * menu?: {
 *   nav?: SiteMenuProps[],
 *   sns?: SiteSnsProps[],
 * }
 * }} SiteProps;
 * 
 * @typedef {{
 *   name: string
 *   account: string
 *   ename: string
 *   mail: string
 *   smail: string
 *   since: number
 *   x:
 *   {
 *     [name: string]: string
 *   }
 * }} SiteAuthorProps
 * 
 * @typedef {{
 *   name: string
 *   url: string
 * }} SiteMenuProps
 * 
 * @typedef {{
 *   name: string
 *   url: string
 *   title?: string
 *   mask?: string
 *   image?: string
 *   row?: number
 *   rel?: string
 * }} SiteSnsProps
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