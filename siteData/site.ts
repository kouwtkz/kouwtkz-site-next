import { load } from "js-yaml";
import { readFileSync } from "fs";
import { setPath } from "@/app/functions/general";
import siteProp from "./site.d"

const site = <siteProp>load(readFileSync(setPath("@/siteData/site.yaml"), "utf8"));
export default site;