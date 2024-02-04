import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useRef } from "react";
import { eventTags } from "./GalleryTags";
import MultiParser from "../components/functions/MultiParser";
import { useServerState } from "../components/System/ServerState";
import queryPush from "../components/functions/queryPush";
import Select from "react-select";

function Main() {
  const router = useRouter();
  const search = useSearchParams();
  const searchTags = search.get("tag")?.split(",");
  const { isServerMode } = useServerState();
  const _eventTags = eventTags.concat();
  const currentEventTags = _eventTags.filter((tag) =>
    searchTags?.some((stag) => tag.value === stag)
  );
  if (isServerMode) {
    const filters = [
      { value: "topImage", label: "📍トップ画像" },
      { value: "pickup", label: "📍ピックアップ" },
    ];
    filters.forEach((item) => _eventTags.push(item));
    const searchFilters = search.get("filter")?.split(",") || [];
    const currentFilters = filters.filter(({ value }) =>
      searchFilters.some((sf) => sf === value)
    );
    if (currentFilters)
      currentFilters.forEach((item) => currentEventTags.push(item));
  }
  return (
    <div className="[&>*]:inline-block text-right">
      <Select
        options={_eventTags}
        value={currentEventTags}
        isMulti
        classNamePrefix="select"
        placeholder="タグ選択"
        className="min-w-[16rem] text-left"
        theme={(theme) => ({
          ...theme,
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
                tagList.push(value);
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

export default function GalleryTagsLink() {
  return (
    <Suspense>
      <Main />
    </Suspense>
  );
}
