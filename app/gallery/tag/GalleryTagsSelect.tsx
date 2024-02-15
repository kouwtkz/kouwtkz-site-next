import { useRouter, useSearchParams } from "next/navigation";
import {
  defaultFilterTags,
  defaultSortTags,
  defaultTags,
  getTagsOptions,
} from "./GalleryTags";
import { useServerState } from "@/app/components/System/ServerState";
import { MakeURL } from "@/app/components/functions/MakeURL";
import ReactSelect from "react-select";
import { HTMLAttributes } from "react";
import { callReactSelectTheme } from "@/app/components/theme/main";

interface SelectAreaProps extends HTMLAttributes<HTMLDivElement> {}

export default function GalleryTagsSelect({ className }: SelectAreaProps) {
  const router = useRouter();
  const search = useSearchParams();
  const searchTags = search.get("tag")?.split(",") || [];
  const searchMonth =
    search
      .get("month")
      ?.split(",")
      .map((v) => `month:${v}`) || [];
  const searchFilters =
    search
      .get("filter")
      ?.split(",")
      .map((v) => `filter:${v}`) || [];
  const searchSort =
    search
      .get("sort")
      ?.split(",")
      .map((v) => `sort:${v}`) || [];
  const searchQuery = searchTags.concat(searchMonth, searchFilters, searchSort);
  const { isServerMode } = useServerState();
  const tags = defaultSortTags.concat(
    isServerMode ? defaultFilterTags : [],
    defaultTags
  );
  const currentTags = getTagsOptions(tags).filter((tag) =>
    searchQuery.some((stag) => tag.value === stag)
  );
  return (
    <div className={className}>
      <ReactSelect
        options={tags}
        value={currentTags}
        isMulti
        classNamePrefix="select"
        placeholder="ソート / フィルタ"
        instanceId="galleryTagSelect"
        className="min-w-[18rem] text-left"
        theme={callReactSelectTheme}
        styles={{ menuList: (style) => ({ ...style, minHeight: "22rem" }) }}
        onChange={(list) => {
          const listObj: { [k: string]: string[] } = {
            sort: [],
            filter: [],
            tag: [],
            month: [],
          };
          list.forEach(({ value, group }) => {
            const values = (value?.split(":", 2) || [""]).concat("");
            switch (values[0]) {
              case "sort":
                listObj.sort = [values[1]];
                break;
              case "filter":
                listObj.filter.push(values[1]);
                break;
              case "month":
                listObj.month = [values[1]];
                break;
              default:
                if (value) listObj.tag.push(value);
                break;
            }
          });
          const query = Object.fromEntries(search);
          Object.entries(listObj).forEach(([key, list]) => {
            if (list.length > 0) query[key] = list.join(",");
            else delete query[key];
          });
          router.push(MakeURL({ query }).href, { scroll: false });
        }}
      />
    </div>
  );
}
