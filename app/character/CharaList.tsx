"use client";

import Link from "next/link";
import { ImageMeeThumbnail } from "../components/tag/ImageMee";
import { useCharaState } from "./CharaState";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { CharaType } from "./CharaType";
import { CSS } from "@dnd-kit/utilities";
import { useEditSwitchState } from "./CharaEditButton";
import { useServerState } from "../components/System/ServerState";
import axios from "axios";
import toast from "react-hot-toast";

type Props = {
  chara: CharaType;
};

const itemClassName =
  "flex flex-col justify-center p-4 w-[50%] sm:w-[33%] hover:bg-main-pale-fluo hover:text-main-deep";
function CharaItem({ chara }: Props) {
  return (
    <>
      {chara.media?.image ? (
        <ImageMeeThumbnail
          imageItem={chara.media.image}
          className="block mx-auto my-2 max-w-[90%]"
          loadingScreen={true}
        />
      ) : null}
      <div className="text-center text-xl md:text-2xl">{chara.name}</div>
    </>
  );
}

function SortableItem({ chara }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: chara.id });
  const style = {
    cursor: "move",
    listStyle: "none",
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      className={itemClassName}
      style={style}
      {...attributes}
      {...listeners}
    >
      <CharaItem chara={chara} />
    </div>
  );
}

function SortableObject({
  items,
  setItems,
}: {
  items: CharaType[];
  setItems: Dispatch<SetStateAction<CharaType[]>>;
}) {
  const { charaList, setIsSet } = useCharaState();
  const { sortable } = useEditSwitchState();
  useEffect(() => {
    if (charaList.length && !sortable) {
      const isDirty = !items.every(({ id }, i) => charaList[i].id === id);
      if (isDirty) {
        const formData = new FormData();
        items.forEach(({ id }) => formData.append("sorts[]", id));
        axios.post("/character/send", formData).then((res) => {
          toast(res.data.message, { duration: 2000 });
          if (res.status === 200) {
            if (res.data.update.chara) setIsSet(false);
          }
        });
      }
    }
  }, [charaList, items, setIsSet, setItems, sortable]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) {
        return;
      }
      if (active.id !== over.id) {
        const oldIndex = items.findIndex((v) => v.id === active.id);
        const newIndex = items.findIndex((v) => v.id === over.id);
        setItems(arrayMove(items, oldIndex, newIndex));
      }
    },
    [items, setItems]
  );
  if (!sortable) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        {items.map((chara) => {
          return <SortableItem chara={chara} key={chara.id} />;
        })}
      </SortableContext>
    </DndContext>
  );
}

function CharaObject({ items }: { items: CharaType[] }) {
  return (
    <>
      {items.map((chara) => {
        return (
          <Link
            href={{ pathname: "/character", query: { name: chara.id } }}
            prefetch={false}
            className={itemClassName}
            key={chara.id}
          >
            <CharaItem chara={chara} />
          </Link>
        );
      })}
    </>
  );
}

export default function CharaList() {
  const { sortable } = useEditSwitchState();
  const { isServerMode } = useServerState();
  const { charaList } = useCharaState();
  const [items, setItems] = useState(charaList);
  useEffect(() => {
    if (charaList.length !== items.length) setItems(charaList);
  }, [charaList, items]);
  return (
    <div className="flex flex-row flex-wrap justify-center content-around w-[90%] max-w-4xl mx-auto">
      {isServerMode ? (
        <SortableObject items={items} setItems={setItems} />
      ) : null}
      {!sortable ? <CharaObject items={items} /> : null}
    </div>
  );
}
