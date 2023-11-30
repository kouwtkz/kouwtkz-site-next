import { load } from "js-yaml";
import { readFileSync } from "fs";
import { setPath } from "@/app/functions/general";
import { SiteProps } from "./site.d"

const rawData = readFileSync(setPath("@/siteData/site.yaml"), "utf8");
const site = <SiteProps>load(rawData);

export { site };