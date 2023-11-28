import { load } from "js-yaml";
import { readFileSync } from "fs";
import { setPath } from "@/app/functions/general";
import siteProp from "./site.d"

const rawData = readFileSync(setPath("@/siteData/site.yaml"), "utf8");
const site = <siteProp>load(rawData);
const isStatic = process.env.OUTPUT_MODE === "export";

export { site, isStatic };