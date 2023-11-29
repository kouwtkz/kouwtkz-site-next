import { load } from "js-yaml";
import { readFileSync } from "fs";
import { setPath } from "@/app/functions/general";
import { SiteProps } from "./site.d"

const rawData = readFileSync(setPath("@/siteData/site.yaml"), "utf8");
const site = <SiteProps>load(rawData);
const isStatic = process.env.OUTPUT_MODE === "export";
const currentDate = new Date();

export { site, isStatic, currentDate };