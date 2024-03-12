"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { create } from "zustand";
import axios from "axios";
import { reducedGitItemType } from "./gitType";
import { GoTriangleDown, GoTriangleRight } from "react-icons/go";
const defaultUrl = "/data/gitlog.json";

type GitStateType = {
  log: reducedGitItemType[];
  isSet: boolean;
  url: string;
  setLog: (value: reducedGitItemType[]) => void;
  setUrl: (url?: string, setFlag?: boolean) => void;
  setLogFromUrl: (url?: string) => void;
  isSetCheck: () => void;
};

export const useGitState = create<GitStateType>((set) => ({
  log: [],
  isSet: false,
  url: defaultUrl,
  setLog: (value) => {
    set({ log: value, isSet: true });
  },
  setUrl(url = defaultUrl, setFlag = true) {
    if (setFlag) {
      set((state) => {
        state.setLogFromUrl(url);
        return state;
      });
    } else {
      set(() => {
        return { url };
      });
    }
  },
  setLogFromUrl(url?: string) {
    set((state) => {
      axios(url || state.url).then((r) => {
        const data: reducedGitItemType[] = r.data;
        state.setLog(data);
      });
      return url ? { url } : state;
    });
  },
  isSetCheck() {
    set((state) => {
      if (!state.isSet) state.setLogFromUrl();
      return state;
    });
  },
}));

export default function GitState({
  url,
  setFlag,
}: {
  url: string;
  setFlag?: boolean;
}) {
  const { setUrl } = useGitState();
  const isSet = useRef(false);
  useEffect(() => {
    if (!isSet.current) {
      setUrl(url, setFlag);
      isSet.current = true;
    }
  });
  return <></>;
}

function GitlogItem({ item }: { item: reducedGitItemType }) {
  const [readMore, setReadMore] = useState(false);
  const handleToggle = () => {
    setReadMore(!readMore);
  };
  return (
    <>
      <div>
        <span
          tabIndex={0}
          className="cursor-pointer inline-flex items-center"
          onClick={handleToggle}
          onKeyDown={(e) => {
            if (e.code === "Enter") handleToggle();
          }}
        >
          <span className="text-main-dark-grayish">
            {readMore ? <GoTriangleDown /> : <GoTriangleRight />}
          </span>
          <span>{item.date}</span>
        </span>
      </div>
      <div className="mr-1">:</div>
      <div className="flex-1">
        {readMore ? (
          item.messages.map((m, i) => <p key={i}>{m}</p>)
        ) : (
          <>
            <p>
              {item.messages[0]}
              {item.messages.length > 1 ? (
                <span
                  className="ml-1 underline cursor-pointer"
                  onClick={handleToggle}
                >
                  {"他" + (item.messages.length - 1) + "件"}
                </span>
              ) : null}
            </p>
          </>
        )}
      </div>
    </>
  );
}

export function GitDetails() {
  const { log, isSetCheck, isSet } = useGitState();
  useLayoutEffect(() => {
    isSetCheck();
  });
  return (
    <details className="">
      <summary className="mx-auto max-w-fit">
        Gitの更新履歴
        <span className="text-sm ml-2">
          {log.length > 0 ? (
            <>
              <span>最終更新:</span>
              <span className="ml-1">{log[0].date}</span>
            </>
          ) : isSet ? (
            "(データなし)"
          ) : (
            "よみこみちゅう…"
          )}
        </span>
      </summary>
      <ul className="text-left max-w-2xl">
        {log.map((item, i) => (
          <li className="flex" key={i}>
            <GitlogItem item={item} />
          </li>
        ))}
      </ul>
    </details>
  );
}