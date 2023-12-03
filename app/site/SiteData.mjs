import { load } from "js-yaml";
import { readFileSync } from "fs";

/**
 * @typedef {{
 * title: string
 * description: string
 * short: { description: string }
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

const projectRoot = `${process.env.PWD}`, dataDir = `${process.env.DATA_DIR}`;
const rawData = readFileSync(`${projectRoot}/${dataDir}/site.yaml`, "utf8");
/** @type SiteProps */
const site = load(rawData);

export { site };