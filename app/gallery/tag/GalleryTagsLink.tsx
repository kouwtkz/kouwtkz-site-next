import { useRouter, useSearchParams } from "next/navigation";
import { defaultFilterTags, defaultTags, getTagsOptions } from "./GalleryTags";
import { useServerState } from "@/app/components/System/ServerState";
import queryPush from "@/app/components/functions/queryPush";
import ReactSelect from "react-select";
import { HTMLAttributes } from "react";

interface SelectAreaProps extends HTMLAttributes<HTMLDivElement> {}

export default function GalleryTagsLink({ className }: SelectAreaProps) {
  const router = useRouter();
  const search = useSearchParams();
  const searchTags = search.get("tag")?.split(",") || [];
  const searchFilters = search.get("filter")?.split(",") || [];
  const searchQuery = searchTags.concat(searchFilters);
  const { isServerMode } = useServerState();
  const tags = defaultTags.concat(isServerMode ? defaultFilterTags : []);
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
        placeholder="タグ選択"
        instanceId="galleryTagSelect"
        className="min-w-[18rem] text-left"
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: "var(--main-color-deep)",
            primary25: "var(--main-color-pale)",
            primary50: "var(--main-color-soft)",
            primary75: "var(--main-color)",
          },
        })}
        onChange={(list) => {
          const filterList = [] as string[];
          const tagList = [] as string[];
          list.forEach(({ value }) => {
            switch (value) {
              case "topImage":
              case "pickup":
                filterList.push(value);
                break;
              default:
                if (value) tagList.push(value);
                break;
            }
          });
          queryPush({
            process: (params) => {
              if (filterList.length > 0) params.filter = filterList.join(",");
              else delete params.filter;
              if (tagList.length > 0) params.tag = tagList.join(",");
              else delete params.tag;
            },
            push: router.push,
            search,
          });
        }}
      />
    </div>
  );
}
