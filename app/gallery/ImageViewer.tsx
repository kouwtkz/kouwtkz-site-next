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
            {image.album?.visible?.info ? (
              <div className="window info">
                <div className="text-center md:text-left">
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
                  <div className="mb-8 text-2xl">
                    {charaData.charaList
                      .filter((chara) =>
                        image.tags?.find((tag) => tag === chara.id)
                      )
                      .map((chara, i) => (
                        <Link
                          className="mx-2 my-1 text-xl whitespace-nowrap inline-block"
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
                              className="charaIcon text-3xl mr-1"
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
