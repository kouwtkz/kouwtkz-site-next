"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { create } from "zustand";
import { useCharaState } from "@/app/character/CharaState";
import Link from "next/link";
import MultiParser from "@/app/components/tag/MultiParser";
import { usePathname, useSearchParams } from "next/navigation";
import { useMediaImageState } from "@/app/context/image/MediaImageState";
import { useRouter } from "next/navigation";
import { BlogDateOptions as opt } from "@/app/components/System/DateTimeFormatOptions";
import ImageMee from "../components/tag/ImageMee";
import CloseButton from "../components/svg/button/CloseButton";
import { EmbedNode } from "../context/embed/EmbedState";
import { useServerState } from "../components/System/ServerState";
import { MediaImageItemType } from "@/mediaScripts/MediaImageDataType";
import ImageEditForm from "./ImageEditForm";
import {
  defaultTags,
  getTagsOptions,
  autoFixTagsOptions,
} from "./tag/GalleryTags";
import { MakeURL } from "@/app/components/functions/MakeURL";

const body = typeof window === "object" ? document?.body : null;
const bodyLock = (m: boolean) => {
  if (m) {
    body?.classList.add("overflow-y-hidden");
  } else {
    body?.classList.remove("overflow-y-hidden");
  }
};

type ImageViewerType = {
  imagePath: string;
  albumImages: string[];
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  editMode: boolean;
  toggleEditMode: () => void;
  setImagePath: (path: string) => void;
  setAlbumImages: (list: string[]) => void;
};
export const useImageViewer = create<ImageViewerType>((set) => ({
  imagePath: "",
  albumImages: [],
  isOpen: false,
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
    set(() => ({ imagePath: path, albumImages: [], isOpen: true }));
    bodyLock(true);
  },
  setAlbumImages(list) {
    set(() => ({ albumImages: list }));
  },
}));

export default function ImageViewer() {
  const router = useRouter();
  const {
    isOpen,
    onClose,
    imagePath,
    setImagePath,
    editMode,
    toggleEditMode,
    albumImages,
  } = useImageViewer();
  const { imageItemList } = useMediaImageState();
  const { charaList } = useCharaState();
  const search = useSearchParams();
  const pathname = usePathname();
  const imageParam = search.get("image");
  const { isServerMode } = useServerState();
  const tagsOptions = autoFixTagsOptions(getTagsOptions(defaultTags));

  const backAction = () => {
    router.back();
    const href = location.href;
    setTimeout(() => {
      if (href === location.href) {
        const query = Object.fromEntries(search);
        delete query.image;
        router.push(MakeURL(query).href, { scroll: false });
      }
    }, 10);
  };
  const updateFlag = useRef(false);
  useEffect(() => {
    if (!imageParam) {
      if (isOpen) onClose();
    } else if (imageParam !== imagePath) {
      setImagePath(imageParam);
      updateFlag.current = true;
    } else {
    }
  });

  const image = useMemo(
    () =>
      imagePath
        ? imageItemList.find((image) => image.URL === imageParam) || null
        : null,
    [imageItemList, imageParam, imagePath]
  );
  const albumImageItems = useMemo(
    () =>
      albumImages
        .map(
          (imageURL) =>
            imageItemList[
              imageItemList.findIndex(({ URL }) => URL === imageURL)
            ]
        )
        .filter((v) => v),
    [albumImages, imageItemList]
  );
  const imageIndex = albumImageItems.findIndex(({ URL }) => image?.URL === URL);
  const beforeAfterImage = {
    before: albumImageItems[imageIndex - 1],
    after: albumImageItems[imageIndex + 1],
  };

  const titleEqFilename = useMemo(
    () =>
      process.env.NODE_ENV === "development"
        ? false
        : image?.name
        ? image.src.startsWith(image.name)
        : true,
    [image]
  );

  const infoCmp = (image: MediaImageItemType) => {
    if (!image.album?.visible?.info) return <></>;
    return (
      <div className="window info">
        <div className="text-center md:text-left flex-shrink-0">
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
                        className="mx-2 my-1 inline-block align-middle"
                        href={{
                          pathname: "/character",
                          query: { name: chara.id },
                        }}
                        prefetch={false}
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
                    tagsOptions.some(({ value }) => value === tag)
                  )
                  .map((tag, i) => {
                    const item = tagsOptions.find(({ value }) => value === tag);
                    if (!item) return item;
                    return (
                      <Link
                        href={{
                          ...(pathname.startsWith("/gallery")
                            ? {}
                            : { pathname: "/gallery" }),
                          query: item.query || { tag: item.value },
                        }}
                        prefetch={false}
                        className="align-middle inline-block mx-2 my-1 text-main-dark hover:text-main-strong"
                        key={i}
                      >
                        <MultiParser
                          only={{ toTwemoji: true }}
                          className="align-middle [&_.emoji]:mr-1"
                        >
                          <span>{item.label}</span>
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
          {isServerMode ? <ImageEditForm /> : null}
        </div>
        <div className="flex w-[100%] px-2 pb-2 h-16 mb-0 text-main-strong flex-shrink-0 select-none">
          {beforeAfterImage?.before ? (
            <Link
              className="px-2 flex-1 flex justify-start items-center cursor-pointer hover:text-main-deep hover:bg-main-pale-fluo"
              href={{
                query: {
                  ...Object.fromEntries(search),
                  image: beforeAfterImage.before.URL,
                },
              }}
              scroll={false}
              replace={true}
              prefetch={false}
            >
              <div className="mr-2">≪</div>
              <div>{beforeAfterImage.before.name}</div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {beforeAfterImage?.after ? (
            <Link
              className="px-2 flex-1 flex justify-end items-center cursor-pointer hover:text-main-deep hover:bg-main-pale-fluo"
              href={{
                query: {
                  ...Object.fromEntries(search),
                  image: beforeAfterImage.after.URL,
                },
              }}
              scroll={false}
              replace={true}
              prefetch={false}
            >
              <div>{beforeAfterImage.after.name}</div>
              <div className="ml-2">≫</div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
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
