"use client";

import React from "react";
import { create } from "zustand";
import { MediaImageItemType } from "@/app/media/MediaImageData.mjs";
import { useCharaData } from "@/app/character/CharaData";
import Image from "next/image";
import Link from "next/link";
import loaderSet from "@/app/lib/loaderSet";
import { useServerData } from "../System/ServerData";

const body = typeof window === "object" ? document?.body : null;
const bodyLock = (m: boolean) => {
  if (m) {
    body?.classList.add("overflow-y-hidden");
  } else {
    body?.classList.remove("overflow-y-hidden");
  }
};
const imageViewerWindowID = "image_viewer_window";

type ImageViewerType = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  imageItem?: MediaImageItemType | null;
  setImageItem: (imageItem: MediaImageItemType) => void;
};
const useImageViewer = create<ImageViewerType>((set) => ({
  isOpen: false,
  onOpen: () => {
    set(() => ({ isOpen: true }));
    bodyLock(true);
  },
  onClose: () => {
    set(() => ({ isOpen: false }));
    bodyLock(false);
  },
  onToggle: () =>
    set((state) => {
      bodyLock(state.isOpen);
      return { isOpen: !state.isOpen };
    }),
  setImageItem: (item) => {
    set({ imageItem: item, isOpen: true });
    bodyLock(true);
  },
}));
export { useImageViewer };

const ImageViewer = () => {
  const imageViewer = useImageViewer();
  const charaData = useCharaData();
  const { isStatic } = useServerData();
  const image = imageViewer.imageItem;
  return (
    <div className="fixed z-[40]" id="image_viewer">
      {imageViewer.isOpen && image ? (
        <div
          className="bg-lightbox-background w-[100vw] h-[100vh] flex justify-center items-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) imageViewer.onClose();
          }}
          id={imageViewerWindowID}
        >
          <div className="window flex flex-wrap flex-row mb-20 max-h-[85%] h-auto md:flex-nowrap overflow-y-scroll w-[98%] md:h-[80%] md:mb-0">
            <div className="flex-auto bg-lightbox-background-preview flex items-center w-[100%] max-h-[65vh] md:max-h-[100%]">
              <Image
                src={`${image.innerURL}`}
                alt={`${image.name}`}
                loader={loaderSet(isStatic, image.path)}
                width={image.info?.width}
                height={image.info?.height}
                style={{ objectFit: "contain" }}
                className="w-[100%] h-[100%]"
              />
            </div>
            <div className="flex-auto p-0 md:pl-12 text-center md:text-left bg-lightbox-background-text min-w-[50vw] max-h-[100%] font-KosugiMaru w-[100%] md:w-auto">
              <h2 className="my-8 text-4xl font-MochiyPopOne text-main-dark">
                {image.title}
              </h2>
              <div className="mx-2 md:mx-8 text-2xl break-words">{image.description}</div>
              <div className="m-2 mb-8 text-2xl">
                {charaData.charaList
                  .filter((chara) =>
                    image.tags?.find((tag) => tag === chara.id)
                  )
                  .map((chara, i) => (
                    <Link
                      className="mx-2 my-2 whitespace-nowrap inline-block"
                      href={`/character/${chara.id}`}
                      onClick={() => {
                        imageViewer.onClose();
                        return true;
                      }}
                      key={i}
                    >
                      {chara?.media?.icon ? (
                        <Image
                          src={`${chara.media.icon.innerURL}`}
                          loader={loaderSet(
                            isStatic,
                            chara?.media?.icon?.resized?.find(
                              (v) => v.option.mode === "icon"
                            )?.src
                          )}
                          className="inline-block mr-1"
                          alt={chara.name}
                          width={40}
                          height={40}
                        />
                      ) : null}
                      <span className="align-middle">{chara.name}</span>
                    </Link>
                  ))}
              </div>
              {image.link ? (
                <div className="text-xl">
                  <Link
                    target="_blank"
                    className="underline font-sans break-all"
                    href={image.link}
                  >
                    {image.link}
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default ImageViewer;
