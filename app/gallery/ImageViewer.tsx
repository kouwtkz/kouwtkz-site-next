"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { create } from "zustand";
import { MediaImageItemType } from "@/app/media/image/MediaImageData.mjs";
import { useCharaData } from "@/app/character/CharaData";
import Image from "next/image";
import Link from "next/link";
import loaderSet from "@/app/lib/loaderSet";
import { useServerState } from "@/app/components/System/ServerState";
import MultiParser from "@/app/components/functions/MultiParser";
import { useSearchParams } from "next/navigation";
import { useMediaImageState } from "../media/image/MediaImageState";
import { useRouter } from "next/navigation";

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
const useImageViewer = create<ImageViewerType>((set) => ({
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
export { useImageViewer };

const ImageViewerWindow = () => {
  const router = useRouter();
  const imageViewer = useImageViewer();
  const search = useSearchParams();
  const { imageItemList } = useMediaImageState();
  const charaData = useCharaData();
  const { isStatic } = useServerState();
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
    ? imageItemList.find((image) => image.path === imageParam) || null
    : null;

  return (
    <div className="fixed z-[40]" id="image_viewer">
      {imageViewer.isOpen && image ? (
        <div
          className="bg-lightbox-background w-[100vw] h-[100vh] flex justify-center items-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) backAction();
          }}
          id={imageViewerWindowID}
        >
          <div className="window flex flex-wrap flex-row max-h-[85%] h-auto md:flex-nowrap overflow-y-scroll w-[98%] md:h-[80%]">
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
            <div className="flex-auto pb-4 md:pb-0 text-center md:text-left bg-lightbox-background-text min-w-[50vw] max-h-[100%] font-KosugiMaru w-[100%] md:w-auto">
              <div className="pl-0 md:pl-12">
                <h2 className="my-8 text-4xl font-MochiyPopOne text-main-dark break-all">
                  {image.title}
                </h2>
                <div className="mx-2 md:mr-6 text-2xl">
                  <MultiParser
                    className="[&_p]:my-4 [&_p]:whitespace-pre-line"
                  >
                    {image.description}
                  </MultiParser>
                </div>
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
                      className="underline font-sans"
                      href={image.link}
                    >
                      {image.link}
                    </Link>
                  </div>
                ) : null}
              </div>
              <div className="m-4">
                <button className="m-auto block text-xl" onClick={backAction}>
                  とじる
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const ImageViewer = () => {
  return (
    <Suspense>
      <ImageViewerWindow />
    </Suspense>
  );
};

export default ImageViewer;
