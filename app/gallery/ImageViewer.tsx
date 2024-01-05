"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
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
import { EmbedNode, useEmbedState } from "../context/embed/EmbedState";

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
    set(() => ({ isOpen: false, imagePath: "" }));
    bodyLock(false);
  },
  setImagePath: (path) => {
    set(() => ({ imagePath: path, isOpen: true }));
    bodyLock(true);
  },
}));

function ImageViewerWindow() {
  const router = useRouter();
  const imageViewer = useImageViewer();
  const search = useSearchParams();
  const { imageItemList } = useMediaImageState();
  const charaData = useCharaState();
  const { data: embedData } = useEmbedState();
  const [backCheck, setBackCheck] = useState(false);
  const imageParam = search.get("image");

  const backAction = () => {
    router.back();
    setBackCheck(true);
  };
  useEffect(() => {
    if (backCheck) {
      router.push(location.pathname, { scroll: false });
      setBackCheck(false);
    }
  }, [backCheck, imageParam, router]);

  useEffect(() => {
    if (!imageParam) {
      if (imageViewer.isOpen) imageViewer.onClose();
    } else if (imageParam !== imageViewer.imagePath) {
      imageViewer.setImagePath(imageParam);
    }
  });

  const image = imageViewer.imagePath
    ? imageItemList.find((image) => image.URL === imageParam) || null
    : null;

  const titleEqFilename =
    process.env.NODE_ENV === "development"
      ? false
      : image?.name
      ? image.src.startsWith(image.name)
      : true;

  return (
    <div className="fixed z-40" id="image_viewer">
      {imageViewer.isOpen && image ? (
        <div
          className="bg-lightbox-background w-[100vw] h-[100vh] flex justify-center items-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) backAction();
          }}
          id={imageViewerWindowID}
        >
          <CloseButton
            className="absolute top-0 right-0 z-20 m-2 w-10 h-10 md:m-4 md:w-14 md:h-14 opacity-80 cursor-pointer"
            width={60}
            height={60}
            onClick={(e) => {
              backAction();
              e.stopPropagation();
            }}
          />
          <div className="window z-30 flex flex-wrap flex-row items-center md:items-stretch max-h-[90%] h-auto md:flex-nowrap w-[98%] md:h-[88%] mt-12 font-KosugiMaru overflow-y-scroll md:overflow-auto">
            <div className="bg-lightbox-background-preview w-[100%] max-h-[65vh] md:max-h-[100%] [&_*]:w-[100%] [&_*]:h-[100%]">
              {image.embed ? (
                <>
                  <EmbedNode
                    embed={image.embed}
                  />
                </>
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
            {image.album?.visible?.info ? (
              <div className="window flex-auto pb-4 md:pb-0 bg-lightbox-background-text max-h-[100%] md:min-w-[30em] md:w-[40vw] md:overflow-y-scroll">
                <div className="text-center md:text-left ml-4 mr-2">
                  {image.album.visible.title &&
                  (image.album.visible.filename || !titleEqFilename) ? (
                    <h2 className="mx-1 my-8 text-center text-2xl md:text-3xl font-MochiyPopOne text-main-dark break-all">
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
                  <div className="mb-8 text-2xl">
                    {charaData.charaList
                      .filter((chara) =>
                        image.tags?.find((tag) => tag === chara.id)
                      )
                      .map((chara, i) => (
                        <Link
                          className="m-1 text-lg whitespace-nowrap inline-block"
                          href={`/character/${chara.id}`}
                          onClick={() => {
                            imageViewer.onClose();
                            return true;
                          }}
                          key={i}
                        >
                          {chara?.media?.icon ? (
                            <ImageMee
                              imageItem={chara?.media?.icon}
                              mode="icon"
                              width={40}
                              height={40}
                              className="inline-block mr-1"
                            />
                          ) : (
                            <></>
                          )}
                          <span className="align-middle">{chara.name}</span>
                        </Link>
                      ))}
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
                </div>
                {image.time ? (
                  <div className="m-4 mr-8 text-main-grayish text-right">
                    {image.time.toLocaleString("ja", opt)}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <></>
            )}
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
