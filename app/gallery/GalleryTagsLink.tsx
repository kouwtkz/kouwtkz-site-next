import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { eventTags } from "./GalleryTags";
import MultiParser from "../components/functions/MultiParser";

function Main() {
  const search = useSearchParams();
  const searchTags = search.get("tag")?.split(",");
  const currentEventTags = eventTags.filter((tag) =>
    searchTags?.some((stag) => tag.value === stag)
  );
  if (currentEventTags.length === 0) return <></>;
  return (
    <MultiParser only={{ toTwemoji: true }}>
      {currentEventTags?.map(({ name }, i) => (
        <div key={i} className="inline-block">{name}</div>
      ))}
    </MultiParser>
  );
}

export default function GalleryTagsLink() {
  return (
    <Suspense>
      <Main />
    </Suspense>
  );
}
