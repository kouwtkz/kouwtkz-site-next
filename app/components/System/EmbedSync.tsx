"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { useLayoutEffect } from "react";

export default function EmbedSync() {
  useSearchParams();
  const already = useRef(false);
  const iframeIdMap = useRef(new Map<string, HTMLIFrameElement>());
  useLayoutEffect(() => {
    if (window) {
      (
        document.querySelectorAll(
          `iframe[src*="embed"]:not([added-embed])`
        ) as NodeListOf<HTMLIFrameElement>
      ).forEach((iframe) => {
        const id = iframe.src;
        const postMessage = () => {
          iframe.contentWindow?.postMessage(
            {
              type: "setHeight",
              id,
            },
            "*"
          );
        };
        iframeIdMap.current.set(id, iframe);
        if (already.current) iframe.onload = postMessage;
        else
          new Promise(() => {
            postMessage();
          });
        iframe.setAttribute("added-embed", "");
      });

      if (!already.current) {
        window.addEventListener("message", function (e) {
          const data = e.data || {};
          const iframe = iframeIdMap.current.get(data.id);
          if (iframe && data.height) iframe.height = data.height;
        });
        already.current = true;
      }
    }
  });
  return <></>;
}
