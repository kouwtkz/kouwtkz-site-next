"use client";

import CharaState from "@/app/character/CharaState";
import MediaImageState from "@/app/context/MediaImageState";
import SiteState from "@/app/site/SiteState";
import PostState from "@/app/blog/PostState";
import SoundState from "@/app/sound/SoundState";
import DataTextState, { useDataTextState } from "./DataTextState";
import EmbedState from "../embed/EmbedState";

function addMdate(url: string, values: { [k: string]: any }) {
  if (values[url]) return `${url}?v=${values[url]}`;
  else return url;
}

export default function DataState() {
  const { values } = useDataTextState();
  if (values) {
    return (
      <>
        <CharaState url={addMdate("/data/characters.json", values)} />
        <SiteState url={addMdate("/data/site.json", values)} />
        <MediaImageState url={addMdate("/data/images.json", values)} />
        <SoundState url={addMdate("/data/sound.json", values)} />
        <PostState url={addMdate("/blog/posts.json", values)} />
        <EmbedState url={addMdate("/data/embed.json", values)} />
      </>
    );
  } else {
    return <DataTextState url={"/data/update.txt"} />;
  }
}
