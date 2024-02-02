import { HTMLAttributes, useRef, useState } from "react";
import { useImageViewer } from "./ImageViewer";
import { MediaImageItemType } from "@/mediaScripts/MediaImageDataType";
import { useCharaState } from "../character/CharaState";
import ImageMee from "../components/image/ImageMee";
import axios from "axios";
import toast from "react-hot-toast";
import { useMediaImageState } from "../context/MediaImageState";
import { eventTags, monthTags } from "./GalleryTags";
import { useRouter } from "next/navigation";
import { useEmbedState } from "../context/embed/EmbedState";

interface Props extends HTMLAttributes<HTMLFormElement> {
  image: MediaImageItemType;
}

export default function ImageEditForm({ image, className, ...args }: Props) {
  const { setImageFromUrl, imageAlbumList } = useMediaImageState();
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
  const tagsSet = useRef(false);
  if (!tagsSet.current && charaList.length > 0) {
    const _charaTags = (image.tags || []).filter((tag) =>
      charaList.some((chara) => tag === chara.id)
    );
    setCharaTags(_charaTags);
    setOtherTags(
      (image.tags || []).filter((tag) =>
        _charaTags.every((_tag) => tag !== _tag)
      )
    );
    tagsSet.current = true;
  }
  const sendUpdate = async (
    image: MediaImageItemType,
    deleteMode: boolean = false
  ) => {
    const { album, resized, resizeOption, URL, move, ..._image } = image;
    const res = await axios.patch("/gallery/send", {
      ..._image,
      albumDir: album?.dir,
      move,
      deleteMode,
    });
    if (res.status === 200) {
      toast(deleteMode ? "削除しました" : "更新しました！", {
        duration: 2000,
      });
      setImageFromUrl();
      if (move) {
        const search = new URLSearchParams(location.search);
        const queryImage = search.get("image");
        if (queryImage && album?.dir) {
          search.set("image", queryImage.replace(album.dir, move));
          router.replace(`?${search.toString()}`, { scroll: false });
        }
      }
      return true;
    } else {
      return false;
    }
  };
  const onToggleEdit = async () => {
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
    wasEdit.current = false;
  };
  if (editMode) {
    wasEdit.current = true;
  } else {
    if (wasEdit.current) onToggleEdit();
  }

  return (
    <>
      <div className="fixed right-0 bottom-0 z-50 m-2 flex flex-row-reverse">
        <button
          title="編集"
          type="button"
          className="ml-2 w-12 h-12 text-2xl rounded-full p-2"
          onClick={toggleEditMode}
        >
          {editMode ? "✓" : "🖊"}
        </button>
        {editMode ? (
          <>
            <button
              title="削除"
              type="button"
              className="plain ml-2 bg-red-400 hover:bg-red-500 w-12 h-12 text-2xl rounded-full p-2"
              onClick={async () => {
                if (confirm("本当に削除しますか？")) {
                  if (await sendUpdate(image, true)) {
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
              🗑️
            </button>
          </>
        ) : null}
      </div>
      {editMode ? (
        <form
          {...args}
          ref={refForm}
          onSubmit={(e) => {
            toggleEditMode();
            e.preventDefault();
          }}
          className={"[&>*]:block [&>*]:my-6 " + className}
        >
          <label>
            <p>タイトル</p>
            <div className="mx-1">
              <input
                className="w-[100%] rounded-none px-1 text-xl md:text-2xl text-main-dark"
                title="タイトル"
                type="text"
                name="name"
                defaultValue={image.name}
              />
            </div>
          </label>
          <label>
            <p>説明文</p>
            <div className="mx-1">
              <textarea
                className="rounded-none w-[100%] px-1 min-h-[8rem] text-lg md:text-xl"
                title="説明文"
                name="description"
                defaultValue={image.description}
              />
            </div>
          </label>
          <div>
            <p>キャラクタータグ</p>
            <div>
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
            <div>
              {(() => {
                const otherTagCandidates = eventTags.concat(monthTags);
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
          <div className="[&_label]:mx-2">
            <p>固定設定</p>
            <label>
              トップ画像
              <select
                name="topImage"
                className="ml-1"
                title="トップ画像"
                defaultValue={String(image.topImage)}
              >
                <option value="undefined">自動</option>
                <option value="true">固定する</option>
                <option value="false">固定しない</option>
              </select>
            </label>
            <label>
              ピックアップ
              <select
                name="pickup"
                className="ml-1"
                title="ピックアップ画像"
                defaultValue={String(image.pickup)}
              >
                <option value="undefined">自動</option>
                <option value="true">固定する</option>
                <option value="false">固定しない</option>
              </select>
            </label>
          </div>
          <label>
            <p>リンク</p>
            <div className="mx-1">
              <input
                className="rounded-none w-[100%] px-1 text-lg md:text-xl"
                title="リンク"
                type="text"
                name="link"
                defaultValue={image.link}
              />
            </div>
          </label>
          <label>
            <div className="inline-block mr-4">埋め込み</div>
            <select title="埋め込み" name="embed" defaultValue={image.embed}>
              <option value="" />
              {/* <option value="_new">新規</option> */}
              {embedData
                ? Object.keys(embedData).map((embed, i) => (
                    <option key={i} value={embed}>
                      {embed}
                    </option>
                  ))
                : null}
            </select>
          </label>
          <label>
            <div className="inline-block mr-4">時間</div>
            <input
              className="rounded-none px-1 text-lg md:text-xl"
              title="時間"
              type="datetime-local"
              name="time"
              defaultValue={image.time
                ?.toLocaleString("sv-SE", { timeZone: "JST" })
                .replace(" ", "T")}
            />
          </label>
          <label>
            <div className="inline-block mr-4">コピーライト</div>
            <input
              className="rounded-none px-1 text-lg md:text-xl"
              title="コピーライト"
              type="text"
              name="copyright"
              defaultValue={image.copyright}
            />
          </label>
          <label>
            <div className="inline-block mr-4">アルバム移動</div>
            <select title="移動" name="move" defaultValue={image.album?.dir}>
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
        </form>
      ) : null}
    </>
  );
}
