"use client";

import { useServerState } from "@/app/components/System/ServerState";
import { useDataState } from "@/app/context/start/DataState";
import Link from "next/link";
import { MdAdd, MdDoneOutline, MdEditNote } from "react-icons/md";
import { TbArrowsMove } from "react-icons/tb";
import { UrlObject } from "url";
import { create } from "zustand";

export const useEditSwitchState = create<{
  sortable: boolean;
  setSortable: (v: boolean) => void;
}>((set) => ({
  sortable: false,
  setSortable(v) {
    set({ sortable: v });
  },
}));

type EditProps = {
  name?: string | null;
};

export function CharaEditButton({ name }: EditProps) {
  const { isServerMode } = useServerState();
  const { isComplete } = useDataState();
  const { sortable, setSortable } = useEditSwitchState();
  if (!isServerMode || !isComplete) return <></>;
  const Url: UrlObject = { pathname: "/character" };
  Url.query = name ? { mode: "edit", name } : { mode: "add" };
  return (
    <div className="fixed right-0 bottom-0 z-[13] p-2">
      <button
        type="button"
        onClick={() => setSortable(!sortable)}
        className="mb-2 w-12 h-12 button rounded-full flex items-center justify-center"
      >
        <div>
          {sortable ? (
            <MdDoneOutline className="w-9 h-9" />
          ) : (
            <TbArrowsMove className="w-9 h-9" />
          )}
        </div>
      </button>
      <Link
        href={Url}
        className="w-12 h-12 button rounded-full flex items-center justify-center"
      >
        {name ? (
          <MdEditNote className="w-10 h-10" />
        ) : (
          <MdAdd className="w-11 h-11" />
        )}
      </Link>
    </div>
  );
}
