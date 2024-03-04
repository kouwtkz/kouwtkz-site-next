"use client";

import { useServerState } from "@/app/components/System/ServerState";
import { useDataState } from "@/app/context/start/DataState";
import Link from "next/link";
import { MdAdd, MdEditNote } from "react-icons/md";
import { UrlObject } from "url";

type EditProps = {
  name?: string | null;
};

export default function CharaEditButton({ name }: EditProps) {
  const { isServerMode } = useServerState();
  const { isComplete } = useDataState();
  if (!isServerMode || !isComplete) return <></>;
  const Url: UrlObject = { pathname: "/character" };
  Url.query = name ? { mode: "edit", name } : { mode: "add" };
  return (
    <div className="fixed right-0 bottom-0 z-[13] p-2">
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
