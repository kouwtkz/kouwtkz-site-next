"use client";

import { useState } from "react";
import { useGitState } from "../context/git/gitState";
import { reducedGitItemType } from "../context/git/gitType";
import { MdSection } from "./Section";
import { GoTriangleDown, GoTriangleRight } from "react-icons/go";

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

export function HistoryPage() {
  const { log } = useGitState();
  return (
    <MdSection title="更新履歴" mdSrc="info/history.md">
      {log.length > 0 ? (
        <details className="">
          <summary className="mx-auto max-w-fit">
            Gitの更新履歴
            {log[0] ? (
              <span className="text-sm ml-2">
                (最終更新:<span className="ml-1">{log[0].date}</span>)
              </span>
            ) : null}
          </summary>
          <ul className="text-left max-w-2xl">
            {log.map((item, i) => (
              <li className="flex" key={i}>
                <GitlogItem item={item} />
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </MdSection>
  );
}
