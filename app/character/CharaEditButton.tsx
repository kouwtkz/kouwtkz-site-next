"use client";

import { useServerState } from "@/app/components/System/ServerState";
import { useDataState } from "@/app/context/start/DataState";
import Link from "next/link";
import { CSSProperties } from "react";
import { MdAdd, MdClose, MdDoneOutline, MdEditNote } from "react-icons/md";
import { TbArrowsMove } from "react-icons/tb";
import { UrlObject } from "url";
import { create } from "zustand";

export const useEditSwitchState = create<{
  save: boolean;
  reset: boolean;
  sortable: boolean;
  set: (args: { sortable?: boolean; reset?: boolean; save?: boolean }) => void;
}>((set) => ({
  save: false,
  reset: false,
  sortable: false,
  set(args) {
    set(args);
  },
}));

type EditProps = {
  name?: string | null;
};

export function CharaEditButton({ name }: EditProps) {
  const { isServerMode } = useServerState();
  const { isComplete } = useDataState();
  const { sortable, set: setEditSwitch } = useEditSwitchState();
  if (!isServerMode || !isComplete) return <></>;
  const Url: UrlObject = { pathname: "/character" };
  Url.query = name ? { mode: "edit", name } : { mode: "add" };
  const style: CSSProperties = {
    margin: "0.5rem",
    width: "3rem",
    height: "3rem",
    borderRadius: "9999px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  return (
    <div className="fixed right-0 bottom-0 z-[13] p-2">
      {name ? null : sortable ? (
        <>
          <button
            type="button"
            title="ソートの中止"
            onClick={() =>
              setEditSwitch({ sortable: false, save: false, reset: true })
            }
            style={style}
          >
            <MdClose className="w-9 h-9" />
          </button>
          <button
            type="button"
            title="ソートの完了"
            onClick={() => setEditSwitch({ sortable: false, save: true })}
            style={style}
          >
            <MdDoneOutline className="w-9 h-9" />
          </button>
        </>
      ) : (
        <button
          type="button"
          title="ソートモードにする"
          onClick={() =>
            setEditSwitch({ sortable: true, save: false, reset: false })
          }
          style={style}
        >
          <TbArrowsMove className="w-9 h-9" />
        </button>
      )}
      <Link href={Url} style={style} className="button">
        {name ? (
          <MdEditNote className="w-10 h-10" />
        ) : (
          <MdAdd className="w-11 h-11" />
        )}
      </Link>
    </div>
  );
}
