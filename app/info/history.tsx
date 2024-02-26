"use client";

import { useState } from "react";
import { useGitState } from "../context/git/gitState";
import { reducedGitItemType } from "../context/git/gitType";
import { MdSection } from "./Section";

function GitlogItem({ item }: { item: reducedGitItemType }) {
  const [readMore, setReadMore] = useState(false);
  return (
    <>
      <div className="mr-1">{item.date}:</div>
      <div>
        {readMore ? (
          item.messages.map((m, i) => <p key={i}>{m}</p>)
        ) : (
          <>
            <p>
              {item.messages[0]}
              {item.messages.length > 1 ? (
                <span
                  className="ml-1 underline cursor-pointer"
                  onClick={() => {
                    setReadMore(true);
                  }}
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
        <details>
          <summary className="mx-auto">Githubの更新履歴</summary>
          <ul className="text-left">
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
