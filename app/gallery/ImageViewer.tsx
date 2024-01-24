"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { create } from "zustand";
import { useCharaState } from "@/app/character/CharaState";
import Link from "next/link";
import MultiParser from "@/app/components/functions/MultiParser";
import { useSearchParams } from "next/navigation";
import { useMediaImageState } from "@/app/context/MediaImageState";
import { useRouter } from "next/navigation";
import { BlogDateOptions as opt } from "@/app/components/System/DateTimeFormatOptions";
import ImageMee from "../components/image/ImageMee";
import CloseButton from "../components/svg/button/CloseButton";
import { EmbedNode } from "../context/embed/EmbedState";
import { useServerState } from "../components/System/ServerState";
import { MediaImageItemType } from "@/mediaScripts/MediaImageDataType";
import ImageEditForm from "./ImageEditForm";
import { eventTags } from "./GalleryTags";

const body = typeof window === "object" ? document?.body : null;
const bodyLock = (m: boolean) => {
  if (m) {
    body?.classList.add("overflow-y-hidden");
  } else {
    body?.classList.remove("overflow-y-hidden");
  }
};

type ImageViewerType = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  editMode: boolean;
  toggleEditMode: () => void;
  imagePath: string;
  setImagePath: (path: string) => void;
};
export const useImageViewer = create<ImageViewerType>((set) => ({
  isOpen: false,
  imagePath: "",
  onOpen: () => {
    set(() => ({ isOpen: true }));
    bodyLock(true);
  },
  onClose: () => {
    set(() => ({ isOpen: false, editMode: false, imagePath: "" }));
    bodyLock(false);
  },
  editMode: false,
  toggleEditMode() {
    set((state) => ({ editMode: !state.editMode }));
  },
  setImagePath: (path) => {
    set(() => ({ imagePath: path, isOpen: true }));
    bodyLock(true);
  },
}));

function ImageViewerWindow() {
  const router = useRouter();
  const { isOpen, onClose, imagePath, setImagePath, editMode, toggleEditMode } =
    useImageViewer();
  const search = useSearchParams();
  const { imageItemList } = useMediaImageState();
  const { charaList } = useCharaState();
  const [backCheck, setBackCheck] = useState(false);
  const imageParam = search.get("image");
  const { isServerMode } = useServerState();

  const backAction = () => {
    router.back();
    const href = location.href;
    setTimeout(() => {
      if (href === location.href)
        router.push(location.pathname, { scroll: false });
    }, 10);
  };
  useEffect(() => {
    if (!imageParam) {
      if (isOpen) onClose();
    } else if (imageParam !== imagePath) {
      setImagePath(imageParam);
    }
  });

  const image = imagePath
    ? imageItemList.find((image) => image.URL === imageParam) || null
    : null;

  const titleEqFilename =
    process.env.NODE_ENV === "development"
      ? false
      : image?.name
      ? image.src.startsWith(image.name)
      : true;

  const infoCmp = (image: MediaImageItemType) => {
    if (!image.album?.visible?.info) return <></>;
    return (
      <div className="window info">
        <div className="text-center md:text-left">
          {editMode ? null : (
            <>
              {image.album.visible.title &&
              (image.album.visible.filename || !titleEqFilename) ? (
                <h2 className="mx-1 my-8 text-center text-2xl md:text-3xl font-MochiyPopOne text-main-deep break-all">
                  {image.name}
                </h2>
              ) : (
                <div className="my-8" />
              )}
              <div className="text-xl md:text-2xl">
                <MultiParser className="[&_p]:my-4 [&_p]:whitespace-pre-line">
                  {image.description}
                </MultiParser>
              </div>
              <div className="mb-8 text-xl">
                {charaList
                  .filter((chara) =>
                    image.tags?.some((tag) => chara.id === tag)
                  )
                  .map((chara, i) => {
                    return (
                      <Link
                        className="mx-2 my-1 inline-block"
                        href={`/character/${chara.id}`}
                        onClick={() => {
                          onClose();
                          return true;
                        }}
                        key={i}
                      >
                        {chara?.media?.icon ? (
                          <ImageMee
                            imageItem={chara.media.icon}
                            mode="icon"
                            width={40}
                            height={40}
                            className="charaIcon text-3xl mr-1"
                          />
                        ) : (
                          <></>
                        )}
                        <span className="align-middle">{chara.name}</span>
                      </Link>
                    );
                  })}
                {image.tags
                  ?.filter((tag) =>
                    eventTags.some(({ value }) => value === tag)
                  )
                  .map((tag, i) => {
                    const item = eventTags.find(({ value }) => value === tag);
                    if (!item) return item;
                    return (
                      <Link
                        href={`?tag=${item.value}`}
                        className="text-main-dark hover:text-main-strong"
                        key={i}
                      >
                        <MultiParser
                          only={{ toTwemoji: true }}
                          className="mx-2 my-1 inline-block [&_.emoji]:mr-1"
                        >
                          {item.name}
                        </MultiParser>
                      </Link>
                    );
                  })}
              </div>
              {image.link ? (
                <div className="text-xl">
                  <Link
                    target="_blank"
                    className="underline font-sans"
                    href={image.link}
                  >
                    {image.link}
                  </Link>
                </div>
              ) : (
                <></>
              )}
              {image.time ? (
                <div className="m-4 mr-8 text-main-grayish text-right">
                  {image.time.toLocaleString("ja", opt)}
                </div>
              ) : (
                <></>
              )}
            </>
          )}
          {isServerMode ? <ImageEditForm image={image} /> : null}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed z-40" id="image_viewer">
      {isOpen && image ? (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) backAction();
          }}
          className="viewer"
        >
          <CloseButton
            className="close"
            width={60}
            height={60}
            onClick={(e) => {
              backAction();
              e.stopPropagation();
            }}
          />
          <div className="window modal z-30 font-KosugiMaru">
            <div className="preview">
              {image.embed ? (
                <EmbedNode embed={image.embed} />
              ) : (
                <a
                  title={image.name || image.src}
                  href={`${image.URL || image.src}`}
                  target="_blank"
                  className="flex items-center flex-auto"
                >
                  <ImageMee
                    imageItem={image}
                    style={{ objectFit: "contain" }}
                  />
                </a>
              )}
            </div>
            {infoCmp(image)}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default function ImageViewer() {
  return (
    <Suspense>
      <ImageViewerWindow />
    </Suspense>
  );
}
