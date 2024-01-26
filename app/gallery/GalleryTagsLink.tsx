import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useRef } from "react";
import { eventTags } from "./GalleryTags";
import MultiParser from "../components/functions/MultiParser";
import { useServerState } from "../components/System/ServerState";
import queryPush from "../components/functions/queryPush";

function Main() {
  const router = useRouter();
  const search = useSearchParams();
  const searchTags = search.get("tag")?.split(",");
  const { isServerMode } = useServerState();
  const tagsSelectRef = useRef<HTMLSelectElement>(null);
  const _eventTags = eventTags.concat();
  const currentEventTags = _eventTags.filter((tag) =>
    searchTags?.some((stag) => tag.value === stag)
  );
  if (isServerMode) {
    const filters = [
      { value: "topImage", name: "📍トップ画像" },
      { value: "pickup", name: "📍ピックアップ" },
    ];
    filters.forEach((item) => _eventTags.push(item));
    const searchFilter = search.get("filter");
    const currentFilter = filters.find(({ value }) => value === searchFilter);
    if (currentFilter) currentEventTags.push(currentFilter);
  }
  const currentEventTag = currentEventTags.pop();
  console.log(currentEventTag);
  return (
    <div className="[&>*]:inline-block text-right">
      <MultiParser only={{ toTwemoji: true }} className="">
        {currentEventTags?.map(({ name }, i) => (
          <div key={i}>{name}</div>
        ))}
      </MultiParser>
      <select
        title="タグ選択"
        className="text-main [&_option]:text-main-dark text-lg m-2 h-6 min-w-[4rem] bg-transparent"
        defaultValue={currentEventTag?.value || ""}
        value={currentEventTag?.value || ""}
        ref={tagsSelectRef}
        onChange={() => {
          const tagsSelect = tagsSelectRef.current;
          if (tagsSelect) {
            queryPush({
              process: (params) => {
                switch (tagsSelect.value) {
                  case "":
                    delete params.tag;
                    delete params.filter;
                    break;
                  case "topImage":
                  case "pickup":
                    delete params.tag;
                    params.filter = tagsSelect.value;
                    break;
                  default:
                    params.tag = tagsSelect.value;
                    delete params.filter;
                    break;
                }
              },
              push: router.push,
              search,
            });
          }
        }}
      >
        <option value="">タグせんたく</option>
        {_eventTags.map(({ name, value }, i) => (
          <option value={value} key={i}>
            {name}
          </option>
        ))}
      </select>
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
