import {
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useImageViewer } from "./ImageViewer";
import { MediaImageItemType } from "@/mediaScripts/MediaImageDataType";
import { useCharaState } from "../character/CharaState";
import ImageMee from "../components/tag/ImageMee";
import axios from "axios";
import toast from "react-hot-toast";
import { useMediaImageState } from "../context/image/MediaImageState";
import {
  defaultTags,
  getTagsOptions,
  autoFixTagsOptions,
} from "./tag/GalleryTags";
import { useRouter } from "next/navigation";
import { useEmbedState } from "../context/embed/EmbedState";
import {
  FieldValues,
  RefCallBack,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { MakeURL } from "../components/functions/MakeURL";
import { AiFillEdit } from "react-icons/ai";
import { MdSaveAlt, MdDeleteForever } from "react-icons/md";

interface Props extends HTMLAttributes<HTMLFormElement> {}

export default function ImageEditForm({ className, ...args }: Props) {
  const { setImageFromUrl, imageAlbumList, copyrightList } =
    useMediaImageState();
  const { data: embedData } = useEmbedState();
  const { editMode, toggleEditMode } = useImageViewer();
  const router = useRouter();
  const wasEdit = useRef(false);
  const refForm = useRef<HTMLFormElement>(null);
  const { charaList } = useCharaState();
  const [charaTags, setCharaTags] = useState<string[]>([]);
  const [otherTags, setOtherTags] = useState<string[]>([]);
  const charaTagsSelect = useRef<HTMLSelectElement>(null);
  const otherTagsSelect = useRef<HTMLSelectElement>(null);
  const { imageItemList } = useMediaImageState();
  const { imageSrc, albumName } = useImageViewer();
  const image = useMemo(() => {
    const albumItemList = albumName
      ? imageItemList.filter(({ album }) => album?.name === albumName)
      : imageItemList;
    return imageSrc
      ? albumItemList.find((image) => image.originName === imageSrc) || null
      : null;
  }, [imageItemList, albumName, imageSrc]);

  const defaultValues = useMemo(
    () => ({
      name: image?.name || "",
      description: image?.description || "",
      topImage: image?.topImage || "",
      pickup: image?.pickup || "",
      time:
        image?.time
          ?.toLocaleString("sv-SE", { timeZone: "JST" })
          .replace(" ", "T") || "",
      copyright: image?.copyright || "",
      link: image?.link || "",
      embed: image?.embed || "",
      move: image?.album?.dir || "",
      rename: image?.originName || "",
    }),
    [image]
  );

  const { register, handleSubmit, reset, getValues, setValue } =
    useForm<FieldValues>({
      defaultValues,
    });

  const sendUpdate = useCallback(
    async (image: MediaImageItemType, deleteMode: boolean = false) => {
      const {
        album,
        resized,
        resizeOption,
        URL,
        move,
        rename,
        size,
        ..._image
      } = image;
      const res = await axios.patch("/gallery/send", {
        ..._image,
        albumDir: album?.dir,
        move,
        rename,
        deleteMode,
      });
      if (res.status === 200) {
        toast(deleteMode ? "削除しました" : "更新しました！", {
          duration: 2000,
        });
        setImageFromUrl();
        if (move || rename) {
          const query = Object.fromEntries(
            new URLSearchParams(location.search)
          );
          const movedAlbum = move
            ? imageAlbumList.find((a) => a.dir === move)
            : null;
          if (movedAlbum) query.album = movedAlbum.name;
          if (rename) query.image = rename;
          router.replace(MakeURL({ query }).href, { scroll: false });
        }
        return true;
      } else {
        return false;
      }
    },
    [imageAlbumList, router, setImageFromUrl]
  );
  const onSubmit = useCallback(
    async (image?: MediaImageItemType) => {
      if (image) {
        const form = refForm.current;
        let sendFlag = false;
        if (form) {
          const fmData = new FormData(form);
          const data = Object.fromEntries(fmData) as { [k: string]: any };
          const ftData = Object.entries(data).filter(([k, v]) => {
            switch (k) {
              case "time":
                return image.time?.getTime() !== new Date(String(v)).getTime();
              case "move":
                return v !== image.album?.dir;
              case "rename":
                return v !== image.originName;
              case "topImage":
              case "pickup":
                const flag = v !== String(image[k]);
                return flag;
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
              case "topImage":
              case "pickup":
                switch (v) {
                  case "true":
                  case "false":
                    image[k] = v === "true";
                    break;
                  default:
                    image[k] = null;
                    break;
                }
                break;
              default:
                image[k] = v;
                break;
            }
          });
          const tags = charaTags.concat(otherTags);
          if (tags.length === 0) {
            if (image.tags) {
              delete image.tags;
              if (!sendFlag) sendFlag = true;
            }
          } else if (image.tags) {
            const tagNotMatch =
              image.tags.length !== tags.length ||
              !image.tags.every((tag) => tags.some((_tag) => tag === _tag));
            if (!sendFlag) sendFlag = tagNotMatch;
            if (tagNotMatch) {
              const _tags = image.tags.filter((tag) =>
                tags.some((_tag) => tag === _tag)
              );
              tags
                .filter((_tag) => _tags.every((tag) => tag !== _tag))
                .forEach((tag) => {
                  _tags.push(tag);
                });
              image.tags = _tags;
            }
          } else {
            image.tags = tags;
            if (!sendFlag) sendFlag = true;
          }
        }
        if (sendFlag) sendUpdate(image);
      }
    },
    [charaTags, otherTags, sendUpdate]
  );

  const onToggleEdit = async () => {
    if (image) await onSubmit(image);
    wasEdit.current = false;
  };
  if (editMode) {
    wasEdit.current = true;
  } else {
    if (wasEdit.current) onToggleEdit();
  }

  const imageUrl = useRef("");
  useEffect(() => {
    async function checkURL() {
      if (
        image?.URL &&
        imageUrl.current !== image.URL &&
        charaList.length > 0
      ) {
        if (editMode) {
          await onSubmit(
            imageItemList.find(({ URL }) => URL === imageUrl.current)
          );
        }
        imageUrl.current = image.URL;
        const _charaTags = (image.tags || []).filter((tag) =>
          charaList.some((chara) => tag === chara.id)
        );
        reset(defaultValues);
        setCharaTags(_charaTags);
        setOtherTags(
          (image.tags || []).filter((tag) =>
            _charaTags.every((_tag) => tag !== _tag)
          )
        );
      }
    }
    checkURL();
  }, [
    image,
    charaList,
    reset,
    defaultValues,
    onSubmit,
    editMode,
    imageItemList,
  ]);

  return (
    <>
      <div className="fixed right-0 bottom-0 z-50 m-2 flex flex-row-reverse">
        <button
          title="編集"
          type="button"
          className={"mr-2 mb-2 w-12 h-12 text-2xl rounded-full p-0"}
          onClick={toggleEditMode}
        >
          {editMode ? (
            <MdSaveAlt className="w-7 h-7 mx-[0.6rem]" />
          ) : (
            <AiFillEdit className="w-7 h-7 m-[0.55rem]" />
          )}
        </button>
        {editMode ? (
          <>
            <button
              title="削除"
              type="button"
              className="plain mr-2 mb-2 bg-red-400 hover:bg-red-500 text-white w-12 h-12 text-2xl rounded-full p-0"
              onClick={async () => {
                if (confirm("本当に削除しますか？")) {
                  if (image && (await sendUpdate(image, true))) {
                    router.back();
                    const href = location.href;
                    setTimeout(() => {
                      if (href === location.href)
                        router.push(location.pathname, { scroll: false });
                    }, 10);
                  }
                }
              }}
            >
              <MdDeleteForever className="w-7 h-7 mx-[0.65rem]" />
            </button>
          </>
        ) : null}
      </div>
      {editMode ? (
        <form
          {...args}
          ref={refForm}
          onSubmit={handleSubmit((e) => {
            toggleEditMode();
            e.preventDefault();
          })}
          className={"edit text-left" + (className ? ` ${className}` : "")}
        >
          <label>
            <p>タイトル</p>
            <div className="px-1 w-[100%]">
              <input
                className="block w-[100%] rounded-none px-1 text-xl md:text-2xl text-main-dark"
                title="タイトル"
                type="text"
                {...register("name")}
              />
            </div>
          </label>
          <label>
            <p>説明文</p>
            <div className="px-1 w-[100%]">
              <textarea
                className="rounded-none w-[100%] px-1 min-h-[8rem] text-lg md:text-xl"
                title="説明文"
                {...register("description")}
              />
            </div>
          </label>
          <div>
            <p>キャラクタータグ</p>
            <div className="px-1 w-[100%]">
              {charaTags.map((tag, i) => {
                const chara = charaList.find((chara) => chara.id === tag);
                return (
                  <span
                    className="m-1 inline-block hover:line-through hover:cursor-pointer"
                    onClick={() => {
                      setCharaTags(charaTags.filter((_tag) => _tag !== tag));
                    }}
                    key={i}
                  >
                    {chara?.media?.icon ? (
                      <ImageMee
                        imageItem={chara.media.icon}
                        mode="icon"
                        width={20}
                        height={20}
                        className="charaIcon mr-1"
                      />
                    ) : (
                      <></>
                    )}
                    {chara ? chara.name : tag}
                  </span>
                );
              })}
              {(() => {
                const noUsedCharaList = charaList.filter((chara) =>
                  charaTags.every((tag) => chara.id !== tag)
                );
                if (noUsedCharaList.length === 0) return null;
                else
                  return (
                    <select
                      title="キャラの追加"
                      ref={charaTagsSelect}
                      onChange={() => {
                        const elm = charaTagsSelect.current;
                        if (!elm) return;
                        switch (elm.value) {
                          case "":
                            break;
                          default:
                            setCharaTags(charaTags.concat(elm.value));
                            break;
                        }
                        elm.value = "";
                      }}
                    >
                      <option>＋追加</option>
                      {noUsedCharaList.map((chara, i) => (
                        <option key={i} value={chara.id}>
                          {(chara.defEmoji || "") +
                            chara.name +
                            (chara.honorific || "")}
                        </option>
                      ))}
                    </select>
                  );
              })()}
            </div>
          </div>
          <label>
            <p>その他のタグ</p>
            <div className="px-1 w-[100%]">
              {(() => {
                const otherTagCandidates = autoFixTagsOptions(
                  getTagsOptions(defaultTags)
                );
                const noUsedCandidates = otherTagCandidates.filter(
                  ({ value }) => otherTags.every((tag) => value !== tag)
                );
                return (
                  <>
                    {otherTags.map((tag, i) => {
                      return (
                        <span
                          className="m-1 inline-block hover:line-through hover:cursor-pointer"
                          onClick={() => {
                            setOtherTags(
                              otherTags.filter((_tag) => _tag !== tag)
                            );
                          }}
                          key={i}
                        >
                          {otherTagCandidates.find(({ value }) => tag === value)
                            ?.label || tag}
                        </span>
                      );
                    })}
                    <select
                      title="タグの追加"
                      ref={otherTagsSelect}
                      onChange={() => {
                        const elm = otherTagsSelect.current;
                        if (!elm) return;
                        switch (elm.value) {
                          case "":
                            break;
                          case "_new":
                            const tag =
                              prompt("設定するタグを入力してください");
                            if (tag) setOtherTags(otherTags.concat(tag));
                            break;
                          default:
                            setOtherTags(otherTags.concat(elm.value));
                            break;
                        }
                        elm.value = "";
                      }}
                    >
                      <option value="">＋追加</option>
                      <option value="_new">新規</option>
                      {noUsedCandidates.map(({ value, label }, i) => (
                        <option key={i} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </>
                );
              })()}
            </div>
          </label>
          <div>
            <p>固定設定</p>
            <div className="px-1 w-[100%] flex justify-around">
              <label>
                トップ画像
                <select
                  className="ml-1"
                  title="トップ画像"
                  {...register("topImage")}
                >
                  <option value="undefined">自動</option>
                  <option value="true">固定する</option>
                  <option value="false">固定しない</option>
                </select>
              </label>
              <label>
                ピックアップ
                <select
                  className="ml-1"
                  title="ピックアップ画像"
                  {...register("pickup")}
                >
                  <option value="undefined">自動</option>
                  <option value="true">固定する</option>
                  <option value="false">固定しない</option>
                </select>
              </label>
            </div>
          </div>
          <label>
            <p>リンク</p>
            <div className="mx-1 flex-1">
              <input
                className="rounded-none w-[100%] px-1 text-lg md:text-xl"
                title="リンク"
                type="text"
                {...register("link")}
              />
            </div>
          </label>
          <label>
            <div className="inline-block mr-4">埋め込み</div>
            <input
              className="py-1 px-2 text-lg md:text-xl rounded-md"
              title="埋め込み"
              type="text"
              list="galleryEditEmbedList"
              {...register("embed")}
            />
            <datalist id="galleryEditEmbedList">
              {embedData
                ? Object.keys(embedData).map((embed, i) => (
                    <option key={i} value={embed}>
                      {embed}
                    </option>
                  ))
                : null}
            </datalist>
          </label>
          <label>
            <div className="inline-block mr-4">時間</div>
            <input
              className="rounded-none px-1 text-lg md:text-xl"
              title="時間"
              type="datetime-local"
              {...register("time")}
            />
          </label>
          <label>
            <div className="inline-block mr-4">コピーライト</div>
            <input
              className="py-1 px-2 text-lg md:text-xl rounded-md"
              title="コピーライト"
              type="text"
              list="galleryEditCopyrightList"
              {...register("copyright")}
            />
            <datalist id="galleryEditCopyrightList">
              {copyrightList.map(({ value }, i) => (
                <option value={value} key={i} />
              ))}
            </datalist>
          </label>
          <label>
            <div className="inline-block mr-4">アルバム移動</div>
            <select
              className="py-1 px-2 text-lg md:text-xl rounded-md"
              title="移動"
              {...register("move")}
            >
              {imageAlbumList
                .filter((album) => album.listup && !album.name.startsWith("/"))
                .sort((a, b) => ((a.name || "") > (b.name || "") ? 1 : -1))
                .map((album, i) => (
                  <option key={i} value={album.dir}>
                    {album.name}
                  </option>
                ))}
            </select>
          </label>
          <label className="flex">
            <div className="inline-block mr-4">ファイル名変更</div>
            <input
              title="ファイル名変更"
              className="flex-1 py-1 px-2 rounded-md"
              {...register("rename")}
            />
          </label>
        </form>
      ) : null}
    </>
  );
}
