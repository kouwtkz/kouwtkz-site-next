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
import { EmbedNode, useEmbedState } from "../context/embed/EmbedState";
import { useServerState } from "../components/System/ServerState";
import axios from "axios";
import toast from "react-hot-toast";
import { MediaImageItemType } from "@/mediaScripts/MediaImageDataType";

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
  const charaData = useCharaState();
  const { data: embedData } = useEmbedState();
  const { isServerMode } = useServerState();
  const [backCheck, setBackCheck] = useState(false);
  const imageParam = search.get("image");
  const { setImageFromUrl } = useMediaImageState();
  const refForm = useRef<HTMLFormElement>(null);

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

  const sendUpdate = async (image: MediaImageItemType) => {
    const { album, resized, resizeOption, URL, ..._image } = image;
    const res = await axios.patch("/gallery/send", {
      ..._image,
      albumDir: album?.dir,
    });
    if (res.status === 200) {
      toast("更新しました！", {
        duration: 2000,
      });
      setImageFromUrl();
    }
  };

  const onToggleEdit = async () => {
    if (editMode && image) {
      const form = refForm.current;
      let sendFlag = false;
      if (form) {
        form.test;
        const fmData = new FormData(form);
        const data = Object.fromEntries(fmData);
        const ftData = Object.entries(data).filter(([k, v]) => {
          switch (k) {
            case "time":
              return image.time?.getTime() !== new Date(String(v)).getTime();
            default:
              return (image[k] || "") !== v;
          }
        });
        if (ftData.length > 0) sendFlag = true;
        ftData.forEach(([k, v]) => {
          switch (k) {
            case "time":
              image.time = new Date(String(v));
              break;
            default:
              image[k] = v;
              break;
          }
        });
      }
      if (sendFlag) sendUpdate(image);
    }
    toggleEditMode();
  };

  const infoCmp = (image: MediaImageItemType) => {
    if (!image.album?.visible?.info) return <></>;
    return (
      <div className="window info">
        {editMode ? (
          <form
            ref={refForm}
            onSubmit={(e) => {
              onToggleEdit();
              e.preventDefault();
            }}
            className="[&>*]:block [&>*]:my-6"
          >
            <label>
              タイトル
              <input
                className="rounded-none w-[100%] mx-1 px-1 text-xl md:text-2xl text-main-dark"
                title="タイトル"
                type="text"
                name="name"
                defaultValue={image.name}
              />
            </label>
            <label>
              説明文
              <textarea
                className="rounded-none w-[100%] mx-1 px-1 min-h-[8rem] text-lg md:text-xl"
                title="説明文"
                name="description"
                defaultValue={image.description}
              />
            </label>
            <label>
              リンク
              <input
                className="rounded-none w-[100%] mx-1 px-1 text-lg md:text-xl"
                title="リンク"
                type="text"
                name="link"
                defaultValue={image.link}
              />
            </label>
            <label>
              投稿時間
              <input
                className="rounded-none w-[100%] mx-1 px-1 text-lg md:text-xl"
                title="リンク"
                type="datetime-local"
                name="time"
                defaultValue={image.time
                  ?.toLocaleString("sv-SE", { timeZone: "JST" })
                  .replace(" ", "T")}
              />
            </label>
          </form>
        ) : (
          <>
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
                        onClose();
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
          </>
        )}
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
          {isServerMode ? (
            <>
              <button
                title="編集"
                type="button"
                className="absolute right-0 bottom-0 z-50 m-2 w-12 h-12 text-2xl rounded-full p-0"
                onClick={onToggleEdit}
              >
                {editMode ? "✓" : "🖊"}
              </button>
            </>
          ) : null}
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
