"use client";

import { useServerState } from "@/app/context/system/ServerState";
import ImageMee, { ImageMeeIcon } from "@/app/components/tag/ImageMee";
import {
  CharaGalleryAlbum,
  CharaGalleryAlbumProps,
  useCharaState,
} from "./CharaState";
import { useSoundPlayer } from "@/app/sound/SoundPlayer";
import { createRef, useEffect, useRef } from "react";
import { EmbedNode } from "@/app/context/embed/Embed";
import GallerySearchArea from "../gallery/tag/GallerySearchArea";
import GalleryTagsSelect from "../gallery/tag/GalleryTagsSelect";
import InPageMenu from "../components/navigation/InPageMenu";
import Link from "next/link";
import MultiParser from "../components/tag/MultiParser";

type DetailProps = {
  name: string;
};

export default function CharaDetail({ name }: DetailProps) {
  const { isStatic } = useServerState();
  const { charaList, charaObject } = useCharaState();
  const { RegistPlaylist, current, playlist } = useSoundPlayer();
  const isSetPlaylist = useRef(false);
  const chara = charaObject ? charaObject[name] : null;
  useEffect(() => {
    if (!isSetPlaylist.current) {
      if (
        chara?.media?.playlist &&
        playlist.title !== chara.media.playlist.title
      ) {
        let foundIndex = chara.media.playlist.list.findIndex(
          (item) => item.src === playlist.list[current].src
        );
        if (foundIndex < 0) foundIndex = 0;
        RegistPlaylist({
          playlist: chara.media.playlist,
          current: foundIndex,
        });
      }
      isSetPlaylist.current = true;
    }
  });
  if (!chara) return null;
  const charaIndex = charaList.findIndex(({ id }) => id === chara.id);
  const beforeChara = charaList[charaIndex - 1];
  const afterChara = charaList[charaIndex + 1];
  const galleryList: CharaGalleryAlbumProps[] = [
    { chara, name: "art" },
    { chara, name: "goods" },
    { chara, name: "3D" },
    { chara, name: "picture" },
    { chara, name: "parody", label: "parody", max: 12 },
    { chara, name: "given", label: "Fanart", max: 40 },
  ];
  const galleryRefList = galleryList.map(() => createRef<HTMLDivElement>());
  const otherMenuList = [{ name: "Profile" }];
  const otherRefList = otherMenuList.map(() => createRef<HTMLDivElement>());
  return (
    <>
      <div className="p-0" ref={otherRefList[0]}>
        <div className="mx-2 my-1 flex justify-between">
          <div>
            {beforeChara ? (
              <Link
                href={{ query: { name: beforeChara.id } }}
                prefetch={false}
                className="flex items-center h-8"
              >
                <span className="mr-2">＜</span>
                {beforeChara.media?.icon ? (
                  <ImageMeeIcon
                    imageItem={beforeChara.media.icon}
                    size={40}
                    className="charaIcon text-2xl mr-2"
                  />
                ) : null}
                <span className="text-xl">{beforeChara.name}</span>
              </Link>
            ) : null}
          </div>
          <div>
            {afterChara ? (
              <Link
                href={{ query: { name: afterChara.id } }}
                prefetch={false}
                className="flex items-center h-8"
              >
                {afterChara.media?.icon ? (
                  <ImageMeeIcon
                    imageItem={afterChara.media.icon}
                    size={40}
                    className="charaIcon text-2xl mr-2"
                  />
                ) : null}
                <span className="text-xl">{afterChara.name}</span>
                <span className="ml-2">＞</span>
              </Link>
            ) : null}
          </div>
        </div>
        <div className="mb-4">
          <h1 className="text-main-strong font-bold text-3xl h-10 inline-block">
            {chara.media?.icon ? (
              <ImageMeeIcon
                imageItem={chara.media.icon}
                size={40}
                className="charaIcon text-4xl mr-2"
              />
            ) : null}
            <span className="align-middle">{`${chara.name}${
              chara.honorific || ""
            }`}</span>
          </h1>
          <div className="text-main text-xl my-2">{chara.overview}</div>
        </div>
        {chara.media?.headerImage ? (
          <div>
            <ImageMee
              imageItem={chara.media.headerImage}
              loading="eager"
              unoptimized={isStatic}
              suppressHydrationWarning={true}
              className="inline-block w-[100%]"
            />
          </div>
        ) : null}
        {chara.media?.image ? (
          <div>
            <ImageMee
              imageItem={chara.media.image}
              mode="thumbnail"
              loading="eager"
              suppressHydrationWarning={true}
              className="inline-block m-4"
              style={{ objectFit: "cover" }}
              height={340}
            />
          </div>
        ) : null}
        <MultiParser>{chara.description}</MultiParser>
        <EmbedNode className="my-8 mx-2 md:mx-8" embed={chara.embed} />
      </div>
      <div className="mt-4">
        <div className="m-1 [&>*]:m-1 flex flex-wrap justify-end items-center">
          <GallerySearchArea />
          <GalleryTagsSelect />
        </div>
        {galleryList.map((args, i) => (
          <div ref={galleryRefList[i]} key={i}>
            <CharaGalleryAlbum {...args} />
          </div>
        ))}
      </div>
      <InPageMenu
        list={otherMenuList
          .map(({ name }, i) => ({ name, ref: otherRefList[i] }))
          .concat(
            galleryList.map(({ name, label }, i) => ({
              name: label || name,
              ref: galleryRefList[i],
            }))
          )}
        adjust={128}
      />
    </>
  );
}
