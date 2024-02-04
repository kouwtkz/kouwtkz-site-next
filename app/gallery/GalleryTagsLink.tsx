import { useRouter, useSearchParams } from "next/navigation";
import { GalleryTagsOption, eventTags } from "./GalleryTags";
import { useServerState } from "../components/System/ServerState";
import queryPush from "../components/functions/queryPush";
import Select from "react-select";

export default function GalleryTagsLink() {
  const router = useRouter();
  const search = useSearchParams();
  const searchTags = search.get("tag")?.split(",");
  const { isServerMode } = useServerState();
  const _eventTags = [
    { label: "季節もの", options: eventTags.concat() },
  ] as GalleryTagsOption[];
  const currentEventTags = _eventTags.filter((tag) =>
    searchTags?.some((stag) => tag.value === stag)
  );
  if (isServerMode) {
    const filters = [
      {
        label: "固定編集用",
        options: [
          { value: "topImage", label: "📍トップ画像" },
          { value: "pickup", label: "📍ピックアップ" },
        ],
      } as GalleryTagsOption,
    ];
    filters.forEach((item) => _eventTags.push(item));
    const searchFilters = search.get("filter")?.split(",") || [];
    const currentFilters = filters.filter((filter) =>
      searchFilters.some((sf) => sf === filter.value)
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
